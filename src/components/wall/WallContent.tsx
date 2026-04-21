'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import Masonry from 'react-masonry-css'
import PostCard from './PostCard'
import CreatePostForm from './CreatePostForm'
import { Button } from '@/components/ui/button'
import { Plus, Settings as SettingsIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ThreadDrawer from './ThreadDrawer'

interface WallContentProps {
  wall: any
  initialPosts: any[]
  initialNickname: string
}

export default function WallContent({ wall, initialPosts, initialNickname }: WallContentProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isThreadOpen, setIsThreadOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const supabase = createClient()

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  }

  useEffect(() => {
    // 실시간 구독 설정: 게시물 추가/삭제
    const postsChannel = supabase
      .channel(`public:posts:wall_id=eq.${wall.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
          filter: `wall_id=eq.${wall.id}`
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const newPost = { ...payload.new, reactions: [] }
            setPosts((prev) => [newPost, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setPosts((prev) => prev.filter((post) => post.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    // 실시간 구독 설정: 리액션 변화
    const reactionsChannel = supabase
      .channel(`public:reactions:wall_id=${wall.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reactions'
        },
        async (payload) => {
          // 리액션이 업데이트되면 해당 게시물의 리액션 데이터를 갱신
          // (필터링 로직이 복잡할 수 있으므로 간단하게 전체 리액션을 다시 패치하거나 상태 업데이트)
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setPosts((prev) => 
              prev.map((post) => {
                if (post.id === payload.new.post_id) {
                  const existingReactions = post.reactions || []
                  const index = existingReactions.findIndex((r: any) => r.id === payload.new.id)
                  
                  let newReactions
                  if (index > -1) {
                    newReactions = [...existingReactions]
                    newReactions[index] = payload.new
                  } else {
                    newReactions = [...existingReactions, payload.new]
                  }
                  return { ...post, reactions: newReactions }
                }
                return post
              })
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(postsChannel)
      supabase.removeChannel(reactionsChannel)
    }
  }, [wall.id, supabase])

  useEffect(() => {
    // 닉네임을 쿠키에 저장하여 세션 유지
    const cookieName = `wall_nickname_${wall.id}`
    const hasCookie = document.cookie.split(';').some((item) => item.trim().startsWith(`${cookieName}=`))
    
    if (!hasCookie) {
      document.cookie = `${cookieName}=${initialNickname}; path=/; max-age=${60 * 60 * 24 * 30}` // 30일 유지
    }
  }, [wall.id, initialNickname])

  const glassStyle = {
    backdropFilter: `blur(${wall.settings?.glassOpacity * 20}px)`,
    backgroundColor: wall.settings?.theme === 'dark' 
      ? `rgba(0, 0, 0, ${wall.settings?.glassOpacity || 0.5})` 
      : `rgba(255, 255, 255, ${wall.settings?.glassOpacity || 0.5})`,
    border: '1px solid rgba(255, 255, 255, 0.1)'
  }

  return (
    <div className="container mx-auto px-4 py-8 relative min-h-screen">
      <header className="mb-12 flex flex-col items-center justify-center text-center">
        <Link href="/" className="flex items-center gap-2 group mb-8 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 hover:bg-white/30 transition-all">
          <div className="bg-blue-500 p-1 rounded-lg">
            <Plus className="h-4 w-4 text-white rotate-45" />
          </div>
          <span className="text-xl font-black tracking-tighter" style={{ color: wall.settings?.theme === 'dark' ? '#fff' : '#000' }}>MEMOLIB</span>
        </Link>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-lg"
          style={{ 
            color: wall.settings?.theme === 'dark' ? '#fff' : '#000',
            fontFamily: wall.settings?.font === 'serif' ? 'serif' : 'sans-serif'
          }}
        >
          {wall.title}
        </motion.h1>
        <p className="text-muted-foreground bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm">
          {initialNickname}님으로 접속 중
        </p>
      </header>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        <AnimatePresence mode="popLayout">
          {posts
            .filter((post) => !post.parent_id) // 오직 상위 게시물만 그리드에 표시
            .map((post) => {
              const replyCount = posts.filter((p) => p.parent_id === post.id).length
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                >
                  <PostCard 
                    post={post} 
                    glassStyle={glassStyle} 
                    theme={wall.settings?.theme}
                    replyCount={replyCount}
                    onReply={() => {
                      setSelectedPost(post)
                      setIsThreadOpen(true)
                    }}
                  />
                </motion.div>
              )
            })}
        </AnimatePresence>
      </Masonry>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4">
        <Button 
          size="icon" 
          className="h-14 w-14 rounded-full shadow-2xl hover:scale-110 transition-transform bg-primary text-primary-foreground"
          onClick={() => setIsFormOpen(true)}
        >
          <Plus className="h-8 w-8" />
        </Button>
      </div>

      <CreatePostForm 
        isOpen={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        wallId={wall.id}
        nickname={initialNickname}
      />

      <ThreadDrawer
        isOpen={isThreadOpen}
        onClose={() => setIsThreadOpen(false)}
        parentPost={selectedPost}
        wallId={wall.id}
        nickname={initialNickname}
        theme={wall.settings?.theme}
        glassStyle={glassStyle}
      />

      <style jsx global>{`
        .my-masonry-grid {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          margin-left: -24px;
          width: auto;
        }
        .my-masonry-grid_column {
          padding-left: 24px;
          background-clip: padding-box;
        }
        .my-masonry-grid_column > div {
          margin-bottom: 24px;
        }
      `}</style>
    </div>
  )
}

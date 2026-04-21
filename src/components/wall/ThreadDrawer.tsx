'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, Send, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import CreatePostForm from './CreatePostForm'

interface ThreadDrawerProps {
  isOpen: boolean
  onClose: () => void
  parentPost: any
  wallId: string
  nickname: string
  theme?: string
  glassStyle?: any
}

export default function ThreadDrawer({ isOpen, onClose, parentPost, wallId, nickname, theme, glassStyle }: ThreadDrawerProps) {
  const [replies, setReplies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isReplyFormOpen, setIsReplyFormOpen] = useState(false)
  const supabase = createClient()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen || !parentPost) return

    const fetchReplies = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('parent_id', parentPost.id)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching replies:', error)
      } else {
        setReplies(data || [])
      }
      setIsLoading(false)
    }

    fetchReplies()

    // Realtime subscription for replies
    const channel = supabase
      .channel(`replies-${parentPost.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
          filter: `parent_id=eq.${parentPost.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setReplies((prev) => [...prev, payload.new])
            // Scroll to bottom on new reply
            setTimeout(() => {
              if (scrollRef.current) {
                scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
              }
            }, 100)
          } else if (payload.eventType === 'DELETE') {
            setReplies((prev) => prev.filter((r) => r.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [isOpen, parentPost, supabase])

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-background border-l border-white/10 shadow-2xl z-[70] flex flex-col"
              style={theme === 'dark' ? { backgroundColor: '#18181b' } : { backgroundColor: '#ffffff' }}
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-background/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                  <h3 className="font-bold">대화 타래</h3>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                    {replies.length}개의 답글
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Scroll Area */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Original Post Summary */}
                {parentPost && (
                  <div className="p-4 rounded-2xl bg-muted/30 border border-white/10 mb-8">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm font-bold">{parentPost.nickname}</span>
                      <span className="text-[10px] text-muted-foreground">원문</span>
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{parentPost.content}</p>
                  </div>
                )}

                {/* Replies List */}
                <div className="space-y-4">
                  {replies.map((reply) => (
                    <motion.div
                      key={reply.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group relative pl-4 border-l-2 border-blue-500/20 hover:border-blue-500/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-blue-500">{reply.nickname}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                    </motion.div>
                  ))}
                  
                  {replies.length === 0 && !isLoading && (
                    <div className="text-center py-20">
                      <MessageCircle className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">아직 답글이 없습니다.<br />첫 번째 답글을 남겨보세요!</p>
                    </div>
                  )}

                  {isLoading && (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-muted/20 animate-pulse rounded-xl" />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer / Reply Input */}
              <div className="p-4 border-t border-white/10 bg-background/50 backdrop-blur-md">
                <Button 
                  className="w-full h-12 rounded-xl flex items-center justify-between px-4 group"
                  onClick={() => setIsReplyFormOpen(true)}
                >
                  <span className="text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                    따뜻한 답글을 남겨주세요...
                  </span>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CreatePostForm
        isOpen={isReplyFormOpen}
        onOpenChange={setIsReplyFormOpen}
        wallId={wallId}
        nickname={nickname}
        parentId={parentPost?.id}
        parentNickname={parentPost?.nickname}
      />
    </>
  )
}

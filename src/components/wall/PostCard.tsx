'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Heart, Flame, ThumbsUp, Laugh, AlertCircle, MessageCircle } from 'lucide-react'

interface PostCardProps {
  post: any
  glassStyle: any
  theme?: string
  onReply?: () => void
  replyCount?: number
}

const EMOJIS = [
  { type: 'heart', icon: Heart, color: 'text-red-500' },
  { type: 'fire', icon: Flame, color: 'text-orange-500' },
  { type: 'like', icon: ThumbsUp, color: 'text-blue-500' },
  { type: 'laugh', icon: Laugh, color: 'text-yellow-500' },
  { type: 'shock', icon: AlertCircle, color: 'text-purple-500' }
]

export default function PostCard({ post, glassStyle, theme, onReply, replyCount = 0 }: PostCardProps) {
  const supabase = createClient()
  const [isReacting, setIsReacting] = useState(false)

  const handleReaction = async (emojiType: string) => {
    if (isReacting) return
    setIsReacting(true)

    try {
      // 리액션 카운트 증가 로직
      // Supabase SQL function으로 처리하는 것이 이상적이나, 여기서는 간단하게 upsert 시도
      const existingReaction = post.reactions?.find((r: any) => r.emoji_type === emojiType)
      
      const { error } = await supabase
        .from('reactions')
        .upsert({
          post_id: post.id,
          emoji_type: emojiType,
          count: (existingReaction?.count || 0) + 1
        }, {
          onConflict: 'post_id,emoji_type'
        })

      if (error) throw error
    } catch (err) {
      console.error('Reaction error:', err)
    } finally {
      setIsReacting(false)
    }
  }

  const getReactionCount = (type: string) => {
    return post.reactions?.find((r: any) => r.emoji_type === type)?.count || 0
  }

  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:scale-[1.02] shadow-lg border-white/10" 
      style={glassStyle}
    >
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <span className="font-bold text-sm bg-primary/10 px-2 py-0.5 rounded text-primary w-fit">
            {post.nickname}
          </span>
          <span suppressHydrationWarning className="text-[10px] text-muted-foreground mt-1 text-opacity-70">
            {new Date(post.created_at).toLocaleString()}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2 space-y-3">
        {post.media_url && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/5">
            <Image 
              src={post.media_url} 
              alt="게시물 이미지" 
              fill 
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <p className={`whitespace-pre-wrap leading-relaxed ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'}`}>
          {post.content}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 flex items-center gap-1.5 rounded-full hover:bg-white/10 transition-colors bg-white/5 shadow-inner"
          onClick={onReply}
        >
          <MessageCircle className="h-4 w-4 text-blue-500" />
          {replyCount > 0 && (
            <span className={`text-[11px] font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              {replyCount}
            </span>
          )}
        </Button>

        {EMOJIS.map((emoji) => {
          const count = getReactionCount(emoji.type)
          return (
            <Button
              key={emoji.type}
              variant="ghost"
              size="sm"
              className={`h-8 px-2 flex items-center gap-1.5 rounded-full hover:bg-white/10 transition-colors ${count > 0 ? 'bg-white/5 shadow-inner' : ''}`}
              onClick={() => handleReaction(emoji.type)}
              disabled={isReacting}
            >
              <emoji.icon className={`h-4 w-4 ${count > 0 ? emoji.color : 'text-muted-foreground/60'}`} />
              {count > 0 && (
                <span className={`text-[11px] font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  {count}
                </span>
              )}
            </Button>
          )
        })}
      </CardFooter>
    </Card>
  )
}

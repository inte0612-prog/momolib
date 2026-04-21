'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Image as ImageIcon, Loader2, Send } from 'lucide-react'
import Image from 'next/image'

interface CreatePostFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  wallId: string
  nickname: string
  parentId?: string | null
  parentNickname?: string | null
}

export default function CreatePostForm({ isOpen, onOpenChange, wallId, nickname, parentId = null, parentNickname = null }: CreatePostFormProps) {
  const [content, setContent] = useState('')
  const [postNickname, setPostNickname] = useState(nickname)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('파일 크기는 5MB 이하여야 합니다.')
        return
      }
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() && !image) return
    
    if (!postNickname.trim()) {
      toast.error('별명을 입력해 주세요.')
      return
    }

    setIsSubmitting(true)
    try {
      let mediaUrl = null

      // 1. 이미지 업로드 (있는 경우)
      if (image) {
        const fileExt = image.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${wallId}/${fileName}`

        const { error: uploadError, data } = await supabase.storage
          .from('wall-images')
          .upload(filePath, image)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('wall-images')
          .getPublicUrl(filePath)
        
        mediaUrl = publicUrl
      }

      // 2. 게시물 저장
      const { error: postError } = await supabase
        .from('posts')
        .insert({
          wall_id: wallId,
          content,
          nickname: postNickname,
          media_url: mediaUrl,
          parent_id: parentId
        })

      if (postError) throw postError

      toast.success('이야기가 게시되었습니다!')
      setContent('')
      removeImage()
      onOpenChange(false)
    } catch (err: any) {
      console.error('Post creation error:', err)
      toast.error('게시물 작성 중 오류가 발생했습니다: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed inset-x-4 bottom-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-background rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {parentId ? `${parentNickname}님에게 답글 남기기` : '새 이야기 남기기'}
                </h2>
                <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nickname">별명</Label>
                    <Input 
                      id="nickname" 
                      value={postNickname} 
                      onChange={(e) => setPostNickname(e.target.value)}
                      placeholder="표시될 별명을 입력하세요"
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">내용</Label>
                    <textarea
                      id="content"
                      className="w-full h-32 p-4 rounded-xl border border-input bg-background resize-none focus:ring-2 focus:ring-primary focus:outline-none"
                      placeholder={parentId ? "따뜻한 답글을 남겨주세요..." : "여기에 익명으로 이야기를 남겨주세요..."}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>이미지 추가 (선택)</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-24 border-dashed border-2 flex flex-col gap-2 rounded-xl"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">이미지 업로드</span>
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>

                  {imagePreview && (
                    <div className="relative mt-4 w-full h-48 rounded-xl overflow-hidden group">
                      <Image src={imagePreview} alt="미리보기" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={removeImage}
                          className="rounded-full"
                        >
                          삭제
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full h-12 rounded-xl text-lg font-semibold" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      게시 중...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      게시하기
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

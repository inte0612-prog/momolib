'use client'

import { useState } from 'react'
import { updateWallSettings, deletePost, deleteWall } from './actions'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { toast } from 'sonner'
import ThemeCustomizer from '@/components/dashboard/ThemeCustomizer'
import { ChevronLeft, Save, Trash2, ExternalLink, ShieldAlert, Settings as SettingsIcon, LayoutGrid, Palette, Eye } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface WallSettingsClientProps {
  wall: any
  posts: any[]
}

export default function WallSettingsClient({ wall, posts }: WallSettingsClientProps) {
  const [loading, setLoading] = useState(false)
  const [previewSettings, setPreviewSettings] = useState(wall.settings)
  const [isPrivate, setIsPrivate] = useState(!!wall.password_hash)

  const handleUpdate = async (formData: FormData) => {
    setLoading(true)
    const result = await updateWallSettings(wall.id, formData)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('설정이 저장되었습니다.')
    }
    setLoading(false)
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('정말로 이 게시물을 삭제하시겠습니까?')) return
    
    const result = await deletePost(postId, wall.id)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('게시물이 삭제되었습니다.')
    }
  }

  const handleDeleteWall = async () => {
    if (!confirm('정말로 이 담벼락을 삭제하시겠습니까? 모든 데이터가 영구적으로 삭제됩니다.')) return
    setLoading(true)
    await deleteWall(wall.id)
  }

  return (
    <div className="container mx-auto px-4 md:px-8 space-y-12">
      <header className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <Link 
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "h-12 w-12 rounded-2xl border-blue-100 bg-white shadow-sm hover:bg-blue-50 transition-colors flex items-center justify-center"
            )}
          >
            <ChevronLeft className="h-6 w-6 text-blue-500" />
          </Link>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold mx-auto md:mx-0">
              <SettingsIcon className="h-3.5 w-3.5" />
              <span>담벼락 환경 설정</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-zinc-900 uppercase">{wall.title}</h1>
            <p className="text-zinc-400 text-sm font-medium font-mono">{wall.id}</p>
          </div>
        </div>
        
        <Link 
          href={`/walls/${wall.id}`} 
          target="_blank"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "rounded-2xl border-blue-100 bg-white hover:bg-blue-50 text-blue-600 font-bold px-8 h-12 shadow-sm flex items-center justify-center"
          )}
        >
          <ExternalLink className="mr-2 h-4 w-4" /> 담벼락 방문하기
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 왼쪽: 설정 영역 */}
        <div className="lg:col-span-8 space-y-8">
          <form action={handleUpdate}>
            <Card className="rounded-[40px] border-none bg-white shadow-xl shadow-blue-200/20 overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-blue-50">
                    <LayoutGrid className="h-5 w-5 text-blue-500" />
                  </div>
                  <CardTitle className="text-2xl font-bold">기본 정보</CardTitle>
                </div>
                <CardDescription className="text-zinc-500 font-medium">담벼락의 이름과 접근 방식을 관리합니다.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-sm font-bold text-zinc-600 ml-1">담벼락 이름</Label>
                  <Input id="title" name="title" defaultValue={wall.title} required className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:bg-white transition-all text-lg font-medium px-6" />
                </div>
               <div className="flex items-center justify-between p-6 bg-blue-50/50 rounded-[32px] border border-blue-100/50">
                  <div className="space-y-1">
                    <Label htmlFor="volatileMode" className="text-lg font-bold text-blue-900">휘발성 모드</Label>
                    <p className="text-sm text-blue-600/70 font-medium">게시물이 24시간 후 자동으로 사라집니다.</p>
                  </div>
                  <label htmlFor="volatileMode" className="relative inline-flex items-center cursor-pointer group">
                    <input 
                      type="checkbox" 
                      id="volatileMode" 
                      name="volatileMode" 
                      className="sr-only peer"
                      defaultChecked={wall.settings?.volatileMode}
                    />
                    <div className="w-14 h-8 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500 shadow-inner group-hover:scale-105 transition-transform"></div>
                  </label>
                </div>

                <div className="p-8 rounded-[36px] bg-zinc-50 border border-zinc-100 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="isPrivate" className="text-xl font-black text-zinc-900">비공개 모드 (비밀번호 보호)</Label>
                      <p className="text-sm text-zinc-500/70 font-medium">비밀번호를 설정하여 특정인만 입장 가능하게 합니다.</p>
                    </div>
                    <label htmlFor="isPrivate" className="relative inline-flex items-center cursor-pointer group">
                      <input 
                        type="checkbox" 
                        id="isPrivate" 
                        className="sr-only peer"
                        checked={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.checked)}
                      />
                      <div className="w-14 h-8 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-zinc-900 shadow-inner group-hover:scale-105 transition-transform"></div>
                    </label>
                  </div>

                  {/* is_public 값은 isPrivate의 역방향으로 전송 */}
                  <input type="hidden" name="is_public" value={isPrivate ? 'off' : 'on'} />

                  {isPrivate && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3 pt-4 border-t border-zinc-200/50"
                    >
                      <Label htmlFor="password" className="text-sm font-bold text-zinc-600 ml-1">입장 비밀번호 설정</Label>
                      <Input 
                        id="password" 
                        name="password" 
                        type="password" 
                        defaultValue={wall.password_hash} 
                        placeholder="입장 시 사용할 비밀번호를 입력하세요"
                        className="h-14 rounded-2xl border-zinc-200 bg-white focus:bg-white transition-all text-lg font-medium px-6 shadow-sm"
                        required={isPrivate}
                      />
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-8 rounded-[40px] border-none bg-white shadow-xl shadow-blue-200/20 overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-blue-50">
                    <Palette className="h-5 w-5 text-blue-500" />
                  </div>
                  <CardTitle className="text-2xl font-bold">브랜딩 & 레이아웃</CardTitle>
                </div>
                <CardDescription className="text-zinc-500 font-medium">배경 이미지와 투명도 등 시각적인 스타일을 커스터마이징하세요.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <ThemeCustomizer 
                  initialSettings={wall.settings} 
                  onSettingsChange={setPreviewSettings} 
                />
              </CardContent>
              <CardFooter className="p-8 pt-0">
                <Button type="submit" className="w-full h-14 rounded-[20px] bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold shadow-lg shadow-blue-200 transition-all" disabled={loading}>
                  {loading ? '저장 중...' : <><Save className="mr-2 h-5 w-5" /> 변경 사항 저장하기</>}
                </Button>
              </CardFooter>
            </Card>
          </form>

          {/* 게시물 관리 */}
          <Card className="rounded-[40px] border-none bg-white shadow-xl shadow-blue-200/20 overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-bold">게시물 모니터링</CardTitle>
                  <CardDescription className="text-zinc-500 font-medium">총 {posts.length}개의 이야기가 있습니다.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-4">
              <div className="grid gap-4">
                {posts.length === 0 ? (
                  <div className="text-center py-20 bg-zinc-50 rounded-[32px] border border-dashed border-zinc-200">
                    <p className="text-zinc-400 font-medium italic">아직 도착한 이야기가 없습니다.</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <motion.div 
                      key={post.id} 
                      whileHover={{ x: 4 }}
                      className="flex items-start justify-between p-6 rounded-3xl bg-zinc-50/50 border border-zinc-100 hover:bg-white hover:shadow-md transition-all group"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-black text-sm text-blue-500 uppercase">{post.nickname}</span>
                          <span className="text-[10px] font-bold text-zinc-400">{new Date(post.created_at).toLocaleString()}</span>
                        </div>
                        <p className="text-zinc-700 font-medium leading-relaxed line-clamp-3">{post.content}</p>
                        {post.media_url && (
                          <div className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg border border-blue-100">
                            IMAGE ATTACHED
                          </div>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 min-w-[40px] rounded-xl text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-colors ml-4"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* 위험 구역 */}
          <div className="p-8 rounded-[40px] bg-red-50 border border-red-100 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:bg-red-100/50">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-lg font-black text-red-600 flex items-center justify-center md:justify-start gap-2">
                <ShieldAlert className="h-5 w-5" /> 영구 삭제
              </h3>
              <p className="text-sm text-red-500/80 font-medium">담벼락의 모든 데이터가 즉시 파괴되며 복구할 수 없습니다.</p>
            </div>
            <Button variant="destructive" className="rounded-2xl px-8 h-12 font-bold shadow-lg shadow-red-200" onClick={handleDeleteWall} disabled={loading}>
              담벼락 전체 삭제
            </Button>
          </div>
        </div>

        {/* 오른쪽: 미리보기 영역 */}
        <div className="lg:col-span-4">
          <div className="sticky top-32 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-black text-zinc-900 flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-500" /> 라이브 프리뷰
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Live Syncing</span>
              </div>
            </div>
            
            <div className="relative group">
              {/* Phone Frame Decoration */}
              <div className="absolute -inset-4 bg-zinc-900 rounded-[54px] shadow-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-700" />
              
              <div 
                className="w-full aspect-[9/16] rounded-[48px] border-[8px] border-white shadow-2xl overflow-hidden relative shadow-blue-200/50 group-hover:scale-[1.02] transition-transform duration-700"
                style={{
                  backgroundColor: previewSettings.theme === 'dark' ? '#000' : '#f8fafc',
                  backgroundImage: previewSettings.backgroundImage ? `url(${previewSettings.backgroundImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div 
                  className="absolute inset-4 rounded-[32px] p-6 flex flex-col gap-6 overflow-hidden border border-white/10"
                  style={{
                    backdropFilter: `blur(${previewSettings.glassOpacity * 20}px)`,
                    backgroundColor: previewSettings.theme === 'dark' 
                      ? `rgba(0, 0, 0, ${previewSettings.glassOpacity})` 
                      : `rgba(255, 255, 255, ${previewSettings.glassOpacity})`
                  }}
                >
                  <div className="h-1 w-12 bg-zinc-300/30 rounded-full mx-auto" />
                  <h3 className="font-black text-xl text-center uppercase tracking-tight" style={{ 
                    color: previewSettings.theme === 'dark' ? '#fff' : '#000',
                    fontFamily: previewSettings.font === 'serif' ? 'serif' : 'sans-serif'
                  }}>
                    {wall.title}
                  </h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white/10 p-4 rounded-3xl border border-white/10 shadow-sm">
                        <div className="h-1.5 w-12 bg-primary/20 rounded-full mb-3" />
                        <div className="space-y-1.5">
                          <div className="h-2 w-full bg-zinc-200/20 rounded" />
                          <div className="h-2 w-2/3 bg-zinc-200/20 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Decorative Floating Button */}
                  <div className="mt-auto mx-auto h-12 w-12 rounded-full bg-blue-500 shadow-lg shadow-blue-200 flex items-center justify-center">
                    <Palette className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-center text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
              모바일 기기에서 보여지는 대략적인 레이아웃입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

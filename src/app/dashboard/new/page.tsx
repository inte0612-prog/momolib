'use client'

import { useState } from 'react'
import { createWall } from './actions'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'
import { ChevronLeft, PlusCircle, Sparkles, LayoutGrid, Lock } from 'lucide-react'
import SiteHeader from '@/components/layout/SiteHeader'

export default function NewWallPage() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await createWall(formData)
    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#f8fbff] text-zinc-900 selection:bg-blue-100">
      <SiteHeader />

      <main className="container mx-auto pt-32 pb-20 px-4 flex flex-col items-center relative z-10">
        {/* Background Decorative Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl aspect-square bg-blue-100/40 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="w-full max-w-xl mb-8 flex items-center justify-between">
          <Link 
            href="/dashboard" 
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "rounded-2xl hover:bg-blue-50 transition-colors group flex items-center h-10 px-4"
            )}
          >
            <ChevronLeft className="mr-2 h-5 w-5 text-blue-500 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-zinc-600">대시보드로 돌아가기</span>
          </Link>
        </div>

        <Card className="w-full max-w-xl rounded-[40px] border-none bg-white shadow-2xl shadow-blue-200/50 overflow-hidden">
          <CardHeader className="p-10 pb-6 text-center">
            <div className="mx-auto mb-6 bg-blue-50 w-20 h-20 rounded-[28px] flex items-center justify-center">
              <PlusCircle className="h-10 w-10 text-blue-500" />
            </div>
            <CardTitle className="text-3xl md:text-4xl font-black tracking-tight mb-2">새 담벼락 만들기</CardTitle>
            <CardDescription className="text-zinc-500 font-medium text-lg">
              진솔한 대화가 시작되는 당신만의<br />소중한 공간을 이름 지어주세요.
            </CardDescription>
          </CardHeader>
          
          <form action={handleSubmit}>
            <CardContent className="px-10 pb-8 space-y-8">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-sm font-bold text-zinc-600 ml-1 flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4 text-blue-400" /> 담벼락 이름
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="예: 우리들만의 비밀 일기장"
                  required
                  className="h-16 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:bg-white transition-all text-lg font-medium px-6 focus:ring-2 focus:ring-blue-100 placeholder:text-zinc-300"
                />
              </div>

              <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-100/50 flex gap-4 items-start">
                <div className="bg-white p-2 rounded-xl shadow-sm">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-blue-900">TIP</p>
                  <p className="text-xs text-blue-700/80 leading-relaxed font-medium">
                    기본적으로 공개 담벼락으로 생성됩니다. 비밀번호가 필요한 경우 생성 후 '관리하기' 메뉴에서 비공개 모드를 설정할 수 있습니다.
                  </p>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="px-10 pb-10">
              <Button type="submit" className="w-full h-16 rounded-[24px] bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold shadow-xl shadow-blue-200 transition-all hover:scale-[1.02] active:scale-95" disabled={loading}>
                {loading ? '공간 생성 중...' : '새로운 담벼락 탄생시키기'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="mt-12 text-[10px] font-bold text-zinc-400 tracking-widest uppercase flex items-center gap-2">
          <span className="w-12 h-px bg-zinc-200" />
          Powered by MEMOLIB Premium
          <span className="w-12 h-px bg-zinc-200" />
        </p>
      </main>
    </div>
  )
}

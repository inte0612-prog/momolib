'use client'

import { useState } from 'react'
import { verifyWallPassword } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Lock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

interface AuthClientProps {
  wallId: string
  isProtected: boolean
  defaultNickname: string
}

export default function AuthClient({ wallId, isProtected, defaultNickname }: AuthClientProps) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await verifyWallPassword(wallId, formData)
    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#f8fbff] p-4 text-zinc-900 selection:bg-blue-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-blue-100/40 blur-[120px] rounded-full pointer-events-none" />

      <div className="mb-12 relative z-10 flex flex-col items-center gap-4">
        <Link href="/" className="flex items-center gap-2 group bg-white/50 backdrop-blur-md px-6 py-3 rounded-[24px] border border-white/20 shadow-sm hover:bg-white transition-all scale-110">
          <div className="bg-blue-500 p-1.5 rounded-xl">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter">MEMOLIB</span>
        </Link>
      </div>

      <Card className="w-full max-w-lg rounded-[48px] border-none bg-white/80 backdrop-blur-2xl shadow-2xl shadow-blue-200/50 relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10" />
        
        <CardHeader className="p-10 pb-6 text-center">
          <div className="mx-auto mb-6 bg-blue-50 w-24 h-24 rounded-[36px] flex items-center justify-center relative">
            <ShieldCheck className="h-10 w-10 text-blue-500" />
            <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-2xl shadow-lg border border-blue-50">
              <Sparkles className="h-5 w-5 text-blue-400" />
            </div>
          </div>
          <CardTitle className="text-3xl md:text-4xl font-black tracking-tight mb-2">
            {isProtected ? "비밀 공간 입장" : "어떤 별명으로 활동할까요?"}
          </CardTitle>
          <CardDescription className="text-zinc-500 font-medium text-lg leading-relaxed">
            {isProtected 
              ? "이 담벼락은 보호되어 있습니다. 별명과 비밀번호를 입력해 주세요." 
              : "담벼락에 사용될 별명을 정해주세요. 언제든 자유롭게 수정할 수 있습니다."}
          </CardDescription>
        </CardHeader>

        <form action={handleSubmit}>
          <CardContent className="px-10 pb-8 space-y-6">
            <div className="space-y-3">
              <Label htmlFor="nickname" className="text-sm font-bold text-zinc-600 ml-1">나의 닉네임</Label>
              <div className="relative group">
                <Input
                  id="nickname"
                  name="nickname"
                  type="text"
                  placeholder="닉네임을 입력하세요"
                  defaultValue={defaultNickname}
                  required
                  className="h-16 rounded-[24px] border-zinc-100 bg-white shadow-inner transition-all text-xl font-bold px-8 focus:ring-4 focus:ring-blue-100 placeholder:text-zinc-300"
                />
              </div>
            </div>

            {isProtected && (
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-bold text-zinc-600 ml-1">잠금 비밀번호</Label>
                <div className="relative group">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    required
                    className="h-16 rounded-[24px] border-zinc-100 bg-white shadow-inner transition-all text-xl font-bold px-8 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="px-10 pb-10">
            <Button type="submit" className="w-full h-16 rounded-[24px] bg-zinc-900 hover:bg-zinc-800 text-white text-xl font-bold transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3" disabled={loading}>
              {loading ? (
                '입장 준비 중...'
              ) : (
                <>
                  담벼락 입장하기 <ArrowRight className="h-6 w-6" />
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <p className="mt-12 text-xs font-bold text-zinc-400 tracking-tighter flex items-center gap-2">
        개인정보 보호를 위해 비밀번호는 안전하게 암호화됩니다.
      </p>
    </div>
  )
}

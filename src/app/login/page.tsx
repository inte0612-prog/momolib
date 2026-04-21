'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Sparkles, Mail, Lock, UserPlus, LogIn, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (isSignUp) {
      // 회원가입 프로세스
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('회원가입 확인 메일을 보냈습니다. 이메일을 확인해 주세요!')
      }
    } else {
      // 로그인 프로세스
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('로그인 성공!')
        router.push('/')
      }
    }
    setLoading(false)
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#f8fbff] p-4 text-zinc-900 selection:bg-blue-100">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl aspect-square bg-blue-100/40 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Branding */}
      <div className="mb-12 relative z-10 text-center space-y-4">
        <Link href="/" className="inline-flex items-center gap-2 group bg-white/50 backdrop-blur-md px-6 py-3 rounded-[24px] border border-white/20 shadow-sm hover:bg-white transition-all scale-110 mb-2">
          <div className="bg-blue-500 p-1.5 rounded-xl">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter">MEMOLIB</span>
        </Link>
      </div>

      <Card className="w-full max-w-lg rounded-[48px] border-none bg-white/80 backdrop-blur-2xl shadow-2xl shadow-blue-200/50 relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10" />
        
        <CardHeader className="p-10 pb-6 text-center">
          <CardTitle className="text-3xl md:text-4xl font-black tracking-tight mb-2">
            {isSignUp ? '회원가입' : '로그인'}
          </CardTitle>
          <CardDescription className="text-zinc-500 font-medium text-lg leading-relaxed">
            {isSignUp 
              ? '함께 나눌 준비가 되셨나요? 계정을 만드세요.' 
              : '지금 로그인하고 담벼락을 작성하세요.'}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="px-10 pb-6 space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-bold text-zinc-600 ml-1 flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400" /> 이메일 주소
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-16 rounded-[24px] border-zinc-100 bg-white shadow-inner transition-all text-lg font-medium px-6 focus:ring-4 focus:ring-blue-100"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="password" className="text-sm font-bold text-zinc-600 ml-1 flex items-center gap-2">
                <Lock className="h-4 w-4 text-blue-400" /> 비밀번호
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-16 rounded-[24px] border-zinc-100 bg-white shadow-inner transition-all text-lg font-medium px-6 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </CardContent>
          
          <CardFooter className="px-10 pb-10 flex flex-col gap-4">
            <Button type="submit" className="w-full h-16 rounded-[24px] bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold shadow-xl shadow-blue-200 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3" disabled={loading}>
              {loading ? (
                isSignUp ? '가입 중...' : '로그인 중...'
              ) : (
                <>
                  {isSignUp ? <UserPlus className="h-6 w-6" /> : <LogIn className="h-6 w-6" />}
                  {isSignUp ? '무료로 시작하기' : '로그인하기'}
                </>
              )}
            </Button>
            
            <div className="flex items-center gap-4 w-full">
              <div className="h-px bg-zinc-100 flex-1" />
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">or</span>
              <div className="h-px bg-zinc-100 flex-1" />
            </div>

            <Button 
              type="button" 
              variant="ghost" 
              className="w-full h-14 rounded-[20px] text-zinc-500 font-bold hover:bg-blue-50 hover:text-blue-500 transition-all flex items-center justify-center gap-2" 
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? (
                <>이미 계정이 있으신가요? <span className="text-blue-500 underline underline-offset-4">로그인하기</span></>
              ) : (
                <>계정이 없으신가요? <span className="text-blue-500 underline underline-offset-4">새로운 계정으로 가입하기</span></>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <div className="mt-12 flex flex-col items-center gap-6 relative z-10">
        <Link href="/" className="text-sm font-bold text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> 메인으로 돌아가기
        </Link>
        <p className="text-[10px] font-bold text-zinc-400 tracking-tighter uppercase">
          © 2026 MEMOLIB. All rights reserved.
        </p>
      </div>
    </div>
  )
}

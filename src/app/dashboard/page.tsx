import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { PlusCircle, Settings, ExternalLink, Sparkles, LayoutDashboard, LogOut } from 'lucide-react'
import SiteHeader from '@/components/layout/SiteHeader'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: walls } = await supabase
    .from('walls')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="relative min-h-screen bg-[#f8fbff] text-zinc-900 selection:bg-blue-100">
      <SiteHeader />

      <main className="container mx-auto pt-32 pb-20 px-4 md:px-8 space-y-12 relative z-10">
        {/* Background Decorative Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-square bg-blue-100/30 blur-[120px] rounded-full pointer-events-none -z-10" />

        <header className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold">
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>관리자 대시보드</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900">내 담벼락 목록</h1>
            <p className="text-zinc-500 font-medium max-w-md">당신의 소중한 소통 공간들을 한눈에 관리하세요.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <form action="/auth/signout" method="post">
              <Button variant="outline" className="rounded-2xl border-blue-100 bg-white hover:bg-zinc-50 text-zinc-600 font-bold px-6">
                <LogOut className="mr-2 h-4 w-4" /> 로그아웃
              </Button>
            </form>
          </div>
        </header>

        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Create New Wall Card */}
          <Link href="/dashboard/new" className="group">
            <div className="h-full border-2 border-dashed border-blue-200 rounded-[40px] flex flex-col items-center justify-center p-12 bg-white/40 backdrop-blur-sm hover:bg-white hover:border-blue-400 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-200/50">
              <div className="bg-blue-50 p-4 rounded-3xl mb-4 group-hover:scale-110 transition-transform">
                <PlusCircle className="h-10 w-10 text-blue-500" />
              </div>
              <span className="text-xl font-bold text-zinc-900">새 담벼락 만들기</span>
              <p className="text-sm text-zinc-400 mt-2 text-center">비밀번호 하나로 시작하는<br />새로운 소통의 공간</p>
            </div>
          </Link>

          {walls?.map((wall) => (
            <Card key={wall.id} className="group relative overflow-hidden rounded-[40px] border-none bg-white shadow-xl shadow-blue-200/20 hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700" />
              
              <CardHeader className="p-8 pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-2xl font-black tracking-tight group-hover:text-blue-500 transition-colors uppercase">
                      {wall.title}
                    </span>
                    <span className="text-xs font-bold text-zinc-400">
                      {new Date(wall.created_at).toLocaleDateString()} 생성
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="px-8 pb-8 space-y-6">
                <div className="h-px bg-zinc-100" />
                <div className="flex items-center justify-between gap-4">
                  <Link 
                    href={`/walls/${wall.id}`} 
                    target="_blank"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "flex-1 rounded-2xl border-blue-50 bg-white hover:bg-blue-50 text-blue-500 font-bold h-12 shadow-sm flex items-center justify-center leading-none"
                    )}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" /> 방문하기
                  </Link>
                  <Link 
                    href={`/dashboard/walls/${wall.id}`}
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "flex-1 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold h-12 shadow-lg shadow-zinc-200 flex items-center justify-center leading-none"
                    )}
                  >
                    <Settings className="mr-2 h-4 w-4" /> 관리하기
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>

      <footer className="py-20 px-4 text-center border-t border-zinc-100 mt-20">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="bg-blue-500 p-1 rounded-lg">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter">MEMOLIB</span>
        </div>
        <p className="text-zinc-400 text-sm font-medium">© 2026 MEMOLIB ADMIN. Your Wall Dashboard.</p>
      </footer>
    </div>
  )
}

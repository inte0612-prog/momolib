import Link from "next/link";
import SiteHeader from "@/components/layout/SiteHeader";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles, PlusCircle, ExternalLink, Settings } from "lucide-react";
import { cookies } from "next/headers";
import { generateAnonymousNickname } from "@/lib/nicknames";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Home() {
  const supabase = await createClient();
  const cookieStore = await cookies();
  
  // 글로벌 닉네임 및 게스트 ID 확인 (쿠키 기반)
  const globalNickname = cookieStore.get('global_nickname')?.value;
  const guestId = cookieStore.get('guest_id')?.value;

  // 전체 공개 담벼락 가져오기
  const { data: publicWalls } = await supabase
    .from('walls')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6);

  // 내가 만든 담벼락 가져오기 (guest_id 기준)
  let myWalls: any[] = [];
  if (guestId) {
    const { data: fetchedMyWalls } = await supabase
      .from('walls')
      .select('*')
      .eq('owner_id', guestId)
      .order('created_at', { ascending: false });
    myWalls = fetchedMyWalls || [];
  }

  const defaultNickname = generateAnonymousNickname();

  return (
    <div className="relative min-h-screen bg-[#f8fbff] text-zinc-900 overflow-hidden selection:bg-blue-100 font-sans">
      <SiteHeader />

      {/* Decorative background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-square bg-blue-100/50 blur-[120px] rounded-full pointer-events-none opacity-60 transition-all duration-1000" />
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-cyan-100/40 blur-[100px] rounded-full pointer-events-none" />

      {!globalNickname ? (
        /* PHASE 1: Nickname Setup (New User) */
        <main className="relative z-10 flex flex-col items-center justify-center pt-24 pb-40 px-4 overflow-hidden min-h-[85vh]">
          <WaveBackground />
          <FloatingEmojis />
          
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-12 relative z-20">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold animate-fade-in shadow-sm mx-auto">
                <Sparkles className="h-3.5 w-3.5" />
                <span>함께 나누는 우리만의 공간, 메모립</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] text-zinc-900 [word-break:keep-all]">
                <span className="block italic text-blue-400 opacity-80">너의</span>
                <span className="block">마음대로</span>
                <span className="block text-blue-500">지금 시작해</span>
              </h1>
              
              <p className="max-w-xl mx-auto text-base md:text-lg text-zinc-500 font-medium leading-relaxed [word-break:keep-all]">
                가입 없는 초간단 담벼락 서비스.<br />
                사용할 별명을 입력하고 바로 나만의 공간을 만들어보세요.
              </p>
            </div>

            <form action="/api/identity/setup" method="POST" className="w-full max-w-md space-y-4">
              <div className="relative group">
                <input 
                  type="text" 
                  name="nickname"
                  placeholder="사용할 별명을 입력하세요"
                  defaultValue={defaultNickname}
                  required
                  className="w-full h-20 rounded-[32px] border-none bg-white shadow-2xl shadow-blue-200/50 text-2xl font-black px-10 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-center"
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-3 bottom-3 px-8 rounded-[24px] bg-blue-500 hover:bg-blue-600 text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-200"
                >
                  시작하기
                </button>
              </div>
              <p className="text-zinc-400 text-xs font-bold italic">언제든 자유롭게 변경할 수 있습니다.</p>
            </form>
          </div>
        </main>
      ) : (
        /* PHASE 2: Dashboard (Returning User) */
        <main className="relative z-10 pt-32 pb-40 px-4">
          <div className="max-w-6xl mx-auto space-y-24">
            {/* Greeting */}
            <div className="flex flex-col md:flex-row items-end justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>반가워요, {globalNickname}님!</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black tracking-tight text-zinc-900 leading-tight">
                  나의 <span className="text-blue-500">담벼락 공간</span>
                </h2>
                <p className="text-zinc-500 font-medium max-w-md text-lg">
                  내가 만든 공간들을 관리하거나 새로운 담벼락을 생성하세요.
                </p>
              </div>

              <Link 
                href="/dashboard/new" 
                className={cn(
                  "w-full sm:w-auto rounded-3xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold h-16 px-10 shadow-2xl transition-all hover:scale-[1.05] flex items-center justify-center gap-2 text-lg"
                )}
              >
                <PlusCircle className="h-6 w-6" /> 새 담벼락 만들기
              </Link>
            </div>

            {/* My Walls Grid */}
            <section className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {myWalls && myWalls.length > 0 ? (
                  myWalls.map((wall: any) => (
                    <WallCard key={wall.id} wall={wall} isAdmin />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center bg-white/40 backdrop-blur-sm rounded-[48px] border-2 border-dashed border-blue-100">
                    <p className="text-zinc-400 font-bold italic">아직 직접 만든 담벼락이 없네요. 시작해볼까요?</p>
                  </div>
                )}
              </div>
            </section>

            {/* Explore Section */}
            <section className="pt-20 space-y-12">
              <div className="flex items-center justify-between">
                <div className="space-y-1 text-center md:text-left">
                  <h3 className="text-3xl font-black tracking-tight text-zinc-900">최근 생성된 담벼락</h3>
                  <p className="text-zinc-500 font-medium text-sm">다른 사람들은 어떤 이야기를 나누고 있을까요?</p>
                </div>
                <Link href="/explore" className="text-sm font-bold text-blue-500 hover:underline">모두 보기</Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {publicWalls && publicWalls.length > 0 ? (
                  publicWalls.map((wall: any) => (
                    <WallCard key={wall.id} wall={wall} />
                  ))
                ) : (
                  <div className="col-span-full py-10 text-center">
                    <p className="text-zinc-400 font-medium italic">탐색할 대화 공간이 아직 없습니다.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      )}

      <footer className="relative z-10 py-16 px-4 text-center border-t border-blue-50/50 mt-40">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="bg-blue-500 p-1.5 rounded-lg shadow-lg shadow-blue-200">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-zinc-900 uppercase">MEMOLIB</span>
        </div>
        <p className="text-zinc-400 text-sm font-medium italic">© 2026 MEMOLIB. Explore and Share Together.</p>
      </footer>
    </div>
  );
}

function WallCard({ wall, isAdmin = false }: { wall: any, isAdmin?: boolean }) {
  return (
    <Card className="group relative overflow-hidden rounded-[40px] border-none bg-white shadow-xl shadow-blue-200/10 hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-500 hover:-translate-y-2">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700" />
      
      <CardHeader className="p-8 pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-black tracking-tight group-hover:text-blue-500 transition-colors uppercase truncate max-w-[180px]">
              {wall.title}
            </span>
            <span className="text-xs font-bold text-zinc-400">
              {new Date(wall.created_at).toLocaleDateString()} 생성
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="px-8 pb-8 space-y-6">
        <div className="h-px bg-zinc-50" />
        <div className="flex items-center justify-between gap-4">
          <Link 
            href={`/walls/${wall.id}`} 
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex-1 rounded-2xl border-blue-50 bg-white hover:bg-blue-50 text-blue-500 font-bold h-12 shadow-sm flex items-center justify-center leading-none"
            )}
          >
            <ExternalLink className="mr-2 h-4 w-4" /> 방문
          </Link>
          {isAdmin && (
            <Link 
              href={`/dashboard/walls/${wall.id}`}
              className={cn(
                buttonVariants({ variant: "default" }),
                "flex-1 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold h-12 shadow-lg shadow-zinc-200 flex items-center justify-center leading-none"
              )}
            >
              <Settings className="mr-2 h-4 w-4" /> 관리
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function WaveBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full bg-gradient-to-b from-blue-50/80 via-transparent to-transparent opacity-80">
      <svg 
        className="absolute top-0 left-[-100%] w-[400%] h-[40%] opacity-20 rotate-180 animate-wave-medium pointer-events-none" 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
      >
        <path 
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,44.78-21.61,69.34-31.42s51.05-18,77.29-21.84C1175,9,1189,10,1200,12.18V0Z" 
          fill="rgba(59, 130, 246, 0.4)"
        ></path>
      </svg>
    </div>
  )
}

function FloatingEmojis() {
  const emojis = ['📝', '💌', '✨', '🔒', '🌈', '💬', '😊', '❤️', '🕊️', '🌟', '📮', '🖋️', '💭'];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30 w-full h-full">
      {[...Array(20)].map((_, i) => (
        <div key={i} className="absolute animate-drift opacity-[0.15]" style={{
          top: `${(i * 137) % 85 + 5}%`,
          left: `${(i * 283) % 90 + 5}%`,
          animationDelay: `${i * 0.7}s`,
          animationDuration: `${20 + (i % 10)}s`
        }}>
          <span className="text-5xl">{emojis[i % emojis.length]}</span>
        </div>
      ))}
    </div>
  );
}

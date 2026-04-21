import Link from "next/link";
import SiteHeader from "@/components/layout/SiteHeader";
import { Button, buttonVariants } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { cn } from "@/lib/utils";
import { ArrowRight, ShieldCheck, Zap, Palette, Sparkles, Globe, ArrowUpRight, PlusCircle } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  
  // Fetch user for condition
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch public walls for 'Auth State' view
  const { data: publicWalls } = await supabase
    .from('walls')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(6);

  return (
    <div className="relative min-h-screen bg-[#f8fbff] text-zinc-900 overflow-hidden selection:bg-blue-100 font-sans">
      {user && <SiteHeader />}

      {/* Decorative background blobs - Consistent for both states */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-square bg-blue-100/50 blur-[120px] rounded-full pointer-events-none opacity-60" />
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-cyan-100/40 blur-[100px] rounded-full pointer-events-none" />

      {!user ? (
        /* GUEST STATE: Full Landing Page */
        <>
          <main className="relative z-10 flex flex-col items-center justify-center pt-20 pb-40 px-4 overflow-hidden">
            {/* Wave Background Layers */}
            <WaveBackground />
            
            {/* Floating Emojis */}
            <FloatingEmojis />
            
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-10 relative z-20 pointer-events-none">
              <div className="space-y-6 pointer-events-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold animate-fade-in shadow-sm mx-auto">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>함께 나누는 우리만의 공간, 메모립</span>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] text-zinc-900 [word-break:keep-all]">
                  <span className="block italic text-blue-400 opacity-80">너의</span>
                  <span className="block">마음대로</span>
                  <span className="block text-blue-500">무엇이든</span>
                </h1>
                
                <p className="max-w-xl mx-auto text-base md:text-lg text-zinc-500 font-medium leading-relaxed [word-break:keep-all]">
                  복잡한 가입 없이, 비밀번호 하나로 시작하는 익명 담벼락.<br />
                  진솔한 응원과 마음을 실시간으로 나누어 보세요. 
                  더 친근하고 따뜻한 소통의 공간, 메모립이 함께합니다.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-4">
                  <Link 
                    href="/login"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "h-14 px-10 rounded-2xl text-lg font-bold bg-blue-500 hover:bg-blue-600 text-white shadow-xl shadow-blue-200 hover:scale-105 transition-transform flex items-center justify-center gap-2"
                    )}
                  >
                    로그인 <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link 
                    href="/login"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "h-14 px-10 rounded-2xl text-lg font-bold border-blue-100 bg-white hover:bg-blue-50 text-blue-600 transition-colors shadow-sm flex items-center justify-center"
                    )}
                  >
                    회원가입
                  </Link>
                </div>
              </div>
            </div>
          </main>

          {/* Features Section */}
          <section className="relative z-10 py-32 px-4 bg-white/30 backdrop-blur-sm border-y border-blue-50">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-20 space-y-4">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900">왜 메모립일까요?</h2>
                <p className="text-zinc-500 font-medium">소통을 더 쉽고, 즐겁게 만드는 기능들을 소개합니다.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard 
                  icon={<ShieldCheck className="h-8 w-8" />} 
                  title="안전한 익명성" 
                  description="이메일이나 이름 없이 오직 비밀번호로만 소통하세요. 당신의 프라이버시가 가장 중요합니다."
                  color="bg-blue-50"
                  iconColor="text-blue-500"
                />
                <FeatureCard 
                  icon={<Zap className="h-8 w-8" />} 
                  title="실시간 인터랙션" 
                  description="새로운 글과 감정 반응들이 실시간으로 업데이트되어 생생한 소통의 재미를 더합니다."
                  color="bg-cyan-50"
                  iconColor="text-cyan-500"
                />
                <FeatureCard 
                  icon={<Palette className="h-8 w-8" />} 
                  title="세련된 감성" 
                  description="사용자 정의 테마와 부드러운 애니메이션으로 누구나 머물고 싶은 예쁜 공간을 만듭니다."
                  color="bg-indigo-50"
                  iconColor="text-indigo-500"
                />
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative z-10 py-24 px-4 bg-blue-500 mx-4 md:mx-10 rounded-[48px] overflow-hidden my-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/30 blur-[80px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/20 blur-[60px] rounded-full" />
            <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight [word-break:keep-all]">
                지금 바로 당신만의<br />담벼락을 만들어보세요.
              </h2>
              <Link 
                href="/login" 
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-white text-blue-600 hover:bg-zinc-100 h-16 px-10 rounded-2xl text-xl font-bold transition-all shadow-2xl flex items-center justify-center w-fit mx-auto"
                )}
              >
                새 담벼락 만들기
              </Link>
            </div>
          </section>
        </>
      ) : (
        /* AUTH STATE: Simplified Wall List */
        <main id="explore" className="relative z-10 pt-32 pb-32 px-4 min-h-[70vh]">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
              <div className="space-y-4 text-center md:text-left [word-break:keep-all]">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                  <Globe className="h-3 w-3" />
                  <span>Live Exploration</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black tracking-tight text-zinc-900 leading-tight">
                  생성된 <span className="text-blue-500">담벼락 목록</span>
                </h2>
                <p className="text-zinc-500 font-medium max-w-md text-lg">
                  누구나 자유롭게 소통할 수 있는 공개 공간들을 탐색하고 따뜻한 메시지를 남겨보세요.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <Link href="/explore" className="text-sm font-bold text-zinc-400 flex items-center gap-2 group hover:text-blue-500 transition-colors px-4 py-2">
                  전체 보기 <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
                <Link 
                  href="/dashboard/new" 
                  className={cn(
                    "w-full sm:w-auto rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold h-14 px-8 shadow-xl shadow-blue-200 transition-all hover:scale-[1.05] flex items-center justify-center gap-2"
                  )}
                >
                  <PlusCircle className="h-5 w-5" /> 나도 담벼락 만들기
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publicWalls && publicWalls.length > 0 ? (
                publicWalls.map((wall) => (
                  <Link key={wall.id} href={`/walls/${wall.id}`} className="group">
                    <div className="h-full p-8 rounded-[48px] bg-white border border-zinc-100 shadow-xl shadow-blue-200/10 hover:shadow-2xl hover:shadow-blue-200/30 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700" />
                      
                      <div className="flex flex-col h-full space-y-6 relative z-10">
                        <div className="space-y-2">
                          <h3 className="text-2xl font-black tracking-tight text-zinc-900 group-hover:text-blue-500 transition-colors uppercase truncate">{wall.title}</h3>
                          <p className="text-sm text-zinc-400 font-medium">{new Date(wall.created_at).toLocaleDateString()} 생성</p>
                        </div>
                        
                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-50">
                          <span className="text-sm font-bold text-zinc-400 group-hover:text-blue-400 transition-colors italic">Visit Wall</span>
                          <div className="h-10 w-10 rounded-2xl bg-zinc-50 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm">
                            <ArrowRight className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-zinc-50 rounded-[48px] border border-dashed border-zinc-200">
                  <p className="text-zinc-400 font-medium italic [word-break:keep-all]">아직 생성된 담벼락이 없습니다. 첫 번째 담벼락을 만들어보세요!</p>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      <footer className="relative z-10 py-16 px-4 text-center border-t border-blue-50/50">
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

function WaveBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full bg-gradient-to-b from-blue-50/80 via-transparent to-transparent">
      {/* Top Inverted Wave to fill the top space with blue */}
      <svg 
        className="absolute top-0 left-[-100%] w-[400%] h-[40%] opacity-20 rotate-180 animate-wave-medium pointer-events-none" 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
      >
        <path 
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,44.78-21.61,69.34-31.42s51.05-18,77.29-21.84C1175,9,1189,10,1200,12.18V0Z" 
          fill="rgba(59, 130, 246, 0.2)"
          className="pointer-events-none"
        ></path>
      </svg>

      {/* Bottom Waves */}
      <svg 
        className="absolute bottom-0 left-0 w-[400%] h-full opacity-60 animate-wave-slow pointer-events-none" 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
      >
        <path 
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
          fill="rgba(59, 130, 246, 0.05)"
          className="pointer-events-none"
        ></path>
      </svg>
      <svg 
        className="absolute bottom-0 left-[-100%] w-[400%] h-[80%] opacity-40 animate-wave-medium pointer-events-none" 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
      >
        <path 
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,44.78-21.61,69.34-31.42s51.05-18,77.29-21.84C1175,9,1189,10,1200,12.18V0Z" 
          fill="rgba(6, 182, 212, 0.08)"
          className="pointer-events-none"
        ></path>
      </svg>
    </div>
  )
}

function FloatingEmojis() {
  const emojis = ['📝', '💌', '✨', '🔒', '🌈', '💬', '😊', '❤️', '🕊️', '🦄', '🍀', '🌟', '📮', '🖋️', '💭', '💎', '🎨', '🚀', '🌙', '☀'];
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30 w-full h-full">
      {[...Array(30)].map((_, i) => {
        // Improved randomization without true Math.random for hydration safety
        const top = (i * 137) % 90 + 5;
        const left = (i * 283) % 100;
        const delay = (i * 73) % 20;
        const duration = 20 + (i * 97) % 15;
        const size = 1 + (i * 13) % 2.5;
        const opacity = 0.15 + (i * 19) % 0.4;
        
        return (
          <div 
            key={i}
            className="absolute animate-drift pointer-events-auto group/emoji"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          >
            <span 
              className="block animate-float transition-all duration-500 hover:scale-150 hover:rotate-12 hover:opacity-100 hover:filter-none cursor-default group-hover/emoji:z-50 relative"
              style={{ 
                animationDelay: `${(i * 37) % 5}s`,
                fontSize: `${size}rem`,
                opacity: opacity,
                filter: i % 5 === 0 ? 'blur(1.5px)' : i % 8 === 0 ? 'blur(0.5px)' : 'none'
              }}
            >
              {emojis[i % emojis.length]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function FeatureCard({ icon, title, description, color, iconColor }: { icon: React.ReactNode, title: string, description: string, color: string, iconColor: string }) {
  return (
    <div className="group p-10 rounded-[40px] bg-white border border-blue-50 hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-500">
      <div className={`p-4 rounded-3xl ${color} ${iconColor} w-fit mb-8 group-hover:scale-110 transition-transform shadow-sm`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-zinc-900">{title}</h3>
      <p className="text-zinc-500 leading-relaxed font-medium">{description}</p>
    </div>
  );
}

import Link from "next/link";
import SiteHeader from "@/components/layout/SiteHeader";
import { createClient } from "@/utils/supabase/server";
import { Globe, ArrowRight, Sparkles, PlusCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default async function ExplorePage() {
  const supabase = await createClient();
  const { data: publicWalls } = await supabase
    .from('walls')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  return (
    <div className="relative min-h-screen bg-[#f8fbff] text-zinc-900 overflow-hidden selection:bg-blue-100 font-sans">
      <SiteHeader />

      {/* Decorative background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-square bg-blue-100/30 blur-[120px] rounded-full pointer-events-none opacity-40" />
      
      <main className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto space-y-16">
          
          {/* Hero Section */}
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-black uppercase tracking-widest animate-fade-in shadow-sm">
              <Globe className="h-3.5 w-3.5" />
              <span>Global discovery</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 leading-tight">
              실시간 <span className="text-blue-500">인기 담벼락</span>을<br />탐색해 보세요.
            </h1>
            <p className="text-zinc-500 font-medium text-lg leading-relaxed">
              다양한 사람들이 만든 소통의 공간입니다. 자유롭게 방문하여<br className="hidden md:block" />
              따뜻한 메시지와 공감을 나누어 보세요.
            </p>
            
            <div className="pt-4">
              <Link 
                href="/dashboard/new" 
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-14 px-10 rounded-2xl text-lg font-bold bg-blue-500 hover:bg-blue-600 text-white shadow-xl shadow-blue-200 transition-all hover:scale-105 flex items-center justify-center gap-2 mx-auto w-fit"
                )}
              >
                <PlusCircle className="h-5 w-5" /> 나도 담벼락 만들기
              </Link>
            </div>
          </div>

          <div className="h-px bg-blue-100/50 w-full" />

          {/* Grid Layout */}
          <div className="space-y-8">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black tracking-tight text-zinc-900 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-blue-500" /> 모든 공개 공간
              </h2>
              <span className="text-sm font-bold text-zinc-400">{publicWalls?.length || 0}개의 공간</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publicWalls && publicWalls.length > 0 ? (
                publicWalls.map((wall) => (
                  <Link key={wall.id} href={`/walls/${wall.id}`} className="group">
                    <div className="h-full p-8 rounded-[48px] bg-white border border-zinc-100 shadow-xl shadow-blue-200/10 hover:shadow-2xl hover:shadow-blue-200/30 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700" />
                      
                      <div className="flex flex-col h-full space-y-6 relative z-10">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Public Space</span>
                          </div>
                          <h3 className="text-2xl font-black tracking-tight text-zinc-900 group-hover:text-blue-500 transition-colors uppercase truncate leading-tight">
                            {wall.title}
                          </h3>
                          <p className="text-sm text-zinc-400 font-medium">
                            {new Date(wall.created_at).toLocaleDateString()} 생성
                          </p>
                        </div>
                        
                        <div className="mt-auto flex items-center justify-between pt-6 border-t border-zinc-50">
                          <span className="text-sm font-black text-zinc-400 group-hover:text-blue-400 transition-colors italic">Visit Wall</span>
                          <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm">
                            <ArrowRight className="h-6 w-6" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-32 text-center bg-white rounded-[56px] border border-dashed border-zinc-200">
                  <div className="max-w-xs mx-auto space-y-6">
                    <div className="bg-zinc-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
                      <Search className="h-10 w-10 text-zinc-300" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-zinc-900 font-black text-xl italic uppercase tracking-tighter">No Walls Found</p>
                      <p className="text-zinc-400 font-medium text-sm">아직 생성된 담벼락이 없습니다.<br />첫 번째 주인공이 되어보세요!</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-16 px-4 text-center border-t border-blue-50 mb-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="bg-blue-500 p-1.5 rounded-lg shadow-lg shadow-blue-200">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-zinc-900">MEMOLIB</span>
        </div>
        <p className="text-zinc-400 text-sm font-medium italic">© 2026 MEMOLIB. Explore and Share.</p>
      </footer>
    </div>
  );
}

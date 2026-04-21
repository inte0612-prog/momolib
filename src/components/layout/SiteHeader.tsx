'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, Settings } from 'lucide-react'

interface SiteHeaderProps {
  globalNickname?: string
}

export default function SiteHeader({ globalNickname }: SiteHeaderProps) {
  const handleResetIdentity = () => {
    // 쿠키를 삭제하고 새로고침하여 닉네임 설정 화면으로 유도
    document.cookie = 'global_nickname=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    window.location.reload()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-6">
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between w-full max-w-6xl px-6 py-3 rounded-[32px] border border-blue-100 bg-white/70 backdrop-blur-xl shadow-2xl shadow-blue-200/20"
      >
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-blue-500 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-200">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-zinc-900">MEMOLIB</span>
        </Link>

        <div className="flex items-center gap-6">
          {globalNickname ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none mb-1">Active Identity</span>
                <span className="text-sm font-bold text-zinc-900">{decodeURIComponent(globalNickname)}</span>
              </div>
              <button 
                onClick={handleResetIdentity}
                className="p-2 rounded-xl bg-zinc-50 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                title="별명 변경하기"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="text-[10px] font-black text-zinc-300 uppercase tracking-widest italic">
              Anonymous Session
            </div>
          )}
        </div>
      </motion.nav>
    </header>
  )
}

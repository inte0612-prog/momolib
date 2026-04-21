'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Sparkles, LayoutDashboard, LogOut } from 'lucide-react'

export default function SiteHeader() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
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

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link 
                href="/dashboard" 
                className="text-sm font-bold text-zinc-500 hover:text-blue-500 transition-colors flex items-center gap-1.5"
              >
                <LayoutDashboard className="h-4 w-4" />
                대시보드
              </Link>
              <button 
                onClick={handleSignOut}
                className="text-sm font-bold text-red-400 hover:text-red-500 transition-colors flex items-center gap-1.5 p-2 rounded-xl hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                로그아웃
              </button>
            </>
          ) : (
            <Link 
              href="/login" 
              className="px-6 py-2 rounded-2xl font-bold bg-blue-500 text-white shadow-xl shadow-blue-200 hover:bg-blue-600 transition-all text-sm"
            >
              로그인
            </Link>
          )}
        </div>
      </motion.nav>
    </header>
  )
}

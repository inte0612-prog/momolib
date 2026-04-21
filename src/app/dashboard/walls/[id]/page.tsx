import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import WallSettingsClient from './WallSettingsClient'
import SiteHeader from '@/components/layout/SiteHeader'
import { LayoutDashboard } from 'lucide-react'

interface WallSettingsPageProps {
  params: Promise<{ id: string }>
}

import { cookies } from 'next/headers'

export default async function WallSettingsPage({ params }: WallSettingsPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const cookieStore = await cookies()
  
  const guestId = cookieStore.get('guest_id')?.value
  const globalNickname = cookieStore.get('global_nickname')?.value

  if (!guestId) {
    redirect('/')
  }

  // 담벼락 정보 가져오기 (본인 소유 확인 포함)
  const { data: wall, error: wallError } = await supabase
    .from('walls')
    .select('*')
    .eq('id', id)
    .eq('owner_id', guestId)
    .single()

  if (wallError || !wall) {
    notFound()
  }

  // 게시물 목록 가져오기 (관리용)
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('wall_id', id)
    .order('created_at', { ascending: false })

  return (
    <div className="relative min-h-screen bg-[#f8fbff] text-zinc-900">
      <SiteHeader globalNickname={globalNickname} />
      
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-square bg-blue-100/30 blur-[120px] rounded-full pointer-events-none z-0" />
      
      <main className="relative z-10 pt-32 pb-20">
        <WallSettingsClient wall={wall} posts={posts || []} />
      </main>
    </div>
  )
}

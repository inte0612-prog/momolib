import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import AuthClient from './AuthClient'

interface WallAuthPageProps {
  params: Promise<{ id: string }>
}

export default async function WallAuthPage({ params }: WallAuthPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: wall, error } = await supabase
    .from('walls')
    .select('password_hash')
    .eq('id', id)
    .single()

  if (error || !wall) {
    notFound()
  }

  // 비밀번호가 없는 공개 담벼락이면 즉시 월 페이지로 리다이렉트
  if (!wall.password_hash || wall.password_hash.trim() === "") {
    redirect(`/walls/${id}`)
  }

  return <AuthClient wallId={id} />
}

import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { generateAnonymousNickname } from '@/lib/nicknames'
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

  const isProtected = wall.password_hash && wall.password_hash.trim() !== ""
  const defaultNickname = generateAnonymousNickname()

  return (
    <AuthClient 
      wallId={id} 
      isProtected={!!isProtected} 
      defaultNickname={defaultNickname} 
    />
  )
}

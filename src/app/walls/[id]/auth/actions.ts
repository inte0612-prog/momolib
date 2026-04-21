'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function verifyWallPassword(wallId: string, formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  const nickname = formData.get('nickname') as string

  const { data: wall, error } = await supabase
    .from('walls')
    .select('password_hash')
    .eq('id', wallId)
    .single()

  if (error || !wall) {
    return { error: '담벼락을 찾을 수 없습니다.' }
  }

  const isProtected = wall.password_hash && wall.password_hash.trim() !== ""
  
  // 비밀번호 확인이 필요한 경우
  if (isProtected) {
    if (wall.password_hash !== password) {
      return { error: '비밀번호가 올바르지 않습니다.' }
    }

    // 인증 쿠키 설정
    const cookieStore = await cookies()
    cookieStore.set(`wall_auth_${wallId}`, 'true', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })
  }

  // 닉네임 쿠키 설정 (항상 수행)
  if (nickname) {
    const cookieStore = await cookies()
    cookieStore.set(`wall_nickname_${wallId}`, encodeURIComponent(nickname), {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
  }
  
  redirect(`/walls/${wallId}`)
}

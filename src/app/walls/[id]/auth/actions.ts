'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function verifyWallPassword(wallId: string, formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string

  const { data: wall, error } = await supabase
    .from('walls')
    .select('password_hash')
    .eq('id', wallId)
    .single()

  if (error || !wall) {
    return { error: '담벼락을 찾을 수 없습니다.' }
  }

  // Note: In a real app, use proper hash comparison.
  if (wall.password_hash === password) {
    const cookieStore = await cookies()
    cookieStore.set(`wall_auth_${wallId}`, 'true', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })
    
    redirect(`/walls/${wallId}`)
  } else {
    return { error: '비밀번호가 올바르지 않습니다.' }
  }
}

'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function createWall(formData: FormData) {
  const supabase = await createClient()
  const cookieStore = await cookies()
  
  // 게스트 ID 확인
  const guestId = cookieStore.get('guest_id')?.value

  if (!guestId) {
    throw new Error('아이덴티티가 설정되지 않았습니다. 홈 화면에서 닉네임을 먼저 설정해 주세요.')
  }

  const title = formData.get('title') as string
  const password_hash = "" // Default is public (no password)
  const is_public = true // Default is public (explore section)

  const { error } = await supabase
    .from('walls')
    .insert([
      {
        owner_id: guestId,
        title,
        password_hash,
        is_public,
        settings: {
          theme: 'light',
          font: 'sans',
          glassOpacity: 0.5,
          volatileMode: false
        }
      }
    ])

  if (error) {
    console.error(error)
    return { error: error.message }
  }

  revalidatePath('/')
  redirect('/')
}

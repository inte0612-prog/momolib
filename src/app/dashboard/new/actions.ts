'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createWall(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('인증되지 않았습니다.')
  }

  const title = formData.get('title') as string
  const password_hash = "" // Default is public (no password)
  const is_public = true // Default is public (explore section)

  const { data, error } = await supabase
    .from('walls')
    .insert([
      {
        owner_id: user.id,
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
    .select()

  if (error) {
    console.error(error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

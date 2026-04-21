'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateWallSettings(wallId: string, formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const password = formData.get('password') as string
  const theme = formData.get('theme') as string
  const font = formData.get('font') as string
  const glassOpacity = parseFloat(formData.get('glassOpacity') as string)
  const backgroundImage = formData.get('backgroundImage') as string

  const isPublic = formData.get('is_public') === 'on'
  const password_hash = isPublic ? "" : password
 
  const { error } = await supabase
    .from('walls')
    .update({
      title,
      password_hash,
      is_public: isPublic,
      settings: {
        theme,
        font,
        glassOpacity,
        backgroundImage,
        volatileMode: formData.get('volatileMode') === 'on'
      }
    })
    .eq('id', wallId)

  if (error) {
    console.error('Update wall error:', error)
    return { error: error.message }
  }

  revalidatePath(`/dashboard/walls/${wallId}`)
  revalidatePath(`/walls/${wallId}`)
  return { success: true }
}

export async function deletePost(postId: string, wallId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)

  if (error) {
    console.error('Delete post error:', error)
    return { error: error.message }
  }

  revalidatePath(`/dashboard/walls/${wallId}`)
  revalidatePath(`/walls/${wallId}`)
  return { success: true }
}

export async function deleteWall(wallId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('walls')
    .delete()
    .eq('id', wallId)

  if (error) {
    console.error('Delete wall error:', error)
    return { error: error.message }
  }

  redirect('/dashboard')
}

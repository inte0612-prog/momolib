import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import WallContent from '@/components/wall/WallContent'
import { generateAnonymousNickname } from '@/lib/nicknames'
import { cookies } from 'next/headers'

interface WallPageProps {
  params: Promise<{ id: string }>
}

export default async function WallPage({ params }: WallPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: wall, error } = await supabase
    .from('walls')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !wall) {
    notFound()
  }

  // 비밀번호 보호 여부 확인
  const cookieStore = await cookies()
  if (wall.password_hash && wall.password_hash.trim() !== "") {
    const isAuthed = cookieStore.get(`wall_auth_${id}`)
    if (!isAuthed) {
      redirect(`/walls/${id}/auth`)
    }
  }

  // 게시물 초기 상위 50개 가져오기
  const { data: initialPosts } = await supabase
    .from('posts')
    .select(`
      *,
      reactions(*)
    `)
    .eq('wall_id', id)
    .order('created_at', { ascending: false })
    .limit(50)

  // 닉네임 처리 (쿠키에서 가져오거나 인증 페이지로 유도)
  const cookieName = `wall_nickname_${id}`
  const rawNickname = cookieStore.get(cookieName)?.value
  
  if (!rawNickname) {
    redirect(`/walls/${id}/auth`)
  }

  const nickname = decodeURIComponent(rawNickname)

  return (
    <main 
      className="min-h-screen transition-all duration-500"
      style={{
        backgroundColor: wall.settings?.theme === 'dark' ? '#000' : '#f8fafc',
        backgroundImage: wall.settings?.backgroundImage ? `url(${wall.settings.backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <WallContent 
        wall={wall} 
        initialPosts={initialPosts || []} 
        initialNickname={nickname}
      />
    </main>
  )
}

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  const formData = await request.formData()
  const nickname = formData.get('nickname') as string

  if (!nickname || nickname.trim() === '') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const cookieStore = await cookies()
  
  // 1. 글로벌 닉네임 설정 (365일 유지)
  cookieStore.set('global_nickname', encodeURIComponent(nickname), {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 365,
  })

  // 2. 게스트 ID 발급 (이미 있으면 유지, 없으면 생성)
  let guestId = cookieStore.get('guest_id')?.value
  if (!guestId) {
    guestId = uuidv4()
    cookieStore.set('guest_id', guestId, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365,
    })
  }

  // 홈으로 리다이렉트 (새로운 쿠키와 함께 대시보드 표시)
  return NextResponse.redirect(new URL('/', request.url))
}

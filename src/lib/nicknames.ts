const adjectives = [
  '행복한', '슬픈', '빛나는', '어두운', '빠른', '느린', '강력한', '부드러운',
  '용감한', '고요한', '신비로운', '따뜻한', '차가운', '명랑한', '우아한',
  '바쁜', '한가한', '날카로운', '뭉툭한', '거대한', '작은', '푸른', '붉은'
]

const nouns = [
  '고래', '사자', '호랑이', '토끼', '여우', '곰', '독수리', '참새',
  '별', '달', '해', '구름', '바다', '산', '강', '나무', '꽃',
  '바람', '파도', '하늘', '들판', '숲', '나비', '돌고래'
]

export function generateAnonymousNickname() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const num = Math.floor(Math.random() * 1000)
  return `${adj} ${noun} ${num}`
}

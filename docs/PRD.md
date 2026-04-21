# 담벼락(Private Anonymous Wall) 서비스 PRD

## 1. 프로젝트 개요
익명성을 보장하면서도 개인적인 공간을 제공하는 **"모던한 프라이빗 익명 소통 공간"**입니다. 방장은 자신만의 담벼락을 생성하고, 방문자들은 비밀번호를 통해 접근하여 익명으로 글과 미디어를 남길 수 있습니다.

- **목표**: 세련된 디자인(Glassmorphism)과 매끄러운 사용자 경험을 제공하는 소통 플랫폼 구축.
- **핵심 가치**: 프라이버시, 익명성, 실시간성, 현대적 미학.

---

## 2. 사용자 정의
### A. 방장 (Owner)
- 서비스에 회원가입/로그인하여 자신만의 담벼락을 생성합니다.
- 담벼락의 테마, 비밀번호, 휘발성(삭제 타이머) 등을 관리합니다.
- 부적절한 게시물을 관리(삭제)할 권한을 가집니다.

### B. 방문자 (Visitor)
- 특정 담벼락의 URL과 비밀번호를 알고 있는 사용자입니다.
- 별도의 회원가입 없이 익명으로 게시물을 작성하고 리액션을 남길 수 있습니다.
- 입장 시 자동으로 부여되는 익명 닉네임을 사용하며, Cookie 또는 LocalStorage를 통해 세션을 유지하여 재접속 시에도 동일한 닉네임을 유지합니다.

---

## 3. 상세 기능 요구사항

### 3.1. 담벼락 관리 (방장 전용)
- **담벼락 생성**: 고유 ID 기반의 URL 생성 (예: `/walls/[wall-id]`).
- **커스텀 테마**: 
  - 배경 이미지 업로드 및 선택.
  - 폰트 스타일 및 카드 투명도(Glassmorphism 농도) 조절.
- **휘발성 모드**: '24시간 후 자동 삭제' 옵션 활성화 기능.
- **관리자 도구**: 개별 게시물 삭제, 담벼락 전체 비공개/폐쇄 전환.
- **접근 제어 (Middleware)**: Next.js의 `middleware.ts`를 활용하여 서버 레벨에서 비밀번호 인증 여부를 확인하고, 미인증 사용자의 상세 페이지(`/walls/[id]`) 접근을 차단합니다.

### 3.2. 게시물 작성 및 인터랙션 (공통)
- **멀티미디어 포스트**: 
  - 텍스트 입력.
  - 이미지 업로드 (Supabase Storage).
  - YouTube 및 웹 링크 입력 시 OpenGraph 자동 미리보기 카드 생성.
- **익명성 보장**: 
  - 입장 시 랜덤 닉네임 생성기(ex: "춤추는 고래") 작동.
  - IP나 개인정보를 노출하지 않는 익명 투고 시스템.
- **감정 리액션**: 
  - 5종의 이모지(❤️, 🔥, 👍, 😮, 😂)를 게시물당 1회 이상 클릭 가능.
  - Supabase Realtime을 활용하여 다른 사용자의 게시물이 실시간으로 나타남.
- **이미지 최적화**: Supabase Storage 이미지에 대해 `next/image`와 Supabase Image Transformation을 결합하여 디바이스별 최적화된 리사이징 이미지를 서빙합니다.

### 3.3. UI/UX 디자인 가이드
- **테마**: 다크 모드 및 라이트 모드 기본 지원.
- **스타일**: Glassmorphism (배경 흐림 효과, 미세한 테두리, 반투명도).
- **레이아웃 시스템 (Hybrid)**: 
  - 기본적으로 **Masonry Grid Layout**을 통해 빈 공간을 최적화하여 보여줍니다.
  - 방장이 게시물을 재배치할 경우 **자유 배치(Fixed Position)** 모드로 전환하여 드래그 앤 드롭 위치 값을 저장할 수 있는 스위칭 기능을 제공합니다.
- **애니메이션**: 
  - Framer Motion을 이용한 카드 등장/사라짐 효과.
  - 호버 시 레이아웃 변화 없이 부드러운 스케일 업 및 그림자 효과.
- **반응형**: 모바일, 태블릿, 데스크톱 최적화.

---

## 4. 기술 스택

### 프론트엔드
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS, Shadcn UI
- **Animation**: Framer Motion
- **Icons**: Lucide React

### 백엔드 (Supabase)
- **Auth**: 방장 로그인을 위한 이메일/소셜 인증.
- **Database**: PostgreSQL (Post, Wall, Reaction, Profile 테이블).
- **Realtime**: 게시물 및 리액션 실시간 동기화.
- **Storage**: 이미지 업로드 처리.

### 인프라
- **Deployment**: Vercel
- **Domain**: Vercel 기본 도메인 또는 커스텀 도메인.

---

## 5. 데이터 모델 (초안)

### `profiles` (Table)
- `id` (uuid, PK)
- `email` (string)
- `created_at` (timestamp)

### `walls` (Table)
- `id` (uuid, PK)
- `owner_id` (uuid, FK to profiles.id)
- `title` (string)
- `password_hash` (string) - 담벼락 입장용
- `settings` (jsonb) - 배경, 폰트, 투명도, 휘발성 설정 등
- `created_at` (timestamp)

### `posts` (Table)
- `id` (uuid, PK)
- `wall_id` (uuid, FK to walls.id)
- `nickname` (string) - 자동 생성된 닉네임
- `content` (text)
- `media_url` (string, optional)
- `link_preview` (jsonb, optional) - OpenGraph 데이터
- `position_order` (int) - 드래그 앤 드롭 순서 (방장 수정용)
- `created_at` (timestamp)

### `reactions` (Table)
- `id` (uuid, PK)
- `post_id` (uuid, FK to posts.id)
- `emoji_type` (string)
- `count` (int)

---

## 6. 핵심 워크플로우

1. **방장**: 로그인 -> 담벼락 생성 -> 비밀번호 및 테마 설정 -> 링크 공유.
2. **방문자**: 링크 접속 -> 비밀번호 입력 -> 닉네임 부여 받음 -> 담벼락 콘텐츠 열람.
3. **상호작용**: 방문자/방장이 글 작성 -> 실시간으로 모든 접속자에게 카드 노출 -> 이모지 반응.
4. **유지관리**: (휘발성 모드 시) 24시간 경과 후 Supabase Edge Functions 또는 Cron Job을 통한 데이터 삭제.

---

## 7. 향후 확장성 (Phase 2)
- 게시물 내 대댓글 기능.
- 더 다양한 카드 템플릿 (음악 재생기, 투표 등).
- 담벼락 전체 아카이브(PDF 또는 이미지) 저장 기능.

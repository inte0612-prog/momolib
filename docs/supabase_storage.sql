-- 담벼락 이미지용 스토리지 버킷 생성
-- 이 SQL은 Supabase SQL Editor에서 실행해야 합니다.

-- 1. 버킷 생성
insert into storage.buckets (id, name, public)
values ('wall-images', 'wall-images', true);

-- 2. 정책 설정: 누구나 조회 가능
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'wall-images' );

-- 3. 정책 설정: 누구나 업로드 가능 (익명 게시판 특성상)
-- 실제 운영 시에는 파일 크기 및 확장자 제한을 추가하는 것이 좋습니다.
create policy "Anonymous Upload"
on storage.objects for insert
with check ( bucket_id = 'wall-images' );

-- 1. profiles 테이블 생성 (방장 정보)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. walls 테이블 생성 (담벼락 설정)
create table public.walls (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  password_hash text not null,
  settings jsonb default '{
    "theme": "light",
    "font": "sans",
    "glassOpacity": 0.5,
    "volatileMode": false
  }'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. posts 테이블 생성 (게시물 데이터)
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  wall_id uuid references public.walls(id) on delete cascade not null,
  nickname text not null,
  content text,
  media_url text,
  link_preview jsonb,
  position_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. reactions 테이블 생성 (이모지 반응)
create table public.reactions (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  emoji_type text not null,
  count integer default 1 not null,
  unique(post_id, emoji_type)
);

-- RLS (Row Level Security) 설정
alter table public.profiles enable row level security;
alter table public.walls enable row level security;
alter table public.posts enable row level security;
alter table public.reactions enable row level security;

-- Profiles: 자가 조회 및 방장 본인만 수정 가능
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

-- Walls: 전체 조회 가능(비밀번호 제외 로직은 앱 레벨), 생성/수정/삭제는 방장만
create policy "Walls are viewable by everyone" on public.walls for select using (true);
create policy "Authenticated users can create walls" on public.walls for insert with check (auth.uid() = owner_id);
create policy "Owners can update their own walls" on public.walls for update using (auth.uid() = owner_id);
create policy "Owners can delete their own walls" on public.walls for delete using (auth.uid() = owner_id);

-- Posts: 특정 담벼락에 속한 게시물 누구나 조회/생성 가능(비밀번호 검증은 미들웨어), 삭제는 방장만
create policy "Posts are viewable by everyone" on public.posts for select using (true);
create policy "Anyone can create posts" on public.posts for insert with check (true);
create policy "Owners can delete posts on their walls" on public.posts for delete
using (auth.uid() in (select owner_id from public.walls where id = public.posts.wall_id));

-- Reactions: 누구나 조회/생성/수정 가능
create policy "Reactions are viewable by everyone" on public.reactions for select using (true);
create policy "Anyone can create/update reactions" on public.reactions for insert with check (true);
create policy "Anyone can update reaction counts" on public.reactions for update using (true);

-- Realtime 활성화
alter publication supabase_realtime add table public.posts;
alter publication supabase_realtime add table public.reactions;

-- auth.users에 신규 유저 생성 시 public.profiles에 자동 삽입하는 트리거
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

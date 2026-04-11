create extension if not exists pgcrypto;

create table if not exists public.mindmitra_users (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  avatar_url text,
  last_check_in_date date,
  streak_count integer not null default 0,
  longest_streak integer not null default 0,
  wellness_score integer not null default 0 check (wellness_score between 0 and 100),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.mood_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.mindmitra_users(id) on delete cascade,
  mood_value integer not null check (mood_value between 1 and 5),
  note text,
  entry_date date not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, entry_date)
);

create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.mindmitra_users(id) on delete cascade,
  title text not null default 'Untitled',
  content text not null,
  is_private boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.chat_rooms (
  id text primary key,
  name text not null,
  description text not null,
  icon text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  room_id text not null references public.chat_rooms(id) on delete cascade,
  user_id uuid references public.mindmitra_users(id) on delete set null,
  sender_alias text not null,
  message text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_mood_entries_user_date
  on public.mood_entries(user_id, entry_date desc);

create index if not exists idx_journal_entries_user_created
  on public.journal_entries(user_id, created_at desc);

create index if not exists idx_chat_messages_room_created
  on public.chat_messages(room_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_users_updated_at on public.mindmitra_users;
create trigger trg_users_updated_at
before update on public.mindmitra_users
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_moods_updated_at on public.mood_entries;
create trigger trg_moods_updated_at
before update on public.mood_entries
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_journal_updated_at on public.journal_entries;
create trigger trg_journal_updated_at
before update on public.journal_entries
for each row execute procedure public.set_updated_at();

insert into public.chat_rooms (id, name, description, icon)
values
  ('general', 'General Support', 'A safe space for anything on your mind', 'chat'),
  ('anxiety', 'Anxiety & Stress', 'Share and cope together', 'wave'),
  ('selfcare', 'Self-Care Corner', 'Tips, wins, and encouragement', 'spark'),
  ('night', 'Night Owls', 'For when sleep will not come', 'moon')
on conflict (id) do update
set
  name = excluded.name,
  description = excluded.description,
  icon = excluded.icon;

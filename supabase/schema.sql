create table applications (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid()
               references auth.users (id) on delete cascade,
  company      text not null,
  role         text not null,
  status       text not null default 'Applied'
               check (status in ('Applied', 'Online Assessment', 'Interview', 'Offer', 'Rejected')),
  deadline     date,
  date_applied date,
  notes        text,
  created_at   timestamptz not null default now()
);
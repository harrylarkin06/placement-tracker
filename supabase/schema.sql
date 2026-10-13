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

create policy "Users can view their own applications"
  on applications for select
  using (auth.uid() = user_id);

create policy "Users can insert their own applications"
  on applications for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own applications"
  on applications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own applications"
  on applications for delete
  using (auth.uid() = user_id);
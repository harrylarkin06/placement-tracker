-- One row per job application, owned by one user
create table applications (
  id           uuid primary key default gen_random_uuid(),
  -- Filled in automatically with the logged-in user's id; deleted if the account is
  user_id      uuid not null default auth.uid()
               references auth.users (id) on delete cascade,
  company      text not null,
  role         text not null,
  -- Must be one of the allowed statuses, even if the form is bypassed
  status       text not null default 'Applied'
               check (status in ('Applied', 'Online Assessment', 'Interview', 'Offer', 'Rejected')),
  -- Optional fields (no "not null")
  deadline     date,
  date_applied date,
  notes        text,
  created_at   timestamptz not null default now()
);

-- Row-level security: rules the database checks on every query so users only
-- touch their own rows. "using" filters which existing rows you can access;
-- "with check" controls what a new or changed row may look like.
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
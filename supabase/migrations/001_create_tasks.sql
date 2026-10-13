create extension if not exists pgcrypto;

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 120),
  description text check (description is null or char_length(description) <= 1000),
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  completed boolean not null default false,
  due_date date not null default (timezone('utc', now())::date),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_user_date_idx on public.tasks(user_id, due_date);
create index if not exists tasks_user_completed_idx on public.tasks(user_id, completed);
create index if not exists tasks_user_priority_idx on public.tasks(user_id, priority);

create or replace function public.set_tasks_updated_at() returns trigger
language plpgsql set search_path = '' as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists tasks_updated_at on public.tasks;
create trigger tasks_updated_at before update on public.tasks for each row execute function public.set_tasks_updated_at();

alter table public.tasks enable row level security;
drop policy if exists "Users can read own tasks" on public.tasks;
create policy "Users can read own tasks" on public.tasks for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "Users can insert own tasks" on public.tasks;
create policy "Users can insert own tasks" on public.tasks for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists "Users can update own tasks" on public.tasks;
create policy "Users can update own tasks" on public.tasks for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists "Users can delete own tasks" on public.tasks;
create policy "Users can delete own tasks" on public.tasks for delete to authenticated using (user_id = (select auth.uid()));

revoke all on public.tasks from anon;
grant select, insert, update, delete on public.tasks to authenticated;

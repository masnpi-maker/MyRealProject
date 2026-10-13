-- Keep category ownership enforcement in PostgreSQL as well as in the client.
-- This migration adds policies only; it does not alter either table.

drop policy if exists "tasks_category_owner_insert" on public.tasks;
create policy "tasks_category_owner_insert"
on public.tasks
as restrictive
for insert
to authenticated
with check (
  category_id is null
  or exists (
    select 1
    from public.categories c
    where c.id = category_id
      and c.user_id = (select auth.uid())
  )
);

drop policy if exists "tasks_category_owner_update" on public.tasks;
create policy "tasks_category_owner_update"
on public.tasks
as restrictive
for update
to authenticated
using (user_id = (select auth.uid()))
with check (
  user_id = (select auth.uid())
  and (
    category_id is null
    or exists (
      select 1
      from public.categories c
      where c.id = category_id
        and c.user_id = (select auth.uid())
    )
  )
);

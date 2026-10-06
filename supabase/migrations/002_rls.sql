alter table public.profiles   enable row level security;
alter table public.advisories enable row level security;

-- profiles: a user can read and update only their own profile.
-- (Insert is done by the signup trigger; deletion cascades from auth.users.)
create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "profiles_insert_own" on public.profiles
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- advisories: full isolation per user.
create policy "advisories_select_own" on public.advisories
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "advisories_insert_own" on public.advisories
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "advisories_update_own" on public.advisories
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "advisories_delete_own" on public.advisories
  for delete to authenticated
  using ((select auth.uid()) = user_id);

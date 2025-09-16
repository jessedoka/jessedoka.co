-- Drop the existing restrictive policy
drop policy if exists "no direct anon select downloads" on public.downloads;

-- Create a new policy that allows reading downloads by token
create policy "allow anon read downloads by token"
  on public.downloads for select
  to anon
  using (token is not null);

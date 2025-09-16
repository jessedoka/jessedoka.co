-- Allow reading orders when joined through downloads
create policy "allow anon read orders through downloads"
  on public.orders for select
  to anon
  using (
    id in (
      select order_id 
      from public.downloads 
      where token is not null
    )
  );

-- Add price field to packs table
-- Price is stored in pence (same as orders.amount) for consistency
alter table public.packs 
add column price integer not null default 1500; -- default to £15.00

-- Add comment to clarify the price format
comment on column public.packs.price is 'Price in pence (e.g., 1500 = £15.00)';

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

alter table public.profiles enable row level security;
alter table public.farms enable row level security;
alter table public.advisory_requests enable row level security;
alter table public.advisory_request_images enable row level security;
alter table public.advisory_reports enable row level security;
alter table public.market_prices enable row level security;
alter table public.weather_cache enable row level security;

-- PROFILES
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- FARMS
drop policy if exists "farms_owner_all" on public.farms;
create policy "farms_owner_all" on public.farms
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- ADVISORY REQUESTS
drop policy if exists "requests_owner_all" on public.advisory_requests;
create policy "requests_owner_all" on public.advisory_requests
  for all using (auth.uid() = farmer_id) with check (auth.uid() = farmer_id);

-- ADVISORY REQUEST IMAGES
drop policy if exists "images_owner_all" on public.advisory_request_images;
create policy "images_owner_all" on public.advisory_request_images
  for all using (
    exists (
      select 1 from public.advisory_requests r
      where r.id = request_id and r.farmer_id = auth.uid()
    )
  );

-- ADVISORY REPORTS
drop policy if exists "reports_owner_select" on public.advisory_reports;
create policy "reports_owner_select" on public.advisory_reports
  for select using (
    exists (
      select 1 from public.advisory_requests r
      where r.id = request_id and r.farmer_id = auth.uid()
    )
  );

-- MARKET PRICES
drop policy if exists "market_prices_select_all" on public.market_prices;
create policy "market_prices_select_all" on public.market_prices
  for select using (auth.role() = 'authenticated');

drop policy if exists "market_prices_admin_write" on public.market_prices;
create policy "market_prices_admin_write" on public.market_prices
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- WEATHER CACHE
drop policy if exists "weather_cache_select_all" on public.weather_cache;
create policy "weather_cache_select_all" on public.weather_cache
  for select using (auth.role() = 'authenticated');

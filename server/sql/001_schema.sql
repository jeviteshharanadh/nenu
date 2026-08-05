-- =========================================================
-- EXTENSIONS
-- =========================================================
create extension if not exists "pgcrypto";

-- =========================================================
-- ENUM TYPES
-- =========================================================
do $$ begin
  create type advisory_domain as enum (
    'crop_selection',
    'disease_pest_diagnosis',
    'fertilizer_nutrition',
    'irrigation_water_management',
    'soil_health',
    'weather_risk_advisory',
    'market_post_harvest'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type advisory_status as enum ('pending', 'processing', 'completed', 'failed');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type urgency_level as enum ('low', 'medium', 'high');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type growth_stage as enum ('seedling', 'vegetative', 'flowering', 'fruiting', 'maturity');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type irrigation_method as enum ('drip', 'sprinkler', 'flood', 'rainfed', 'manual');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type user_role as enum ('farmer', 'admin');
exception
  when duplicate_object then null;
end $$;

-- =========================================================
-- PROFILES  (1:1 with auth.users)
-- =========================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  preferred_language text not null default 'en',
  default_region text,
  role user_role not null default 'farmer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- FARMS
-- =========================================================
create table if not exists public.farms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  region text not null,
  latitude numeric(9,6),
  longitude numeric(9,6),
  area_acres numeric(10,2) not null check (area_acres > 0),
  soil_type text not null,
  irrigation_source text,
  primary_crops text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_farms_owner on public.farms(owner_id);

-- =========================================================
-- ADVISORY REQUESTS
-- =========================================================
create table if not exists public.advisory_requests (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid not null references public.farms(id) on delete cascade,
  advisory_domain advisory_domain not null,
  title text not null check (char_length(title) <= 120),
  description text not null check (char_length(description) between 20 and 2000),
  urgency urgency_level not null default 'medium',
  crop_type text,
  growth_stage growth_stage,
  target_season text,
  available_water_source text,
  symptoms_observed text[],
  first_noticed_days_ago int,
  last_fertilizer_applied text,
  last_applied_days_ago int,
  current_irrigation_method irrigation_method,
  soil_test_available boolean,
  soil_ph numeric(3,1),
  visible_soil_issues text[],
  expected_harvest_date date,
  quantity_estimate_kg numeric(10,2),
  status advisory_status not null default 'pending',
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_requests_farmer on public.advisory_requests(farmer_id);
create index if not exists idx_requests_farm on public.advisory_requests(farm_id);
create index if not exists idx_requests_status on public.advisory_requests(status);

-- =========================================================
-- ADVISORY REQUEST IMAGES
-- =========================================================
create table if not exists public.advisory_request_images (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.advisory_requests(id) on delete cascade,
  storage_path text not null,
  mime_type text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_images_request on public.advisory_request_images(request_id);

-- =========================================================
-- ADVISORY REPORTS  (1:1 with advisory_requests)
-- =========================================================
create table if not exists public.advisory_reports (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique references public.advisory_requests(id) on delete cascade,
  summary text not null,
  report_json jsonb not null,
  model_name text not null,
  language text not null default 'en',
  generated_at timestamptz not null default now()
);

-- =========================================================
-- WEATHER CACHE
-- =========================================================
create table if not exists public.weather_cache (
  id uuid primary key default gen_random_uuid(),
  region text not null,
  fetched_at timestamptz not null default now(),
  payload jsonb not null,
  unique (region)
);

-- =========================================================
-- MARKET PRICES
-- =========================================================
create table if not exists public.market_prices (
  id uuid primary key default gen_random_uuid(),
  crop_name text not null,
  region text not null,
  price_per_kg numeric(10,2) not null check (price_per_kg >= 0),
  unit text not null default 'kg',
  recorded_date date not null default current_date,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (crop_name, region, recorded_date)
);

create index if not exists idx_market_crop_region on public.market_prices(crop_name, region);

-- =========================================================
-- updated_at TRIGGER FUNCTION
-- =========================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_farms_updated on public.farms;
create trigger trg_farms_updated before update on public.farms
  for each row execute function public.set_updated_at();

drop trigger if exists trg_requests_updated on public.advisory_requests;
create trigger trg_requests_updated before update on public.advisory_requests
  for each row execute function public.set_updated_at();

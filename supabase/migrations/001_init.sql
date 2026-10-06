-- Extensions
create extension if not exists "pgcrypto";

-- Enum-like checks are used instead of Postgres enums for easier migration.

-- ============ profiles ============
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null default '' check (char_length(name) <= 100),
  default_location text check (default_location is null or char_length(default_location) <= 100),
  preferred_language text not null default 'English'
    check (preferred_language in ('English','Kannada','Hindi')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============ advisories ============
create table public.advisories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  -- inputs
  crop text not null check (char_length(crop) between 2 and 60),
  location text not null check (char_length(location) between 2 and 100),
  soil_type text not null check (soil_type in
    ('Red','Black','Alluvial','Laterite','Sandy','Loamy','Clay','Not sure')),
  season text not null check (season in
    ('Kharif','Rabi','Zaid','Perennial / Year-round')),
  growth_stage text check (growth_stage is null or growth_stage in
    ('Not planted yet','Germination','Vegetative','Flowering','Fruiting','Maturity / Harvest')),
  irrigation text not null check (irrigation in ('Available','Limited','Rain-fed only')),
  irrigation_method text check (irrigation_method is null or irrigation_method in
    ('Drip','Sprinkler','Flood','Furrow','Manual','Other')),
  temperature_c numeric(4,1) check (temperature_c is null or temperature_c between -5 and 55),
  rainfall_mm numeric(6,1) check (rainfall_mm is null or rainfall_mm between 0 and 3000),
  farm_size_acres numeric(10,2) check (farm_size_acres is null or farm_size_acres between 0.01 and 10000),
  problem text not null check (char_length(problem) between 10 and 1000),
  language text not null default 'English' check (language in ('English','Kannada','Hindi')),

  -- outputs
  primary_category text not null check (primary_category in (
    'crop_selection','soil_conditions','irrigation','nutrient_management',
    'pest_concerns','disease_symptoms','weather_risk','crop_growth_issues',
    'harvest_guidance','general_crop_management')),
  risk_level text not null check (risk_level in ('low','medium','high')),
  expert_consultation_recommended boolean not null default false,
  ai_response jsonb not null,
  model text not null,

  created_at timestamptz not null default now()
);

create index advisories_user_created_idx on public.advisories (user_id, created_at desc);
create index advisories_user_crop_idx    on public.advisories (user_id, crop);
create index advisories_user_risk_idx    on public.advisories (user_id, risk_level);

-- ============ updated_at trigger ============
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- ============ auto-create profile on signup ============
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''))
  on conflict (user_id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

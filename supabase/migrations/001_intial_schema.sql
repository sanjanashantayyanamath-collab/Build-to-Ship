-- ====================================================================
-- MIGRATION: 001_intial_schema.sql
-- DESCRIPTION: Initial PostgreSQL Schema for AI Crop Advisory Assistant
-- Includes: Extensions, Tables, Triggers, RLS Policies, and Seed Data
-- ====================================================================

-- 1. EXTENSIONS
create extension if not exists "pgcrypto";

-- 2. TABLE CREATION
-- ============ profiles ============
create table if not exists public.profiles (
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
create table if not exists public.advisories (
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

-- 3. INDEXES
create index if not exists advisories_user_created_idx on public.advisories (user_id, created_at desc);
create index if not exists advisories_user_crop_idx    on public.advisories (user_id, crop);
create index if not exists advisories_user_risk_idx    on public.advisories (user_id, risk_level);

-- 4. TRIGGERS & FUNCTIONS
-- ============ updated_at trigger ============
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists profiles_set_updated_at on public.profiles;
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.profiles   enable row level security;
alter table public.advisories enable row level security;

-- Drop existing policies if any for idempotency
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

drop policy if exists "advisories_select_own" on public.advisories;
drop policy if exists "advisories_insert_own" on public.advisories;
drop policy if exists "advisories_update_own" on public.advisories;
drop policy if exists "advisories_delete_own" on public.advisories;

-- profiles: a user can read, insert and update only their own profile
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

-- advisories: full isolation per user
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

-- 6. SEED DATA
-- Populate initial demo advisory if a user exists in auth.users
do $$
declare
  demo_user_id uuid;
begin
  select id into demo_user_id from auth.users limit 1;

  if demo_user_id is not null then
    insert into public.profiles (user_id, name, default_location, preferred_language)
    values (demo_user_id, 'Demo Farmer', 'Mysuru, Karnataka', 'English')
    on conflict (user_id) do nothing;

    insert into public.advisories (
      user_id, crop, location, soil_type, season, growth_stage,
      irrigation, irrigation_method, temperature_c, rainfall_mm, farm_size_acres,
      problem, language, primary_category, risk_level, expert_consultation_recommended,
      ai_response, model
    )
    values (
      demo_user_id,
      'Tomato',
      'Mysuru, Karnataka',
      'Red',
      'Kharif',
      'Flowering',
      'Available',
      'Drip',
      28.5,
      120.0,
      2.5,
      'Yellowing leaves with dark brown spots on lower canopy after light rain.',
      'English',
      'disease_symptoms',
      'medium',
      true,
      '{
        "inScope": true,
        "summary": "Early blight symptom patterns observed on tomato leaves following humid conditions.",
        "confidence": "medium",
        "limitations": "Visual inspection by an extension worker recommended.",
        "disclaimer": "This AI-generated advice is informational and does not replace guidance from a qualified agricultural expert.",
        "possibleCauses": [
          {"cause": "Alternaria solani (Early Blight)", "likelihood": "high", "howToCheck": "Check lower leaves for concentric rings in lesions."}
        ],
        "nutrientAdvice": "Ensure balanced Potassium and Nitrogen application to maintain plant vigor.",
        "preventiveMeasures": ["Remove affected lower leaves", "Maintain proper plant spacing for airflow"],
        "recommendedActions": [
          {"action": "Prune infected lower foliage and dispose away from field", "reason": "Reduces spore load and secondary infection", "priority": 1}
        ],
        "irrigationAdvice": "Avoid overhead irrigation; use drip irrigation to keep leaf canopy dry.",
        "followUpQuestions": ["Are spots spreading to upper foliage?", "Is fruit set affected?"],
        "riskExplanation": "Early blight can spread quickly across canopy during high humidity.",
        "weatherConsiderations": "Warm temperatures with frequent leaf wetness favor fungal spread.",
        "expertConsultationReason": "If more than 25% of canopy shows lesions, consult your local KVK or extension officer.",
        "pestDiseasePossibilities": [
          {"name": "Early Blight (Alternaria solani)", "likelihood": "high", "signsToLookFor": "Target-board pattern ring spots on leaves"}
        ]
      }'::jsonb,
      'gemini-2.5-flash'
    )
    on conflict do nothing;
  end if;
end $$;

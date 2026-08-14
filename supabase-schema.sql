-- À exécuter dans l'éditeur SQL de Supabase une seule fois.
-- L'application utilise l'authentification email/mot de passe et des règles RLS :
-- chaque compte ne voit que ses propres données.

create table if not exists public.equipment (
  id text primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null,
  location text,
  min_temp numeric,
  max_temp numeric,
  products text,
  active boolean not null default true,
  photo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.temperature_logs (
  id text primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  equipment_id text not null,
  log_date date not null,
  period text not null,
  recorded_at timestamptz not null default now(),
  temperature numeric not null,
  initials text,
  compliant boolean not null,
  anomaly text,
  corrective_action text,
  photo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  establishment_name text,
  company text,
  address text,
  phone text,
  updated_at timestamptz not null default now()
);

alter table public.equipment enable row level security;
alter table public.temperature_logs enable row level security;
alter table public.app_settings enable row level security;

create policy "equipment_select_own" on public.equipment for select using (auth.uid() = owner_id);
create policy "equipment_insert_own" on public.equipment for insert with check (auth.uid() = owner_id);
create policy "equipment_update_own" on public.equipment for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "equipment_delete_own" on public.equipment for delete using (auth.uid() = owner_id);

create policy "logs_select_own" on public.temperature_logs for select using (auth.uid() = owner_id);
create policy "logs_insert_own" on public.temperature_logs for insert with check (auth.uid() = owner_id);
create policy "logs_update_own" on public.temperature_logs for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "logs_delete_own" on public.temperature_logs for delete using (auth.uid() = owner_id);

create policy "settings_select_own" on public.app_settings for select using (auth.uid() = owner_id);
create policy "settings_insert_own" on public.app_settings for insert with check (auth.uid() = owner_id);
create policy "settings_update_own" on public.app_settings for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "settings_delete_own" on public.app_settings for delete using (auth.uid() = owner_id);

create index if not exists temperature_logs_equipment_date_idx on public.temperature_logs (equipment_id, log_date);

-- Capco Manufacturing ERP Supabase schema
-- Run this before seed.sql and rls-policies.sql.

create extension if not exists "pgcrypto";

do $$
begin
  create type public.user_status as enum ('active', 'inactive', 'suspended');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.workflow_status as enum ('Yet to Start', 'In-progress', 'Completed', 'Cancelled', 'Pending', 'Returned', 'Issued', 'Accepted', 'Rejected', 'Partially Issued', 'Paid', 'Partial Payment', 'Due', 'In Inventory', 'Being Used', 'Used Completely', 'Quality Check Pending', 'Dispatch Ready');
exception when duplicate_object then null;
end $$;

do $$
declare
  status_value text;
begin
  foreach status_value in array array[
    'Yet to Start',
    'In-progress',
    'Completed',
    'Cancelled',
    'Pending',
    'Returned',
    'Issued',
    'Accepted',
    'Rejected',
    'Partially Issued',
    'Paid',
    'Partial Payment',
    'Due',
    'In Inventory',
    'Being Used',
    'Used Completely',
    'Quality Check Pending',
    'Dispatch Ready'
  ]
  loop
    if not exists (
      select 1
      from pg_enum e
      join pg_type t on t.oid = e.enumtypid
      join pg_namespace n on n.oid = t.typnamespace
      where n.nspname = 'public'
        and t.typname = 'workflow_status'
        and e.enumlabel = status_value
    ) then
      execute format('alter type public.workflow_status add value %L', status_value);
    end if;
  end loop;
end $$;

do $$
begin
  create type public.workflow_stage as enum ('Inventory', 'Raw Material', 'Ready for Metallisation', 'Metallisation', 'Slitting', 'Stock', 'Ready for Winding', 'Winding', 'Spray', 'Finished Goods', 'Completed', 'Dispatch Ready');
exception when duplicate_object then null;
end $$;

do $$
declare
  stage_value text;
begin
  foreach stage_value in array array[
    'Inventory',
    'Raw Material',
    'Ready for Metallisation',
    'Metallisation',
    'Slitting',
    'Stock',
    'Ready for Winding',
    'Winding',
    'Spray',
    'Finished Goods',
    'Completed',
    'Dispatch Ready'
  ]
  loop
    if not exists (
      select 1
      from pg_enum e
      join pg_type t on t.oid = e.enumtypid
      join pg_namespace n on n.oid = t.typnamespace
      where n.nspname = 'public'
        and t.typname = 'workflow_stage'
        and e.enumlabel = stage_value
    ) then
      execute format('alter type public.workflow_stage add value %L', stage_value);
    end if;
  end loop;
end $$;

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null unique,
  description text,
  permissions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  role_id uuid not null references public.roles(id),
  reports_to uuid references public.profiles(id) on delete set null,
  team_name text,
  worker_label text,
  full_name text not null,
  email text unique,
  phone text not null unique,
  status public.user_status not null default 'active',
  last_login_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists reports_to uuid references public.profiles(id) on delete set null,
  add column if not exists team_name text,
  add column if not exists worker_label text;

create table if not exists public.qr_references (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid,
  entity_code text not null,
  qr_payload text not null unique,
  qr_url text,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  raw_material_code text not null unique,
  raw_material_name text not null default 'Capacitor Film Roll',
  roll_no text not null unique,
  micron numeric(10,2) not null,
  width_m numeric(10,3) not null,
  net_weight_kg numeric(12,3) not null,
  gross_weight_kg numeric(12,3) not null,
  current_weight_kg numeric(12,3) not null,
  actual_weight_kg numeric(12,3),
  damaged_weight_kg numeric(12,3) not null default 0,
  used_weight_kg numeric(12,3) not null default 0,
  wastage_weight_kg numeric(12,3) not null default 0,
  wet_weight_kg numeric(12,3),
  supplier text not null,
  temperature_c numeric(8,2),
  raw_material_image_url text,
  date_received date not null default current_date,
  status public.workflow_status not null default 'Pending',
  stage public.workflow_stage not null default 'Inventory',
  assigned_work_order_id uuid,
  qr_reference_id uuid references public.qr_references(id),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.work_orders (
  id uuid primary key default gen_random_uuid(),
  work_order_no text not null unique,
  micron numeric(10,2) not null,
  width_m numeric(10,3) not null,
  quantity numeric(14,3) not null,
  stage public.workflow_stage not null default 'Raw Material',
  status public.workflow_status not null default 'Yet to Start',
  planned_start_date date,
  due_date date,
  assigned_to uuid references public.profiles(id),
  qr_reference_id uuid references public.qr_references(id),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.inventory
  drop constraint if exists inventory_assigned_work_order_id_fkey,
  add constraint inventory_assigned_work_order_id_fkey foreign key (assigned_work_order_id) references public.work_orders(id) on delete set null;

create table if not exists public.work_order_materials (
  id uuid primary key default gen_random_uuid(),
  work_order_id uuid not null references public.work_orders(id) on delete cascade,
  inventory_id uuid not null references public.inventory(id),
  assigned_to uuid references public.profiles(id),
  assigned_by uuid references public.profiles(id),
  assigned_at timestamptz not null default now(),
  handover_to uuid references public.profiles(id),
  handover_by uuid references public.profiles(id),
  handover_at timestamptz,
  quantity_kg numeric(12,3) not null,
  store_head_review_image_url text,
  status public.workflow_status not null default 'Pending',
  notes text,
  created_at timestamptz not null default now(),
  unique (work_order_id, inventory_id)
);

create table if not exists public.metallisation (
  id uuid primary key default gen_random_uuid(),
  metallisation_no text not null unique,
  work_order_id uuid not null references public.work_orders(id) on delete cascade,
  raw_material_id uuid not null references public.inventory(id),
  operator_id uuid references public.profiles(id),
  coil_no text,
  machine_no text,
  weight_kg numeric(12,3) not null,
  weight_after_metallisation_kg numeric(12,3),
  optical_density numeric(10,3),
  resistance_ohms numeric(10,3),
  factory_wastage_kg numeric(12,3) not null default 0,
  factory_wastage_image_url text,
  photo_url text,
  metallisation_image_url text,
  metallisation_review_image_url text,
  qc_details jsonb not null default '{}'::jsonb,
  next_stage public.workflow_stage not null default 'Slitting',
  stage public.workflow_stage not null default 'Metallisation',
  status public.workflow_status not null default 'Completed',
  qr_reference_id uuid references public.qr_references(id),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.metallisation
  add column if not exists factory_wastage_image_url text,
  add column if not exists photo_url text,
  add column if not exists metallisation_image_url text,
  add column if not exists metallisation_review_image_url text;

comment on column public.metallisation.factory_wastage_image_url is 'Public Supabase Storage URL for the factory wastage image.';
comment on column public.metallisation.photo_url is 'Public Supabase Storage URL for metallisation photos such as weight-scale or QC images.';
comment on column public.metallisation.metallisation_image_url is 'Public Supabase Storage URL for the primary metallisation stage image.';
comment on column public.metallisation.metallisation_review_image_url is 'Public Supabase Storage URL for the metallisation review image.';
comment on column public.metallisation.qc_details is 'JSON payload for QC data. Can include image URLs, remarks, and pass/fail metadata.';

create table if not exists public.slitting (
  id uuid primary key default gen_random_uuid(),
  slitting_no text not null unique,
  work_order_id uuid not null references public.work_orders(id) on delete cascade,
  metallisation_id uuid references public.metallisation(id) on delete set null,
  raw_material_id uuid references public.inventory(id),
  operator_id uuid references public.profiles(id),
  product_no text not null unique,
  weight_kg numeric(12,3) not null,
  thickness_micron numeric(10,2) not null,
  width_m numeric(10,3),
  number_of_bags integer not null default 0,
  grade text not null,
  grade_each_bag jsonb not null default '[]'::jsonb,
  weight_each_bag jsonb not null default '[]'::jsonb,
  remarks text,
  slitting_image_url text,
  slitting_review_image_url text,
  stage public.workflow_stage not null default 'Stock',
  status public.workflow_status not null default 'Completed',
  qr_reference_id uuid references public.qr_references(id),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.inventory
  add column if not exists raw_material_image_url text;

alter table public.work_order_materials
  add column if not exists store_head_review_image_url text;

alter table public.slitting
  add column if not exists slitting_image_url text,
  add column if not exists slitting_review_image_url text;

comment on column public.inventory.raw_material_image_url is 'Public Supabase Storage URL for the raw material image.';
comment on column public.work_order_materials.store_head_review_image_url is 'Public Supabase Storage URL for the Store Head review image during raw material assignment or handover.';
comment on column public.slitting.slitting_image_url is 'Public Supabase Storage URL for the primary slitting stage image.';
comment on column public.slitting.slitting_review_image_url is 'Public Supabase Storage URL for the slitting review image.';

alter table public.inventory
  drop constraint if exists inventory_raw_material_image_url_format,
  add constraint inventory_raw_material_image_url_format check (raw_material_image_url is null or raw_material_image_url ~* '^https?://');

alter table public.work_order_materials
  drop constraint if exists work_order_materials_store_head_review_image_url_format,
  add constraint work_order_materials_store_head_review_image_url_format check (store_head_review_image_url is null or store_head_review_image_url ~* '^https?://');

alter table public.metallisation
  drop constraint if exists metallisation_factory_wastage_image_url_format,
  add constraint metallisation_factory_wastage_image_url_format check (factory_wastage_image_url is null or factory_wastage_image_url ~* '^https?://'),
  drop constraint if exists metallisation_photo_url_format,
  add constraint metallisation_photo_url_format check (photo_url is null or photo_url ~* '^https?://'),
  drop constraint if exists metallisation_image_url_format,
  add constraint metallisation_image_url_format check (metallisation_image_url is null or metallisation_image_url ~* '^https?://'),
  drop constraint if exists metallisation_review_image_url_format,
  add constraint metallisation_review_image_url_format check (metallisation_review_image_url is null or metallisation_review_image_url ~* '^https?://');

alter table public.slitting
  drop constraint if exists slitting_image_url_format,
  add constraint slitting_image_url_format check (slitting_image_url is null or slitting_image_url ~* '^https?://'),
  drop constraint if exists slitting_review_image_url_format,
  add constraint slitting_review_image_url_format check (slitting_review_image_url is null or slitting_review_image_url ~* '^https?://');

create table if not exists public.stock (
  id uuid primary key default gen_random_uuid(),
  stock_no text not null unique,
  slitting_id uuid references public.slitting(id) on delete set null,
  work_order_id uuid references public.work_orders(id) on delete set null,
  weight_kg numeric(12,3) not null,
  width_m numeric(10,3),
  micron numeric(10,2),
  grade text not null,
  quantity numeric(14,3) not null default 1,
  status public.workflow_status not null default 'Pending',
  stage public.workflow_stage not null default 'Stock',
  qr_reference_id uuid references public.qr_references(id),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_orders (
  id uuid primary key default gen_random_uuid(),
  product_order_no text not null unique,
  product_code text not null,
  product_name text,
  capacitor_type text not null,
  grade text not null,
  specifications jsonb not null default '{}'::jsonb,
  quantity numeric(14,3) not null,
  batch_size numeric(14,3) not null,
  customer text,
  instructions text,
  stage public.workflow_stage not null default 'Raw Material',
  status public.workflow_status not null default 'Yet to Start',
  planned_start_date date,
  delivery_commitment timestamptz,
  assigned_to uuid references public.profiles(id),
  qr_reference_id uuid references public.qr_references(id),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_order_materials (
  id uuid primary key default gen_random_uuid(),
  product_order_id uuid not null references public.product_orders(id) on delete cascade,
  stock_id uuid not null references public.stock(id),
  linked_work_order_id uuid references public.work_orders(id),
  assigned_by uuid references public.profiles(id),
  assigned_to uuid references public.profiles(id),
  handover_by uuid references public.profiles(id),
  assigned_at timestamptz not null default now(),
  weight_kg numeric(12,3) not null,
  width_m numeric(10,3),
  micron numeric(10,2),
  grade text not null,
  status public.workflow_status not null default 'Issued',
  qr_reference_id uuid references public.qr_references(id),
  created_at timestamptz not null default now(),
  unique (product_order_id, stock_id)
);

create table if not exists public.winding (
  id uuid primary key default gen_random_uuid(),
  winding_no text not null unique,
  product_order_id uuid not null references public.product_orders(id) on delete cascade,
  product_material_id uuid references public.product_order_materials(id) on delete set null,
  operator_id uuid references public.profiles(id),
  film_width text not null,
  winding_tension text,
  film_turns integer,
  turns_count integer,
  quantity_wound numeric(14,3) not null,
  weight_of_element_kg numeric(12,3),
  total_film_consumed_kg numeric(12,3),
  rejected_quantity numeric(14,3) not null default 0,
  stage public.workflow_stage not null default 'Winding',
  status public.workflow_status not null default 'Completed',
  qr_reference_id uuid references public.qr_references(id),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.spray (
  id uuid primary key default gen_random_uuid(),
  spray_no text not null unique,
  product_order_id uuid not null references public.product_orders(id) on delete cascade,
  winding_id uuid references public.winding(id) on delete set null,
  operator_id uuid references public.profiles(id),
  spray_type text not null,
  feed_rate text,
  pressure_setting text,
  mfd text,
  no_of_coats integer,
  thickness_maintained text,
  rejected_quantity numeric(14,3) not null default 0,
  quantity numeric(14,3) not null,
  stage public.workflow_stage not null default 'Spray',
  status public.workflow_status not null default 'Completed',
  qr_reference_id uuid references public.qr_references(id),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.finished_goods (
  id uuid primary key default gen_random_uuid(),
  finished_good_no text not null unique,
  product_order_id uuid references public.product_orders(id) on delete set null,
  product_code text not null,
  product_name text not null,
  quantity numeric(14,3) not null,
  grade text not null,
  status public.workflow_status not null default 'Completed',
  qr_reference_id uuid references public.qr_references(id),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.material_requests (
  id uuid primary key default gen_random_uuid(),
  request_no text not null unique,
  material_type text not null check (material_type in ('raw_material', 'stock')),
  material_id uuid,
  stock_id uuid references public.stock(id),
  inventory_id uuid references public.inventory(id),
  product_order_id uuid references public.product_orders(id) on delete set null,
  work_order_id uuid references public.work_orders(id) on delete set null,
  requested_quantity numeric(14,3) not null,
  issued_quantity numeric(14,3) not null default 0,
  grade text,
  requested_by uuid references public.profiles(id),
  issued_by uuid references public.profiles(id),
  issued_at timestamptz,
  status public.workflow_status not null default 'Pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.material_returns (
  id uuid primary key default gen_random_uuid(),
  return_no text not null unique,
  material_type text not null check (material_type in ('raw_material', 'stock')),
  material_id uuid,
  stock_id uuid references public.stock(id),
  inventory_id uuid references public.inventory(id),
  product_order_id uuid references public.product_orders(id) on delete set null,
  work_order_id uuid references public.work_orders(id) on delete set null,
  weight_kg numeric(12,3) not null,
  used_weight_kg numeric(12,3) not null default 0,
  quantity_returned numeric(14,3) not null,
  reason text not null,
  returned_by uuid references public.profiles(id),
  accepted_by uuid references public.profiles(id),
  status public.workflow_status not null default 'Pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vendor_purchases (
  id uuid primary key default gen_random_uuid(),
  purchase_no text not null unique,
  vendor_name text not null,
  purchase_date date not null,
  direction text not null check (direction in ('Credit', 'Debit')),
  order_amount numeric(14,2) not null,
  paid_amount numeric(14,2) not null default 0,
  status public.workflow_status not null default 'Due',
  payment_type text,
  notes text,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vendor_purchase_items (
  id uuid primary key default gen_random_uuid(),
  purchase_id uuid not null references public.vendor_purchases(id) on delete cascade,
  item_type text not null,
  rate numeric(14,2) not null,
  quantity numeric(14,3) not null,
  total numeric(14,2) not null,
  created_at timestamptz not null default now(),
  unique (purchase_id, item_type)
);

create table if not exists public.pipeline_tracking (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('work_order', 'product_order')),
  entity_id uuid not null,
  from_stage public.workflow_stage,
  to_stage public.workflow_stage not null,
  status public.workflow_status not null default 'In-progress',
  assigned_from uuid references public.profiles(id),
  assigned_to uuid references public.profiles(id),
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.import_export_jobs (
  id uuid primary key default gen_random_uuid(),
  module text not null,
  job_type text not null check (job_type in ('import', 'export')),
  file_name text,
  file_url text,
  status text not null default 'pending',
  total_rows integer not null default 0,
  processed_rows integer not null default 0,
  error_rows integer not null default 0,
  errors jsonb not null default '[]'::jsonb,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'roles','profiles','inventory','work_orders','metallisation','slitting','stock',
    'product_orders','winding','spray','finished_goods','material_requests',
    'material_returns','vendor_purchases'
  ]
  loop
    execute format('drop trigger if exists trg_%I_touch on public.%I', t, t);
    execute format('create trigger trg_%I_touch before update on public.%I for each row execute function public.touch_updated_at()', t, t);
  end loop;
end $$;

create index if not exists idx_profiles_role_id on public.profiles(role_id);
create index if not exists idx_profiles_reports_to on public.profiles(reports_to);
create index if not exists idx_profiles_team_name on public.profiles(team_name);
create index if not exists idx_profiles_phone on public.profiles(phone);
create index if not exists idx_inventory_status_stage on public.inventory(status, stage);
create index if not exists idx_inventory_assigned_wo on public.inventory(assigned_work_order_id);
create index if not exists idx_work_orders_status_stage on public.work_orders(status, stage);
create index if not exists idx_work_orders_assigned_to on public.work_orders(assigned_to);
create index if not exists idx_product_orders_status_stage on public.product_orders(status, stage);
create index if not exists idx_product_orders_assigned_to on public.product_orders(assigned_to);
create index if not exists idx_metallisation_work_order on public.metallisation(work_order_id);
create index if not exists idx_slitting_work_order on public.slitting(work_order_id);
create index if not exists idx_stock_stage_status on public.stock(stage, status);
create index if not exists idx_product_materials_po on public.product_order_materials(product_order_id);
create index if not exists idx_winding_po on public.winding(product_order_id);
create index if not exists idx_spray_po on public.spray(product_order_id);
create index if not exists idx_pipeline_entity on public.pipeline_tracking(entity_type, entity_id);

insert into storage.buckets (id, name, public)
values ('production-stage-images', 'production-stage-images', true)
on conflict (id) do nothing;

drop policy if exists "production_stage_images_read" on storage.objects;
create policy "production_stage_images_read"
on storage.objects for select
to authenticated
using (bucket_id = 'production-stage-images');

drop policy if exists "production_stage_images_insert" on storage.objects;
create policy "production_stage_images_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'production-stage-images'
);

drop policy if exists "production_stage_images_update" on storage.objects;
create policy "production_stage_images_update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'production-stage-images'
)
with check (
  bucket_id = 'production-stage-images'
);

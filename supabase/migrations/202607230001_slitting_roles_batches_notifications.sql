-- Slitting role split, coil confirmations, batch bags/packets, serials, and notifications.

insert into public.roles (id, code, name, description, permissions) values
('10000000-0000-0000-0000-000000000012','slitting_qc','Slitting QC','Performs slitting QC, batch creation, QR, and stickers','{"modules":["slitting","stock","work_orders","product_orders","material_requests","material_returns"],"actions":["read","create","update","export","download","print"]}'),
('10000000-0000-0000-0000-000000000013','slitting_operator','Slitting Operator','Scans and confirms metallisation coils entering slitting','{"modules":["slitting_confirmations","metallisation","work_orders","product_orders"],"actions":["read","create"]}')
on conflict (code) do update
set name = excluded.name,
    description = excluded.description,
    permissions = excluded.permissions,
    updated_at = now();

create table if not exists public.serial_counters (
  entity text primary key,
  prefix text not null,
  last_value bigint not null default 0 check (last_value >= 0),
  padding integer not null default 4 check (padding >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  entity_type text not null,
  entity_id uuid,
  entity_code text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.slitting_coil_confirmations (
  id uuid primary key default gen_random_uuid(),
  confirmation_no text not null unique,
  work_order_id uuid not null references public.work_orders(id) on delete restrict,
  product_order_id uuid references public.product_orders(id) on delete set null,
  metallisation_id uuid not null references public.metallisation(id) on delete restrict,
  raw_material_id uuid references public.inventory(id) on delete set null,
  operator_id uuid not null references public.profiles(id) on delete restrict,
  qr_reference_id uuid references public.qr_references(id) on delete set null,
  idempotency_key text,
  status public.workflow_status not null default 'In-progress',
  confirmed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (metallisation_id),
  unique (operator_id, idempotency_key)
);

create table if not exists public.slitting_batches (
  id uuid primary key default gen_random_uuid(),
  batch_no text not null unique,
  slitting_id uuid not null references public.slitting(id) on delete restrict,
  work_order_id uuid not null references public.work_orders(id) on delete restrict,
  product_order_id uuid references public.product_orders(id) on delete set null,
  metallisation_id uuid not null references public.metallisation(id) on delete restrict,
  confirmation_id uuid not null references public.slitting_coil_confirmations(id) on delete restrict,
  packet_type text not null check (packet_type in ('Bag','Packet')),
  quantity integer not null check (quantity > 0),
  idempotency_key text not null,
  qc_user_id uuid not null references public.profiles(id) on delete restrict,
  status public.workflow_status not null default 'Completed',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slitting_id, idempotency_key)
);

create table if not exists public.slitting_batch_items (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.slitting_batches(id) on delete cascade,
  slitting_id uuid not null references public.slitting(id) on delete restrict,
  work_order_id uuid not null references public.work_orders(id) on delete restrict,
  product_order_id uuid references public.product_orders(id) on delete set null,
  metallisation_id uuid not null references public.metallisation(id) on delete restrict,
  item_no text not null unique,
  item_index integer not null check (item_index > 0),
  packet_type text not null check (packet_type in ('Bag','Packet')),
  grade text,
  weight_kg numeric(12,3),
  qr_reference_id uuid references public.qr_references(id) on delete set null,
  sticker_payload jsonb not null default '{}'::jsonb,
  sticker_document_id uuid,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (batch_id, item_index)
);

create table if not exists public.generated_documents (
  id uuid primary key default gen_random_uuid(),
  document_no text not null unique,
  entity_type text not null,
  entity_id uuid,
  entity_code text,
  document_kind text not null,
  content_type text not null default 'text/html; charset=utf-8',
  file_name text not null,
  storage_bucket text,
  storage_path text,
  content_html text,
  metadata jsonb not null default '{}'::jsonb,
  generated_by uuid references public.profiles(id) on delete set null,
  generated_at timestamptz not null default now(),
  unique (entity_type, entity_id, document_kind)
);

alter table public.slitting_batch_items
  drop constraint if exists slitting_batch_items_sticker_document_id_fkey,
  add constraint slitting_batch_items_sticker_document_id_fkey
  foreign key (sticker_document_id) references public.generated_documents(id) on delete set null;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  entity_type text,
  entity_id uuid,
  entity_code text,
  channel text not null default 'in_app' check (channel in ('in_app','push')),
  dedupe_key text not null,
  read_at timestamptz,
  push_attempted_at timestamptz,
  push_status text not null default 'pending' check (push_status in ('pending','sent','failed','not_configured')),
  push_error text,
  created_at timestamptz not null default now(),
  unique (recipient_profile_id, dedupe_key)
);

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  is_active boolean not null default true,
  failure_count integer not null default 0,
  last_failure_at timestamptz,
  last_success_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
declare
  t text;
begin
  foreach t in array array[
    'serial_counters','slitting_coil_confirmations','slitting_batches',
    'push_subscriptions'
  ]
  loop
    execute format('drop trigger if exists trg_%I_touch on public.%I', t, t);
    execute format('create trigger trg_%I_touch before update on public.%I for each row execute function public.touch_updated_at()', t, t);
  end loop;
end $$;

create index if not exists idx_serial_counters_prefix on public.serial_counters(prefix);
create index if not exists idx_audit_events_entity on public.audit_events(entity_type, entity_id);
create index if not exists idx_audit_events_actor_created on public.audit_events(actor_profile_id, created_at desc);
create index if not exists idx_slitting_confirmations_operator on public.slitting_coil_confirmations(operator_id, confirmed_at desc);
create index if not exists idx_slitting_confirmations_wo on public.slitting_coil_confirmations(work_order_id);
create index if not exists idx_slitting_batches_slitting on public.slitting_batches(slitting_id, created_at desc);
create index if not exists idx_slitting_batch_items_batch on public.slitting_batch_items(batch_id, item_index);
create index if not exists idx_notifications_recipient_read on public.notifications(recipient_profile_id, read_at, created_at desc);
create index if not exists idx_notifications_push_pending on public.notifications(push_status, created_at) where push_status = 'pending';
create index if not exists idx_push_subscriptions_profile_active on public.push_subscriptions(profile_id, is_active);

create or replace function public.build_qr_payload(p_entity_type text, p_code text)
returns text
language sql
immutable
as $$
  select 'capco://' || p_entity_type || '/' || p_code
$$;

create or replace function public.capco_extract_serial_number(p_code text, p_prefix text)
returns bigint
language plpgsql
immutable
as $$
declare
  matches text[];
begin
  matches := regexp_match(coalesce(p_code, ''), '^' || regexp_replace(p_prefix, '([^a-zA-Z0-9])', '\\\1', 'g') || '-?([0-9]+)$');
  if matches is null then
    return null;
  end if;
  return matches[1]::bigint;
end;
$$;

create or replace function public.capco_init_serial_counter(p_entity text, p_prefix text, p_last_value bigint, p_padding integer default 4)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.serial_counters(entity, prefix, last_value, padding)
  values (p_entity, p_prefix, greatest(coalesce(p_last_value, 0), 0), p_padding)
  on conflict (entity) do update
  set prefix = excluded.prefix,
      last_value = greatest(public.serial_counters.last_value, excluded.last_value),
      padding = excluded.padding,
      updated_at = now();
end;
$$;

create or replace function public.capco_next_serial(p_entity text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  counter record;
  next_value bigint;
begin
  select * into counter
  from public.serial_counters
  where entity = p_entity
  for update;

  if not found then
    raise exception 'Serial counter % is not configured', p_entity using errcode = 'P0002';
  end if;

  next_value := counter.last_value + 1;

  update public.serial_counters
  set last_value = next_value,
      updated_at = now()
  where entity = p_entity;

  return counter.prefix || '-' || lpad(next_value::text, counter.padding, '0');
end;
$$;

select public.capco_init_serial_counter('work_order', 'WO', coalesce((select max(public.capco_extract_serial_number(work_order_no, 'WO')) from public.work_orders), 0));
select public.capco_init_serial_counter('product_order', 'PO', coalesce((select max(public.capco_extract_serial_number(product_order_no, 'PO')) from public.product_orders), 0));
select public.capco_init_serial_counter('metallisation_coil', 'MC', coalesce((select max(greatest(public.capco_extract_serial_number(metallisation_no, 'MC'), public.capco_extract_serial_number(coil_no, 'MC'))) from public.metallisation), 0));
select public.capco_init_serial_counter('slitting', 'SA', coalesce((select max(public.capco_extract_serial_number(slitting_no, 'SA')) from public.slitting), 0));
select public.capco_init_serial_counter(
  'stock',
  'PM',
  coalesce((
    select max(serial_value)
    from (
      select public.capco_extract_serial_number(stock_no, 'PM') as serial_value from public.stock
      union all
      select public.capco_extract_serial_number(product_no, 'PM') as serial_value from public.slitting
    ) existing_pm
  ), 0)
);
select public.capco_init_serial_counter('slitting_confirmation', 'SC', coalesce((select max(public.capco_extract_serial_number(confirmation_no, 'SC')) from public.slitting_coil_confirmations), 0));
select public.capco_init_serial_counter('slitting_batch', 'SB', coalesce((select max(public.capco_extract_serial_number(batch_no, 'SB')) from public.slitting_batches), 0));
select public.capco_init_serial_counter('slitting_bag', 'SBG', coalesce((select max(public.capco_extract_serial_number(item_no, 'SBG')) from public.slitting_batch_items where packet_type = 'Bag'), 0));
select public.capco_init_serial_counter('slitting_packet', 'SPK', coalesce((select max(public.capco_extract_serial_number(item_no, 'SPK')) from public.slitting_batch_items where packet_type = 'Packet'), 0));
select public.capco_init_serial_counter('generated_document', 'DOC', coalesce((select max(public.capco_extract_serial_number(document_no, 'DOC')) from public.generated_documents), 0));

create or replace function public.capco_current_role_is(p_role_codes text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_any_role(p_role_codes)
$$;

create or replace function public.capco_assert_role(p_role_codes text[])
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  profile_id uuid;
begin
  profile_id := public.current_profile_id();
  if profile_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if not public.has_any_role(p_role_codes) then
    raise exception 'Insufficient role permission' using errcode = '42501';
  end if;
  return profile_id;
end;
$$;

create or replace function public.capco_find_metallisation_by_qr(p_qr_value text)
returns table(metallisation_id uuid, qr_reference_id uuid)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  clean_qr text := btrim(coalesce(p_qr_value, ''));
begin
  if clean_qr = '' or length(clean_qr) > 300 then
    raise exception 'Invalid QR value' using errcode = '22023';
  end if;

  return query
  select m.id, q.id
  from public.qr_references q
  join public.metallisation m
    on (m.id = q.entity_id or m.metallisation_no = q.entity_code or m.coil_no = q.entity_code)
  where q.qr_payload = clean_qr
    and q.entity_type = 'metallisation'
    and q.is_active = true
  limit 1;

  if not found then
    return query
    select m.id, m.qr_reference_id
    from public.metallisation m
    where m.metallisation_no = clean_qr
       or m.coil_no = clean_qr
    limit 1;
  end if;
end;
$$;

create or replace function public.scan_slitting_metallisation_coil(p_qr_value text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_id uuid;
  found_id uuid;
  found_qr uuid;
  result jsonb;
begin
  actor_id := public.capco_assert_role(array['slitting_operator','slitting_qc','operator_2_slitting','super_admin','production_head']);

  select metallisation_id, qr_reference_id into found_id, found_qr
  from public.capco_find_metallisation_by_qr(p_qr_value)
  limit 1;

  if found_id is null then
    raise exception 'Metallisation coil not found' using errcode = 'P0002';
  end if;

  select jsonb_build_object(
    'metallisation_id', m.id,
    'metallisation_no', m.metallisation_no,
    'coil_no', m.coil_no,
    'work_order_id', wo.id,
    'work_order_no', wo.work_order_no,
    'product_order', (
      select jsonb_build_object('id', po.id, 'product_order_no', po.product_order_no)
      from public.product_order_materials pom
      join public.stock st on st.id = pom.stock_id
      join public.product_orders po on po.id = pom.product_order_id
      where st.work_order_id = wo.id
      order by pom.created_at desc
      limit 1
    ),
    'material', inv.raw_material_name,
    'raw_material_code', inv.raw_material_code,
    'micron', inv.micron,
    'width_m', inv.width_m,
    'weight_kg', m.weight_kg,
    'metallisation_date', m.created_at,
    'metallisation_status', m.status,
    'current_production_stage', m.stage,
    'next_stage', m.next_stage,
    'work_order_status', wo.status,
    'work_order_stage', wo.stage,
    'existing_slitting_status', coalesce(s.status::text, c.status::text),
    'already_confirmed', c.id is not null,
    'confirmed_by', confirmer.full_name,
    'confirmed_by_profile_id', c.operator_id,
    'confirmed_at', c.confirmed_at,
    'qr_reference_id', found_qr
  ) into result
  from public.metallisation m
  join public.work_orders wo on wo.id = m.work_order_id
  left join public.inventory inv on inv.id = m.raw_material_id
  left join public.slitting s on s.metallisation_id = m.id
  left join public.slitting_coil_confirmations c on c.metallisation_id = m.id
  left join public.profiles confirmer on confirmer.id = c.operator_id
  where m.id = found_id;

  insert into public.audit_events(actor_profile_id, event_type, entity_type, entity_id, entity_code, metadata)
  values (actor_id, 'slitting.coil_scanned', 'metallisation', found_id, result->>'metallisation_no', jsonb_build_object('qr_value', p_qr_value))
  on conflict do nothing;

  return result;
end;
$$;

create or replace function public.create_notifications_for_roles(
  p_role_codes text[],
  p_title text,
  p_body text,
  p_entity_type text,
  p_entity_id uuid,
  p_entity_code text,
  p_dedupe_key text
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_count integer;
begin
  insert into public.notifications(recipient_profile_id, title, body, entity_type, entity_id, entity_code, dedupe_key)
  select p.id, p_title, p_body, p_entity_type, p_entity_id, p_entity_code, p_dedupe_key || ':' || p.id::text
  from public.profiles p
  join public.roles r on r.id = p.role_id
  where p.status = 'active'
    and r.code = any(p_role_codes)
  on conflict (recipient_profile_id, dedupe_key) do nothing;

  get diagnostics inserted_count = row_count;
  return inserted_count;
end;
$$;

create or replace function public.confirm_slitting_metallisation_coil(
  p_qr_value text,
  p_work_order_id uuid default null,
  p_product_order_id uuid default null,
  p_idempotency_key text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_id uuid;
  found_id uuid;
  found_qr uuid;
  mrow public.metallisation%rowtype;
  worow public.work_orders%rowtype;
  existing public.slitting_coil_confirmations%rowtype;
  inserted public.slitting_coil_confirmations%rowtype;
  idem text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
begin
  actor_id := public.capco_assert_role(array['slitting_operator','super_admin']);

  select metallisation_id, qr_reference_id into found_id, found_qr
  from public.capco_find_metallisation_by_qr(p_qr_value)
  limit 1;

  if found_id is null then
    raise exception 'Metallisation coil not found' using errcode = 'P0002';
  end if;

  select * into mrow from public.metallisation where id = found_id for update;
  select * into worow from public.work_orders where id = mrow.work_order_id for update;

  if p_work_order_id is not null and p_work_order_id <> mrow.work_order_id then
    raise exception 'Coil does not belong to the supplied Work Order' using errcode = '23514';
  end if;
  if mrow.status <> 'Completed' or mrow.next_stage <> 'Slitting' then
    raise exception 'Metallisation must be completed and ready for Slitting' using errcode = '23514';
  end if;
  if worow.status in ('Cancelled','Rejected') or worow.stage not in ('Slitting','Metallisation','Stock') then
    raise exception 'Work Order is not active for Slitting' using errcode = '23514';
  end if;
  if exists (select 1 from public.slitting where metallisation_id = mrow.id and status = 'Completed') then
    raise exception 'Coil has already completed Slitting' using errcode = '23505';
  end if;

  select * into existing
  from public.slitting_coil_confirmations
  where metallisation_id = mrow.id;

  if found then
    return jsonb_build_object('confirmation', to_jsonb(existing), 'duplicate', true);
  end if;

  insert into public.slitting_coil_confirmations(
    confirmation_no,
    work_order_id,
    product_order_id,
    metallisation_id,
    raw_material_id,
    operator_id,
    qr_reference_id,
    idempotency_key,
    status
  )
  values (
    public.capco_next_serial('slitting_confirmation'),
    mrow.work_order_id,
    p_product_order_id,
    mrow.id,
    mrow.raw_material_id,
    actor_id,
    found_qr,
    idem,
    'In-progress'
  )
  on conflict (metallisation_id) do nothing
  returning * into inserted;

  if not found then
    select * into existing
    from public.slitting_coil_confirmations
    where metallisation_id = mrow.id;

    return jsonb_build_object('confirmation', to_jsonb(existing), 'duplicate', true);
  end if;

  update public.work_orders
  set stage = 'Slitting',
      status = 'In-progress',
      updated_by = actor_id
  where id = mrow.work_order_id
    and status not in ('Cancelled','Rejected','Completed');

  insert into public.pipeline_tracking(entity_type, entity_id, from_stage, to_stage, status, assigned_from, assigned_to, notes, created_by)
  values ('work_order', mrow.work_order_id, 'Metallisation', 'Slitting', 'In-progress', actor_id, null, 'Metallisation coil confirmed for slitting', actor_id);

  insert into public.audit_events(actor_profile_id, event_type, entity_type, entity_id, entity_code, metadata)
  values (actor_id, 'slitting.coil_confirmed', 'metallisation', mrow.id, mrow.metallisation_no, jsonb_build_object('confirmation_id', inserted.id));

  perform public.create_notifications_for_roles(
    array['slitting_qc','operator_2_slitting'],
    'Slitting coil confirmed',
    'Metallisation coil ' || coalesce(mrow.coil_no, mrow.metallisation_no) || ' is ready for Slitting QC.',
    'metallisation',
    mrow.id,
    mrow.metallisation_no,
    'slitting-confirmed:' || mrow.id::text
  );

  return jsonb_build_object('confirmation', to_jsonb(inserted), 'duplicate', false);
end;
$$;

create or replace function public.notify_new_work_or_product_order()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  role_codes text[] := array['super_admin','production_head'];
  entity_code text;
  title text;
  body text;
begin
  if tg_table_name = 'work_orders' then
    entity_code := new.work_order_no;
    title := 'New Work Order';
    body := 'A new Work Order ' || new.work_order_no || ' has been issued.';
    if new.stage = 'Slitting' then
      role_codes := role_codes || array['slitting_operator','slitting_qc','operator_2_slitting'];
    end if;
    perform public.create_notifications_for_roles(role_codes, title, body, 'work_order', new.id, entity_code, 'work-order-created:' || new.id::text);
  elsif tg_table_name = 'product_orders' then
    entity_code := new.product_order_no;
    title := 'New Product Order';
    body := 'A new Product Order ' || new.product_order_no || ' has been issued.';
    if new.stage = 'Slitting' then
      role_codes := role_codes || array['slitting_operator','slitting_qc','operator_2_slitting'];
    end if;
    perform public.create_notifications_for_roles(role_codes, title, body, 'product_order', new.id, entity_code, 'product-order-created:' || new.id::text);
  end if;

  return new;
end;
$$;

drop trigger if exists trg_work_orders_notify_created on public.work_orders;
create trigger trg_work_orders_notify_created
after insert on public.work_orders
for each row execute function public.notify_new_work_or_product_order();

drop trigger if exists trg_product_orders_notify_created on public.product_orders;
create trigger trg_product_orders_notify_created
after insert on public.product_orders
for each row execute function public.notify_new_work_or_product_order();

create or replace function public.create_slitting_packet_batch(
  p_slitting_id uuid,
  p_packet_type text,
  p_quantity integer,
  p_product_order_id uuid default null,
  p_item_weights jsonb default '[]'::jsonb,
  p_item_grades jsonb default '[]'::jsonb,
  p_idempotency_key text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_id uuid;
  max_quantity integer := coalesce(nullif(current_setting('app.slitting_batch_max_quantity', true), '')::integer, 500);
  slrow public.slitting%rowtype;
  mrow public.metallisation%rowtype;
  worow public.work_orders%rowtype;
  confirmation public.slitting_coil_confirmations%rowtype;
  batch public.slitting_batches%rowtype;
  item public.slitting_batch_items%rowtype;
  serial_entity text;
  item_no text;
  qr_id uuid;
  doc_id uuid;
  i integer;
  idem text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  sticker jsonb;
begin
  actor_id := public.capco_assert_role(array['slitting_qc','operator_2_slitting','super_admin']);

  if idem is null then
    raise exception 'Idempotency key is required' using errcode = '22023';
  end if;
  if p_packet_type not in ('Bag','Packet') then
    raise exception 'Packet type must be Bag or Packet' using errcode = '22023';
  end if;
  if p_quantity is null or p_quantity < 1 or p_quantity > max_quantity then
    raise exception 'Quantity must be between 1 and %', max_quantity using errcode = '22023';
  end if;

  select * into slrow from public.slitting where id = p_slitting_id for update;
  if not found then
    raise exception 'Slitting record not found' using errcode = 'P0002';
  end if;

  select * into mrow from public.metallisation where id = slrow.metallisation_id for update;
  if not found then
    raise exception 'Metallisation coil is required for Slitting batch' using errcode = '23514';
  end if;

  select * into worow from public.work_orders where id = slrow.work_order_id for update;
  if worow.status in ('Cancelled','Rejected') then
    raise exception 'Work Order is not active' using errcode = '23514';
  end if;

  select * into confirmation
  from public.slitting_coil_confirmations
  where metallisation_id = mrow.id
  for update;

  if not found then
    raise exception 'Coil must be confirmed by Slitting Operator before QC batch creation' using errcode = '23514';
  end if;

  select * into batch
  from public.slitting_batches
  where slitting_id = p_slitting_id
    and idempotency_key = idem;

  if found then
    return (
      select jsonb_build_object(
        'batch', to_jsonb(batch),
        'items', coalesce(jsonb_agg(to_jsonb(sbi) order by sbi.item_index), '[]'::jsonb),
        'idempotent', true
      )
      from public.slitting_batch_items sbi
      where sbi.batch_id = batch.id
    );
  end if;

  insert into public.slitting_batches(
    batch_no, slitting_id, work_order_id, product_order_id, metallisation_id,
    confirmation_id, packet_type, quantity, idempotency_key, qc_user_id, metadata
  )
  values (
    public.capco_next_serial('slitting_batch'), p_slitting_id, slrow.work_order_id,
    p_product_order_id, mrow.id, confirmation.id, p_packet_type, p_quantity, idem, actor_id, p_metadata
  )
  returning * into batch;

  serial_entity := case when p_packet_type = 'Bag' then 'slitting_bag' else 'slitting_packet' end;

  for i in 1..p_quantity loop
    item_no := public.capco_next_serial(serial_entity);

    insert into public.qr_references(entity_type, entity_code, qr_payload, created_by)
    values (
      case when p_packet_type = 'Bag' then 'slitting_bag' else 'slitting_packet' end,
      item_no,
      public.build_qr_payload(case when p_packet_type = 'Bag' then 'slitting-bags' else 'slitting-packets' end, item_no),
      actor_id
    )
    returning id into qr_id;

    sticker := jsonb_build_object(
      'company', 'CAPCO Capacitors',
      'serial_no', item_no,
      'work_order_no', worow.work_order_no,
      'product_order_no', (select product_order_no from public.product_orders where id = p_product_order_id),
      'metallisation_coil_no', coalesce(mrow.coil_no, mrow.metallisation_no),
      'batch_no', batch.batch_no,
      'item_index', i,
      'packet_type', p_packet_type,
      'material', (select raw_material_name from public.inventory where id = slrow.raw_material_id),
      'micron', slrow.thickness_micron,
      'width_m', slrow.width_m,
      'weight_kg', nullif(p_item_weights->>(i - 1), '')::numeric,
      'grade', coalesce(nullif(p_item_grades->>(i - 1), ''), slrow.grade),
      'production_date', current_date,
      'qr_payload', public.build_qr_payload(case when p_packet_type = 'Bag' then 'slitting-bags' else 'slitting-packets' end, item_no)
    );

    insert into public.generated_documents(document_no, entity_type, entity_code, document_kind, file_name, content_html, metadata, generated_by)
    values (
      public.capco_next_serial('generated_document'),
      case when p_packet_type = 'Bag' then 'slitting_bag' else 'slitting_packet' end,
      item_no,
      'sticker',
      item_no || '-sticker.html',
      null,
      sticker,
      actor_id
    )
    returning id into doc_id;

    insert into public.slitting_batch_items(
      batch_id, slitting_id, work_order_id, product_order_id, metallisation_id,
      item_no, item_index, packet_type, grade, weight_kg, qr_reference_id,
      sticker_payload, sticker_document_id, created_by
    )
    values (
      batch.id, p_slitting_id, slrow.work_order_id, p_product_order_id, mrow.id,
      item_no, i, p_packet_type, sticker->>'grade',
      nullif(p_item_weights->>(i - 1), '')::numeric, qr_id, sticker, doc_id, actor_id
    )
    returning * into item;
  end loop;

  update public.slitting
  set number_of_bags = p_quantity,
      status = 'Completed',
      updated_at = now()
  where id = p_slitting_id;

  insert into public.audit_events(actor_profile_id, event_type, entity_type, entity_id, entity_code, metadata)
  values (actor_id, 'slitting.batch_created', 'slitting_batch', batch.id, batch.batch_no, jsonb_build_object('quantity', p_quantity, 'packet_type', p_packet_type));

  return (
    select jsonb_build_object(
      'batch', to_jsonb(batch),
      'items', coalesce(jsonb_agg(to_jsonb(sbi) order by sbi.item_index), '[]'::jsonb),
      'idempotent', false
    )
    from public.slitting_batch_items sbi
    where sbi.batch_id = batch.id
  );
end;
$$;

create or replace function public.register_push_subscription(
  p_endpoint text,
  p_p256dh text,
  p_auth text,
  p_user_agent text default null
)
returns public.push_subscriptions
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_id uuid;
  row public.push_subscriptions%rowtype;
begin
  actor_id := public.capco_assert_role(array[
    'super_admin','production_head','store_head','person_a','operator_1_metallisation',
    'operator_2_slitting','slitting_qc','slitting_operator','person_b',
    'operator_3_winding','operator_4_spray','sales','accountant'
  ]);

  if coalesce(p_endpoint, '') = '' or coalesce(p_p256dh, '') = '' or coalesce(p_auth, '') = '' then
    raise exception 'Invalid push subscription' using errcode = '22023';
  end if;

  insert into public.push_subscriptions(profile_id, endpoint, p256dh, auth, user_agent, is_active, failure_count)
  values (actor_id, p_endpoint, p_p256dh, p_auth, p_user_agent, true, 0)
  on conflict (endpoint) do update
  set profile_id = excluded.profile_id,
      p256dh = excluded.p256dh,
      auth = excluded.auth,
      user_agent = excluded.user_agent,
      is_active = true,
      updated_at = now()
  returning * into row;

  return row;
end;
$$;

create or replace function public.deactivate_push_subscription(p_endpoint text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_id uuid;
begin
  actor_id := public.current_profile_id();
  update public.push_subscriptions
  set is_active = false,
      updated_at = now()
  where endpoint = p_endpoint
    and profile_id = actor_id;
end;
$$;

create or replace function public.mark_notifications_read(p_notification_ids uuid[] default null)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_id uuid;
  updated_count integer;
begin
  actor_id := public.current_profile_id();
  if actor_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  update public.notifications
  set read_at = now()
  where recipient_profile_id = actor_id
    and read_at is null
    and (p_notification_ids is null or id = any(p_notification_ids));

  get diagnostics updated_count = row_count;
  return updated_count;
end;
$$;

grant execute on function public.scan_slitting_metallisation_coil(text) to authenticated;
grant execute on function public.confirm_slitting_metallisation_coil(text, uuid, uuid, text) to authenticated;
grant execute on function public.create_slitting_packet_batch(uuid, text, integer, uuid, jsonb, jsonb, text, jsonb) to authenticated;
grant execute on function public.register_push_subscription(text, text, text, text) to authenticated;
grant execute on function public.deactivate_push_subscription(text) to authenticated;
grant execute on function public.mark_notifications_read(uuid[]) to authenticated;
grant execute on function public.capco_next_serial(text) to authenticated;

alter table public.serial_counters enable row level security;
alter table public.audit_events enable row level security;
alter table public.slitting_coil_confirmations enable row level security;
alter table public.slitting_batches enable row level security;
alter table public.slitting_batch_items enable row level security;
alter table public.generated_documents enable row level security;
alter table public.notifications enable row level security;
alter table public.push_subscriptions enable row level security;

drop policy if exists "serial_counters_admin_read" on public.serial_counters;
create policy "serial_counters_admin_read" on public.serial_counters for select to authenticated
using (public.is_admin_role());

drop policy if exists "audit_admin_read" on public.audit_events;
create policy "audit_admin_read" on public.audit_events for select to authenticated
using (public.is_admin_role());

drop policy if exists "slitting_confirmations_read_roles" on public.slitting_coil_confirmations;
create policy "slitting_confirmations_read_roles" on public.slitting_coil_confirmations for select to authenticated
using (
  public.has_any_role(array['super_admin','production_head','person_a','operator_2_slitting','slitting_qc','slitting_operator'])
  or operator_id = public.current_profile_id()
);

drop policy if exists "slitting_confirmations_insert_operator" on public.slitting_coil_confirmations;
create policy "slitting_confirmations_insert_operator" on public.slitting_coil_confirmations for insert to authenticated
with check (public.has_any_role(array['super_admin','slitting_operator']));

drop policy if exists "slitting_batches_read_roles" on public.slitting_batches;
create policy "slitting_batches_read_roles" on public.slitting_batches for select to authenticated
using (public.has_any_role(array['super_admin','production_head','person_a','operator_2_slitting','slitting_qc','slitting_operator','person_b']));

drop policy if exists "slitting_batches_insert_qc" on public.slitting_batches;
create policy "slitting_batches_insert_qc" on public.slitting_batches for insert to authenticated
with check (public.has_any_role(array['super_admin','operator_2_slitting','slitting_qc']));

drop policy if exists "slitting_batch_items_read_roles" on public.slitting_batch_items;
create policy "slitting_batch_items_read_roles" on public.slitting_batch_items for select to authenticated
using (public.has_any_role(array['super_admin','production_head','person_a','operator_2_slitting','slitting_qc','slitting_operator','person_b']));

drop policy if exists "generated_documents_read_roles" on public.generated_documents;
create policy "generated_documents_read_roles" on public.generated_documents for select to authenticated
using (public.has_any_role(array['super_admin','production_head','store_head','person_a','operator_1_metallisation','operator_2_slitting','slitting_qc','slitting_operator','person_b','operator_3_winding','operator_4_spray','sales','accountant']));

drop policy if exists "notifications_owner_read" on public.notifications;
create policy "notifications_owner_read" on public.notifications for select to authenticated
using (recipient_profile_id = public.current_profile_id() or public.is_admin_role());

drop policy if exists "notifications_owner_update" on public.notifications;
create policy "notifications_owner_update" on public.notifications for update to authenticated
using (recipient_profile_id = public.current_profile_id() or public.is_admin_role())
with check (recipient_profile_id = public.current_profile_id() or public.is_admin_role());

drop policy if exists "push_subscriptions_owner_all" on public.push_subscriptions;
create policy "push_subscriptions_owner_all" on public.push_subscriptions for all to authenticated
using (profile_id = public.current_profile_id() or public.is_admin_role())
with check (profile_id = public.current_profile_id() or public.is_admin_role());

drop policy if exists "inventory_read_roles" on public.inventory;
create policy "inventory_read_roles" on public.inventory for select to authenticated
using (public.has_any_role(array['super_admin','production_head','store_head','person_a','operator_1_metallisation','operator_2_slitting','slitting_qc','slitting_operator','person_b','accountant']));

drop policy if exists "work_orders_read_roles" on public.work_orders;
create policy "work_orders_read_roles" on public.work_orders for select to authenticated
using (
  public.has_any_role(array['super_admin','production_head','store_head','person_a','operator_1_metallisation','operator_2_slitting','slitting_qc','slitting_operator'])
  or assigned_to = public.current_profile_id()
);

drop policy if exists "metallisation_read_roles" on public.metallisation;
create policy "metallisation_read_roles" on public.metallisation for select to authenticated
using (public.has_any_role(array['super_admin','production_head','store_head','person_a','operator_1_metallisation','operator_2_slitting','slitting_qc','slitting_operator']));

drop policy if exists "slitting_read_roles" on public.slitting;
create policy "slitting_read_roles" on public.slitting for select to authenticated
using (public.has_any_role(array['super_admin','production_head','store_head','person_a','operator_2_slitting','slitting_qc','slitting_operator','person_b']));

drop policy if exists "slitting_write_roles" on public.slitting;
create policy "slitting_write_roles" on public.slitting for all to authenticated
using (public.has_any_role(array['super_admin','person_a','operator_2_slitting','slitting_qc']))
with check (public.has_any_role(array['super_admin','person_a','operator_2_slitting','slitting_qc']));

drop policy if exists "stock_read_roles" on public.stock;
create policy "stock_read_roles" on public.stock for select to authenticated
using (public.has_any_role(array['super_admin','production_head','person_a','operator_2_slitting','slitting_qc','slitting_operator','person_b','operator_3_winding','sales','accountant']));

drop policy if exists "stock_write_roles" on public.stock;
create policy "stock_write_roles" on public.stock for all to authenticated
using (public.has_any_role(array['super_admin','production_head','person_a','operator_2_slitting','slitting_qc']))
with check (public.has_any_role(array['super_admin','production_head','person_a','operator_2_slitting','slitting_qc']));

drop policy if exists "product_orders_read_roles" on public.product_orders;
create policy "product_orders_read_roles" on public.product_orders for select to authenticated
using (
  public.has_any_role(array['super_admin','production_head','person_a','operator_2_slitting','slitting_qc','slitting_operator','person_b','operator_3_winding','operator_4_spray','sales','accountant'])
  or assigned_to = public.current_profile_id()
);

drop policy if exists "product_materials_read_roles" on public.product_order_materials;
create policy "product_materials_read_roles" on public.product_order_materials for select to authenticated
using (public.has_any_role(array['super_admin','production_head','person_a','operator_2_slitting','slitting_qc','slitting_operator','person_b','operator_3_winding','operator_4_spray']));

drop policy if exists "product_materials_write_roles" on public.product_order_materials;
create policy "product_materials_write_roles" on public.product_order_materials for all to authenticated
using (public.has_any_role(array['super_admin','production_head','operator_2_slitting','slitting_qc','person_b']))
with check (public.has_any_role(array['super_admin','production_head','operator_2_slitting','slitting_qc','person_b']));

drop policy if exists "material_requests_read_roles" on public.material_requests;
create policy "material_requests_read_roles" on public.material_requests for select to authenticated
using (
  public.has_any_role(array['super_admin','production_head','store_head','person_a','person_b','operator_2_slitting','slitting_qc'])
  or requested_by = public.current_profile_id()
);

drop policy if exists "material_requests_write_roles" on public.material_requests;
create policy "material_requests_write_roles" on public.material_requests for all to authenticated
using (public.has_any_role(array['super_admin','store_head','person_a','person_b','operator_2_slitting','slitting_qc']))
with check (public.has_any_role(array['super_admin','store_head','person_a','person_b','operator_2_slitting','slitting_qc']));

drop policy if exists "material_returns_read_roles" on public.material_returns;
create policy "material_returns_read_roles" on public.material_returns for select to authenticated
using (
  public.has_any_role(array['super_admin','production_head','store_head','person_a','person_b','operator_2_slitting','slitting_qc'])
  or returned_by = public.current_profile_id()
);

drop policy if exists "material_returns_write_roles" on public.material_returns;
create policy "material_returns_write_roles" on public.material_returns for all to authenticated
using (public.has_any_role(array['super_admin','store_head','person_a','person_b','operator_2_slitting','slitting_qc']))
with check (public.has_any_role(array['super_admin','store_head','person_a','person_b','operator_2_slitting','slitting_qc']));

drop policy if exists "pipeline_read_roles" on public.pipeline_tracking;
create policy "pipeline_read_roles" on public.pipeline_tracking for select to authenticated
using (public.has_any_role(array['super_admin','production_head','store_head','person_a','person_b','operator_1_metallisation','operator_2_slitting','slitting_qc','slitting_operator','operator_3_winding','operator_4_spray']));

drop policy if exists "pipeline_write_roles" on public.pipeline_tracking;
create policy "pipeline_write_roles" on public.pipeline_tracking for all to authenticated
using (public.has_any_role(array['super_admin','production_head','store_head','person_a','person_b','operator_1_metallisation','operator_2_slitting','slitting_qc','slitting_operator','operator_3_winding','operator_4_spray']))
with check (public.has_any_role(array['super_admin','production_head','store_head','person_a','person_b','operator_1_metallisation','operator_2_slitting','slitting_qc','slitting_operator','operator_3_winding','operator_4_spray']));

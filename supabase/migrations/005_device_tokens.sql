create table if not exists device_tokens (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete cascade not null,
  organization_id  uuid references organizations(id) on delete cascade not null,
  token            text not null,
  platform         text not null default 'ios',
  created_at       timestamptz default now(),
  unique(user_id, token)
);

alter table device_tokens enable row level security;

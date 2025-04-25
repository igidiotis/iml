-- session_events table
create table if not exists session_events (
  id            uuid        primary key default gen_random_uuid(),
  participant   text        not null,
  event_type    text        not null,
  payload       jsonb       not null,
  created_at    timestamptz default now()
);

-- Row-Level Security
alter table session_events enable row level security;
create policy "Anon can insert" on session_events
  for insert with check (true); 
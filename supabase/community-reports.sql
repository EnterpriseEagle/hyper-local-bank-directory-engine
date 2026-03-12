create extension if not exists pgcrypto;

create table if not exists public.community_reports (
  id uuid primary key default gen_random_uuid(),
  branch_id bigint not null,
  suburb_id bigint not null,
  report_type text not null check (report_type in ('working', 'atm_empty', 'branch_closed', 'long_queue')),
  note text,
  photo_path text,
  photo_bucket text,
  photo_content_type text,
  reporter_hash text,
  source text not null default 'web',
  agent_summary text,
  agent_confidence numeric(5, 2),
  agent_recommendation text check (agent_recommendation in ('approve', 'review', 'reject')),
  moderation_status text not null default 'pending' check (moderation_status in ('pending', 'approved', 'rejected')),
  moderation_note text,
  moderated_at timestamptz,
  moderated_by text,
  submitted_at timestamptz not null default now(),
  synced_at timestamptz
);

create index if not exists community_reports_moderation_status_idx
  on public.community_reports (moderation_status, submitted_at desc);

create index if not exists community_reports_branch_idx
  on public.community_reports (branch_id, submitted_at desc);

alter table public.community_reports enable row level security;

insert into storage.buckets (id, name, public)
values ('report-photos', 'report-photos', false)
on conflict (id) do nothing;

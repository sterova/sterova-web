-- ============================================================================
-- Sterova — service enquiries
-- Adds structured project-scoping columns to contact_messages so the CMS can
-- separate normal contact messages from service enquiries and tag the service.
-- ============================================================================

alter table public.contact_messages
  add column if not exists source text not null default 'contact'
    check (source in ('contact', 'service')),
  add column if not exists service_slug   text check (char_length(service_slug) <= 64),
  add column if not exists service_title  text check (char_length(service_title) <= 160),
  add column if not exists company        text check (char_length(company) <= 120),
  add column if not exists phone          text check (char_length(phone) <= 32),
  add column if not exists budget         text check (char_length(budget) <= 64),
  add column if not exists timeline       text check (char_length(timeline) <= 64),
  add column if not exists project_stage  text check (char_length(project_stage) <= 64),
  add column if not exists referral_source text check (char_length(referral_source) <= 64);

create index if not exists contact_messages_source_idx
  on public.contact_messages (source, created_at desc);

-- =============================================================
-- Migration 0002: settings (key/value site config)
-- Created: 2026-05-16
-- =============================================================

create table if not exists public.settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

alter table public.settings enable row level security;

drop policy if exists "Public can read settings" on public.settings;
create policy "Public can read settings"
  on public.settings
  for select
  to anon, authenticated
  using (true);

-- =============================================================
-- Seed default settings (idempotent — re-running is safe)
-- =============================================================
insert into public.settings (key, value) values
  ('phone_display',         '0533 559 47 97'),
  ('phone_tel',             '+905335594797'),
  ('whatsapp_number',       '905335594797'),
  ('instagram_handle',      '@samimi_sportsclub'),
  ('instagram_url',         'https://instagram.com/samimi_sportsclub'),
  ('address_full',          'Sami Efendi Caddesi No:31/9, Yenimahalle (Demet), Ankara'),
  ('address_short',         'Sami Efendi Cad. No:31/9, Yenimahalle, Ankara'),
  ('hours_weekdays',        '12:00 - 23:00'),
  ('hours_weekends',        '12:00 - 23:00'),
  ('google_maps_embed_url', 'https://www.google.com/maps/embed?pb=...')
on conflict (key) do nothing;

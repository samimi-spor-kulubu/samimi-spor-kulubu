-- =============================================================
-- Migration 0006: Esat Mahmut Akın — full profile update
-- Created: 2026-05-18
--
-- 1. Introduces public.trainer_branches (M:N junction) so a single
--    trainer can teach multiple branches. Backfilled from the
--    existing branches.instructor_id column so behaviour is
--    unchanged for already-wired trainers.
-- 2. Adds Geleneksel Okçuluk and Çocuk Jimnastiği to Esat Hoca on
--    top of his existing Taekwondo branch. Also points the
--    branches.instructor_id of those two branches at Esat so the
--    branch detail pages still show him as the primary instructor.
-- 3. Rewrites Esat Hoca's title, short bio, about paragraphs,
--    certifications and specialties in both TR and EN to reflect
--    his national-athlete background and 3 disciplines.
-- =============================================================

-- =============================================================
-- 1) trainer_branches junction table
-- =============================================================
create table if not exists public.trainer_branches (
  trainer_id uuid not null references public.trainers(id) on delete cascade,
  branch_id  uuid not null references public.branches(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (trainer_id, branch_id)
);

create index if not exists trainer_branches_trainer_idx on public.trainer_branches (trainer_id);
create index if not exists trainer_branches_branch_idx  on public.trainer_branches (branch_id);

alter table public.trainer_branches enable row level security;

drop policy if exists "Public can read trainer_branches" on public.trainer_branches;
create policy "Public can read trainer_branches"
  on public.trainer_branches
  for select
  to anon, authenticated
  using (true);

-- Backfill from existing 1:1 instructor_id pairings. Idempotent.
insert into public.trainer_branches (trainer_id, branch_id)
select b.instructor_id, b.id
from public.branches b
where b.instructor_id is not null
on conflict (trainer_id, branch_id) do nothing;

-- =============================================================
-- 2) Wire Esat to Geleneksel Okçuluk and Çocuk Jimnastiği
-- =============================================================
insert into public.trainer_branches (trainer_id, branch_id)
select
  (select id from public.trainers where slug = 'esat-mahmut-akin'),
  b.id
from public.branches b
where b.slug in ('geleneksel-okculuk', 'cocuk-jimnastigi')
on conflict (trainer_id, branch_id) do nothing;

-- Also update the legacy instructor_id pointer on those branches so the
-- existing branch detail page (which reads branches.instructor) shows Esat.
update public.branches
set instructor_id = (select id from public.trainers where slug = 'esat-mahmut-akin'),
    updated_at = now()
where slug in ('geleneksel-okculuk', 'cocuk-jimnastigi');

-- =============================================================
-- 3) Esat Mahmut Akın — full profile rewrite (TR + EN)
-- =============================================================
update public.trainers
set
  title_tr = 'Milli Sporcu · Taekwondo, Okçuluk & Jimnastik Eğitmeni',
  title_en = 'National Athlete · Taekwondo, Archery & Gymnastics Coach',
  short_bio_tr = 'Milli sporcu — 2012 Balkan Şampiyonası 2.si. Taekwondo, Geleneksel Okçuluk ve Çocuk Jimnastiği eğitmeni.',
  short_bio_en = 'National athlete — 2nd place at the 2012 Balkan Championships. Coach in Taekwondo, Traditional Archery and Kids Gymnastics.',
  about_tr = array[
    'MİLLİ SPORCU. Uluslararası arenada Bosna Hersek''te düzenlenen 2012 Balkan Şampiyonası''nda Türkiye''yi temsil ederek 2.lik kazandı. Ulusal düzeyde 2009 ve 2012 yıllarında iki kez Türkiye Taekwondo Şampiyonu oldu, 2001 yılında Liseler Arası Türkiye Şampiyonluğu elde etti ve 2002-2011 yılları arasında 10 yıl üst üste Ankara Taekwondo Şampiyonluğu unvanını taşıdı.',
    'Kırşehir Ahi Evran Üniversitesi Beden Eğitimi ve Spor Yüksekokulu (BESYO) mezunudur. 2002-2012 yılları arasında İl Bank Spor Kulübü''nde profesyonel sporcu olarak yer aldı; 2012-2017 yılları arasında ise aynı kulüpte antrenör olarak görev yaptı. 2019-2022 döneminde Muradiye Öğretim Kurumları''nda beden eğitimi öğretmenliği yaptı; Altındağ Halk Eğitim Merkezi''nde de usta öğreticilik görevini sürdürüyor.',
    'Bugün Samimi Spor Kulübü çatısı altında üç farklı branşta — Taekwondo, Geleneksel Okçuluk ve Çocuk Jimnastiği — eğitim veriyor. Sportech Türkiye iş birliği çerçevesinde Norveç Olimpiyat Komitesi''nin spor teknolojileri projesinde yer alarak hem spor pedagojisi birikimini hem de teknoloji destekli antrenman yöntemlerine olan ilgisini geliştirmeye devam ediyor.',
    'Antrenörlük felsefesinin temelinde disiplin, saygı ve samimiyet yatar. Çocukların yalnızca fiziksel değil; karakter, özgüven ve sosyal becerilerinin de gelişmesini önemser — sporu bir yaşam alışkanlığı olarak öğretmeyi hedefler.'
  ],
  about_en = array[
    'NATIONAL ATHLETE. Represented Turkey at the 2012 Balkan Championships in Bosnia and Herzegovina, finishing 2nd. On the national stage he is a two-time Turkish Taekwondo Champion (2009 and 2012), Turkish High School Champion (2001), and held the Ankara Taekwondo Champion title for 10 consecutive years between 2002 and 2011.',
    'Graduate of Kırşehir Ahi Evran University, School of Physical Education and Sports (BESYO). He competed professionally for İl Bank Sports Club between 2002 and 2012, then served as a coach at the same club from 2012 to 2017. From 2019 to 2022 he taught physical education at Muradiye Educational Institutions, and he continues to teach as a master instructor at Altındağ Public Education Centre.',
    'Today, at Samimi Sports Club, he coaches three different disciplines: Taekwondo, Traditional Archery and Kids Gymnastics. Through a partnership with Sportech Turkey, he contributes to the Norwegian Olympic Committee''s sports technology project, deepening both his pedagogical experience and his interest in technology-driven training methods.',
    'His coaching philosophy is rooted in discipline, respect and sincerity. He cares not only about children''s physical development but also about their character, confidence and social skills — teaching sport as a lifelong habit.'
  ],
  certifications = array[
    'Taekwondo 1. Kademe Antrenör',
    'Taekwondo 2. Kademe Antrenör',
    'Dünya Taekwondo Kukkiwon 1. Dan',
    'Türkiye Taekwondo Federasyonu 2. Dan',
    'Temel Jimnastik Antrenörü',
    'Geleneksel Okçuluk Antrenörü'
  ],
  specialties = array[
    'Olimpik Taekwondo',
    'Geleneksel Türk Okçuluğu',
    'Çocuk Jimnastiği',
    'Çocuk Sporu Pedagojisi',
    'Spor Teknolojileri'
  ],
  updated_at = now()
where slug = 'esat-mahmut-akin';

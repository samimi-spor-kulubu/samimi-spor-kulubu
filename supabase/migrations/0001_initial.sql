-- =============================================================
-- Migration 0001: Initial schema
-- Created: 2026-05-16
--
-- Creates the core tables, RLS policies, indexes and seed data
-- for the Samimi Spor Kulübü site. All tables live in `public`.
-- =============================================================

create extension if not exists pgcrypto;

-- =============================================================
-- TABLE: trainers
-- =============================================================
create table if not exists public.trainers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  title_tr text,
  title_en text,
  short_bio_tr text,
  short_bio_en text,
  about_tr text[],
  about_en text[],
  certifications text[],
  specialties text[],
  photo text,
  order_index int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists trainers_slug_idx on public.trainers (slug);
create index if not exists trainers_order_idx on public.trainers (order_index);

alter table public.trainers enable row level security;

drop policy if exists "Public can read active trainers" on public.trainers;
create policy "Public can read active trainers"
  on public.trainers
  for select
  to anon, authenticated
  using (active = true);

-- =============================================================
-- TABLE: branches
-- =============================================================
create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  emoji text,
  name_tr text not null,
  name_en text,
  schedule_tr text,
  schedule_en text,
  schedule_long_tr text,
  schedule_long_en text,
  description_tr text,
  description_en text,
  short_description_tr text,
  short_description_en text,
  features_tr text[],
  features_en text[],
  instructor_id uuid references public.trainers(id) on delete set null,
  price_info jsonb,
  women_only boolean not null default false,
  order_index int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists branches_slug_idx on public.branches (slug);
create index if not exists branches_order_idx on public.branches (order_index);

alter table public.branches enable row level security;

drop policy if exists "Public can read active branches" on public.branches;
create policy "Public can read active branches"
  on public.branches
  for select
  to anon, authenticated
  using (active = true);

-- =============================================================
-- TABLE: blog_posts
-- =============================================================
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null,
  author text,
  date date not null default current_date,
  image text,
  read_time int default 5,
  title_tr text not null,
  title_en text,
  excerpt_tr text,
  excerpt_en text,
  content_tr text,
  content_en text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_slug_idx on public.blog_posts (slug);
create index if not exists blog_posts_category_idx on public.blog_posts (category);
create index if not exists blog_posts_date_idx on public.blog_posts (date desc);
create index if not exists blog_posts_published_idx on public.blog_posts (published);

alter table public.blog_posts enable row level security;

drop policy if exists "Public can read published blog posts" on public.blog_posts;
create policy "Public can read published blog posts"
  on public.blog_posts
  for select
  to anon, authenticated
  using (published = true);

-- =============================================================
-- TABLE: gallery_items
-- =============================================================
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  src text,
  category text not null,
  title_tr text,
  title_en text,
  order_index int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists gallery_items_category_idx on public.gallery_items (category);
create index if not exists gallery_items_order_idx on public.gallery_items (order_index);

alter table public.gallery_items enable row level security;

drop policy if exists "Public can read active gallery items" on public.gallery_items;
create policy "Public can read active gallery items"
  on public.gallery_items
  for select
  to anon, authenticated
  using (active = true);

-- =============================================================
-- TABLE: faqs
-- =============================================================
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  category text not null,
  question_tr text not null,
  question_en text,
  answer_tr text not null,
  answer_en text,
  link_href text,
  link_label_tr text,
  link_label_en text,
  order_index int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists faqs_category_idx on public.faqs (category);
create index if not exists faqs_order_idx on public.faqs (order_index);

alter table public.faqs enable row level security;

drop policy if exists "Public can read active faqs" on public.faqs;
create policy "Public can read active faqs"
  on public.faqs
  for select
  to anon, authenticated
  using (active = true);

-- =============================================================
-- TABLE: contact_messages
-- =============================================================
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  subject text,
  message text not null,
  ip_address text,
  user_agent text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_idx on public.contact_messages (created_at desc);
create index if not exists contact_messages_status_idx on public.contact_messages (status);

alter table public.contact_messages enable row level security;

-- Public/anon can INSERT (so the website form can submit) but not read.
drop policy if exists "Public can submit contact messages" on public.contact_messages;
create policy "Public can submit contact messages"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

-- No public select policy — only service_role / admins can read.

-- =============================================================
-- TABLE: admin_users
-- =============================================================
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text,
  role text not null default 'editor',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_users_email_idx on public.admin_users (email);

alter table public.admin_users enable row level security;

-- No public policies — admin_users is service_role only.

-- =============================================================
-- Seed: trainers
-- =============================================================
insert into public.trainers (
  slug, name, title_tr, title_en, short_bio_tr, short_bio_en,
  about_tr, about_en, certifications, specialties, photo, order_index
) values
  (
    'beyza-erdas',
    'Beyza Erdaş',
    'Fizyoterapist · Reformer Pilates',
    'Physiotherapist · Reformer Pilates',
    'Dokuz Eylül Üniversitesi Fizik Tedavi ve Rehabilitasyon mezunu.',
    'Graduate of Dokuz Eylül University, Physical Therapy and Rehabilitation.',
    array[
      'Dokuz Eylül Üniversitesi Fizik Tedavi ve Rehabilitasyon mezunu (2024).',
      'G Therapy Ankara''da sporcu fizyoterapistliği, pilates ve manuel terapi pratikleri yürüttü.',
      '2025''ten itibaren aynı kurumda müdür olarak görev yapıyor.'
    ],
    array[
      'Dokuz Eylül University, Physical Therapy and Rehabilitation graduate (2024).',
      'Practiced sports physiotherapy, pilates and manual therapy at G Therapy Ankara.',
      'Director at the same clinic since 2025.'
    ],
    array['MPT', 'Hacamat-Kupa Masajı'],
    array[
      'Manuel terapi',
      'Kinezyo bantlama',
      'Pilates',
      'Kuru iğneleme',
      'Mobilizasyon',
      'Manipülasyon',
      'Hacamat'
    ],
    '/images/trainers/beyza-erdas.jpg',
    1
  ),
  (
    'esat-mahmut-akin',
    'Esat Mahmut Akın',
    'Taekwondo Eğitmeni',
    'Taekwondo Coach',
    'Taekwondo branşının deneyimli eğitmeni.',
    'Experienced coach of our taekwondo program.',
    array['Taekwondo eğitmenimiz. Detaylı bilgiler yakında eklenecek.'],
    array['Our taekwondo coach. More details coming soon.'],
    null,
    null,
    '/images/trainers/esat-mahmut-akin.jpg',
    2
  )
on conflict (slug) do nothing;

-- =============================================================
-- Seed: branches (instructor_id resolved via trainers.slug)
-- =============================================================
insert into public.branches (
  slug, emoji, name_tr, name_en,
  schedule_tr, schedule_en, schedule_long_tr, schedule_long_en,
  short_description_tr, short_description_en,
  description_tr, description_en,
  features_tr, features_en,
  instructor_id, price_info, women_only, order_index
) values
  (
    'taekwondo', '🥋',
    'Taekwondo', 'Taekwondo',
    'Pzt / Çrş / Cum · 18:00 – 19:30',
    'Mon / Wed / Fri · 18:00 – 19:30',
    'Pazartesi / Çarşamba / Cuma · 18:00 – 19:30',
    'Monday / Wednesday / Friday · 18:00 – 19:30',
    'Disiplin, denge ve özgüven kazandıran köklü bir Kore dövüş sanatı. Çocuk ve yetişkin grupları.',
    'A timeless Korean martial art that builds discipline, balance and confidence. Kids and adult groups.',
    'Kore''nin milli dövüş sanatı. Disiplin, özgüven ve refleks geliştirme. Her yaş ve seviyeye uygun.',
    'Korea''s national martial art. Builds discipline, confidence and reflexes. Suitable for every age and level.',
    array['Her yaşa uygun', 'Disiplin ve özgüven', 'Öz savunma teknikleri'],
    array['Suitable for all ages', 'Discipline and confidence', 'Self-defense techniques'],
    (select id from public.trainers where slug = 'esat-mahmut-akin'),
    null, false, 1
  ),
  (
    'boks-kick-boks', '🥊',
    'Boks & Kick Boks', 'Boxing & Kickboxing',
    'Pzt / Çrş / Cum · 19:30 – 21:00',
    'Mon / Wed / Fri · 19:30 – 21:00',
    'Pazartesi / Çarşamba / Cuma · 19:30 – 21:00',
    'Monday / Wednesday / Friday · 19:30 – 21:00',
    'Yüksek tempolu, kondisyon ve refleks geliştiren karma antrenman.',
    'High-tempo, mixed training that develops conditioning and reflexes.',
    'Kondisyon, güç ve öz savunma bir arada. Hem yeni başlayanlar hem deneyimliler için.',
    'Conditioning, power and self-defense combined. For beginners and experienced alike.',
    array['Yoğun kondisyon', 'Öz savunma', 'Her seviyeye uygun'],
    array['High-intensity conditioning', 'Self-defense', 'Suitable for all levels'],
    null,
    null, false, 2
  ),
  (
    'geleneksel-okculuk', '🏹',
    'Geleneksel Okçuluk', 'Traditional Archery',
    'Sal / Per · 16:30 – 17:30',
    'Tue / Thu · 16:30 – 17:30',
    'Salı / Perşembe · 16:30 – 17:30',
    'Tuesday / Thursday · 16:30 – 17:30',
    'Geleneksel tirendaz tekniğiyle odaklanma, postür ve nefes çalışması.',
    'Traditional ''tirendaz'' technique with focus on posture, breath and concentration.',
    'Türk okçuluk geleneğini yaşat. Konsantrasyon, sabır ve teknik gelişim.',
    'Carry on the Turkish archery tradition. Focus, patience and technique.',
    array['Geleneksel Türk okçuluğu', 'Konsantrasyon gelişimi', 'Tüm ekipman sağlanır'],
    array['Traditional Turkish archery', 'Focus development', 'All equipment provided'],
    null,
    null, false, 3
  ),
  (
    'cocuk-jimnastigi', '🤸',
    'Çocuk Jimnastiği', 'Kids Gymnastics',
    'Per 17:30 · Cmt 14:00 (45 dk)',
    'Thu 17:30 · Sat 14:00 (45 min)',
    'Perşembe 17:30 · Cumartesi 14:00 (45 dakika)',
    'Thursday 17:30 · Saturday 14:00 (45 min)',
    '4–14 yaş çocuklar için temel jimnastik becerileri, denge ve esneklik.',
    'Foundational gymnastics, balance and flexibility for ages 4–14.',
    'Çocukların motor gelişimini destekleyen eğlenceli jimnastik dersleri.',
    'Playful gymnastics classes that support kids'' motor development.',
    array['4–14 yaş', 'Motor gelişim', 'Eğlenceli ortam'],
    array['Ages 4–14', 'Motor development', 'Playful environment'],
    null,
    null, false, 4
  ),
  (
    'reformer-pilates', '🧘',
    'Reformer Pilates', 'Reformer Pilates',
    'Sal / Per / Cmt / Paz · 12:00 – 23:00',
    'Tue / Thu / Sat / Sun · 12:00 – 23:00',
    'Salı / Perşembe / Cumartesi / Pazar · 12:00 – 23:00',
    'Tuesday / Thursday / Saturday / Sunday · 12:00 – 23:00',
    'Bayanlara özel, 8 seanslık paketlerle reformer üzerinde tam vücut çalışması.',
    'Women-only full-body work on the reformer, sold as 8-session packages.',
    'Fizyoterapist Beyza Erdaş eşliğinde reformer pilates. 8 seanslık paketler, haftada 2 seans.',
    'Reformer pilates with physiotherapist Beyza Erdaş. 8-session packages, 2 sessions per week.',
    array['Bayanlara özel', 'Fizyoterapist eğitmen', 'Küçük gruplar'],
    array['Women only', 'Physiotherapist trainer', 'Small groups'],
    (select id from public.trainers where slug = 'beyza-erdas'),
    '{"packages":[{"key":"group4","campaign":"4.200 TL","normal":"5.000 TL"},{"key":"group3","campaign":"5.200 TL","normal":"5.750 TL"},{"key":"group2","campaign":"6.500 TL","normal":"6.750 TL"},{"key":"individual","campaign":"9.000 TL","normal":"10.500 TL"}],"sessionCount":8,"sessionsPerWeek":2}'::jsonb,
    true, 5
  )
on conflict (slug) do nothing;

-- =============================================================
-- Seed: faqs  (mirrors src/lib/faqs.ts)
-- =============================================================
insert into public.faqs (
  key, category, question_tr, question_en, answer_tr, answer_en,
  link_href, link_label_tr, link_label_en, order_index
) values
  (
    'membership-start', 'membership',
    'Üyelik nasıl başlar?',
    'How does a membership start?',
    'Bize WhatsApp''tan veya telefonla ulaşabilirsiniz. Size uygun branş ve seansı belirledikten sonra üyeliğinizi başlatırız.',
    'Reach us on WhatsApp or by phone. Once we pick the right class and time slot for you, we activate the membership.',
    null, null, null, 1
  ),
  (
    'membership-trial', 'membership',
    'Deneme dersi var mı?',
    'Do you offer a trial class?',
    'Bu konu için lütfen bizimle WhatsApp''tan iletişime geçin — en güncel bilgiyi paylaşalım.',
    'For this one, please reach out on WhatsApp — we''ll share the latest details.',
    null, null, null, 2
  ),
  (
    'membership-pause', 'membership',
    'Üyelik dondurabilir miyim?',
    'Can I pause my membership?',
    'Bu konu için lütfen bizimle WhatsApp''tan iletişime geçin — en güncel bilgiyi paylaşalım.',
    'For this one, please reach out on WhatsApp — we''ll share the latest details.',
    null, null, null, 3
  ),
  (
    'classes-age-groups', 'classes',
    'Hangi yaş gruplarına hizmet veriyorsunuz?',
    'What age groups do you serve?',
    'Çocuk jimnastiği 4–14 yaş arasıdır. Diğer branşlar her yaşa uygundur. Detaylı bilgi için bizimle iletişime geçin.',
    'Kids gymnastics is for ages 4–14. Our other classes welcome every age. Reach out for details.',
    null, null, null, 4
  ),
  (
    'classes-beginner', 'classes',
    'Daha önce hiç spor yapmadım, başlayabilir miyim?',
    'I''ve never trained before — can I still join?',
    'Elbette! Tüm branşlarımız her seviyeye uygundur. Eğitmenlerimiz seviyenize göre programı düzenler.',
    'Of course. Every class is open to all levels and our trainers tailor the program to where you are.',
    null, null, null, 5
  ),
  (
    'classes-pilates-women', 'classes',
    'Reformer pilates sadece bayanlara mı özeldir?',
    'Is reformer pilates women-only?',
    'Evet, reformer pilates derslerimiz bayanlarımıza özeldir.',
    'Yes, our reformer pilates classes are women-only.',
    '/branslar/reformer-pilates', 'Reformer Pilates sayfası', 'Reformer Pilates page', 6
  ),
  (
    'classes-parents-watch', 'classes',
    'Çocuk jimnastiği derslerini veliler izleyebilir mi?',
    'Can parents watch the kids gymnastics class?',
    'Bu konu için lütfen bizimle WhatsApp''tan iletişime geçin — en güncel bilgiyi paylaşalım.',
    'For this one, please reach out on WhatsApp — we''ll share the latest details.',
    null, null, null, 7
  ),
  (
    'facility-locker', 'facility',
    'Soyunma odası var mı?',
    'Is there a locker room?',
    'Evet, tesisimizde soyunma odamız bulunmaktadır.',
    'Yes, our facility has a locker room.',
    null, null, null, 8
  ),
  (
    'facility-parking', 'facility',
    'Otopark var mı?',
    'Is parking available?',
    'Bu konu için lütfen bizimle WhatsApp''tan iletişime geçin — en güncel bilgiyi paylaşalım.',
    'For this one, please reach out on WhatsApp — we''ll share the latest details.',
    null, null, null, 9
  ),
  (
    'facility-equipment', 'facility',
    'Spor kıyafeti ve ekipmanı temin ediyor musunuz?',
    'Do you provide sportswear and equipment?',
    'Geleneksel okçuluk için tüm ekipman tarafımızca sağlanır. Diğer branşlar için kendi spor kıyafetinizi getirmenizi tavsiye ederiz.',
    'For traditional archery, we provide all the equipment. For the other classes, please bring your own sportswear.',
    null, null, null, 10
  ),
  (
    'pilates-packages', 'pilates',
    'Reformer pilates seansları nasıl satılıyor?',
    'How are reformer pilates sessions sold?',
    'Reformer pilates 8 seanslık paketler halinde satılır. Haftada 2 ders olarak planlanır — yani yaklaşık 1 aylık bir programdır.',
    'Reformer pilates is sold as 8-session packages, run as 2 sessions per week — roughly a 1-month program.',
    '/branslar/reformer-pilates', 'Reformer Pilates sayfası', 'Reformer Pilates page', 11
  ),
  (
    'pilates-prices', 'pilates',
    'Reformer pilates fiyatları ne kadar?',
    'What are the reformer pilates prices?',
    E'4 kişilik grup: 4.200 TL\n3 kişilik grup: 5.200 TL\n2 kişilik grup: 6.500 TL\nBireysel: 9.000 TL\n\nKampanyalı fiyatlardır. Detaylı bilgi için bize ulaşabilirsiniz.',
    E'Group of 4: 4,200 TL\nGroup of 3: 5,200 TL\nGroup of 2: 6,500 TL\nIndividual: 9,000 TL\n\nThese are promotional prices. Reach out for the latest.',
    '/branslar/reformer-pilates', 'Reformer Pilates sayfası', 'Reformer Pilates page', 12
  ),
  (
    'pilates-trainer', 'pilates',
    'Reformer pilates eğitmeniniz kim?',
    'Who teaches reformer pilates?',
    'Reformer pilates eğitmenimiz Fizyoterapist Beyza Erdaş''tır. Dokuz Eylül Üniversitesi mezunudur ve manuel terapi, pilates alanlarında uzmanlaşmıştır.',
    'Our reformer pilates trainer is physiotherapist Beyza Erdaş, a Dokuz Eylül University graduate specialised in manual therapy and pilates.',
    '/egitmenler/beyza-erdas', 'Beyza Erdaş profili', 'Beyza Erdaş profile', 13
  ),
  (
    'payment-method', 'payment',
    'Ödeme nasıl yapılıyor?',
    'How can I pay?',
    'Bu konu için lütfen bizimle WhatsApp''tan iletişime geçin — en güncel bilgiyi paylaşalım.',
    'For this one, please reach out on WhatsApp — we''ll share the latest details.',
    null, null, null, 14
  ),
  (
    'payment-card', 'payment',
    'Kredi kartı kabul ediyor musunuz?',
    'Do you accept credit cards?',
    'Bu konu için lütfen bizimle WhatsApp''tan iletişime geçin — en güncel bilgiyi paylaşalım.',
    'For this one, please reach out on WhatsApp — we''ll share the latest details.',
    null, null, null, 15
  )
on conflict (key) do nothing;

-- Add Talha Numan Uçar as the Boxing & Kick Boxing coach.
--
-- Final display order: Esat (taekwondo) → Talha (boxing/kick boxing) →
-- Beyza (pilates). Existing order was Beyza=1, Esat=2; this migration
-- shifts those to make room at position 2 for Talha.

-- 1) Reorder existing trainers so Esat is #1 and Beyza is #3.
update public.trainers set order_index = 1, updated_at = now() where slug = 'esat-mahmut-akin';
update public.trainers set order_index = 3, updated_at = now() where slug = 'beyza-erdas';

-- 2) Insert Talha. about_tr / about_en are paragraph arrays consumed by
--    the trainer detail page renderer.
insert into public.trainers (
  slug, name, title_tr, title_en, short_bio_tr, short_bio_en,
  about_tr, about_en, certifications, specialties, photo, order_index, active
) values (
  'talha-numan-ucar',
  'Talha Numan UÇAR',
  'Boks & Kick Boks Antrenörü',
  'Boxing & Kick Boxing Coach',
  '25+ yıl boks ve kick boks deneyimi; aile mirası bir mücadele sporları geçmişiyle.',
  '25+ years of boxing and kick boxing experience, built on a family legacy of combat sports.',
  array[
    'Boks ve Kick Boks deneyimini bir aile mirası olarak alan Talha Hoca, 25 yılı aşkın süredir mücadele sporlarının içinde. Dedesi Ali Uçar boks antrenörü, babası Abdullah Uçar ise boks, kick boks ve taekwondo antrenörüydü. Bu güçlü gelenek üzerine kendi öğretim tarzını inşa etti.',
    '5 yaşında Taekwondo ile başladığı spor hayatı, sonraki yıllarda Boks ve Kick Boks ile zenginleşti. Türkiye Boks ve Kick Boks Federasyonu''nda yıllarca aktif müsabık olarak yer aldı. Kick Boks''ta Siyah Kuşak 2. Dan ve 1. Kademe Antrenörlük belgesine sahip.',
    'Boks alanında ise dedesi ve babasının rehberliğinde 25 yılı aşkın süredir ''Rus stili'' boks ekolünde eğitim aldı ve bu alanda derin bir uzmanlık kazandı.',
    'Antrenörlük vizyonu sadece teknik gelişimi değil, sporcuların zihinsel dayanıklılığını ve spor ahlakını da en üst seviyeye çıkarmayı hedefler. Sabırlı, disiplinli ve teşvik edici yaklaşımıyla her seviyeden sporcuya uygun eğitim sunar.'
  ],
  array[
    'Talha Hoca inherited his boxing and kick boxing experience as a family legacy and has been immersed in combat sports for over 25 years. His grandfather Ali Uçar was a boxing coach, and his father Abdullah Uçar was a boxing, kick boxing, and taekwondo coach. He built his own teaching style upon this strong tradition.',
    'His sports journey began at age 5 with Taekwondo and was later enriched with Boxing and Kick Boxing. He competed actively for years under the Turkish Boxing and Kick Boxing Federations. He holds a 2nd Dan Black Belt and a Level 1 Coaching Certificate in Kick Boxing.',
    'In Boxing, under the guidance of his grandfather and father, he has been trained for over 25 years in the ''Russian style'' boxing school, gaining deep expertise in this area.',
    'His coaching vision aims not only at technical development but also at elevating athletes'' mental resilience and sportsmanship. With his patient, disciplined, and encouraging approach, he offers training suitable for athletes of every level.'
  ],
  array[
    'Kick Boks: Siyah Kuşak 2. Dan',
    'Kick Boks: 1. Kademe Antrenör (Türkiye Kick Boks Federasyonu)',
    'Boks: 25+ yıl Rus stili ekol',
    'Taekwondo: Siyah Kuşak 2. Dan',
    '25+ yıl mücadele sporları tecrübesi'
  ],
  array[
    'Boks',
    'Kick Boks',
    'Rus stili boks ekolü',
    'Sporcu gelişimi',
    'Müsabaka hazırlığı'
  ],
  null,
  2,
  true
)
on conflict (slug) do nothing;

-- 3) Wire Talha to the Boks & Kick Boks branch as its instructor.
update public.branches
set instructor_id = (select id from public.trainers where slug = 'talha-numan-ucar'),
    updated_at = now()
where slug = 'boks-kick-boks';

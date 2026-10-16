-- Kort Tenisi: yeni branş (Cmt / Paz, saat sonra eklenecek), eğitmen Esat Hoca.
-- Esat Hoca'nın profiline Kort Tenisi eklenir.

insert into public.branches (
  slug, emoji, name_tr, name_en,
  schedule_tr, schedule_en, schedule_long_tr, schedule_long_en,
  short_description_tr, short_description_en,
  description_tr, description_en,
  features_tr, features_en,
  instructor_id, price_info, women_only, order_index
) values (
  'kort-tenisi', '🎾',
  'Kort Tenisi', 'Tennis',
  'Cmt / Paz', 'Sat / Sun',
  'Cumartesi / Pazar', 'Saturday / Sunday',
  'Hafta sonu kort tenisi dersleri.',
  'Weekend tennis lessons.',
  'Esat Hoca eşliğinde kort tenisi dersleri. Dersler Cumartesi ve Pazar günleri yapılır, ders saatleri yakında duyurulacaktır.',
  'Tennis lessons with Coach Esat. Classes are held on Saturdays and Sundays; class times will be announced soon.',
  array['Hafta sonu dersleri', 'Deneyimli eğitmen'],
  array['Weekend classes', 'Experienced coach'],
  (select id from public.trainers where slug = 'esat-mahmut-akin'),
  null, false, 6
)
on conflict (slug) do nothing;

insert into public.trainer_branches (trainer_id, branch_id)
select
  (select id from public.trainers where slug = 'esat-mahmut-akin'),
  b.id
from public.branches b
where b.slug = 'kort-tenisi'
on conflict (trainer_id, branch_id) do nothing;

update public.trainers
set
  title_tr = 'Milli Sporcu · Taekwondo, Okçuluk, Jimnastik & Kort Tenisi Eğitmeni',
  title_en = 'National Athlete · Taekwondo, Archery, Gymnastics & Tennis Coach',
  short_bio_tr = 'Milli sporcu — 2012 Balkan Şampiyonası 2.si. Taekwondo, Geleneksel Okçuluk, Çocuk Jimnastiği ve Kort Tenisi eğitmeni.',
  short_bio_en = 'National athlete — 2nd place at the 2012 Balkan Championships. Coach in Taekwondo, Traditional Archery, Kids Gymnastics and Tennis.',
  about_tr[3] = 'Bugün Samimi Spor Kulübü çatısı altında dört farklı branşta — Taekwondo, Geleneksel Okçuluk, Çocuk Jimnastiği ve Kort Tenisi — eğitim veriyor. Sportech Türkiye iş birliği çerçevesinde Norveç Olimpiyat Komitesi''nin spor teknolojileri projesinde yer alarak hem spor pedagojisi birikimini hem de teknoloji destekli antrenman yöntemlerine olan ilgisini geliştirmeye devam ediyor.',
  about_en[3] = 'Today, at Samimi Sports Club, he coaches four different disciplines: Taekwondo, Traditional Archery, Kids Gymnastics and Tennis. Through a partnership with Sportech Turkey, he contributes to the Norwegian Olympic Committee''s sports technology project, deepening both his pedagogical experience and his interest in technology-driven training methods.',
  specialties = array_append(specialties, 'Kort Tenisi'),
  updated_at = now()
where slug = 'esat-mahmut-akin'
  and not ('Kort Tenisi' = any(specialties));

-- Okçuluk: Pzt / Çrş 17:00 – 18:00
-- Çocuk Jimnastiği: Cmt 13:00 – 13:45 · Paz 12:00 – 12:45

update public.branches
set
  schedule_tr = 'Pzt / Çrş · 17:00 – 18:00',
  schedule_en = 'Mon / Wed · 17:00 – 18:00',
  schedule_long_tr = 'Pazartesi / Çarşamba · 17:00 – 18:00',
  schedule_long_en = 'Monday / Wednesday · 17:00 – 18:00',
  updated_at = now()
where slug = 'geleneksel-okculuk';

update public.branches
set
  schedule_tr = 'Cmt 13:00 – 13:45 · Paz 12:00 – 12:45',
  schedule_en = 'Sat 13:00 – 13:45 · Sun 12:00 – 12:45',
  schedule_long_tr = 'Cumartesi 13:00 – 13:45 · Pazar 12:00 – 12:45',
  schedule_long_en = 'Saturday 13:00 – 13:45 · Sunday 12:00 – 12:45',
  updated_at = now()
where slug = 'cocuk-jimnastigi';

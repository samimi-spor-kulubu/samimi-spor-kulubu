-- =============================================================
-- FAQ: TR text update — "soyunma odası" → "giyinme odası"
-- The English text already uses "changing room" and stays as-is.
-- =============================================================

update public.faqs
set
  question_tr = 'Duş ve giyinme odası var mı?',
  answer_tr   = 'Evet, salonumuzda duş ve giyinme odası bulunmaktadır. Antrenmandan sonra rahatça duş alıp temizlenebilirsiniz.',
  updated_at  = now()
where key = 'facility-locker';

-- Clarify that Boks & Kick Boks is a single combined discipline (not two
-- separate classes). The earlier description ("Kondisyon, güç ve öz
-- savunma bir arada…") didn't make the "same session, both styles
-- together" point explicit, which led to customer confusion.

update public.branches
set
  description_tr = 'Boks ve Kick Boks derslerimiz aynı seansta birlikte yapılır. Hem klasik boks tekniklerini hem de Kick Boks ayak tekniklerini öğreneceğiniz, kondisyon ve refleksinizi geliştirecek dinamik bir branştır.',
  description_en = 'Our Boxing and Kick Boxing classes are held together in the same session. A dynamic discipline where you will learn both classical boxing techniques and Kick Boxing kicking techniques while improving your conditioning and reflexes.',
  updated_at = now()
where slug = 'boks-kick-boks';

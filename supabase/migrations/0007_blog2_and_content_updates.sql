-- =============================================================
-- Migration 0007: Blog post #2 (Reformer Pilates) — full content,
-- Beyza Erdaş profile rewrite, FAQ content updates.
-- Created: 2026-05-19
--
-- Idempotent — every statement uses ON CONFLICT or WHERE clauses
-- so this can be re-run safely. The Hakkımızda page is i18n-only
-- (messages/*.json) and is NOT touched here.
-- =============================================================

-- =============================================================
-- 1) Blog post #2 — Reformer Pilates with a Physiotherapist
--    Full TR/EN markdown content embedded.
-- =============================================================
insert into public.blog_posts (
  slug, category, author, image, published, date,
  read_time,
  title_tr, title_en,
  excerpt_tr, excerpt_en,
  content_tr, content_en
) values (
  'reformer-pilates-fizyoterapist-esliginde',
  'pilates',
  'Samimi Spor Kulübü',
  null,
  true,
  current_date,
  4,
  'Fizyoterapist Eşliğinde Reformer Pilates: Neden Fark Yaratır?',
  'Reformer Pilates with a Physiotherapist: Why It Makes a Difference',
  'Sıradan bir pilates eğitmeninin fark edemediği detayları fizyoterapist görür. Reformer Pilates''in ne olduğunu, mat pilatesten farkını ve neden fizyoterapist eşliğinde yapmanın daha güvenli olduğunu anlatıyoruz.',
  'A physiotherapist notices details an ordinary pilates instructor might miss. We explain what Reformer Pilates is, how it differs from mat pilates, and why doing it with a physiotherapist is safer and more effective.',
  E'## Yanlış Bir Hareket, Bir Aylık Sırt Ağrısı\n\nPilates''e başlamak istiyorsunuz. YouTube''da videolar var, semtinizde stüdyolar var, mat pilates kursları var. Ama bir şey sizi durduruyor: "Ya yanlış yaparsam? Ya zaten ağrıyan dizim daha kötü olursa?"\n\nBu endişe haklı. Çünkü pilates, doğru yapıldığında **mucize gibi iyi gelir**, yanlış yapıldığında **sakatlık yaratır**. Aradaki farkı görebilecek tek kişi vardır: **fizyoterapist.**\n\n## Reformer Pilates Nedir?\n\nReformer, üzerinde uzandığınız bir yatak, ayaklarınızla ittiğiniz bir platform, ellerinizle çektiğiniz halatlar ve direnci ayarlayan yaylardan oluşan özel bir pilates cihazıdır.\n\nMat pilatesle aynı prensiplere dayanır: **kor güçlenmesi, doğru nefes, kontrollü hareket.** Ama reformer''da bir fark vardır: cihaz size yardım eder.\n\n- Hareketleri **doğru pozisyonda** yapmanızı sağlar\n- Direnci **kendi vücudunuza göre** ayarlar\n- Eklemlerinize **yumuşak** yaklaşır\n- Çok daha **çeşitli egzersizler** mümkündür (500+ farklı hareket)\n\n## Mat Pilates mi, Reformer Pilates mi?\n\nİkisi de iyi. Ama farkları var:\n\n**Mat Pilates:**\n- Sadece vücut ağırlığıyla çalışır\n- Evde de yapılabilir\n- Daha ucuzdur\n- Başlangıçta yetersiz hissedebilirsiniz\n\n**Reformer Pilates:**\n- Cihazın yardımıyla çalışır\n- Stüdyo gerekir\n- Daha hızlı sonuç verir\n- Sakatlık riski daha düşüktür\n- Postür düzeltmede daha etkilidir\n\nEğer bel ağrınız varsa, hamile kaldıktan sonra bir şeyleri düzeltmek istiyorsanız, ofis çalışanı olarak boyun-omuz sorunu yaşıyorsanız, **reformer önerilir.**\n\n## Fizyoterapist Eşliğinde Pilates: Fark Nedir?\n\nİşte burası kritik. Çoğu pilates stüdyosunda eğitmen size hareketi gösterir, siz tekrar edersiniz. Eğitmen "kalçanı sık", "karnı içeri çek" der.\n\nAma bir fizyoterapist farklı bakar.\n\nFizyoterapist size baktığında şunları görür:\n\n- Sağ omzun sol omuzdan **1 santim daha yüksek** olduğunu\n- Yürürken **sağ ayağınıza yüklendiğinizi**\n- Şikayetiniz olan diz ağrısının aslında **kalça kaslarınızdaki zayıflıktan** kaynaklandığını\n- Nefes alırken **göğsünüzü kullanmadığınızı**\n\nSıradan bir eğitmen bunları fark etmez. Fizyoterapist **göz alıştırması** olmuştur, dört yıl boyunca anatomi okumuş, hastanelerde stajını yapmış.\n\nİşte bu yüzden **Samimi Spor Kulübü''nde Reformer Pilates''i Fizyoterapist Beyza Erdaş** yönetiyor.\n\n## Beyza Hoca Kimdir?\n\nBeyza Erdaş, **Dokuz Eylül Üniversitesi Fizik Tedavi ve Rehabilitasyon** bölümünden 2024 yılında mezun oldu. Lisans eğitimi sırasında:\n\n- **Dr. Savaş Kudaş Spor Hekimliği Kliniği**''nde sporcu sağlığı stajı\n- **G Therapy Ankara**''da manuel terapi ve pilates üzerine deneyim\n- **Bilkent Şehir Hastanesi**''nde ortopedik rehabilitasyon stajı\n\nMezun olduktan sonra G Therapy Ankara''da çalışmaya başladı, **Temmuz 2025''ten beri burada müdür** olarak görev yapıyor. Manuel terapi, kinezyo bantlama, kuru iğneleme sertifikalarına sahip.\n\nYani Beyza Hoca, sadece pilates hareketini öğretmiyor. Vücudunuzu **fizyoterapist gözüyle** okuyor.\n\n## Reformer Pilates Kimler İçin?\n\n- 👩 **Ofis çalışanları** — boyun, omuz, bel sorunu olanlar\n- 🤰 **Hamilelik sonrası** — kor kaslarını yeniden çalıştırmak isteyenler\n- 💪 **Postür sorunu olanlar** — kambur duranlar\n- 🏃 **Sakatlık geçirmiş olanlar** — diz, bel ameliyatı sonrası dönüş yapmak isteyenler\n- 👵 **Yaşı ilerlemiş bireyler** — denge ve esneklik için\n- 🧘 **Stresten kaçmak isteyenler** — pilates beden kadar zihni de yatıştırır\n\n## Samimi Spor Kulübü''nde Reformer Pilates\n\n- **Bayanlara özel** — rahat ve güvenli ortam\n- **Küçük gruplar** — en fazla 4 kişi\n- **Fizyoterapist eşliğinde** — Beyza Erdaş tüm dersleri bizzat veriyor\n- **Esnek paket seçenekleri**\n\n## Ders Paketleri (Aylık)\n\n| Grup Boyutu | Ücret |\n|---|---|\n| 4 Kişilik Grup | **4.200 TL** |\n| 3 Kişilik Grup | **5.200 TL** |\n| 2 Kişilik Grup | **6.500 TL** |\n| Birebir (Bireysel) | **9.000 TL** |\n\nDaha küçük grup = Beyza Hoca''dan daha fazla bireysel ilgi. Reformer Pilates ödemesi peşin veya IBAN yoluyla yapılır, minimum 8 seans alımı gereklidir.\n\n## Sık Sorulan Sorular\n\n**Daha önce hiç pilates yapmadım, başlayabilir miyim?**\nEvet. Reformer Pilates başlangıç seviyesi için de uygundur. Beyza Hoca ilk derste seviyenizi değerlendirir.\n\n**Haftada kaç gün yapmalıyım?**\nSonuç almak için **haftada 2 ders** önerilir.\n\n**Sakatlığım/Rahatsızlığım var, yapabilir miyim?**\nİlk derste Beyza Hoca''ya **mutlaka belirtin**. Çoğu rahatsızlık reformer pilates için engel değildir, aksine **iyileştirici** olabilir.\n\n**Hangi kıyafetleri giymeliyim?**\nRahat spor kıyafetleri — tayt veya eşofman, atlet veya t-shirt yeterli. Çorap önerilir.\n\n**Reformer''da kilo verir miyim?**\nReformer Pilates kilo vermek için **tek başına yeterli değildir** — ama yağı sıkılaştırır, postürü düzeltir, kasları güzelleştirir.\n\n## Başlamaya Hazır mısınız?\n\nBeyza Hoca ile çalışmak istiyorsanız, en hızlı yol **WhatsApp**. Sorularınızı sorun, müsait olduğunuz günü söyleyin, programı birlikte oluşturun.',
  E'## One Wrong Move, A Month of Back Pain\n\nYou want to start pilates. There are YouTube videos, studios in your neighborhood, mat pilates classes. But something stops you: "What if I do it wrong? What if my already-aching knee gets worse?"\n\nThis concern is valid. Because pilates, when done right, **works miracles** — but when done wrong, **causes injury**. Only one person can tell the difference: **a physiotherapist.**\n\n## What Is Reformer Pilates?\n\nThe Reformer is a specialized pilates apparatus: a bed you lie on, a platform you push with your feet, ropes you pull with your hands, and springs that adjust resistance.\n\nIt''s based on the same principles as mat pilates: **core strength, proper breathing, controlled movement.** But there''s a key difference on the reformer: **the machine assists you.**\n\n- Keeps you in the **correct position**\n- Adjusts resistance **to your body**\n- Goes **easy on your joints**\n- Allows for **much more variety** (500+ different exercises)\n\n## Mat Pilates or Reformer Pilates?\n\nBoth are good. But they''re different:\n\n**Mat Pilates:**\n- Works with body weight only\n- Can be done at home\n- Cheaper\n- May feel insufficient for beginners\n\n**Reformer Pilates:**\n- Uses the machine for assistance\n- Requires a studio\n- Faster results\n- Lower injury risk\n- More effective for posture correction\n\nIf you have back pain, want to recover after pregnancy, or suffer from office-related neck-shoulder issues, **reformer is recommended.**\n\n## Pilates with a Physiotherapist: What''s the Difference?\n\nThis is the critical part. In most pilates studios, the instructor shows you the movement and you repeat it. The instructor says "squeeze your glutes", "pull your belly in".\n\nBut a physiotherapist looks differently.\n\nA physiotherapist sees:\n\n- That your right shoulder is **1 cm higher** than your left\n- That you''re **putting more weight on your right foot** when walking\n- That the knee pain you complain about actually stems from **weak hip muscles**\n- That you''re **not using your chest** when breathing\n\nA regular instructor doesn''t notice these things. A physiotherapist has had **trained eyes** — four years of anatomy classes, hospital internships.\n\nThat''s why **Reformer Pilates at Samimi Sports Club is led by Physiotherapist Beyza Erdaş.**\n\n## Who Is Beyza?\n\nBeyza Erdaş graduated from **Dokuz Eylül University, Department of Physical Therapy and Rehabilitation** in 2024. During her undergraduate years:\n\n- Internship at **Dr. Savaş Kudaş Sports Medicine Clinic**\n- Manual therapy and pilates experience at **G Therapy Ankara**\n- Orthopedic rehabilitation internship at **Bilkent City Hospital**\n\nAfter graduating, she joined G Therapy Ankara, and **since July 2025 she has served as the manager** there. She holds certifications in manual therapy, kinesio taping, and dry needling.\n\nSo Beyza doesn''t just teach pilates movements. She reads your body **through a physiotherapist''s eyes.**\n\n## Who Is Reformer Pilates For?\n\n- 👩 **Office workers** — those with neck, shoulder, or back issues\n- 🤰 **Post-pregnancy** — to rebuild core muscles\n- 💪 **Posture problems** — slouching, uneven walking\n- 🏃 **Injury recovery** — returning after knee or back surgery\n- 👵 **Older adults** — for balance and flexibility\n- 🧘 **Stress relief** — pilates calms the mind as well as the body\n\n## Reformer Pilates at Samimi Sports Club\n\n- **Women only** — comfortable and secure environment\n- **Small groups** — maximum 4 people\n- **Led by a physiotherapist** — Beyza Erdaş teaches all sessions\n- **Flexible package options**\n\n## Pricing (Monthly Packages)\n\n| Group Size | Price |\n|---|---|\n| Group of 4 | **4,200 TL** |\n| Group of 3 | **5,200 TL** |\n| Group of 2 | **6,500 TL** |\n| Private (1-on-1) | **9,000 TL** |\n\nSmaller group = more individual attention. Payment for Reformer Pilates is made in cash or via bank transfer (IBAN), with a minimum of 8 sessions required.\n\n## Frequently Asked Questions\n\n**I''ve never done pilates. Can I start?**\nYes. Reformer Pilates is suitable for beginners. Beyza assesses your level in the first session.\n\n**How many times per week should I attend?**\nFor results, **2 sessions per week** is recommended.\n\n**I have an injury/condition. Can I still join?**\n**Tell Beyza in the first session.** Most conditions are not obstacles — in fact, it can be **therapeutic.**\n\n**What should I wear?**\nComfortable sportswear — leggings or sweatpants, a breathable top. Socks are recommended.\n\n**Can I lose weight with reformer?**\nReformer Pilates **alone is not enough** — but it tones, improves posture, and shapes muscles.\n\n## Ready to Begin?\n\nIf you''d like to work with Beyza, the fastest way is **WhatsApp**. Ask your questions, let us know your availability, and we''ll create a program together.'
)
on conflict (slug) do update set
  category   = excluded.category,
  author     = excluded.author,
  image      = excluded.image,
  published  = excluded.published,
  read_time  = excluded.read_time,
  title_tr   = excluded.title_tr,
  title_en   = excluded.title_en,
  excerpt_tr = excluded.excerpt_tr,
  excerpt_en = excluded.excerpt_en,
  content_tr = excluded.content_tr,
  content_en = excluded.content_en,
  updated_at = now();

-- =============================================================
-- 2) Beyza Erdaş — full profile rewrite (TR + EN)
-- =============================================================
update public.trainers
set
  title_tr = 'Fizyoterapist · Reformer Pilates Eğitmeni',
  title_en = 'Physiotherapist · Reformer Pilates Instructor',
  short_bio_tr = 'Dokuz Eylül Üniversitesi Fizik Tedavi ve Rehabilitasyon mezunu fizyoterapist. Manuel terapi, sporcu fizyoterapisi ve klinik pilates uzmanı.',
  short_bio_en = 'Physiotherapist, graduate of Dokuz Eylül University Department of Physical Therapy and Rehabilitation. Specialist in manual therapy, sports physiotherapy and clinical pilates.',
  about_tr = array[
    'Beyza Erdaş, Dokuz Eylül Üniversitesi Fizik Tedavi ve Rehabilitasyon bölümünden 2024 yılında mezun olan bir fizyoterapisttir. Lisans eğitimi sırasında Dr. Savaş Kudaş Spor Hekimliği Kliniği''nde Gençlerbirliği Spor Kulübü fizyoterapistleriyle, G Therapy Ankara''da manuel terapi ve klinik pilates üzerine, Bilkent Şehir Hastanesi''nde ise ortopedik rehabilitasyon alanında staj deneyimi kazandı.',
    'Mezuniyetin ardından G Therapy Ankara''da çalışmaya başladı; Temmuz 2025 itibarıyla aynı kurumda müdür olarak görev yapmaktadır. Manuel terapi, kinezyo bantlama, mobilizasyon, manipülasyon, kuru iğneleme ve hacamat-kupa masajı gibi alanlarda sertifikalıdır.',
    'Samimi Spor Kulübü''nde Reformer Pilates derslerini bizzat veriyor. Fizyoterapist bakış açısıyla danışanlarının postür, kas dengesizliği ve hareket bozukluklarını okur; hareketleri kişiye göre uyarlar. Bu yaklaşım, klasik pilates eğitmenlerinden çok daha derin bir farkındalık sağlar.',
    'Antrenörlük felsefesinin temelinde empati, güven ve insan odaklı yaklaşım yer alır. Her danışanın yaşam kalitesine katkı sağlamayı hedefler; spor pratiğini bir tedavi ve gelişim yolculuğu olarak ele alır.'
  ],
  about_en = array[
    'Beyza Erdaş is a physiotherapist who graduated from Dokuz Eylül University, Department of Physical Therapy and Rehabilitation in 2024. During her undergraduate years, she completed internships at Dr. Savaş Kudaş Sports Medicine Clinic (working alongside Gençlerbirliği Sports Club physiotherapists), G Therapy Ankara (manual therapy and clinical pilates), and Bilkent City Hospital (orthopedic rehabilitation).',
    'After graduating, she joined G Therapy Ankara, and since July 2025 she has served as manager at the same institution. She holds certifications in manual therapy, kinesio taping, mobilization, manipulation, dry needling, and cupping-massage therapy.',
    'At Samimi Sports Club, she personally leads all Reformer Pilates sessions. Through a physiotherapist''s lens, she reads each client''s posture, muscular imbalances and movement patterns, and adapts exercises individually. This approach offers a depth of awareness that ordinary pilates instructors cannot match.',
    'Her coaching philosophy is rooted in empathy, trust, and a person-centered approach. She aims to contribute to each client''s quality of life — treating sports practice as a journey of healing and growth.'
  ],
  certifications = array[
    'Fizik Tedavi ve Rehabilitasyon Lisansı — Dokuz Eylül Üniversitesi',
    'Manuel Terapi (MPT)',
    'Kinezyo Bantlama',
    'Mobilizasyon',
    'Manipülasyon',
    'Kuru İğneleme',
    'Hacamat - Kupa Masajı',
    'Klinik Pilates'
  ],
  specialties = array[
    'Reformer Pilates',
    'Sporcu Fizyoterapisi',
    'Ortopedik Rehabilitasyon',
    'Manuel Terapi',
    'Postür Düzeltme',
    'Hamilelik Sonrası Pilates'
  ],
  updated_at = now()
where slug = 'beyza-erdas';

-- =============================================================
-- 3) FAQ updates — 4 entries (3 update, 1 new)
-- =============================================================

-- SORU 1: Duş ve soyunma odası var mı? (reuses key 'facility-locker')
insert into public.faqs (
  key, category, question_tr, question_en, answer_tr, answer_en,
  link_href, link_label_tr, link_label_en, order_index, active
) values (
  'facility-locker', 'facility',
  'Duş ve soyunma odası var mı?',
  'Is there a shower and changing room?',
  'Evet, salonumuzda duş ve soyunma odası bulunmaktadır. Antrenmandan sonra rahatça duş alıp temizlenebilirsiniz.',
  'Yes, our facility has both shower and changing rooms. You can comfortably shower and freshen up after your training.',
  null, null, null, 8, true
)
on conflict (key) do update set
  question_tr = excluded.question_tr, question_en = excluded.question_en,
  answer_tr   = excluded.answer_tr,   answer_en   = excluded.answer_en,
  active = true, updated_at = now();

-- SORU 2: Reformer Pilates için ödeme (reuses 'payment-method')
insert into public.faqs (
  key, category, question_tr, question_en, answer_tr, answer_en,
  link_href, link_label_tr, link_label_en, order_index, active
) values (
  'payment-method', 'payment',
  'Reformer Pilates için ödeme nasıl yapılır?',
  'How is payment made for Reformer Pilates?',
  'Reformer Pilates derslerinde ödeme peşin veya IBAN yoluyla yapılabilir. Minimum 8 seans alımı gereklidir. Diğer branşlar için detaylı bilgi almak üzere WhatsApp''tan iletişime geçebilirsiniz.',
  'Payment for Reformer Pilates can be made in cash or via bank transfer (IBAN). A minimum of 8 sessions must be purchased. For detailed information about other disciplines, please contact us via WhatsApp.',
  null, null, null, 14, true
)
on conflict (key) do update set
  question_tr = excluded.question_tr, question_en = excluded.question_en,
  answer_tr   = excluded.answer_tr,   answer_en   = excluded.answer_en,
  active = true, updated_at = now();

-- SORU 3: Çocuk jimnastiği veli izleme (reuses 'classes-parents-watch')
insert into public.faqs (
  key, category, question_tr, question_en, answer_tr, answer_en,
  link_href, link_label_tr, link_label_en, order_index, active
) values (
  'classes-parents-watch', 'classes',
  'Çocuk jimnastiğinde veliler dersi izleyebilir mi?',
  'Can parents watch the kids gymnastics class?',
  'Evet. Çocuk jimnastiği seanslarını velilerimiz camekanlı oturma alanımızdan rahatça izleyebilirler. Hem çocuğunuzu görüp güvende hissedebilir, hem de gelişimini takip edebilirsiniz.',
  'Yes. Parents can comfortably watch kids gymnastics sessions from our glass-enclosed seating area. You can see your child, feel reassured of their safety, and follow their development.',
  null, null, null, 7, true
)
on conflict (key) do update set
  question_tr = excluded.question_tr, question_en = excluded.question_en,
  answer_tr   = excluded.answer_tr,   answer_en   = excluded.answer_en,
  active = true, updated_at = now();

-- SORU 4: Taekwondo/Boks/Okçuluk veli izleme (NEW key)
insert into public.faqs (
  key, category, question_tr, question_en, answer_tr, answer_en,
  link_href, link_label_tr, link_label_en, order_index, active
) values (
  'classes-parents-watch-others', 'classes',
  'Taekwondo, Boks ve Okçuluk derslerinde veliler izleyebilir mi?',
  'Can parents watch Taekwondo, Boxing and Archery classes?',
  'Evet, tüm branşlarımızda velilerimiz dersleri rahatlıkla izleyebilirler. Salonumuz, ailelerin antrenmanları takip edebileceği şekilde tasarlanmıştır.',
  'Yes, parents can comfortably observe sessions in all our disciplines. Our facility is designed to allow families to follow training.',
  null, null, null, 16, true
)
on conflict (key) do update set
  question_tr = excluded.question_tr, question_en = excluded.question_en,
  answer_tr   = excluded.answer_tr,   answer_en   = excluded.answer_en,
  active = true, updated_at = now();

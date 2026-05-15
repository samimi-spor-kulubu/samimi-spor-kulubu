export const BLOG_CATEGORIES = [
  'training',
  'nutrition',
  'pilates',
  'martial-arts',
  'kids-sports',
  'general'
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export type BlogPostLocalized = {
  title: string;
  excerpt: string;
  content: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  category: BlogCategory;
  author: string;
  date: string; // ISO YYYY-MM-DD
  image: string; // empty = placeholder
  readTime: number; // minutes
  tr: BlogPostLocalized;
  en: BlogPostLocalized;
};

export type LocalizedBlogPost = Omit<BlogPost, 'tr' | 'en'> & BlogPostLocalized;

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'reformer-pilates-nedir',
    slug: 'reformer-pilates-nedir',
    category: 'pilates',
    author: 'Beyza Erdaş',
    date: '2026-05-10',
    image: '',
    readTime: 6,
    tr: {
      title: 'Reformer Pilates Nedir? Yeni Başlayanlar İçin Rehber',
      excerpt:
        'Reformer pilates yaylı bir tezgah üzerinde yapılan kontrollü hareketler bütünüdür. Bu rehberde temelleri, kimler için uygun olduğunu ve ilk seansta neler olduğunu anlatıyorum.',
      content: `## Reformer pilates nedir?

Reformer pilates, yaylı bir tezgah üzerinde yapılan kontrollü hareketler bütünüdür. Yer pilatesinden farklı olarak ek direnç sağlayan yaylar ve kayışlar kullanır.

## Kimler için uygundur?

- Postür problemi olanlar
- Düşük tempolu ama etkili çalışmak isteyenler
- Sakatlık sonrası dönenler (fizyoterapist önerisiyle)
- Hamile veya doğum sonrası dönemde olanlar

## Bir seansta neler olur?

İlk seans değerlendirme ile başlar. Postür analizi yapılır, hedeflere göre program çizilir. Devamında ısınma, ana çalışma ve esneme bloklarıyla yaklaşık 50 dakikalık bir akış izlenir.

## Sonuç

Düzenli reformer pilates **postür**, **core gücü** ve **esneklik** üzerinde belirgin kazanım sağlar. Haftada 2 seans, 8 haftalık döngülerle anlamlı sonuç görülür.`
    },
    en: {
      title: 'What Is Reformer Pilates? A Beginner’s Guide',
      excerpt:
        'Reformer pilates is a controlled movement practice on a spring-loaded carriage. Here are the basics, who it suits, and what your first session looks like.',
      content: `## What is reformer pilates?

Reformer pilates is a controlled movement practice performed on a spring-loaded carriage. Unlike mat pilates, it adds resistance through springs and straps.

## Who is it for?

- People with postural issues
- Anyone who wants effective low-impact work
- Post-injury rehab (with a physiotherapist's clearance)
- Pre- and post-natal periods

## What happens in a session?

The first session starts with an assessment. Postural analysis is followed by a program tailored to your goals. After that, sessions flow through warm-up, main work and stretching for about 50 minutes.

## Bottom line

Regular reformer pilates produces clear gains in **posture**, **core strength** and **mobility**. Two sessions a week over 8-week cycles bring meaningful results.`
    }
  },
  {
    id: 'taekwondo-cocuk-gelisimi',
    slug: 'taekwondo-cocuk-gelisimi',
    category: 'kids-sports',
    author: 'Esat Mahmut Akın',
    date: '2026-05-05',
    image: '',
    readTime: 5,
    tr: {
      title: 'Taekwondo Çocukların Gelişimine Nasıl Katkı Sağlar?',
      excerpt:
        'Disiplin, denge, refleks ve özgüven — Taekwondo çocuk gelişiminin birçok alanına dokunur. Hangi yaşta başlanmalı ve neler kazanılır?',
      content: `## Disiplin ve özgüven

Taekwondo, çocukların dış dünyaya açıldığı ilk yapılandırılmış ortamlardan biri olabilir. Belirli kurallar, selamlama ritüelleri ve hocaya saygı içsel disiplinin temellerini atar.

## Fiziksel gelişim

- **Denge:** Tekme teknikleri tek ayak üstünde stabil durmayı öğretir.
- **Refleks:** Eşli çalışmalarda algıyı ve tepki hızını geliştirir.
- **Esneklik:** Kuşak ilerledikçe esneme rutinleri kalıcı hale gelir.

## Sosyal kazanımlar

Çocuk, kuşak sınavlarıyla başarı duygusunu erkenden tanır. Grup içi çalışma takım ruhu kazandırır.

## Hangi yaşta başlamalı?

5–7 yaş aralığı motor öğrenme için ideal. Daha küçük yaşlar oyun bazlı desteklenir; ergenlik döneminde teknik derinlik artar.`
    },
    en: {
      title: 'How Taekwondo Supports a Child’s Development',
      excerpt:
        'Discipline, balance, reflexes and confidence — taekwondo touches many areas of child development. When to start and what kids gain.',
      content: `## Discipline and confidence

Taekwondo can be one of the first structured environments a child enters outside the home. Clear rules, greeting rituals and respect for the coach build the foundations of inner discipline.

## Physical development

- **Balance:** Kicking techniques teach stable single-leg stance.
- **Reflexes:** Partner drills sharpen perception and reaction time.
- **Mobility:** As the belt progresses, stretching routines stick.

## Social gains

Belt tests give kids early exposure to achievement. Group work builds team spirit.

## When to start?

Ages 5–7 are ideal for motor learning. Younger ages are supported through play; technical depth grows from adolescence onward.`
    }
  },
  {
    id: 'boks-kick-boks-secimi',
    slug: 'boks-kick-boks-secimi',
    category: 'martial-arts',
    author: 'Esat Mahmut Akın',
    date: '2026-04-28',
    image: '',
    readTime: 4,
    tr: {
      title: 'Boks ve Kick Boks: Hangi Branş Sana Uygun?',
      excerpt:
        'Aynı kökten gelseler de boks ve kick boks farklı odaklara sahip. Hangisi sana uygun, kısa bir karşılaştırma.',
      content: `## Hangi branş kim için?

Boks ve kick boks aynı kökten gelse de odakları farklı.

## Boks

- Yalnızca yumruk teknikleri
- Yüksek üst vücut gücü
- Hızlı refleks ve baş hareketi
- Kondisyon ve dayanıklılığı keskinleştirir

## Kick boks

- Yumruk + tekme + diz
- Tam vücut koordinasyonu
- Daha yüksek alt vücut esnekliği
- Karma sporlara doğal köprü

## Karar verirken

Üst vücudunu daha çok geliştirmek istiyorsan **boks**. Tam vücut çalışması ve esneklik kazandıran bir karma antrenman arıyorsan **kick boks**. Kararsızsan deneme seansıyla başla.`
    },
    en: {
      title: 'Boxing vs. Kickboxing: Which One Suits You?',
      excerpt:
        'Same roots, different focus. A short comparison to help you choose between boxing and kickboxing.',
      content: `## Which one for whom?

Boxing and kickboxing share roots but focus differently.

## Boxing

- Punch techniques only
- Strong upper-body work
- Quick reflexes and head movement
- Sharpens conditioning and endurance

## Kickboxing

- Punches + kicks + knees
- Full-body coordination
- Greater lower-body mobility
- Natural bridge to mixed disciplines

## Making the call

If you want to develop your upper body, pick **boxing**. If you want full-body work with mobility, pick **kickboxing**. Undecided? Start with a trial session.`
    }
  },
  {
    id: 'geleneksel-okculuk-tarihi',
    slug: 'geleneksel-okculuk-tarihi',
    category: 'general',
    author: 'Samimi Spor Kulübü',
    date: '2026-04-22',
    image: '',
    readTime: 5,
    tr: {
      title: 'Geleneksel Türk Okçuluğunun Tarihi ve Faydaları',
      excerpt:
        'Orta Asya bozkırlarından Anadolu’ya uzanan bir miras. Tirendaz yaklaşımı, kazanımları ve ilk derste seni neler bekliyor.',
      content: `## Köklü bir gelenek

Türk geleneksel okçuluğu, Orta Asya bozkırlarından Anadolu'ya uzanan binlerce yıllık bir miras. **Tirendaz** yaklaşımı baş parmak çekişi ve duruşuyla diğer ekollerden ayrılır.

## Faydaları

- **Konsantrasyon:** Hedef çalışması zihni bugünde tutar.
- **Postür:** Omuz, sırt ve karın kası birlikte çalışır.
- **Nefes kontrolü:** Atışta nefesi tutmak, yoga benzeri bir disipline alıştırır.

## Ekipman

Tüm ekipman salonda mevcut. Sen sadece rahat kıyafetle gel. Sezon sonunda kişisel yay satın almak isteyenlere rehberlik ederiz.

## İlk derste

Güvenlik bilgisi, duruş, çekiş ve hedef mesafesine aşamalı geçiş yapılır.`
    },
    en: {
      title: 'Traditional Turkish Archery: History and Benefits',
      excerpt:
        'A heritage from the Central Asian steppes to Anatolia. The tirendaz approach, what you gain, and what to expect in your first class.',
      content: `## A long tradition

Turkish traditional archery is a heritage spanning thousands of years from the Central Asian steppes to Anatolia. The **tirendaz** approach is set apart by its thumb draw and stance.

## Benefits

- **Focus:** Target work keeps the mind in the present.
- **Posture:** Shoulders, back and core work together.
- **Breath control:** Holding the breath at release is its own discipline.

## Equipment

All equipment is provided at the studio — just come in comfortable clothes. We guide those who want a personal bow later.

## First class

Safety briefing, stance, draw and a gradual move to target distance.`
    }
  },
  {
    id: 'antrenman-oncesi-beslenme',
    slug: 'antrenman-oncesi-beslenme',
    category: 'nutrition',
    author: 'Beyza Erdaş',
    date: '2026-04-15',
    image: '',
    readTime: 4,
    tr: {
      title: 'Antrenman Öncesi Beslenme Önerileri',
      excerpt:
        'Ne zaman, ne yemeli? Antrenman öncesi öğün zamanlaması ve kaçınılması gerekenler.',
      content: `## Ne zaman ne yemeli?

Antrenmandan **2–3 saat önce**: karbonhidrat ağırlıklı dengeli öğün — pilav, tam tahıllı ekmek, sebze, az yağlı protein.

Antrenmandan **30–60 dakika önce**: meyve + yoğurt veya muz + bir avuç kuruyemiş.

## Kaçınılması gerekenler

- Aşırı yağlı ve kızartma ürünler
- Çok lif (mide rahatsızlığı yapabilir)
- Yeni denenen besinler

## Sıvı

200–300 ml su ile başla. Yoğun çalışacaksan elektrolit ekle.

## Vücudunu dinle

Herkesin sindirim hızı farklı. 1–2 deneyim sonra senin için en uygun zamanlamayı bulursun.`
    },
    en: {
      title: 'Pre-Workout Nutrition Tips',
      excerpt:
        'When and what to eat? Timing your pre-workout meal and what to avoid.',
      content: `## When to eat what?

**2–3 hours before** training: a balanced, carb-leaning meal — rice, whole-grain bread, vegetables, lean protein.

**30–60 minutes before**: fruit + yogurt, or a banana + a handful of nuts.

## What to avoid

- Heavy fried foods
- Excess fiber (can upset the stomach)
- New foods you haven't tried

## Hydration

Start with 200–300 ml of water. Add electrolytes if you'll work hard.

## Listen to your body

Digestion speeds vary. After 1–2 sessions, you'll find the timing that works for you.`
    }
  },
  {
    id: 'cocuklar-icin-spor-yas',
    slug: 'cocuklar-icin-spor-yas',
    category: 'kids-sports',
    author: 'Samimi Spor Kulübü',
    date: '2026-04-08',
    image: '',
    readTime: 5,
    tr: {
      title: 'Çocuklar İçin Spor: Hangi Yaşta Hangi Branş?',
      excerpt:
        'Çocukların gelişim dönemlerine göre uygun spor branşları. 3 yaştan ergenlik sonrasına kısa bir rehber.',
      content: `## 3–5 yaş

Spor değil **oyun**. Koşma, atlama, dengeleme. Genel motor gelişim. Jimnastik ve hareket dersleri ideal.

## 6–9 yaş

Spesifik beceri öğrenme dönemi. **Taekwondo**, **jimnastik**, yüzme, basketbol. Tek branşa fanatik bağlanma değil çeşitlilik öne çıksın.

## 10–13 yaş

Tercih netleşir. **Boks/kick boks**, **okçuluk** gibi disiplin gerektiren branşlar açılabilir. Performans hedefli antrenmana geçilebilir.

## 14+ yaş

Yetişkin sporu sayılır. Tüm branşlar açık. Hedef: sürdürülebilirlik ve zevk.`
    },
    en: {
      title: 'Sports for Kids: Which Discipline at Which Age?',
      excerpt:
        'Age-appropriate sports for children. A short guide from age 3 through adolescence.',
      content: `## Ages 3–5

Not sport, **play**. Running, jumping, balancing. General motor development. Gymnastics and movement classes are ideal.

## Ages 6–9

Specific-skill learning window. **Taekwondo**, **gymnastics**, swimming, basketball. Favor variety over fanatical commitment to a single discipline.

## Ages 10–13

Preferences sharpen. Disciplines like **boxing/kickboxing** and **archery** can open up. Performance-oriented training becomes possible.

## Age 14+

Essentially adult sport. All disciplines are open. Goal: sustainability and enjoyment.`
    }
  }
];

export const BLOG_BY_SLUG: Record<string, BlogPost> = Object.fromEntries(
  BLOG_POSTS.map((p) => [p.slug, p])
);

export function localizePost(
  post: BlogPost,
  locale: string
): LocalizedBlogPost {
  const t = locale === 'en' ? post.en : post.tr;
  return {
    id: post.id,
    slug: post.slug,
    category: post.category,
    author: post.author,
    date: post.date,
    image: post.image,
    readTime: post.readTime,
    title: t.title,
    excerpt: t.excerpt,
    content: t.content
  };
}

export function getRelatedPosts(
  current: BlogPost,
  count = 3
): BlogPost[] {
  const sameCategory = BLOG_POSTS.filter(
    (p) => p.category === current.category && p.slug !== current.slug
  );
  if (sameCategory.length >= count) return sameCategory.slice(0, count);
  const others = BLOG_POSTS.filter(
    (p) => p.slug !== current.slug && p.category !== current.category
  ).sort((a, b) => (a.date < b.date ? 1 : -1));
  return [...sameCategory, ...others].slice(0, count);
}

export const BLOG_POSTS_PER_PAGE = 9;

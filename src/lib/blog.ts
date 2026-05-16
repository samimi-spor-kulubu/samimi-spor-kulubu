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
    readTime: 8,
    tr: {
      title: 'Reformer Pilates Nedir? Yeni Başlayanlar İçin Rehber',
      excerpt:
        'Reformer pilates yaylı bir tezgah üzerinde yapılan kontrollü hareketler bütünüdür. Bu rehberde temelleri, kimler için uygun olduğunu ve ilk seansta neler olduğunu anlatıyorum.',
      content: `Reformer pilates, son yıllarda Ankara'da en hızlı büyüyen egzersiz yöntemlerinden biri haline geldi. Hem fizyoterapistlerin önerdiği güvenli bir hareket sistemi olması hem de düşük tempolu yapısına rağmen güçlü sonuçlar vermesi, ilgiyi besleyen iki ana sebep. Bu rehberde reformer pilatesi A'dan Z'ye anlatıyorum: ne olduğu, nasıl çalıştığı, kimler için uygun olduğu ve ilk seansında seni neler beklediği.

## Reformer pilates nedir?

Reformer pilates, **reformer** adı verilen, yaylar ve kayışlarla donatılmış özel bir tezgah üzerinde yapılan kontrollü egzersiz pratiğidir. Joseph Pilates'in 20. yüzyılın başlarında geliştirdiği yöntemin modern bir uzantısıdır. Yer (mat) pilatesinden farkı; ek dirence sahip yayların hareket sırasında hem dirençli hem destekleyici rol üstlenmesidir.

Reformer üzerinde yapılan her hareket; **derin core kasları** (transversus abdominis, multifidus, pelvik taban), **omuz stabilizatörleri** ve **postür kasları** ile koordineli çalışır. Bu sayede yüzeysel kaslardan değil, gerçek anlamda “merkezden” bir güç inşa edilir.

## Kimler için uygundur?

Reformer pilates, popüler inanışın aksine sadece esnek ya da deneyimli kişiler için değildir. Aşağıdaki gruplar reformerden özellikle yararlanır:

- **Postür problemi yaşayanlar:** Masa başı çalışanlar, sürekli telefon kullananlar, omuz çökmesi ya da kifoz problemi yaşayanlar için ideal.
- **Düşük etkili egzersiz arayanlar:** Eklem yükü minimumdur. Diz, bel ve omuz şikayeti olanlar genellikle güvenle yapabilir.
- **Sakatlık sonrası rehabilitasyon:** Fizyoterapist eşliğinde yapıldığında, kontrollü direnç sayesinde dönüş sürecini hızlandırır.
- **Hamile ve doğum sonrası dönemdekiler:** Pelvik taban ve derin karın kasları için en güvenli yöntemlerden biridir.
- **Performans sporu yapanlar:** Koşucular, dövüş sanatçıları ve okçular core stabilitesi için reformeri ek antrenman olarak kullanır.

## İlk seansta seni ne bekliyor?

İlk seans her zaman bir **değerlendirme** ile başlar. Eğitmenin (Samimi Spor Kulübü'nde Fizyoterapist Beyza Erdaş) sana birkaç soru sorar: ağrı geçmişin var mı, hangi sporları yapıyorsun, ne hedefliyorsun, postürün nasıl. Ardından ayakta ve yatarken kısa bir postür analizi yapılır.

Sonrasında akış şu şekilde ilerler:

1. **Isınma (5–8 dakika):** Nefes çalışması ve omurga mobilizasyonu.
2. **Ana çalışma (30–35 dakika):** Hedefe göre 6–10 farklı egzersiz. Genelde alt vücut, üst vücut, core ve denge için ayrı bloklar.
3. **Esneme ve soğuma (5–10 dakika):** Çalıştığın kasları gevşetip nefesini dengelemek.

Toplam süre yaklaşık **50 dakika**. İlk seansın sonunda hafif bir kas yorgunluğu hissetmen normaldir; ertesi gün gelen tutulma birinci hafta sık olur, ikinci haftadan itibaren azalır.

## Ne giymeli, ne getirmelisin?

- **Kıyafet:** Esnek ve vücuda oturan tayt + tişört. Fazla bol kıyafet eğitmenin hareketini görmesini zorlaştırır.
- **Çorap:** Pilates çorabı (alt tarafı silikonlu) önerilir. Çıplak ayak da kabul edilir.
- **Su:** Yanında bir matara olsun.
- **Saç:** Uzunsa toplu olsun; başı geriye yatırma egzersizlerinde rahat olursun.

## Sonuçları ne zaman görürsün?

Düzenli reformer pilates **postür düzelmesi**, **core gücü** ve **esneklik** üzerinde belirgin kazanım sağlar. Genel kurallar:

- **Haftada 2 seans, 8 haftalık döngülerle** anlamlı sonuç görülür.
- İlk 2 hafta: vücudun yöntemi öğrenir, “güç farkı” değil “farkındalık farkı” hissedersin.
- 4–6 hafta arası: postürel değişiklikler ve core stabilitesi belirginleşir.
- 8 hafta sonunda: çevren fark eder.

Tek seferlik çalışmalardan değil, **sürekliliğin getirdiği birikimden** bahsediyoruz. Reformer pilates bir “mucize” değil, akıllı yapılandırılmış bir araçtır.

## Reformer pilates ve diğer egzersizler

Reformer pilates **kardiyo egzersizinin yerini almaz**. Yağ yakmaya veya zayıflamaya odaklıysan, reformeri tek başına değil; haftalık 1–2 yürüyüş, koşu ya da bisikletle birlikte yapman daha etkili olur. Buna karşılık postür, core ve esneklik için diğer pek çok yöntemden çok daha doğrudan sonuç verir.

## Samimi Spor Kulübü'nde reformer pilates

Samimi Spor Kulübü Ankara Yenimahalle Demet'te, **bayanlara özel** reformer pilates stüdyomuzda profesyonel reformer makineleri ile çalışıyoruz. Eğitmenimiz Fizyoterapist Beyza Erdaş (Dokuz Eylül Üniversitesi mezunu), her yeni başlayana özel değerlendirme yapar. Seanslar **8 derslik paketler** halinde satılır; haftada 2 seans planlanarak yaklaşık bir aylık bir programa yayılır.

İlk seansından emin değilsen, **WhatsApp'tan yazıp** bir deneme görüşmesi ayarlayabilirsin. Programını birlikte planlar, uygun gün ve saati netleştiririz. Detaylı paket fiyatları ve kampanyalar için Reformer Pilates sayfasına göz at.`
    },
    en: {
      title: 'What Is Reformer Pilates? A Beginner’s Guide',
      excerpt:
        'Reformer pilates is a controlled movement practice on a spring-loaded carriage. Here are the basics, who it suits, and what your first session looks like.',
      content: `Reformer pilates has become one of the fastest-growing exercise methods in Ankara in recent years. The reasons are simple: it is a safe movement system endorsed by physiotherapists, and despite its slow tempo it delivers strong results. In this guide I walk through reformer pilates from A to Z — what it is, how it works, who it suits, and what to expect in your first session.

## What is reformer pilates?

Reformer pilates is a controlled exercise practice performed on a **reformer** — a special carriage equipped with springs, ropes and straps. It is a modern extension of the method Joseph Pilates developed in the early 20th century. The key difference from mat pilates is that the springs act both as resistance and as support during every movement.

Every exercise on the reformer coordinates the **deep core muscles** (transversus abdominis, multifidus, pelvic floor), the **shoulder stabilisers** and the **postural muscles**. The result is real strength built from the center, not from superficial muscles.

## Who is it for?

Contrary to popular belief, reformer pilates is not reserved for the flexible or the experienced. The following groups benefit especially:

- **People with postural problems:** Desk workers, heavy phone users, anyone with rounded shoulders or kyphosis.
- **Those seeking low-impact exercise:** Joint load is minimal. People with knee, lower-back or shoulder issues can usually train safely.
- **Post-injury rehabilitation:** When led by a physiotherapist, controlled resistance accelerates the return process.
- **Pre- and post-natal:** One of the safest methods for the pelvic floor and deep abdominals.
- **Performance athletes:** Runners, martial artists and archers use the reformer for core stability as supplementary training.

## What to expect in your first session

The first session always begins with an **assessment**. Your trainer (at Samimi Sports Club, physiotherapist Beyza Erdaş) asks a few questions: any history of pain, what sports you do, what your goals are, how your posture looks. A short standing-and-lying postural analysis follows.

The flow then runs roughly like this:

1. **Warm-up (5–8 minutes):** Breath work and spinal mobility.
2. **Main work (30–35 minutes):** Six to ten exercises tailored to your goals — usually separate blocks for the lower body, upper body, core and balance.
3. **Stretch and cool-down (5–10 minutes):** Releasing the muscles you worked and settling the breath.

Total length: around **50 minutes**. Mild muscle fatigue afterwards is normal; the delayed soreness is more common in the first week and fades from the second week onward.

## What to wear and bring

- **Clothes:** Stretchy, fitted leggings and a t-shirt. Loose clothing makes it harder for the trainer to see your alignment.
- **Socks:** Pilates socks with grip are recommended. Bare feet are also fine.
- **Water:** Bring a bottle.
- **Hair:** Tie long hair back so you stay comfortable during head-tilt movements.

## When will you see results?

Regular reformer pilates produces clear improvements in **posture**, **core strength** and **mobility**. The general guidelines:

- **Two sessions per week over 8-week cycles** deliver meaningful change.
- First two weeks: your body learns the method — what shifts is awareness, not yet strength.
- Weeks four to six: postural changes and core stability become noticeable.
- After eight weeks: the people around you notice.

This is not a one-off intervention; the gains come from **the compounding of consistency**. Reformer pilates is not a miracle — it is a smartly structured tool.

## Reformer pilates and other forms of exercise

Reformer pilates **does not replace cardio**. If your focus is fat loss or weight management, pair the reformer with 1–2 walks, runs or bike rides per week — it will be more effective than the reformer alone. That said, for posture, core and mobility, it produces more direct results than almost any alternative.

## Reformer pilates at Samimi Sports Club

At Samimi Sports Club in Ankara Yenimahalle Demet, we run a **women-only** reformer pilates studio with professional reformer machines. Our trainer, physiotherapist Beyza Erdaş (Dokuz Eylül University graduate), conducts an individual assessment for every new client. Sessions are sold as **8-class packages**, scheduled at two sessions per week — roughly a one-month program.

If you are unsure about starting, **message us on WhatsApp** and we'll set up a discovery call. We'll plan your program together and lock in the right day and time. For full package pricing and current promotions, see the Reformer Pilates page.`
    }
  },
  {
    id: 'taekwondo-cocuk-gelisimi',
    slug: 'taekwondo-cocuk-gelisimi',
    category: 'kids-sports',
    author: 'Esat Mahmut Akın',
    date: '2026-05-05',
    image: '',
    readTime: 8,
    tr: {
      title: 'Taekwondo Çocukların Gelişimine Nasıl Katkı Sağlar?',
      excerpt:
        'Disiplin, denge, refleks ve özgüven — Taekwondo çocuk gelişiminin birçok alanına dokunur. Hangi yaşta başlanmalı ve neler kazanılır?',
      content: `Çocuğunuzu bir spora yazdırmaya karar verdiğiniz an, anne-baba olarak en çok sorduğunuz soru genelde aynıdır: “Hangi branş onun için en faydalısı olur?” Taekwondo, bu sorunun yıllardır verilen en güçlü cevaplarından biri. Sadece fiziksel değil; zihinsel ve sosyal gelişimin birçok katmanına aynı anda dokunur. Ankara Yenimahalle Demet'teki Samimi Spor Kulübü'nde yıllardır taekwondo derslerini yöneten bir eğitmen olarak, bu yazıda çocukların taekwondo yoluyla neler kazandığını adım adım anlatıyorum.

## Disiplin ve özgüven temelleri

Taekwondo, çocuğun ev dışında karşılaştığı ilk yapılandırılmış ortamlardan biri olabilir. Selamlama ritüelleri, üniformanın doğru giyilmesi, hocaya saygı, sıra bekleme ve grup içinde konumlanma — bunların hepsi içsel disiplinin küçük yapı taşlarıdır. Çocuk önce kuralları öğrenir; sonra kuralların **neden var olduğunu** anlar.

Kuşak sistemi bu süreci somutlaştırır. Beyaz kuşaktan başlayarak çocuk:

- **Hedef koymayı** öğrenir (bir sonraki sınav)
- Hedefe ulaşmak için **çalışmayı** ve **sabretmeyi** deneyimler
- Başarıyı bir madalya olarak değil; kazanılan bir kuşak olarak görür

Bu, hayat boyu sürecek bir tutumun ilk filizleridir.

## Fiziksel gelişim

Çocukluk dönemi motor öğrenmenin altın çağıdır. Taekwondo bu pencereyi en verimli şekilde kullanır:

- **Denge:** Tekme teknikleri tek ayak üstünde stabil durmayı öğretir. Bu beceri, yetişkinlikte düşme önleme refleksinin temelidir.
- **Refleks:** Eşli çalışmalar, blok ve manevra alıştırmaları görsel-motor tepki süresini ciddi şekilde geliştirir.
- **Esneklik:** Kuşak ilerledikçe esneme rutinleri günlük hayatın parçası olur. Çocuğun esnekliği yetişkinliğe kadar korunur.
- **Kondisyon:** Yüksek tempolu setler nefes kontrolü ve kalp-damar sağlığını destekler.
- **Koordinasyon:** El-ayak-göz koordinasyonu, diğer sporlara da pozitif aktarım sağlar.

## Sosyal kazanımlar

Spor salonunda çocuk; **kendinden büyük çocuklar**, **kendinden küçük çocuklar** ve **yetişkin bir otorite figürü** ile aynı anda etkileşim kurar. Bu, sadece okulun veremeyeceği bir sosyal zenginliktir.

- Grup içi çalışmalar takım ruhu kazandırır.
- Eşli çalışmalar, kontrol ve empati öğretir (“karşımdakine zarar vermeden çalışmak”).
- Sınavlar performans baskısını sağlıklı dozda tanıtır.

Utangaç çocukların ilk birkaç ay içinde sınıfta nasıl açıldığını, çekingen çocukların kuşak ilerledikçe nasıl liderlik özelliği geliştirdiğini sayısız kez görüyoruz.

## Zihinsel kazanımlar

Taekwondo bir “zihin sporu” olarak da değerlendirilebilir. Çocuk:

- Karmaşık hareket dizilerini (poomsae) ezberleyerek **bellek kapasitesini** geliştirir.
- Tekniği uygularken **dikkati yönlendirmeyi** öğrenir.
- Hata yaptığında **panikleme yerine düzeltme** refleksi kazanır.

Bu beceriler okul başarısına da olumlu yansır. Velilerimizden sık duyduğumuz bir geri bildirim: “Taekwondo'ya başladıktan sonra dersi dinleme süresi uzadı.”

## Hangi yaşta başlamalı?

Her çocuk farklıdır ama genel rehber şudur:

- **5–7 yaş:** Motor öğrenme için ideal pencere. Oyun-bazlı yaklaşımla teknik temelleri.
- **8–11 yaş:** Tam program. Hem teknik derinlik hem fiziksel gelişim açısından en verimli dönem.
- **12+ yaş:** Performans ve rekabet odaklı çalışma. Eğer çocuk öncesinden başlamamışsa, bu dönem de tamamen uygundur.

5 yaşından önce ne yapmalı? Yapılandırılmış sporlardan çok serbest oyun ve genel motor gelişim faaliyetleri (jimnastik, yüzme, dans) önerilir.

## Velilerin sık sorduğu sorular

**Çocuğum saldırgan olur mu?**
Hayır. Aksine, taekwondo agresyonu kontrol etmeyi öğretir. Eğitmen sürekli **“gücünü ne zaman kullanırsan kullanmazsın”** vurgusunu yapar. İyi öğretilmiş bir dövüş sanatçısı çatışmadan kaçınmayı öğrenir.

**Yaralanma riski yüksek mi?**
Doğru ekipman, doğru tatami ve uzman eğitmen eşliğinde yapıldığında risk çok düşüktür. Samimi Spor Kulübü'nde tüm kontak çalışmalar koruyucu ekipman ve seviye-uyumlu eşler ile yapılır.

**Haftada kaç gün yeterli?**
Haftada 2–3 gün ideal. Daha fazlası küçük yaşlarda gerek değil; daha azı ise becerinin oturmasını yavaşlatır.

## Samimi Spor Kulübü'nde taekwondo

Ankara Yenimahalle Demet'teki tesisimizde çocuk grupları **Pazartesi/Çarşamba/Cuma 18:00–19:30** saatleri arasında çalışır. Yetişkin grupları aynı saatlerde paralel ilerler. Tüm seviyelere uygun ortam sağlıyoruz; deneme dersi mevcut.

Çocuğunuz için uygun bir başlangıç planlamak istiyorsanız, **WhatsApp'tan yazın**. Yaşına ve karakterine göre nasıl bir giriş yapacağımızı birlikte konuşalım. İlk derste neler olduğunu anlatır, kaygılarınızı netleştiririz.`
    },
    en: {
      title: 'How Taekwondo Supports a Child’s Development',
      excerpt:
        'Discipline, balance, reflexes and confidence — taekwondo touches many areas of child development. When to start and what kids gain.',
      content: `The moment you decide to enroll your child in a sport, the question you most often ask as a parent is the same: “Which discipline will benefit them the most?” For years, taekwondo has been one of the strongest answers to that question. It touches not just physical but also mental and social development at the same time. As a coach who has led taekwondo classes at Samimi Sports Club in Ankara Yenimahalle Demet for years, I walk through what children gain from taekwondo step by step in this article.

## Foundations of discipline and confidence

Taekwondo is often one of the first structured environments a child meets outside the home. Greeting rituals, wearing the uniform correctly, respect for the coach, waiting in line, finding your place in a group — all of these are small building blocks of internal discipline. The child first learns the rules, and then begins to understand **why** they exist.

The belt system makes this process tangible. Starting from white belt, the child:

- Learns to **set goals** (the next exam)
- Experiences **work** and **patience** in service of a goal
- Sees success not as a medal, but as a belt that was earned

These are the first shoots of an attitude that lasts a lifetime.

## Physical development

Childhood is the golden age of motor learning. Taekwondo uses this window with high efficiency:

- **Balance:** Kicking techniques teach stable single-leg posture. This skill is the foundation of fall-prevention reflexes in adulthood.
- **Reflexes:** Partner drills and block-and-counter routines significantly improve visual-motor reaction time.
- **Mobility:** As belts progress, stretching routines become part of daily life. The child's flexibility is preserved into adulthood.
- **Conditioning:** High-tempo sets build breath control and cardiovascular health.
- **Coordination:** Hand-foot-eye coordination transfers positively to other sports.

## Social gains

In the gym, the child interacts with **older children**, **younger children** and **an adult authority figure** all at once. That is a social mix the school environment alone rarely provides.

- Group work develops team spirit.
- Partner work teaches control and empathy (“working with a partner without harming them”).
- Exams introduce performance pressure in healthy doses.

We have seen countless shy children open up in the first few months, and reserved children develop leadership traits as their belt advances.

## Mental gains

Taekwondo can also be considered a “mental sport.” The child:

- Memorises complex movement sequences (poomsae), developing **memory capacity**.
- Learns to **direct attention** while executing technique.
- Builds the reflex of **correcting rather than panicking** when mistakes happen.

These skills also reflect positively in academic performance. A common piece of feedback from parents: “Since starting taekwondo, the time he can pay attention in class has grown.”

## What age should they start?

Every child is different, but the general guide is:

- **Ages 5–7:** The ideal window for motor learning. Play-based technical foundations.
- **Ages 8–11:** Full program. The most productive window for both technical depth and physical development.
- **Ages 12+:** Performance- and competition-focused work. If the child has not started earlier, this period is still completely fine.

What to do before age 5? Free play and general motor development activities (gymnastics, swimming, dance) are more suitable than structured sports.

## Common parent questions

**Will my child become aggressive?**
No. On the contrary, taekwondo teaches them to control aggression. The coach repeatedly emphasises **“when to use your strength and when not to.”** A well-trained martial artist learns to avoid conflict.

**Is the injury risk high?**
With proper equipment, proper tatami and an experienced coach, the risk is very low. At Samimi Sports Club, all contact work is done with protective gear and skill-matched partners.

**How many days per week is enough?**
Two or three days a week is ideal. More than that is unnecessary at younger ages; less than that slows the embedding of skills.

## Taekwondo at Samimi Sports Club

In our Ankara Yenimahalle Demet facility, kids groups train on **Monday/Wednesday/Friday 18:00–19:30**. Adult groups run in parallel in the same window. We accommodate every level, and a trial class is available.

If you'd like to plan the right start for your child, **message us on WhatsApp**. We'll talk through how to introduce them based on their age and personality, walk you through what happens in the first class, and clear up any concerns.`
    }
  },
  {
    id: 'boks-kick-boks-secimi',
    slug: 'boks-kick-boks-secimi',
    category: 'martial-arts',
    author: 'Esat Mahmut Akın',
    date: '2026-04-28',
    image: '',
    readTime: 7,
    tr: {
      title: 'Boks ve Kick Boks: Hangi Branş Sana Uygun?',
      excerpt:
        'Aynı kökten gelseler de boks ve kick boks farklı odaklara sahip. Hangisi sana uygun, kısa bir karşılaştırma ve karar rehberi.',
      content: `Salona yeni gelen birçok kişinin sorduğu klasik soru: “Boks mu yapayım, kick boks mu?” İkisi de eldiven sporu, ikisi de yüksek tempolu, ikisi de kalorinin hızla yandığı çalışmalar. Ama gözüktüklerinden çok daha farklı odaklara sahipler. Bu yazıda iki branşın benzerliklerini ve ayrımlarını netleştirip, sana uygun olanı seçmen için bir karar rehberi sunuyorum.

## Ortak nokta: temel kondisyon

Hem boks hem kick boks; tempo, dayanıklılık ve refleks üzerine kurulu sporlardır. Her ikisi de:

- Kalp-damar kapasitesini hızla geliştirir
- Üst vücut gücünü ve dayanıklılığını artırır
- Reaksiyon hızını keskinleştirir
- Stresi etkili şekilde boşaltır
- Öz savunma açısından temel beceriler sağlar

Yani yanlış seçim yapma korkusu olmasın — hangisini seçersen seç, kondisyon kazanacaksın. Asıl fark, **odakta** ve **çalışma türünde**.

## Boks: yumruğun sanatı

Boks **sadece yumruk tekniklerini** kullanır. Bu kısıtlama, ona derin bir teknik zenginlik kazandırır. Sadece dört temel yumrukla (jab, cross, hook, uppercut) yüzlerce farklı kombinasyon oluşur.

Boks antrenmanında daha çok şunlar vurgulanır:

- **Üst vücut gücü:** Omuz, sırt, göğüs, kollar.
- **Bel ve kalça rotasyonu:** Gerçek güç buradan gelir.
- **Ayak hareketleri:** İleri-geri-yan adımlar, mesafe yönetimi.
- **Baş hareketi:** Slip, duck ve roll — gelen yumruktan kaçmanın temelleri.
- **Kombinasyon zekası:** “Önce ne, sonra ne, ne zaman çık?”

Boks zihinsel olarak da yorucudur — gerçek anlamda satranç gibi düşünmen gerekir. Kim daha hızlı düşünür, kim daha akıllı kombinasyon kurar — fark orada açılır.

## Kick boks: tüm vücudun savaşı

Kick boks **yumruk + tekme + diz** tekniklerini birleştirir. Bazı stillerde dirsek de eklenir. Sonuç olarak çok daha geniş bir hareket dağarcığı ortaya çıkar.

Kick boks antrenmanında öne çıkanlar:

- **Alt vücut esnekliği:** Yüksek tekmeler için kalça mobilitesi kritik.
- **Tam vücut koordinasyonu:** El ve ayak aynı anda farklı görevler üstlenir.
- **Denge:** Tekme atarken stabil kalmak başlı başına bir beceri.
- **Bacak gücü:** Quadriceps, hamstring, kalça kasları sürekli çalışır.
- **Esneklik kazancı:** İlk birkaç ayda boy-kollarına bakanlar “sanki uzamışım” der; aslında kalçası açılmıştır.

Kick boks, karma sporlara (MMA) ve diğer dövüş sanatlarına da doğal bir köprüdür.

## Hangisi kim için?

İki branş arasında karar verirken kendine şu soruları sor:

**Boks seç eğer:**
- Üst vücudunu daha çok geliştirmek istiyorsan
- Esneklik problemin varsa ve önce kondisyon istiyorsan
- Hızlı düşünme ve taktik kurmaya ilgi duyuyorsan
- Dizinde veya kalçanda eski bir sakatlığın varsa

**Kick boks seç eğer:**
- Tam vücut çalışması arıyorsan
- Esnekliğini de geliştirmek istiyorsan
- Daha çeşitli teknik öğrenmek istiyorsan
- Karma sporlara veya başka bir dövüş sanatına geçiş planlıyorsan

## Yaygın yanlış inançlar

**“Boks daha güvenlidir.”**
Aslında değil. Hem boks hem kick boks; iyi ekipman ve seviye-uyumlu eşlerle yapıldığında benzer güvenlik seviyesindedir. Kontrolsüz sparring (eşli dövüş) her ikisinde de risklidir.

**“Kadınlar için kick boks zor.”**
Tam tersi. Bayanların kalça mobilitesi genellikle daha iyi olduğu için kick boks teknik açıdan onlara daha hızlı oturur. Salonlarımızda kick boks yapan bayan üye sayısı her geçen yıl artıyor.

**“Önce boks öğren, sonra kick boks'a geç.”**
Şart değil. Doğrudan kick boksla başlayabilirsin. Yumruk tekniklerini zaten kick boks içinde de tam olarak öğrenirsin.

## Kararsızsan: deneme seansı

En iyi karar verme yöntemi — bir deneme dersine gelmek. **Samimi Spor Kulübü Ankara Yenimahalle Demet'te** boks ve kick boks dersleri ortak saatte (**Pazartesi/Çarşamba/Cuma 19:30–21:00**) yapılır. Bir ay süresince hem birini hem diğerini denemek mümkün; ardından kendine uyanı seçersin.

Yeni başlayanlar için temel: ilk hafta tempo seni şaşırtacak. İkinci hafta vücudun alışır. Üçüncü haftadan itibaren teknik geliştirme keyifli hale gelir.

## Başlamak için

Karar verdin, başlamak istiyorsun? **WhatsApp'tan yazıp** uygun gün ve saati birlikte planlayalım. Eldiven ve sargı ilk gelişte salonda bulunur, kendi ekipmanını edinmek için acele etmene gerek yok. Spor kıyafeti, su şişesi ve havlu yeterli.`
    },
    en: {
      title: 'Boxing vs. Kickboxing: Which One Suits You?',
      excerpt:
        'Same roots, different focus. A short comparison and decision guide to help you choose between boxing and kickboxing.',
      content: `The classic question many newcomers ask in the gym: “Should I do boxing or kickboxing?” Both are glove sports, both are high-tempo, both are calorie-burning. But their focus is far more different than it appears. In this article I clarify the similarities and differences between the two disciplines and offer a decision guide so you can choose what fits you.

## Common ground: foundational conditioning

Boxing and kickboxing are both sports built on tempo, endurance and reflexes. Both:

- Quickly develop cardiovascular capacity
- Build upper-body strength and endurance
- Sharpen reaction time
- Discharge stress effectively
- Provide foundational self-defense skills

So there's no fear of making the wrong choice — whichever you pick, you will gain conditioning. The real difference lies in **focus** and **type of work**.

## Boxing: the art of the punch

Boxing uses **only punch techniques**. That constraint gives it deep technical richness. With just four basic punches (jab, cross, hook, uppercut), hundreds of combinations emerge.

In boxing training, the emphasis falls on:

- **Upper-body strength:** Shoulders, back, chest, arms.
- **Hip and waist rotation:** Real power comes from here.
- **Footwork:** Forward, back, lateral steps and distance management.
- **Head movement:** Slip, duck, and roll — the foundation of avoiding incoming punches.
- **Combination intelligence:** “What first, what next, when to exit?”

Boxing is mentally taxing — you really do need to think like a chess player. Whoever thinks faster and builds smarter combinations wins.

## Kickboxing: the whole body in the fight

Kickboxing combines **punches + kicks + knees**. Some styles also add elbows. The result is a much wider movement vocabulary.

What stands out in kickboxing training:

- **Lower-body flexibility:** Hip mobility is critical for high kicks.
- **Full-body coordination:** Hands and feet take on different tasks simultaneously.
- **Balance:** Staying stable while kicking is a skill in itself.
- **Leg strength:** Quads, hamstrings and glutes work constantly.
- **Mobility gains:** After a few months, people look at themselves and think “I feel taller” — what really happened is their hips opened.

Kickboxing is also a natural bridge to MMA and other martial arts.

## Which one suits whom?

When deciding, ask yourself:

**Pick boxing if:**
- You want to develop your upper body more
- You have flexibility issues and want conditioning first
- You enjoy fast thinking and tactical setups
- You have an old injury in your knee or hip

**Pick kickboxing if:**
- You want full-body work
- You also want to improve flexibility
- You want to learn a wider technical vocabulary
- You plan to transition to MMA or another martial art

## Common misconceptions

**“Boxing is safer.”**
Not really. With proper equipment and skill-matched partners, both boxing and kickboxing land at a similar safety level. Uncontrolled sparring is risky in both.

**“Kickboxing is hard for women.”**
The opposite. Because women's hip mobility is generally better, kickboxing technique often sets in faster for them. The number of female members training kickboxing in our gyms grows every year.

**“Learn boxing first, then move to kickboxing.”**
Not necessary. You can start directly with kickboxing. You'll learn the punch techniques fully inside the kickboxing program anyway.

## If you're undecided: trial session

The best way to decide is to come in for a trial class. **At Samimi Sports Club in Ankara Yenimahalle Demet**, boxing and kickboxing classes share the same slot (**Monday/Wednesday/Friday 19:30–21:00**). Over the course of a month you can try both, then pick what fits.

For beginners: in the first week, the tempo will surprise you. In the second week, your body adapts. From the third week onward, refining technique becomes enjoyable.

## Getting started

Made up your mind to start? **Message us on WhatsApp** and we'll plan a suitable day and time together. Gloves and wraps are available in the gym for your first session — no need to rush into buying your own. Sportswear, a water bottle and a towel are enough.`
    }
  },
  {
    id: 'geleneksel-okculuk-tarihi',
    slug: 'geleneksel-okculuk-tarihi',
    category: 'general',
    author: 'Samimi Spor Kulübü',
    date: '2026-04-22',
    image: '',
    readTime: 8,
    tr: {
      title: 'Geleneksel Türk Okçuluğunun Tarihi ve Faydaları',
      excerpt:
        'Orta Asya bozkırlarından Anadolu’ya uzanan bir miras. Tirendaz yaklaşımı, kazanımları ve ilk derste seni neler bekliyor.',
      content: `Türk geleneksel okçuluğu, sadece bir spor değil; bir kültür mirasıdır. Orta Asya bozkırlarından Anadolu'ya, Selçuklu meydanlarından Osmanlı padişahlarının ok meydanlarına uzanan binlerce yıllık bir hikaye. Bugün Ankara'da modern bir salonda geleneksel okçuluğu yaşatmak, bu mirasla yeniden bağ kurmanın en somut yollarından biri. Bu yazıda hem tarihçeyi hem de okçuluğun sana neler katacağını anlatıyoruz.

## Kısa bir tarihçe

Türklerin okçulukla bağı atlı göçebe kültürüne kadar uzanır. Ata binerken bile ok atabilen savaşçılar (mounted archers), Türk askeri tarihinin en belirgin imzalarından biriydi. Yay; sadece silah değil, **statü** ve **kimlik** taşıyıcısıydı.

Osmanlı döneminde okçuluk; bir savaş aracı olmaktan çıkıp sportif ve manevi bir disipline dönüştü:

- **Ok meydanları** İstanbul'un birçok semtinde kuruldu. Okmeydanı semti adını buradan alır.
- **Tirendaz** kavramı doğdu — yetkin okçu, ustalaşmış kişi.
- Padişahlar ok atışı rekorlarını taş kitabelerle ölümsüzleştirdi (menzil taşları).
- Yay yapımı (kavasçılık) başlı başına bir zanaat haline geldi.

20. yüzyılla birlikte gerileyen okçuluk geleneği, son yıllarda hem Türkiye'de hem dünya çapında ciddi bir geri dönüş yaşıyor. Geleneksel okçuluğun **terapötik etkisi**, modern hayatın stresine bir cevap olarak yeniden değer kazandı.

## Modern Olimpik okçuluktan farkı

Geleneksel Türk okçuluğunu modern olimpik okçuluktan ayıran birkaç kritik nokta var:

- **Çekiş şekli:** Olimpikte ip parmak uçlarıyla çekilir, geleneksel Türk usulünde **baş parmak çekişi** kullanılır. Bu, daha kompakt ve hızlı bir tekniktir.
- **Yay yapısı:** Geleneksel yay kompozit (kemik, ahşap, sinir) ve **reflex-rekürve**dir. Olimpik yaylar uzun, geleneksel yaylar daha kısa ve atlı kullanım için tasarlanmıştır.
- **Duruş:** Daha geniş, daha dinamik. Bedenin tamamı atışa katılır.
- **Felsefe:** Olimpikte hedef hassasiyeti merkezdedir. Gelenekselde teknik, ritim ve içsel odak birlikte önem kazanır.

## Faydaları

Geleneksel okçuluk yapan kişilerin tarif ettiği kazanımlar çok katmanlıdır:

### 1. Konsantrasyon

Atış anında dikkat tek bir noktaya odaklanır: hedef, çekiş, nefes. Bu kısa anlar zihne **derin odaklanma egzersizi** verir. Birçok üyemiz “okçulukta geçen iki saatim, gün içindeki en sakin saatlerim” diyor.

### 2. Postür

Yay çekişi; sırt, omuz, karın ve bacak kaslarını birlikte kullanır. Düzenli çalışmayla:

- Omuzlar açılır
- Sırt kasları (özellikle latissimus dorsi) güçlenir
- Postür dik bir yapıya kavuşur
- Masa başı çalışanların yaygın “öne çökmüş omuz” problemi geriler

### 3. Nefes kontrolü

Atışta nefesi tutmak, yoga ve meditasyon disiplinlerine benzer bir farkındalık yaratır. Yıllar içinde okçunun nefes kapasitesi ve nefes kontrolü gözle görülür şekilde artar.

### 4. Sabır ve duygu yönetimi

Okçuluk hızlı sonuç vaat etmez. İlk hafta tüm okların hedef tahtasının yanına gitmesi normaldir. Önemli olan **her atıştan ders çıkarmak**. Bu, modern hayatın “anında sonuç” baskısına karşı güçlü bir antidot.

### 5. Tarihle bağlantı

Geleneksel yayı çekerken, bir kültürel zincirin parçası haline geldiğini hissedersin. Bu, ölçülmesi zor ama derin bir kazanımdır.

## İlk derste seni ne bekliyor?

Tesisimizde ilk ders şu akışta ilerler:

1. **Güvenlik bilgilendirmesi (10 dakika):** Atış alanı kuralları, ok ve yayla ilgili temel güvenlik.
2. **Duruş ve çekiş (15 dakika):** Doğru ayak konumu, kalça yönlendirmesi, baş parmak çekişi.
3. **Aşamalı atış (35 dakika):** Önce çok kısa mesafeden başlarsın. Mesafe ders ilerledikçe artar.
4. **Soğuma ve sohbet (10 dakika):** İlk izlenimlerin değerlendirmesi.

İlk dersten sonra omuz ve sırt kaslarında hafif bir yorgunluk normaldir. Birkaç hafta içinde bu his kaybolur ve “derinden çalışan” bir kas grubuyla tanışırsın.

## Ekipman

İyi haber: ilk dersinde **hiçbir ekipmana ihtiyacın yok**. Yay, ok, hedef tahtası ve koruyucu (parmaklık) tesisimizde hazır. Rahat, hareket kısıtlamayan kıyafetler yeterli.

Sezon sonunda, severek devam ediyorsan, kişisel yay almak isteyebilirsin. Bu konuda da rehberlik ediyoruz.

## Samimi Spor Kulübü'nde geleneksel okçuluk

Ankara Yenimahalle Demet'teki tesisimizde geleneksel okçuluk dersleri **Salı ve Perşembe günleri 16:30–17:30** saatleri arasında yapılır. Küçük gruplarla çalışıyoruz; bireysel ilgi yüksek.

Bu yüzyıllık geleneği denemek istiyorsan, **WhatsApp'tan yazıp** bir deneme dersi planlayabilirsin. İlk atışını çekene kadar — özellikle hedefe ilk isabet ettirdiğin an — okçuluğun cazibesinin nereden geldiğini anlayacaksın.`
    },
    en: {
      title: 'Traditional Turkish Archery: History and Benefits',
      excerpt:
        'A heritage from the Central Asian steppes to Anatolia. The tirendaz approach, what you gain, and what to expect in your first class.',
      content: `Traditional Turkish archery is not just a sport — it is a cultural heritage. A story spanning thousands of years from the Central Asian steppes to Anatolia, from Seljuk squares to the shooting grounds of Ottoman sultans. To practice traditional archery in a modern hall in Ankara today is to reconnect with that heritage in one of its most tangible forms. In this article we cover both the history and what archery can give you.

## A short history

The Turkish connection with archery reaches back to the mounted nomadic culture. Warriors who could shoot arrows while riding (mounted archers) were one of the defining signatures of Turkish military history. The bow was not only a weapon — it carried **status** and **identity**.

In the Ottoman era, archery moved beyond warfare into a sporting and spiritual discipline:

- **Arrow squares** (ok meydanları) were established in many districts of Istanbul. The Okmeydanı neighbourhood takes its name from this.
- The concept of **tirendaz** emerged — the accomplished archer, the master.
- Sultans immortalised their distance records in stone tablets (menzil taşları).
- Bow making (kavasçılık) became a craft in its own right.

The archery tradition that declined through the 20th century has seen a significant comeback in Turkey and worldwide in recent years. The **therapeutic effect** of traditional archery has regained value as a counterpoint to the stress of modern life.

## How it differs from modern Olympic archery

A few critical differences set traditional Turkish archery apart from modern Olympic archery:

- **Draw style:** Olympic archery uses fingertip draw; traditional Turkish style uses a **thumb draw**. The thumb draw is more compact and faster.
- **Bow design:** The traditional bow is composite (bone, wood, sinew) and **reflex-recurve**. Olympic bows are long; traditional bows are shorter and built for mounted use.
- **Stance:** Wider, more dynamic. The whole body is involved in the shot.
- **Philosophy:** In Olympic archery, target precision sits at the center. In the traditional approach, technique, rhythm and inner focus matter together.

## Benefits

Practitioners describe gains across many layers:

### 1. Concentration

In the moment of the shot, attention concentrates on a single point: the target, the draw, the breath. Those short moments train the mind in **deep-focus exercise**. Many of our members say, “The two hours I spend on archery are the calmest hours of my day.”

### 2. Posture

Drawing the bow recruits the back, shoulder, abdominal and leg muscles together. With regular practice:

- The shoulders open
- The back muscles (especially latissimus dorsi) strengthen
- Posture becomes upright
- The common “rounded shoulder” problem of desk workers recedes

### 3. Breath control

Holding the breath at release creates an awareness similar to yoga and meditation. Over the years, an archer's breathing capacity and breath control improve visibly.

### 4. Patience and emotional regulation

Archery does not promise fast results. In the first week, it is normal for all of your arrows to land beside the target. What matters is **learning from every shot**. That is a strong antidote to the “instant result” pressure of modern life.

### 5. Connection to history

When you draw a traditional bow, you feel yourself becoming part of a cultural chain. That is a gain that is hard to measure but deeply felt.

## What to expect in your first class

In our studio, the first class flows like this:

1. **Safety briefing (10 minutes):** Range rules, basic safety with arrows and bows.
2. **Stance and draw (15 minutes):** Correct foot positioning, hip orientation, thumb draw.
3. **Graduated shooting (35 minutes):** You start at very short range. Distance increases as the class progresses.
4. **Cool-down and conversation (10 minutes):** Review of first impressions.

Mild fatigue in the shoulders and back is normal after the first class. Within a few weeks, that fades and you discover a “deep-working” muscle group you hadn't previously felt.

## Equipment

Good news: you need **no equipment** for your first class. The bow, arrows, target and finger protection are ready at the studio. Comfortable, non-restrictive clothes are enough.

By the end of the season, if you continue and enjoy it, you may want to buy a personal bow. We guide that decision too.

## Traditional archery at Samimi Sports Club

In our Ankara Yenimahalle Demet facility, traditional archery classes run on **Tuesday and Thursday 16:30–17:30**. We work in small groups, so individual attention is high.

If you'd like to try this centuries-old tradition, **message us on WhatsApp** and we'll plan a trial class. Until you take your first shot — especially the moment you first hit the target — you won't quite understand where archery's appeal comes from.`
    }
  },
  {
    id: 'antrenman-oncesi-beslenme',
    slug: 'antrenman-oncesi-beslenme',
    category: 'nutrition',
    author: 'Beyza Erdaş',
    date: '2026-04-15',
    image: '',
    readTime: 7,
    tr: {
      title: 'Antrenman Öncesi Beslenme: Doğru Zamanlama, Doğru Seçim',
      excerpt:
        'Ne zaman, ne yemeli? Antrenman öncesi öğün zamanlaması, kaçınılması gerekenler ve pratik öneriler.',
      content: `Antrenman öncesi beslenme, sonuçları belirleyen ama çoğu kişinin yeterince düşünmediği bir konudur. Yanlış zamanlanmış ya da yanlış seçilmiş bir öğün, antrenmanı bir saat çekilmez bir hale getirebilir; doğru bir öğün ise enerji düzeyini iki katına çıkarır. Bu yazıda fizyoterapist gözüyle, hem performans hem sindirim açısından en uygun seçenekleri pratik şekilde anlatıyorum.

## Neden önemli?

Vücudun antrenman sırasında kullandığı yakıtın çoğu **glikojen** (kaslarda ve karaciğerde depolanmış karbonhidrat) ve **kan şekeri**dir. Aç karnına antrenmana gittiğinde, bu depolar düşer; sonuç:

- Performans düşer
- Toparlanma uzar
- Baş dönmesi ve halsizlik olabilir
- Yağ yakımı artar gibi gözükür ama aslında **kas yıkımı** da artar

Tersi de problem: çok tok karnına antrenman, sindirim sistemini zorlayıp **mide rahatsızlığı**na yol açar. Doğru cevap; doğru miktarda, doğru zamanda, doğru besinden geçer.

## Zamanlama: ne zaman ne yemeli?

### 2–3 saat önce: tam öğün

Antrenmandan 2–3 saat öncesinde dengeli bir öğün ideal. Karışım:

- **Karbonhidrat ağırlıklı:** Pilav, makarna, tam tahıllı ekmek, bulgur, kinoa.
- **Orta düzey protein:** Tavuk göğsü, hindi, yumurta, beyaz peynir, balık.
- **Az yağ:** Aşırı yağlı yemek sindirimi yavaşlatır.
- **Sebze:** Mide yükünü ayarlayan bir denge unsuru.

Örnek: 1 kâse pilav + 100 g ızgara tavuk + söğüş salata.

### 30–60 dakika önce: hızlı yakıt

Antrenmana 30–60 dakika kala küçük bir ara öğün:

- 1 muz + 1 avuç ceviz/badem
- 1 bardak yoğurt + 1 yemek kaşığı bal
- 1 dilim tam tahıllı ekmek + fıstık ezmesi
- 1 elma + 5–6 badem

Bu öğünler hızlı sindirilir ve kan şekerini stabilize eder.

### Antrenmandan 5–10 dakika önce

Hâlâ aç hissediyorsan: bir hurma veya bir tatlı kaşığı bal. Daha fazlasına gerek yok.

## Hangi antrenman, hangi öğün?

Beslenme **antrenman türüne göre** ayarlanmalıdır:

### Reformer Pilates / hafif yoga

Düşük tempolu çalışmalar. Aşırı tok karnına yapılmaz çünkü çok karın kası egzersizi var. **45–60 dakika önce hafif bir ara öğün** yeterli.

### Boks, kick boks, taekwondo

Yüksek tempolu, **dinamik** sporlar. Glikojen ihtiyacı yüksek. **2 saat önce tam öğün + 30 dakika önce küçük bir karbonhidrat** ideal.

### Geleneksel okçuluk

Düşük tempolu ama uzun süreli. Kan şekerinin dalgalanmaması önemli. **1–2 saat önce dengeli bir öğün** yeterli, hızlı şeker (çikolata, gazlı içecek) önerilmez.

### Çocuk jimnastiği

Çocuklar için: dersten 1 saat önce hafif öğün. Boş midede gelmemek önemli ama tok da olmamalı.

## Kaçınılması gerekenler

Antrenmandan önce uzak durulması gerekenler:

- **Aşırı yağlı ve kızartma yiyecekler:** Sindirim 4 saat sürer, antrenmanda mide gurultusu garanti.
- **Çok lifli yiyecekler (büyük miktarda):** Brokoli, lahana, kuru baklagiller — antrenman boyunca rahatsızlık verir.
- **Yeni denenen besinler:** Antrenman günü deney günü değildir.
- **Aşırı baharatlı yemekler:** Reflü ve mide yanması riski.
- **Çok şekerli içecekler:** Kan şekeri önce yükselip sonra hızla düşer, ortada bayılma hissi.
- **Alkol:** Performans yarı yarıya düşer, dehidrate eder.

## Sıvı: çoğu kişinin atladığı parça

Antrenmandan 1–2 saat önce **400–500 ml su**, antrenmanın hemen öncesinde **200–300 ml**. Yoğun ter atacaksan elektrolit ekleyebilirsin (ev yapımı: 500 ml su + tuz ucu + limon suyu + bir çay kaşığı bal).

Kafein konusu: antrenman öncesi 1 kahve performansı artırır (özellikle dövüş sanatları için). Ama uyku saatine 6 saatten az kalmışsa içme.

## Bireysel farklar

Sindirim hızı kişiden kişiye değişir:

- Bazı kişiler 1 saat önce yemek yiyip antrenmana gidebilir
- Bazıları 3 saat boşluk olmadan kendini ağır hisseder

**Önerim:** İlk 2–3 antrenmanda zamanlama deneyimi yap. Aynı öğünü farklı zamanlarda yiyip kendini gözlemle. Bir hafta sonra kendi optimal pencereni bulursun.

## Antrenman sonrası ipucu (bonus)

Antrenman sonrası 30 dakika içinde **karbonhidrat + protein** kombinasyonu toparlanmayı hızlandırır:

- Süt + muz
- Yumurta + tam tahıllı ekmek
- Yoğurt + bal + yulaf

## Samimi Spor Kulübü'nde beslenme desteği

Eğitmenlerimiz, özellikle Fizyoterapist Beyza Erdaş, üyelerimize antrenman beslenmesi konusunda kişiselleştirilmiş öneriler verir. Reformer pilates ya da herhangi bir branşta düzenli antrenmana başladığında, beslenme planını birlikte gözden geçirebiliriz.

Sorularını **WhatsApp'tan** sorabilir, sana özel öneri almak için **deneme görüşmesi** ayarlayabilirsin.`
    },
    en: {
      title: 'Pre-Workout Nutrition: Right Timing, Right Choices',
      excerpt:
        'When and what to eat? Pre-workout meal timing, what to avoid, and practical suggestions.',
      content: `Pre-workout nutrition is a topic that shapes your results but most people don't think enough about. A poorly timed or poorly chosen meal can turn an hour of training into something unbearable; the right meal can double your energy. In this article, with a physiotherapist's perspective, I walk through the most suitable options from both performance and digestion standpoints.

## Why it matters

Most of the fuel your body uses during training is **glycogen** (carbohydrate stored in muscles and liver) and **blood sugar**. When you train fasted, those stores drop; the result:

- Performance drops
- Recovery takes longer
- You may experience dizziness and weakness
- Fat burning appears to rise, but so does **muscle breakdown**

The opposite is also a problem: training on a full stomach strains digestion and causes **stomach upset**. The right answer goes through the right amount, at the right time, of the right foods.

## Timing: when to eat what?

### 2–3 hours before: full meal

Two to three hours before training, a balanced meal is ideal. The mix:

- **Carb-leaning:** Rice, pasta, whole-grain bread, bulgur, quinoa.
- **Moderate protein:** Chicken breast, turkey, eggs, white cheese, fish.
- **Low fat:** Heavily fatty meals slow digestion.
- **Vegetables:** A balancing element that regulates the stomach load.

Example: 1 bowl of rice + 100 g grilled chicken + a side salad.

### 30–60 minutes before: quick fuel

Thirty to sixty minutes before training, a small snack:

- 1 banana + a handful of walnuts/almonds
- 1 cup of yogurt + 1 tbsp honey
- 1 slice of whole-grain bread + peanut butter
- 1 apple + 5–6 almonds

These foods digest quickly and stabilise blood sugar.

### 5–10 minutes before training

If you still feel hungry: one date or a teaspoon of honey. No more needed.

## Which workout, which meal?

Nutrition should be tuned to the **type of training**:

### Reformer Pilates / light yoga

Low-tempo work. Not done on a very full stomach because there is significant abdominal work. **A light snack 45–60 minutes before** is enough.

### Boxing, kickboxing, taekwondo

High-tempo, **dynamic** sports. Glycogen demand is high. **A full meal 2 hours before + a small carb 30 minutes before** is ideal.

### Traditional archery

Low-tempo but long-duration. Blood sugar stability is important. **A balanced meal 1–2 hours before** is enough; fast sugar (chocolate, sodas) is not recommended.

### Kids gymnastics

For children: a light meal 1 hour before. It's important not to come in empty, but also not overfull.

## What to avoid

Things to stay away from before training:

- **Heavy fried foods:** Digestion takes 4 hours; stomach gurgling during training is guaranteed.
- **Very high-fiber foods (in large amounts):** Broccoli, cabbage, dry legumes — they cause discomfort throughout the session.
- **New foods you haven't tried:** Training day is not experiment day.
- **Very spicy meals:** Reflux and heartburn risk.
- **Sugary drinks:** Blood sugar spikes and then crashes, leaving you faint.
- **Alcohol:** Performance drops by half and dehydrates you.

## Hydration: the part most people skip

One to two hours before training, **400–500 ml of water**; right before training, **200–300 ml**. If you'll sweat heavily you can add electrolytes (homemade: 500 ml water + a pinch of salt + lemon juice + 1 tsp honey).

About caffeine: 1 coffee before training boosts performance (especially for martial arts). But don't drink it if bedtime is less than 6 hours away.

## Individual differences

Digestion speed varies person to person:

- Some can eat 1 hour before and train fine
- Others feel heavy without a 3-hour gap

**My recommendation:** Experiment with timing in your first 2–3 sessions. Eat the same meal at different times and observe yourself. After a week you'll find your optimal window.

## Post-workout tip (bonus)

Within 30 minutes after training, a **carbohydrate + protein** combination accelerates recovery:

- Milk + banana
- Egg + whole-grain bread
- Yogurt + honey + oats

## Nutrition support at Samimi Sports Club

Our trainers, especially physiotherapist Beyza Erdaş, give members personalised guidance on training nutrition. When you start regular training in reformer pilates or any other class, we can review your nutrition plan together.

You can ask your questions on **WhatsApp** or schedule a **discovery call** to get advice tailored to you.`
    }
  },
  {
    id: 'cocuklar-icin-spor-yas',
    slug: 'cocuklar-icin-spor-yas',
    category: 'kids-sports',
    author: 'Samimi Spor Kulübü',
    date: '2026-04-08',
    image: '',
    readTime: 8,
    tr: {
      title: 'Çocuklar İçin Spor: Hangi Yaşta Hangi Branş?',
      excerpt:
        'Çocukların gelişim dönemlerine göre uygun spor branşları. 3 yaştan ergenlik sonrasına kapsamlı bir rehber.',
      content: `“Çocuğumu hangi spora yazdırmalıyım?” sorusunun tek bir doğru cevabı yoktur. Doğru cevap; çocuğun **yaşına**, **gelişim aşamasına**, **karakterine** ve **ailenin imkanlarına** göre değişir. Bu yazıda yaş aralıklarına göre çocuk sporu rehberini, hem genel motor gelişim bilgileri hem de pratik öneriler eşliğinde sunuyoruz.

## Genel ilke: çeşitlilik > erken uzmanlaşma

Spor bilimi literatürünün açık vurgusu: **erken yaşta tek bir branşta uzmanlaşma** sakatlık riskini ve sporu erken bırakma oranını artırır. Bunun yerine, **çoklu spor maruziyeti** ile genel motor zekânın gelişmesi önerilir. Tek branşa fanatik bağlılık, ergenlik sonrasında karar verilebilir.

## 3–5 yaş: oyun çağı

Bu yaş aralığında “spor” değil, **yapılandırılmış oyun** vardır. Motor gelişim için kritik dönem. Hedef: temel becerilerin (koşma, atlama, dengeleme, fırlatma, yakalama, dönme) zengin çeşitlilikte denenmesi.

**Uygun aktiviteler:**
- Çocuk jimnastiği (bizim de programımızda olan)
- Yüzme (suya alışma)
- Müzik+hareket dersleri
- Açık havada serbest oyun

**Bu yaşta yapılmaması gerekenler:**
- Rekabet odaklı maçlar
- Yorucu uzun antrenmanlar (45 dakika fazlası bile fazla)
- Tek branşa odaklı uzmanlaşma
- Ağırlık çalışması

## 6–9 yaş: beceri öğrenme penceresi

Beyin için motor öğrenmenin en verimli dönemi. Çocuk yeni becerileri **bir yetişkinin asla yapamayacağı hızda** öğrenir. Bu dönem; geniş bir “spor okuryazarlığı” inşa etmek için altın fırsattır.

**Uygun branşlar:**
- **Taekwondo** (denge, refleks, disiplin)
- Jimnastik (esneklik ve koordinasyon)
- Yüzme (kondisyon ve teknik)
- Basketbol, futbol gibi takım sporları (takım algısı)
- Tenis, masa tenisi (göz-el koordinasyonu)

**Önemli:** Çocuk haftada en az 2 farklı spor yapıyor olmalı. Yetenek bu yaşta kendini gösterir ama erken kategorize etmek (“o futbolcu olacak”) hata.

**Çocuk jimnastiği bu yaşta neden değerli?**
Tüm sporların temelini atar. Denge, esneklik, vücut farkındalığı, düşme becerisi — hepsi jimnastik içinde geliştirilir. Bizim 4–14 yaş programımız tam bu pencereyi hedefler.

## 10–13 yaş: tercih netleşir

Çocuk artık “neyi sevdiğini” ve “neyde iyi olduğunu” kendi farkındalığıyla görmeye başlar. Bu dönem; yarı uzmanlaşmaya geçişin başlangıcı olabilir ama **hâlâ tek branşa bağlanma şart değil**.

**Açılabilecek branşlar:**
- **Boks ve kick boks** (disiplin, kondisyon, öz savunma)
- **Geleneksel okçuluk** (odaklanma, postür, sabır)
- Atletizm
- Bisiklet

**Bu yaşta dikkat edilmesi gerekenler:**
- Hızlı boy uzaması nedeniyle eklem ağrıları yaygındır (özellikle diz). Aşırı sıçrama ve yüksek yoğunluk dönemler kontrollü tutulmalı.
- Rekabet dozu yavaş yavaş artırılabilir ama hâlâ asıl odak gelişimde olmalı.
- Akran etkisi büyük: arkadaşının yaptığı sporu denemek istemesi sağlıklıdır, zorlamayın ama önerin.

## 14+ yaş: yetişkin sporu

14 yaş sonrası fizyolojik olarak çocuk neredeyse yetişkin. Antrenman yapısı yetişkinlere benzer hale gelir. Bu yaş; ya **performans/rekabet** yönüne, ya da **yaşam boyu egzersiz** yönüne karar verme zamanı.

**Tüm branşlar açık:**
- Boks, kick boks, taekwondo (artık tam program)
- Reformer pilates (kızlar için, 16+ yaş güvenle yapabilir)
- Geleneksel okçuluk
- Ağırlık antrenmanı (gözetim altında)

**Hedef:** Sporun sürdürülebilir bir hayat tarzı haline gelmesi. Bu yaşta keyif almıyorsa, branşı değiştirmek aileler için seçenek olarak masada olmalı.

## Anne-baba olarak ne yapmalı?

İyi rehberlik üç temele dayanır:

### 1. Baskı değil, fırsat sunmak

Çocuğa “sen bunda iyi olmalısın” yerine “bunu denemeye ne dersin?” yaklaşımı uzun vadede daha verimli.

### 2. Tutarlılık

Hafta içinde 2–3 kez aynı saatte aynı yerde olmak çocuğa **yapılandırılmış zaman** algısı kazandırır. Spor başarısının yanında okul performansı için de değerlidir.

### 3. Sürecin parçası olmak

Antrenmandan sonra “Bugün ne öğrendin, en zor kısmı neydi?” gibi sorular çocuğun motivasyonunu besler. Maç ya da sınavda sonuca odaklanmak yerine **emeğe ve gelişime** vurgu yapmak kalıcı motivasyonun anahtarı.

## Yaygın hatalar

- **Çok erken yaşta ağırlık:** 12 yaşından önce ağır direnç çalışması önerilmez.
- **Tek branşa fanatik bağlılık:** Çocuğun başka sporları da denemesine izin verin.
- **Karşılaştırma:** “Kuzeni şampiyon, sen niye değilsin?” motivasyon değil, küskünlük üretir.
- **Performans baskısı:** Sınav öncesi “kazanmazsan üzülürüm” cümleleri çocuğu hayat boyu sporsuz bırakabilir.

## Samimi Spor Kulübü'nde çocuk programları

Ankara Yenimahalle Demet'teki tesisimizde çocuk grupları için iki ana program var:

- **Çocuk Jimnastiği:** 4–14 yaş, Perşembe 17:30 ve Cumartesi 14:00 (45 dakika).
- **Taekwondo (çocuk grubu):** Pazartesi/Çarşamba/Cuma 18:00–19:30.

Çocuğunuza uygun başlangıcı belirlemek için, **WhatsApp'tan yazıp** kısa bir görüşme planlayabiliriz. Yaşı, karakteri ve hedeflerinize göre öneri sunarız.`
    },
    en: {
      title: 'Sports for Kids: Which Discipline at Which Age?',
      excerpt:
        'Age-appropriate sports for children. A comprehensive guide from age 3 through adolescence and beyond.',
      content: `“Which sport should I enroll my child in?” does not have one correct answer. The right answer depends on the child's **age**, **developmental stage**, **personality** and **family circumstances**. In this article we offer an age-by-age guide to kids' sports, paired with general motor development knowledge and practical recommendations.

## General principle: variety beats early specialisation

A clear theme in sports science literature: **early specialisation in a single discipline** increases injury risk and the rate of dropping out of sport early. Instead, **multi-sport exposure** is recommended to grow general motor intelligence. Fanatical commitment to a single discipline is a decision better made after adolescence.

## Ages 3–5: the play years

In this range, “sport” doesn't exist — only **structured play** does. It is a critical window for motor development. The goal: rich exposure to foundational skills (running, jumping, balancing, throwing, catching, spinning).

**Suitable activities:**
- Kids gymnastics (which we offer)
- Swimming (water acclimatisation)
- Music-and-movement classes
- Free outdoor play

**What not to do at this age:**
- Competition-focused matches
- Long, tiring sessions (more than 45 minutes is too much)
- Single-discipline specialisation
- Resistance training

## Ages 6–9: the skill-learning window

For the brain, this is the most efficient period of motor learning. The child learns new skills at **a speed an adult could never match**. This window is a golden opportunity to build broad “sports literacy.”

**Suitable disciplines:**
- **Taekwondo** (balance, reflexes, discipline)
- Gymnastics (mobility and coordination)
- Swimming (conditioning and technique)
- Team sports such as basketball and football (team perception)
- Tennis, table tennis (hand-eye coordination)

**Important:** A child should ideally be doing at least 2 different sports per week. Talent shows itself in this period, but categorising early (“he'll be a footballer”) is a mistake.

**Why is kids gymnastics so valuable at this age?**
It lays the foundation of all sports. Balance, mobility, body awareness, falling skills — all of them are developed inside gymnastics. Our program for ages 4–14 targets exactly this window.

## Ages 10–13: preferences sharpen

Children now start to see “what they enjoy” and “what they're good at” through their own awareness. This is the beginning of semi-specialisation, but **single-discipline commitment is still not necessary**.

**Disciplines that can open up:**
- **Boxing and kickboxing** (discipline, conditioning, self-defense)
- **Traditional archery** (focus, posture, patience)
- Athletics
- Cycling

**What to watch at this age:**
- Joint pain is common due to rapid height growth (especially in the knees). Heavy jumping and high-intensity blocks must be carefully managed.
- Competition exposure can grow gradually but development should still be the main focus.
- Peer influence is strong: wanting to try a friend's sport is healthy — don't force, but encourage.

## Age 14+: adult sport

After 14, the body is physiologically close to adult. Training structure becomes similar to adult training. This age is the moment to decide between **performance/competition** and **lifelong exercise**.

**All disciplines are open:**
- Boxing, kickboxing, taekwondo (now full programs)
- Reformer pilates (for girls; safe from 16+)
- Traditional archery
- Resistance training (under supervision)

**The goal:** Sport becoming a sustainable lifestyle. If enjoyment is missing at this age, switching disciplines should be on the table for families.

## What should parents do?

Good guidance rests on three pillars:

### 1. Offer opportunity, not pressure

Reaching for “Why don't you try this?” instead of “You need to be good at this” works better over the long term.

### 2. Consistency

Being at the same place at the same time 2–3 times a week gives the child a sense of **structured time**. That's valuable for both sports success and academic performance.

### 3. Be part of the process

Asking after training, “What did you learn today? What was the hardest part?” nourishes a child's motivation. Emphasising **effort and growth** rather than results is the key to lasting motivation.

## Common mistakes

- **Too-early weights:** Heavy resistance work is not recommended before age 12.
- **Single-discipline fanaticism:** Let your child try other sports too.
- **Comparison:** “Your cousin is a champion — why aren't you?” breeds resentment, not motivation.
- **Performance pressure:** Sentences like “I'll be disappointed if you lose” before an exam can leave a child unwilling to play sport for life.

## Kids programs at Samimi Sports Club

In our Ankara Yenimahalle Demet facility, we run two main programs for kids:

- **Kids Gymnastics:** Ages 4–14, Thursday 17:30 and Saturday 14:00 (45 minutes).
- **Taekwondo (kids group):** Monday/Wednesday/Friday 18:00–19:30.

To find the right starting point for your child, **message us on WhatsApp** and we can plan a short call. We'll offer suggestions based on age, personality and goals.`
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

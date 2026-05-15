export const FAQ_CATEGORIES = [
  'membership',
  'classes',
  'facility',
  'pilates',
  'payment'
] as const;

export type FAQCategory = (typeof FAQ_CATEGORIES)[number];

export type FAQLocalized = {
  question: string;
  answer: string;
};

export type FAQItem = {
  id: string;
  category: FAQCategory;
  link?: {
    href: string;
    tr: string;
    en: string;
  };
  tr: FAQLocalized;
  en: FAQLocalized;
};

export type LocalizedFAQItem = {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
  link?: {label: string; href: string};
};

const TBD_TR =
  'Bu konu için lütfen bizimle WhatsApp’tan iletişime geçin — en güncel bilgiyi paylaşalım.';
const TBD_EN =
  'For this one, please reach out on WhatsApp — we’ll share the latest details.';

export const FAQ_ITEMS: FAQItem[] = [
  // MEMBERSHIP
  {
    id: 'membership-start',
    category: 'membership',
    tr: {
      question: 'Üyelik nasıl başlar?',
      answer:
        'Bize WhatsApp’tan veya telefonla ulaşabilirsiniz. Size uygun branş ve seansı belirledikten sonra üyeliğinizi başlatırız.'
    },
    en: {
      question: 'How does a membership start?',
      answer:
        'Reach us on WhatsApp or by phone. Once we pick the right class and time slot for you, we activate the membership.'
    }
  },
  {
    id: 'membership-trial',
    category: 'membership',
    tr: {question: 'Deneme dersi var mı?', answer: TBD_TR},
    en: {question: 'Do you offer a trial class?', answer: TBD_EN}
  },
  {
    id: 'membership-pause',
    category: 'membership',
    tr: {question: 'Üyelik dondurabilir miyim?', answer: TBD_TR},
    en: {question: 'Can I pause my membership?', answer: TBD_EN}
  },

  // CLASSES
  {
    id: 'classes-age-groups',
    category: 'classes',
    tr: {
      question: 'Hangi yaş gruplarına hizmet veriyorsunuz?',
      answer:
        'Çocuk jimnastiği 4–14 yaş arasıdır. Diğer branşlar her yaşa uygundur. Detaylı bilgi için bizimle iletişime geçin.'
    },
    en: {
      question: 'What age groups do you serve?',
      answer:
        'Kids gymnastics is for ages 4–14. Our other classes welcome every age. Reach out for details.'
    }
  },
  {
    id: 'classes-beginner',
    category: 'classes',
    tr: {
      question: 'Daha önce hiç spor yapmadım, başlayabilir miyim?',
      answer:
        'Elbette! Tüm branşlarımız her seviyeye uygundur. Eğitmenlerimiz seviyenize göre programı düzenler.'
    },
    en: {
      question: 'I’ve never trained before — can I still join?',
      answer:
        'Of course. Every class is open to all levels and our trainers tailor the program to where you are.'
    }
  },
  {
    id: 'classes-pilates-women',
    category: 'classes',
    link: {
      href: '/branslar/reformer-pilates',
      tr: 'Reformer Pilates sayfası',
      en: 'Reformer Pilates page'
    },
    tr: {
      question: 'Reformer pilates sadece bayanlara mı özeldir?',
      answer:
        'Evet, reformer pilates derslerimiz bayanlarımıza özeldir.'
    },
    en: {
      question: 'Is reformer pilates women-only?',
      answer: 'Yes, our reformer pilates classes are women-only.'
    }
  },
  {
    id: 'classes-parents-watch',
    category: 'classes',
    tr: {
      question: 'Çocuk jimnastiği derslerini veliler izleyebilir mi?',
      answer: TBD_TR
    },
    en: {
      question: 'Can parents watch the kids gymnastics class?',
      answer: TBD_EN
    }
  },

  // FACILITY
  {
    id: 'facility-locker',
    category: 'facility',
    tr: {
      question: 'Soyunma odası var mı?',
      answer: 'Evet, tesisimizde soyunma odamız bulunmaktadır.'
    },
    en: {
      question: 'Is there a locker room?',
      answer: 'Yes, our facility has a locker room.'
    }
  },
  {
    id: 'facility-parking',
    category: 'facility',
    tr: {question: 'Otopark var mı?', answer: TBD_TR},
    en: {question: 'Is parking available?', answer: TBD_EN}
  },
  {
    id: 'facility-equipment',
    category: 'facility',
    tr: {
      question: 'Spor kıyafeti ve ekipmanı temin ediyor musunuz?',
      answer:
        'Geleneksel okçuluk için tüm ekipman tarafımızca sağlanır. Diğer branşlar için kendi spor kıyafetinizi getirmenizi tavsiye ederiz.'
    },
    en: {
      question: 'Do you provide sportswear and equipment?',
      answer:
        'For traditional archery, we provide all the equipment. For the other classes, please bring your own sportswear.'
    }
  },

  // REFORMER PILATES
  {
    id: 'pilates-packages',
    category: 'pilates',
    link: {
      href: '/branslar/reformer-pilates',
      tr: 'Reformer Pilates sayfası',
      en: 'Reformer Pilates page'
    },
    tr: {
      question: 'Reformer pilates seansları nasıl satılıyor?',
      answer:
        'Reformer pilates 8 seanslık paketler halinde satılır. Haftada 2 ders olarak planlanır — yani yaklaşık 1 aylık bir programdır.'
    },
    en: {
      question: 'How are reformer pilates sessions sold?',
      answer:
        'Reformer pilates is sold as 8-session packages, run as 2 sessions per week — roughly a 1-month program.'
    }
  },
  {
    id: 'pilates-prices',
    category: 'pilates',
    link: {
      href: '/branslar/reformer-pilates',
      tr: 'Reformer Pilates sayfası',
      en: 'Reformer Pilates page'
    },
    tr: {
      question: 'Reformer pilates fiyatları ne kadar?',
      answer:
        '4 kişilik grup: 4.200 TL\n3 kişilik grup: 5.200 TL\n2 kişilik grup: 6.500 TL\nBireysel: 9.000 TL\n\nKampanyalı fiyatlardır. Detaylı bilgi için bize ulaşabilirsiniz.'
    },
    en: {
      question: 'What are the reformer pilates prices?',
      answer:
        'Group of 4: 4,200 TL\nGroup of 3: 5,200 TL\nGroup of 2: 6,500 TL\nIndividual: 9,000 TL\n\nThese are promotional prices. Reach out for the latest.'
    }
  },
  {
    id: 'pilates-trainer',
    category: 'pilates',
    link: {
      href: '/egitmenler/beyza-erdas',
      tr: 'Beyza Erdaş profili',
      en: 'Beyza Erdaş profile'
    },
    tr: {
      question: 'Reformer pilates eğitmeniniz kim?',
      answer:
        'Reformer pilates eğitmenimiz Fizyoterapist Beyza Erdaş’tır. Dokuz Eylül Üniversitesi mezunudur ve manuel terapi, pilates alanlarında uzmanlaşmıştır.'
    },
    en: {
      question: 'Who teaches reformer pilates?',
      answer:
        'Our reformer pilates trainer is physiotherapist Beyza Erdaş, a Dokuz Eylül University graduate specialised in manual therapy and pilates.'
    }
  },

  // PAYMENT
  {
    id: 'payment-method',
    category: 'payment',
    tr: {question: 'Ödeme nasıl yapılıyor?', answer: TBD_TR},
    en: {question: 'How can I pay?', answer: TBD_EN}
  },
  {
    id: 'payment-card',
    category: 'payment',
    tr: {question: 'Kredi kartı kabul ediyor musunuz?', answer: TBD_TR},
    en: {question: 'Do you accept credit cards?', answer: TBD_EN}
  }
];

export function localizeFaq(item: FAQItem, locale: string): LocalizedFAQItem {
  const t = locale === 'en' ? item.en : item.tr;
  return {
    id: item.id,
    category: item.category,
    question: t.question,
    answer: t.answer,
    link: item.link
      ? {
          label: locale === 'en' ? item.link.en : item.link.tr,
          href: item.link.href
        }
      : undefined
  };
}

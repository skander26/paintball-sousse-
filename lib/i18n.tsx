"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Locale = "en" | "fr" | "ar";

type Dict = Record<string, string>;

const en: Dict = {
  brand: "PAINTBALL SOUSSE",
  tagline: "Adrenaline and Friendship Meet in a Challenge",
  nav_home: "Home",
  nav_exp: "Experiences",
  nav_pack: "Arsenal",
  nav_tour: "Tournament",
  nav_gal: "Gallery",
  nav_contact: "Contact",
  nav_book: "BOOK NOW",
  hero_badge: "SINCE 2023 · SOUSSE, TUNISIA",
  hero_l1: "FEEL THE",
  hero_l2: "ADRENALINE",
  hero_sub:
    "Paintball · Team Building · Events · Tournaments",
  hero_cta: "BOOK YOUR SESSION",
  hero_call: "Or call us:",
  scroll_hint: "SCROLL TO EXPLORE",
  exp_title: "OUR EXPERIENCES",
  pack_title: "CHOOSE YOUR PACK",
  pack_per: "per person",
  pack_group: "GROUP PACK",
  pack_tournament: "TOURNAMENT PACK",
  pack_women: "WOMEN'S PROMO",
  popular: "MOST POPULAR",
  special: "SPECIAL OFFER",
  discount: "-20% ON SELECTED DATES",
  join: "JOIN THE FIGHT",
  claim: "CLAIM OFFER",
  tour_badge: "COMPETITIVE PAINTBALL",
  tour_h1: "PAINTBALL SOUSSE",
  tour_h2: "CHAMPIONSHIP",
  tour_sub: "1ST EDITION — 28 DECEMBER 2025",
  tour_desc:
    "Register for an intense competitive day: brackets, referees, and pure adrenaline near Sousse. Gear checks and safety briefings included.",
  tour_price_lbl: "ENTRY",
  tour_register: "REGISTER NOW",
  tour_small: "Limited spots · Contact us to confirm availability.",
  gallery_title: "ACTION SHOTS",
  gallery_kicker: "Moments in action",
  gallery_follow: "FOLLOW US FOR DAILY ACTION",
  testi_title: "PLAYER VOICES",
  faq_title: "GOT QUESTIONS?",
  faq_item_0_q: "What is the minimum group size?",
  faq_item_0_a:
    "Minimum 4 players (2v2). Maximum 20 players (10v10). We recommend 6+ for the best experience.",
  faq_item_1_q: "What age is allowed to play?",
  faq_item_1_a:
    "Players aged 10 to 60 are welcome. Under 18 requires parental consent.",
  faq_item_2_q: "What should I wear?",
  faq_item_2_a:
    "Comfortable clothes you don't mind getting dirty. We provide full protective masks and gear.",
  faq_item_3_q: "Is paintball safe?",
  faq_item_3_a:
    "Absolutely. All players receive a safety briefing and wear full-face masks throughout the game.",
  faq_item_4_q: "How do I book?",
  faq_item_4_a:
    "Use our online reservation system, or call/WhatsApp us at +216 46 209 091.",
  faq_item_5_q: "Are there women's special offers?",
  faq_item_5_a:
    "Yes! We run women's promotional events with discounts on selected dates.",
  faq_item_6_q: "Do you offer corporate packages?",
  faq_item_6_a:
    "Yes! Tailored team-building packages for companies of all sizes. Contact us for custom quotes.",
  contact_title: "BOOK YOUR ADVENTURE",
  contact_reach_title: "FIND US & REACH OUT",
  contact_address_block:
    "Near Mall of Sousse, Route Sidi Bou Ali, Kalaa Kebira, Sousse",
  contact_call_btn: "Call",
  contact_wa_btn: "WhatsApp",
  contact_map_intro:
    "Near Mall of Sousse, Route Sidi Bou Ali, Kalaa Kebira, Sousse",
  contact_book_title: "WANT TO BOOK?",
  contact_book_sub: "Head to our tactical reservation system.",
  contact_enter_cta: "ENTER THE ARENA",
  contact_wa_quick: "WhatsApp — quick contact",
  contact_find: "FIND US",
  contact_send: "SEND MESSAGE",
  contact_success: "We'll contact you soon!",
  footer_links: "Quick Links",
  footer_services: "Services",
  footer_contact: "Contact",
  footer_rights: "© 2025 Paintball Sousse. All rights reserved.",
  footer_made: "Made with love in Tunisia",
  wa_tooltip: "Chat with us",
  loading: "LOADING...",
  sound: "Enable sound",
  sound_off: "Sound off",
};

const fr: Dict = {
  ...en,
  nav_home: "Accueil",
  nav_exp: "Expériences",
  nav_pack: "Arsenal",
  nav_tour: "Tournoi",
  nav_gal: "Galerie",
  nav_contact: "Contact",
  nav_book: "RÉSERVER",
  hero_badge: "DEPUIS 2023 · SOUSSE, TUNISIE",
  hero_sub:
    "Paintball · Team building · Événements · Tournois",
  hero_cta: "RÉSERVER VOTRE SESSION",
  hero_call: "Ou appelez :",
  scroll_hint: "DÉFILER POUR EXPLORER",
  exp_title: "NOS EXPÉRIENCES",
  pack_title: "CHOISISSEZ VOTRE FORMULE",
  pack_per: "par personne",
  pack_group: "PACK GROUPE",
  pack_tournament: "PACK TOURNOI",
  pack_women: "PROMO FEMMES",
  popular: "LE PLUS POPULAIRE",
  special: "OFFRE SPÉCIALE",
  discount: "-20% SUR DATES SÉLECTIONNÉES",
  join: "REJOINDRE LE COMBAT",
  claim: "PROFITER DE L'OFFRE",
  tour_badge: "PAINTBALL COMPÉTITIF",
  tour_desc:
    "Inscrivez-vous pour une journée intense : phases finales, arbitres et adrénaline près de Sousse. Équipement et sécurité inclus.",
  tour_price_lbl: "TARIF",
  tour_register: "S'INSCRIRE",
  tour_small: "Places limitées · Contactez-nous pour confirmer.",
  gallery_title: "ACTION",
  gallery_kicker: "Moments d’action",
  gallery_follow: "SUIVEZ-NOUS AU QUOTIDIEN",
  testi_title: "ILS EN PARLENT",
  faq_title: "DES QUESTIONS ?",
  faq_item_0_q: "Quel est le nombre minimum de joueurs ?",
  faq_item_0_a:
    "Minimum 4 joueurs (2v2). Maximum 20 joueurs (10v10). Nous recommandons 6+ pour une expérience optimale.",
  faq_item_1_q: "Quel âge est autorisé ?",
  faq_item_1_a:
    "Les joueurs de 10 à 60 ans sont les bienvenus. Les mineurs nécessitent un consentement parental.",
  faq_item_2_q: "Que faut-il porter ?",
  faq_item_2_a:
    "Des vêtements confortables que vous ne craignez pas de salir. Nous fournissons masques et équipements de protection.",
  faq_item_3_q: "Le paintball est-il sûr ?",
  faq_item_3_a:
    "Absolument. Tous les joueurs reçoivent un briefing sécurité et portent des masques intégraux.",
  faq_item_4_q: "Comment réserver ?",
  faq_item_4_a:
    "Utilisez notre système de réservation en ligne, ou appelez/WhatsApp au +216 46 209 091.",
  faq_item_5_q: "Y a-t-il des offres spéciales pour les femmes ?",
  faq_item_5_a:
    "Oui ! Nous organisons des événements promotionnels avec des réductions sur certaines dates.",
  faq_item_6_q: "Proposez-vous des forfaits entreprise ?",
  faq_item_6_a:
    "Oui ! Des forfaits team-building sur mesure pour toutes les tailles d'entreprise.",
  contact_title: "RÉSERVEZ VOTRE AVENTURE",
  contact_reach_title: "TROUVEZ-NOUS & CONTACTEZ-NOUS",
  contact_address_block:
    "Près du Mall of Sousse, Route Sidi Bou Ali, Kalaa Kebira, Sousse",
  contact_call_btn: "Appeler",
  contact_wa_btn: "WhatsApp",
  contact_map_intro:
    "Près du Mall of Sousse, Route Sidi Bou Ali, Kalaa Kebira, Sousse",
  contact_book_title: "VOUS VOULEZ RÉSERVER ?",
  contact_book_sub: "Accédez à notre système de réservation tactique.",
  contact_enter_cta: "ENTRER DANS L'ARÈNE",
  contact_wa_quick: "WhatsApp — contact rapide",
  contact_find: "NOUS TROUVER",
  contact_send: "ENVOYER",
  contact_success: "Nous vous recontactons très vite !",
  footer_links: "Liens rapides",
  footer_services: "Services",
  footer_contact: "Contact",
  footer_rights: "© 2025 Paintball Sousse. Tous droits réservés.",
  footer_made: "Fait avec passion en Tunisie",
  wa_tooltip: "Écrivez-nous",
  loading: "CHARGEMENT...",
  sound: "Activer le son",
  sound_off: "Son désactivé",
};

const ar: Dict = {
  ...en,
  nav_home: "الرئيسية",
  nav_exp: "التجارب",
  nav_pack: "الترسانة",
  nav_tour: "البطولة",
  nav_gal: "المعرض",
  nav_contact: "اتصل",
  nav_book: "احجز الآن",
  hero_badge: "منذ 2023 · سوسة، تونس",
  hero_sub: "بينت بول · بناء الفريق · فعاليات · بطولات",
  hero_cta: "احجز جلستك",
  hero_call: "أو اتصل:",
  scroll_hint: "مرر للاستكشاف",
  exp_title: "تجاربنا",
  pack_title: "اختر باقتك",
  pack_per: "للشخص",
  pack_group: "باقة جماعية",
  pack_tournament: "باقة البطولة",
  pack_women: "عرض السيدات",
  popular: "الأكثر طلباً",
  special: "عرض خاص",
  discount: "-20٪ على تواريخ مختارة",
  join: "انضم للمعركة",
  claim: "استفد من العرض",
  tour_badge: "بينت بول تنافسي",
  tour_desc:
    "سجّل ليوم مكثف: أدوار، حكام، وإثارة قرب سوسة. التجهيزات والسلامة مدمجة.",
  tour_price_lbl: "الدخول",
  tour_register: "سجّل الآن",
  tour_small: "مقاعد محدودة · تواصل للتأكيد.",
  gallery_title: "لقطات الحركة",
  gallery_kicker: "لحظات الحماس",
  gallery_follow: "تابعنا يومياً",
  testi_title: "آراء اللاعبين",
  faq_title: "هل لديك أسئلة؟",
  faq_item_0_q: "ما هو الحد الأدنى لعدد اللاعبين؟",
  faq_item_0_a:
    "الحد الأدنى 4 لاعبين (2 مقابل 2). الحد الأقصى 20 لاعباً. ننصح بـ 6+ لأفضل تجربة.",
  faq_item_1_q: "ما هو السن المسموح به؟",
  faq_item_1_a:
    "اللاعبون من سن 10 إلى 60 سنة. من هم دون 18 سنة يحتاجون موافقة الوالدين.",
  faq_item_2_q: "ماذا يجب أن أرتدي؟",
  faq_item_2_a:
    "ملابس مريحة لا تهتم بتوسيخها. نوفر أقنعة ومعدات حماية كاملة.",
  faq_item_3_q: "هل البينتبول آمن؟",
  faq_item_3_a:
    "بالتأكيد. جميع اللاعبين يتلقون إحاطة سلامة ويرتدون أقنعة كاملة الوجه.",
  faq_item_4_q: "كيف أحجز؟",
  faq_item_4_a:
    "استخدم نظام الحجز عبر الموقع، أو اتصل/واتساب على +216 46 209 091.",
  faq_item_5_q: "هل هناك عروض خاصة للنساء؟",
  faq_item_5_a:
    "نعم! نقدم فعاليات ترويجية مع خصومات في تواريخ محددة.",
  faq_item_6_q: "هل تقدمون باقات للشركات؟",
  faq_item_6_a:
    "نعم! باقات بناء فريق مخصصة لجميع أحجام الشركات.",
  contact_title: "احجز مغامرتك",
  contact_reach_title: "ابحث عنا وتواصل معنا",
  contact_address_block:
    "بالقرب من مول سوسة، طريق سيدي بوعلي، القلعة الكبرى، سوسة",
  contact_call_btn: "اتصل",
  contact_wa_btn: "واتساب",
  contact_map_intro:
    "بالقرب من مول سوسة، طريق سيدي بوعلي، القلعة الكبرى، سوسة",
  contact_book_title: "تريد الحجز؟",
  contact_book_sub: "انتقل إلى نظام الحجز التكتيكي.",
  contact_enter_cta: "ادخل الساحة",
  contact_wa_quick: "واتساب — تواصل سريع",
  contact_find: "موقعنا",
  contact_send: "إرسال",
  contact_success: "سنتواصل معك قريباً!",
  footer_links: "روابط سريعة",
  footer_services: "الخدمات",
  footer_contact: "اتصال",
  footer_rights: "© 2025 بينت بول سوسة. جميع الحقوق محفوظة.",
  footer_made: "صُنع بإتقان في تونس",
  wa_tooltip: "راسلنا على واتساب",
  loading: "جارٍ التحميل...",
  sound: "تفعيل الصوت",
  sound_off: "إيقاف الصوت",
};

const dictionaries: Record<Locale, Dict> = { en, fr, ar };

export type TranslationKey = keyof typeof en;

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem("pbs-locale", l);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pbs-locale") as Locale | null;
      if (saved && (saved === "en" || saved === "fr" || saved === "ar")) {
        setLocaleState(saved);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey) => dictionaries[locale][key] ?? en[key] ?? String(key),
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be inside I18nProvider");
  return ctx;
}

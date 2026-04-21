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
  nav_pack: "Packages",
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
  contact_title: "BOOK YOUR ADVENTURE",
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
  nav_pack: "Formules",
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
  contact_title: "RÉSERVEZ VOTRE AVENTURE",
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
  nav_pack: "الباقات",
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
  faq_title: "أسئلة شائعة؟",
  contact_title: "احجز مغامرتك",
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

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: keyof typeof en) => string;
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
    (key: keyof typeof en) => dictionaries[locale][key] ?? en[key] ?? String(key),
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

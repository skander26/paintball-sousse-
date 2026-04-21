"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Navbar } from "@/components/Navbar";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { SplatCursor } from "@/components/ui/SplatCursor";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

const HeroSection = dynamic(
  () => import("@/components/HeroSection").then((m) => m.HeroSection),
  { loading: () => <div className="min-h-[100dvh] bg-black-deep" /> },
);

const ExperiencesSection = dynamic(
  () =>
    import("@/components/ExperiencesSection").then((m) => m.ExperiencesSection),
);

const PackagesSection = dynamic(
  () => import("@/components/PackagesSection").then((m) => m.PackagesSection),
);

const TournamentSection = dynamic(
  () =>
    import("@/components/TournamentSection").then((m) => m.TournamentSection),
);

const GallerySection = dynamic(
  () => import("@/components/GallerySection").then((m) => m.GallerySection),
);

const TestimonialsSection = dynamic(
  () =>
    import("@/components/TestimonialsSection").then(
      (m) => m.TestimonialsSection,
    ),
);

const FAQSection = dynamic(
  () => import("@/components/FAQSection").then((m) => m.FAQSection),
);

const ContactSection = dynamic(
  () => import("@/components/ContactSection").then((m) => m.ContactSection),
);

const Footer = dynamic(() => import("@/components/Footer").then((m) => m.Footer));

export function HomeClient() {
  const [ready, setReady] = useState(false);
  const doneOnce = useRef(false);

  const onLoaded = useCallback(() => {
    if (doneOnce.current) return;
    doneOnce.current = true;
    setReady(true);
  }, []);

  useEffect(() => {
    return () => {
      void import("gsap/ScrollTrigger").then((mod) => {
        mod.ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        mod.ScrollTrigger.clearMatchMedia();
      });
    };
  }, []);

  return (
    <>
      {!ready && <LoadingScreen onDone={onLoaded} />}
      <ScrollProgress />
      <SplatCursor />
      <Navbar />
      <main>
        <HeroSection />
        <ExperiencesSection />
        <PackagesSection />
        <TournamentSection />
        <GallerySection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
        <Footer />
      </main>
      <WhatsAppFloat />
    </>
  );
}

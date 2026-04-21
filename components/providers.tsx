"use client";

import { MotionConfig, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { I18nProvider } from "@/lib/i18n";

export function Providers({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <I18nProvider>
      <MotionConfig reducedMotion={reduce ? "always" : "user"}>
        {children}
      </MotionConfig>
    </I18nProvider>
  );
}

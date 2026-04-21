"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

/** Upload client photo as /public/hero-character.png */
const HERO_CHARACTER_SRC = "/hero-character.png";

type Props = {
  className?: string;
};

export function HeroCharacterSlot({ className = "" }: Props) {
  const [imageFailed, setImageFailed] = useState(false);

  // 📸 CLIENT: Replace /public/hero-character.png with your character photo
  // Recommended: PNG with transparent background, min 800x1000px

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`relative z-[2] ${className}`}
    >
      {!imageFailed ? (
        <motion.div
          className="mx-auto w-fit"
          animate={{
            y: [0, -18, 0],
            rotate: [-1, 1, -1],
            filter: [
              "drop-shadow(0 0 30px rgba(232, 0, 28, 0.5))",
              "drop-shadow(0 0 50px rgba(232, 0, 28, 0.8))",
              "drop-shadow(0 0 30px rgba(232, 0, 28, 0.5))",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            src={HERO_CHARACTER_SRC}
            alt=""
            width={800}
            height={1000}
            className="mx-auto h-auto max-h-[280px] w-full max-w-[min(280px,70vw)] object-contain lg:max-h-[min(90vh,720px)] lg:w-[420px] lg:max-w-[420px]"
            sizes="(max-width: 1023px) min(280px,70vw), 420px"
            priority
            unoptimized
            onError={() => setImageFailed(true)}
          />
        </motion.div>
      ) : (
        <div
          className="mx-auto flex min-h-[400px] w-full max-w-[420px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand-red px-6 text-center font-body text-[14px] text-muted"
          aria-live="polite"
        >
          Drop your hero image at /public/hero-character.png
        </div>
      )}
    </motion.div>
  );
}

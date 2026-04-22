"use client";

import { ICONS } from "@/icons";
import { PBIcon } from "@/components/ui/PBIcon";
import { motion } from "framer-motion";
import { useReservationStore } from "@/store/reservationStore";
import { resumeAudioContext, startAmbientLoop, stopAmbientLoop } from "@/lib/reserveSounds";

export function AmbientAudioToggle() {
  const ambientOn = useReservationStore((s) => s.ambientOn);
  const setAmbientOn = useReservationStore((s) => s.setAmbientOn);

  return (
    <motion.button
      type="button"
      aria-label={ambientOn ? "Couper le son ambiant" : "Activer le son ambiant"}
      className="fixed right-4 top-[max(5.5rem,env(safe-area-inset-top)+4rem)] z-[70] rounded-full border border-white/15 bg-black/50 p-2 text-white/80 backdrop-blur-sm"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        resumeAudioContext();
        const next = !ambientOn;
        setAmbientOn(next);
        if (next) startAmbientLoop();
        else stopAmbientLoop();
      }}
    >
      {ambientOn ? (
        <PBIcon icon={ICONS.volumeOn} size={20} />
      ) : (
        <PBIcon icon={ICONS.volumeOff} size={20} />
      )}
    </motion.button>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import type { ClassId } from "@/data/classes";
import { useReservationStore } from "@/store/reservationStore";

const IDS: ClassId[] = ["recruit", "soldier", "warrior", "elite", "commander"];

export function ReserveUrlSync() {
  const searchParams = useSearchParams();
  const setPreselection = useReservationStore((s) => s.setPreselection);
  const q = searchParams.toString();

  useEffect(() => {
    const pkg = searchParams.get("package");
    const balls = searchParams.get("balls");
    if (!pkg || !IDS.includes(pkg as ClassId)) {
      return;
    }
    const b = balls ? parseInt(balls, 10) : null;
    setPreselection(pkg as ClassId, Number.isFinite(b) ? b : null);
  }, [q, searchParams, setPreselection]);

  return null;
}

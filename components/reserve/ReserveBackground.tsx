"use client";

export function ReserveBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div
        className="reserve-radar h-[min(140vw,900px)] w-[min(140vw,900px)] rounded-full opacity-[0.07]"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, rgba(232,0,28,0.35) 25deg, transparent 50deg)`,
        }}
      />
      </div>
    </div>
  );
}

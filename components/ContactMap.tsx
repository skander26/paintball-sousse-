"use client";

import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import { MAP_CENTER } from "@/lib/constants";

const LEAFLET_CSS_ID = "leaflet-css-bundle";
const LEAFLET_CSS_HREF =
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

function ensureLeafletCss() {
  if (typeof document === "undefined") return;
  if (document.getElementById(LEAFLET_CSS_ID)) return;
  const link = document.createElement("link");
  link.id = LEAFLET_CSS_ID;
  link.rel = "stylesheet";
  link.href = LEAFLET_CSS_HREF;
  document.head.appendChild(link);
}

const pin = L.divIcon({
  className: "pbs-pin",
  html: `<div style="width:26px;height:26px;border-radius:999px;background:#E8001C;border:2px solid #fff;box-shadow:0 0 18px rgba(232,0,28,0.55);"></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

export function ContactMap() {
  useEffect(() => {
    ensureLeafletCss();
  }, []);

  return (
    <div className="relative z-0 h-[300px] w-full overflow-hidden rounded-xl border border-white/10 shadow-card">
      <MapContainer
        center={MAP_CENTER}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
        aria-label="Carte Paintball Sousse"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={MAP_CENTER} icon={pin} />
      </MapContainer>
    </div>
  );
}

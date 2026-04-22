'use client'

import { useMemo } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MAP_CENTER } from '@/lib/constants'

export default function ContactMapInner() {
  const icon = useMemo(
    () =>
      L.divIcon({
        className: '',
        html: `<div style="width:16px;height:16px;border-radius:9999px;background:#E8001C;box-shadow:0 0 18px rgba(232,0,28,0.9);border:2px solid #fff"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      }),
    [],
  )

  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={14}
      scrollWheelZoom={false}
      className="h-full w-full rounded-[var(--radius-lg)]"
      style={{ background: '#0f0e11' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <Marker position={MAP_CENTER} icon={icon} />
    </MapContainer>
  )
}

"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";

const MapContainer = dynamic(async () => (await import("react-leaflet")).MapContainer, { ssr: false });
const TileLayer = dynamic(async () => (await import("react-leaflet")).TileLayer, { ssr: false });
const Marker = dynamic(async () => (await import("react-leaflet")).Marker, { ssr: false });
const Popup = dynamic(async () => (await import("react-leaflet")).Popup, { ssr: false });

// Fix default icon paths in Leaflet when using bundlers
import L from "leaflet";
// @ts-expect-error leaflet default icon path override (private type)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export type MapMarker = {
  id: string;
  position: LatLngExpression;
  label?: string;
};

export default function Map({
  center = [37.7749, -122.4194],
  zoom = 11,
  markers = [],
  className,
  height = 360,
}: {
  center?: LatLngExpression;
  zoom?: number;
  markers?: MapMarker[];
  className?: string;
  height?: number;
}) {
  return (
    <div className={className} style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
        style={{ height: "100%", width: "100%", borderRadius: 8, overflow: "hidden" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m) => (
          <Marker key={m.id} position={m.position}>
            {m.label ? <Popup>{m.label}</Popup> : null}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}


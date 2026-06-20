"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";

declare global {
  interface Window {
    selectLocationFromMap?: (name: string, lat: number, lng: number) => void;
  }
}

interface LocationMapProps {
  onSelectLocation: (lat: number, lng: number, name: string) => void;
  initialLat?: number | null;
  initialLng?: number | null;
}

export default function LocationMap({
  onSelectLocation,
  initialLat,
  initialLng,
}: LocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainer.current) return;

    import("leaflet").then((leaflet) => {
      const L = leaflet.default;

      const DefaultIcon = L.icon({
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      L.Marker.prototype.options.icon = DefaultIcon;

      const defaultLat = initialLat || -6.2088;
      const defaultLng = initialLng || 106.8456;

      if (mapRef.current) {
        mapRef.current.remove();
      }

      if (!mapContainer.current) return;

      mapRef.current = L.map(mapContainer.current).setView(
        [defaultLat, defaultLng],
        13,
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);

      if (initialLat && initialLng) {
        markerRef.current = L.marker([initialLat, initialLng], {
          draggable: true,
        }).addTo(mapRef.current);

        markerRef.current.on("drag", () => {
          void updateMarker();
        });
      }

      mapRef.current.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;

        if (markerRef.current) {
          markerRef.current.remove();
        }

        if (!mapRef.current) return;

        markerRef.current = L.marker([lat, lng], { draggable: true })
          .addTo(mapRef.current)
          .bindPopup(
            `<b>Lokasi Terpilih</b><br>${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          );

        markerRef.current.on("drag", () => {
          void updateMarker();
        });

        markerRef.current.openPopup();
      });

      const updateMarker = async () => {
        if (!markerRef.current) return;

        const { lat, lng } = markerRef.current.getLatLng();

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          );
          const data = (await response.json()) as {
            address?: {
              city?: string;
              town?: string;
              village?: string;
              county?: string;
            };
          };

          const locationName =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

          markerRef.current
            .setPopupContent(
              `<b>${locationName}</b><br><button style="width: 100%; padding: 8px; margin-top: 8px; background: #1A1A1A; color: #EAB308; border: none; border-radius: 4px; cursor: pointer;" onclick="window.selectLocationFromMap('${locationName}', ${lat}, ${lng})">Pilih Lokasi Ini</button>`,
            )
            .openPopup();

          window.selectLocationFromMap = (
            name: string,
            selectLat: number,
            selectLng: number,
          ) => {
            onSelectLocation(selectLat, selectLng, name);
          };
        } catch (err) {
          const fallbackName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          markerRef.current
            .setPopupContent(
              `<b>${fallbackName}</b><br><button style="width: 100%; padding: 8px; margin-top: 8px; background: #1A1A1A; color: #EAB308; border: none; border-radius: 4px; cursor: pointer;" onclick="window.selectLocationFromMap('${fallbackName}', ${lat}, ${lng})">Pilih Lokasi Ini</button>`,
            )
            .openPopup();

          window.selectLocationFromMap = (
            name: string,
            selectLat: number,
            selectLng: number,
          ) => {
            onSelectLocation(selectLat, selectLng, name);
          };
        }
      };

      setIsLoading(false);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [initialLat, initialLng, onSelectLocation]);

  return (
    <div>
      {isLoading && (
        <p className="text-center text-sm text-[#1A1A1A]">Loading map...</p>
      )}
      <div
        ref={mapContainer}
        style={{
          height: "300px",
          width: "100%",
          borderRadius: "0.5rem",
          display: isLoading ? "none" : "block",
        }}
      />
      <p className="text-xs text-[#1A1A1A] mt-2">
        Klik di map untuk pilih lokasi, atau drag marker untuk ubah posisi
      </p>
    </div>
  );
}

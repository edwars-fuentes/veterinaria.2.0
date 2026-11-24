import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  open: boolean;
};

function MapaRancagua({ open }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current).setView([-34.1708, -70.7424], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    L.marker([-34.1708, -70.7424])
      .addTo(map)
      .bindPopup("Rancagua, Chile");

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (open && mapInstance.current) {
      setTimeout(() => {
        mapInstance.current?.invalidateSize();
      }, 150);
    }
  }, [open]);

  return (
    <div
      ref={mapRef}
      style={{
        height: "350px",
        width: "100%",
        borderRadius: "8px",
        marginTop: "12px",
      }}
    />
  );
}

export default MapaRancagua;
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// แก้ path ไอคอน default ของ Leaflet ให้โหลดได้เวลา build React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export default function MapCard({ onCenterToLocation }) {
  const mapEl = useRef(null);
  const mapRef = useRef(null);

  // 🏠 บ้าน = มก.ศรีราชา
  const home = { lat: 13.1467, lng: 100.9187 };

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map(mapEl.current, {
      center: home,
      zoom: 15,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    L.marker(home).addTo(map).bindPopup("🏠 Home: KU Sriracha").openPopup();

    mapRef.current = map;
  }, []);

  return (
    <div className="card">
      <div className="card__head">
        <h3 className="card__title">MAP</h3>
        <div className="row gap tiny muted">
          <span>
            Home: {home.lat.toFixed(3)}, {home.lng.toFixed(3)}
          </span>
          <button
            className="btn tiny"
            onClick={() => {
              // ส่งพิกัดศูนย์กลางแผนที่ออกไปให้ Weather แสดง ถ้าต้องการ
              const c = mapRef.current?.getCenter();
              if (c && onCenterToLocation) onCenterToLocation(c.lat, c.lng);
            }}
          >
            Use map center
          </button>
        </div>
      </div>

      <div
        ref={mapEl}
        style={{
          height: 260,
          width: "100%",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid var(--card-border)",
        }}
      />
    </div>
  );
}

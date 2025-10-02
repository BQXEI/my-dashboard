import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapCard({ onLocation }) {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = L.map("map", { center: [13.736717, 100.523186], zoom: 6 });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
    mapRef.current = map;

    return () => map.remove();
  }, []);

  function locateMe() {
    if (!navigator.geolocation) {
      alert("เบราว์เซอร์ของคุณไม่รองรับ Geolocation");
      return;
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      const marker = L.marker([latitude, longitude]).addTo(mapRef.current);
      marker.bindPopup("📍 คุณอยู่ที่นี่").openPopup();
      mapRef.current.setView([latitude, longitude], 13);
      // ส่งค่า lat/lon ไปให้ App
      if (onLocation) onLocation(latitude, longitude);
    });
  }

  return (
    <div className="card">
      <div className="card__head">
        <h3 className="card__title">MAP</h3>
        <button className="btn" onClick={locateMe}>📍 Locate me</button>
      </div>
      <div id="map" style={{ height: "300px", borderRadius: "8px" }} />
    </div>
  );
}

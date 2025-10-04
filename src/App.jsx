import { useEffect, useMemo, useState } from "react";
import "./App.css";

import Card from "./components/Card";
import Pill from "./components/Pill";
import Switch from "./components/Switch";
import Slider from "./components/Slider";
import RoomTabs from "./components/RoomTabs";
import UserProfile from "./components/UserProfile";
import MapCard from "./components/MapCard";

export default function App() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* 👤 User Profile State */
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return (
      (saved && JSON.parse(saved)) || {
        name: "Nitipoom Phunphong",
        email: "nitipoom@ku.th",
        role: "Owner",
        avatarUrl: "",
      }
    );
  });
  useEffect(() => localStorage.setItem("user", JSON.stringify(user)), [user]);
  function handleLogout() {
    alert("Logged out");
    setUser({ name: "Guest", email: "", role: "Visitor", avatarUrl: "" });
  }

  /* Weather */
  const [weather, setWeather] = useState({
    location: "Sriracha, TH",
    condition: "Partly Cloudy",
    temp: 31,
    high: 33,
    low: 26,
    wind: 8,
    aqi: 54,
  });
  function handleLocation(lat, lon) {
    setWeather((w) => ({ ...w, location: `${lat.toFixed(3)}, ${lon.toFixed(3)}` }));
  }

  /* Lights */
  const [lights, setLights] = useState({
    Living: true,
    Kitchen: false,
    Bedroom: true,
    Office: false,
    Balcony: false,
  });
  const lightNames = Object.keys(lights);
  const totalOn = useMemo(() => Object.values(lights).filter(Boolean).length, [lights]);
  const toggleLight = (room) => setLights((s) => ({ ...s, [room]: !s[room] }));

  /* Climate (global + per-room) */
  const [temp, setTemp] = useState(24);
  const [humidity] = useState(58);
  const [hvacMode, setHvacMode] = useState("cool");
  const [roomTarget, setRoomTarget] = useState({
    Living: 22,
    Kitchen: 24,
    Bedroom: 21,
    Office: 23,
    Balcony: 26,
  });

  /* Energy */
  const [energy, setEnergy] = useState({
    todayKWh: 18.4,
    monthKWh: 462.2,
    costTHB: 225.8,
    hourly: [1.0, 1.1, 0.9, 0.8, 0.7, 1.0, 1.5, 1.9, 2.4, 2.1, 1.7, 1.5],
  });
  useEffect(() => {
    const id = setInterval(() => {
      setEnergy((e) => {
        const next = [...e.hourly];
        next.shift();
        next.push(
          Math.max(0.6, Math.min(2.6, next[next.length - 1] + (Math.random() - 0.5)))
        );
        return { ...e, hourly: next };
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);
  const maxEnergy = Math.max(...energy.hourly);
  const minEnergy = Math.min(...energy.hourly);

  /* Notifications */
  const [notifications, setNotifications] = useState([
    { id: 1, type: "info", text: "Washer finished a cycle (10:40)", read: false },
    { id: 2, type: "warn", text: "Garage door left open", read: false },
    { id: 3, type: "info", text: "Motion detected: Driveway (10:32)", read: true },
  ]);
  const markAllRead = () => setNotifications((n) => n.map((x) => ({ ...x, read: true })));

  /* Rooms view */
  const [selectedRoom, setSelectedRoom] = useState("All");
  const isAll = selectedRoom === "All";

  /* Helpers */
  function RoomLightCard({ room }) {
    return (
      <Card
        title={`${room} • Light`}
        right={<span className="muted tiny">{lights[room] ? "On" : "Off"}</span>}
      >
        <div className="row between">
          <div className="label">{room}</div>
          <Switch checked={lights[room]} onChange={() => toggleLight(room)} />
        </div>
      </Card>
    );
  }

  function RoomClimateCard({ room }) {
    const t = roomTarget[room];
    const setT = (v) => setRoomTarget((s) => ({ ...s, [room]: v }));
    return (
      <Card title={`${room} • Climate`} right={<span className="muted tiny">{humidity}% RH</span>}>
        <div className="row gap">
          <div className="xl">{t}°</div>
          <div className="grow">
            <div className="row between tiny">
              <span>
                Target: <b className="accent">{t}°C</b>
              </span>
              <span className="muted">Mode: {hvacMode.toUpperCase()}</span>
            </div>
            <Slider value={t} setValue={setT} min={16} max={32} />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header sticky">
          <div className="header__left">
            <h1 className="header__title">Home</h1>
            <p className="header__sub">Smart Home Dashboard</p>
          </div>

          <div className="header__right">
            <div className="header__clock">{now.toLocaleString()}</div>
            <div className="header__modes">
              {["off", "cool", "heat", "auto"].map((m) => (
                <Pill key={m} active={hvacMode === m} onClick={() => setHvacMode(m)}>
                  {m.toUpperCase()}
                </Pill>
              ))}
            </div>

            {/* 👤 User Profile */}
            <UserProfile user={user} onLogout={handleLogout} />
          </div>
        </header>

        {/* Room tabs */}
        <div className="row between mt mb">
          <div className="muted small">Rooms</div>
          <RoomTabs selected={selectedRoom} onSelect={setSelectedRoom} />
        </div>

        {/* Grid */}
        <div className="grid">
          {/* --- ALL VIEW --- */}
          {isAll ? (
            <>
              {/* Weather */}
              <Card title="WEATHER" right={<span className="muted">{weather.location}</span>}>
                <div className="row gap">
                  <div className="xxl">{weather.temp}°C</div>
                  <div className="muted small">
                    <div>{weather.condition}</div>
                    <div>
                      H {weather.high}° · L {weather.low}° · Wind {weather.wind} km/h
                    </div>
                    <div>AQI {weather.aqi}</div>
                  </div>
                </div>
              </Card>

              {/* Lights */}
              <Card
                title="LIGHTS"
                right={<span className="muted small">{totalOn}/{lightNames.length} on</span>}
              >
                <div className="wrap gap">
                  {lightNames.map((room) => (
                    <div key={room} className="tile">
                      <div>
                        <div className="label">{room}</div>
                        <div className="muted tiny">{lights[room] ? "On" : "Off"}</div>
                      </div>
                      <Switch checked={lights[room]} onChange={() => toggleLight(room)} />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Climate */}
              <Card title="CLIMATE" right={<span className="muted small">{humidity}% RH</span>}>
                <div className="row gap">
                  <div className="xxl">{temp}°</div>
                  <div className="grow">
                    <div className="row between tiny">
                      <span>
                        Target (global):{" "}
                        <b className="accent">
                          {Math.round(
                            Object.values(roomTarget).reduce((a, b) => a + b, 0) /
                              Object.keys(roomTarget).length
                          )}
                          °C
                        </b>
                      </span>
                      <span className="muted">Mode: {hvacMode.toUpperCase()}</span>
                    </div>
                    <div className="row gap mt">
                      <button className="btn" onClick={() => setTemp((t) => Math.max(10, t - 1))}>
                        –
                      </button>
                      <button className="btn" onClick={() => setTemp((t) => Math.min(40, t + 1))}>
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Map: บ้าน = มก.ศรีราชา */}
              <MapCard onCenterToLocation={handleLocation} />

              {/* Energy */}
              <Card
                title="ENERGY (TODAY)"
                right={
                  <span className="tiny muted">
                    min {minEnergy.toFixed(1)} · max {maxEnergy.toFixed(1)}
                  </span>
                }
              >
                <div className="bars">
                  {energy.hourly.map((v, i) => (
                    <div
                      key={i}
                      className="bars__col"
                      style={{ height: `${12 + v * 22}px` }}
                      title={`${v.toFixed(2)} kWh`}
                    />
                  ))}
                </div>
                <div className="muted small mt">
                  <div>
                    {energy.todayKWh.toFixed(1)} kWh · ~ ฿{energy.costTHB.toFixed(2)}
                  </div>
                  <div className="tiny">Month: {energy.monthKWh} kWh</div>
                </div>
              </Card>

              {/* Camera */}
              <Card title="DRIVEWAY CAMERA">
                <div className="camera" />
                <div className="row gap mt">
                  <button className="btn">Snapshot</button>
                  <button className="btn">Record</button>
                </div>
              </Card>

              {/* Notifications */}
              <Card
                title="NOTIFICATIONS"
                right={
                  <button className="btn tiny" onClick={markAllRead}>
                    Mark all read
                  </button>
                }
              >
                <ul className="list">
                  {notifications.map((n) => (
                    <li key={n.id} className={`note ${n.read ? "note--read" : ""}`}>
                      <span className={`dot ${n.type}`}></span>
                      <span className="note__text">{n.text}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Security */}
              <Card
                title="SECURITY"
                right={<span className={`small ${false ? "danger" : "ok"}`}>Disarmed</span>}
              >
                <div className="col gap">
                  <div className="grid-3 gap">
                    {Object.entries({ Front: "Closed", Back: "Open", Garage: "Open" }).map(
                      ([k, v]) => (
                        <div key={k} className="tile">
                          <div className="tiny muted">{k}</div>
                          <div className={`label ${v === "Open" ? "danger" : ""}`}>{v}</div>
                        </div>
                      )
                    )}
                  </div>
                  <div className="row between">
                    <div className="label">Alarm</div>
                    <Switch checked={false} onChange={() => {}} />
                  </div>
                </div>
              </Card>
            </>
          ) : (
            /* --- ROOM VIEW --- */
            <>
              <RoomLightCard room={selectedRoom} />
              <RoomClimateCard room={selectedRoom} />
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="footer">
          Demo UI inspired by Home Assistant Lovelace · Frontend only (mock data).
        </footer>
      </div>
    </div>
  );
}
//
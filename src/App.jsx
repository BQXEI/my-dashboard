import { useEffect, useMemo, useState } from "react";
import "./App.css";
import MapCard from "./MapCard";

/* ---------- Small UI helpers ---------- */
function Card({ title, right, children }) {
  return (
    <div className="card">
      <div className="card__head">
        <h3 className="card__title">{title}</h3>
        {right}
      </div>
      {children}
    </div>
  );
}

function Pill({ active, onClick, children }) {
  return (
    <button className={`pill ${active ? "pill--active" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

function Switch({ checked, onChange }) {
  return (
    <button
      className={`switch ${checked ? "switch--on" : ""}`}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      title={checked ? "On" : "Off"}
    >
      <span className="switch__knob" />
    </button>
  );
}

function Slider({ value, setValue, min = 0, max = 100, step = 1 }) {
  return (
    <input
      className="slider"
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
    />
  );
}

/* ---------- Main App ---------- */
export default function App() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

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
    setWeather((w) => ({
      ...w,
      location: `${lat.toFixed(3)}, ${lon.toFixed(3)}`,
    }));
  }

  // mock states
  const [lights, setLights] = useState({
    Living: true, Kitchen: false, Bedroom: true, Office: false, Balcony: false,
  });
  const lightNames = Object.keys(lights);
  const totalOn = useMemo(() => Object.values(lights).filter(Boolean).length, [lights]);

  const [temp, setTemp] = useState(24);
  const [targetTemp, setTargetTemp] = useState(22);
  const [humidity] = useState(58);
  const [hvacMode, setHvacMode] = useState("cool");

  const scenes = ["Relax", "Focus", "Movie", "Away"];
  const [activeScene, setActiveScene] = useState("Relax");

  const [doors] = useState({ Front: "Closed", Back: "Open", Garage: "Open" });
  const [alarm, setAlarm] = useState(false);

  const [energy, setEnergy] = useState({
    todayKWh: 18.4, monthKWh: 462.2, costTHB: 225.8,
    hourly: [1.0,1.1,0.9,0.8,0.7,1.0,1.5,1.9,2.4,2.1,1.7,1.5],
  });
  useEffect(() => {
    const id = setInterval(() => {
      setEnergy((e) => {
        const next = [...e.hourly];
        next.shift();
        next.push(Math.max(0.6, Math.min(2.6, next[next.length - 1] + (Math.random() - 0.5))));
        return { ...e, hourly: next };
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const [notifications, setNotifications] = useState([
    { id: 1, type: "info", text: "Washer finished a cycle (10:40)", read: false },
    { id: 2, type: "warn", text: "Garage door left open", read: false },
    { id: 3, type: "info", text: "Motion detected: Driveway (10:32)", read: true },
  ]);
  const markAllRead = () =>
    setNotifications((n) => n.map((x) => ({ ...x, read: true })));

  const toggleLight = (room) => setLights((s) => ({ ...s, [room]: !s[room] }));

  const maxEnergy = Math.max(...energy.hourly);
  const minEnergy = Math.min(...energy.hourly);

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
          </div>
        </header>

        {/* Grid */}
        <div className="grid">
          {/* Weather */}
          <Card title="WEATHER" right={<span className="muted">{weather.location}</span>}>
            <div className="row gap">
              <div className="xxl">{weather.temp}°C</div>
              <div className="muted small">
                <div>{weather.condition}</div>
                <div>H {weather.high}° · L {weather.low}° · Wind {weather.wind} km/h</div>
                <div>AQI {weather.aqi}</div>
              </div>
            </div>
          </Card>

          {/* Lights */}
          <Card title="LIGHTS" right={<span className="muted small">{totalOn}/{lightNames.length} on</span>}>
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
                  <span>Target: <b className="accent">{targetTemp}°C</b></span>
                  <span className="muted">Mode: {hvacMode.toUpperCase()}</span>
                </div>
                <Slider value={targetTemp} setValue={setTargetTemp} min={16} max={32} />
                <div className="row gap mt">
                  <button className="btn" onClick={() => setTemp((t) => Math.max(10, t - 1))}>–</button>
                  <button className="btn" onClick={() => setTemp((t) => Math.min(40, t + 1))}>+</button>
                </div>
              </div>
            </div>
          </Card>

        {/* Map */}
        <MapCard onLocation={handleLocation} />

        {/* Energy (enhanced) */}
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
            right={<span className={`small ${alarm ? "danger" : "ok"}`}>{alarm ? "Armed" : "Disarmed"}</span>}
          >
            <div className="col gap">
              <div className="grid-3 gap">
                {Object.entries(doors).map(([k, v]) => (
                  <div key={k} className="tile">
                    <div className="tiny muted">{k}</div>
                    <div className={`label ${v === "Open" ? "danger" : ""}`}>{v}</div>
                  </div>
                ))}
              </div>
              <div className="row between">
                <div className="label">Alarm</div>
                <Switch checked={alarm} onChange={setAlarm} />
              </div>
            </div>
          </Card>

          {/* Energy (enhanced) */}
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
          
        
        {/* Footer */}
        <footer className="footer">
          Demo UI inspired by Home Assistant Lovelace · Frontend only (mock data).
        </footer>
      </div>
    </div>
  </div>
  );
}

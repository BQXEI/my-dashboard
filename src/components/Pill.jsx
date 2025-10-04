export default function Pill({ children, active, onClick }) {
  return (
    <button
      className={`pill ${active ? "pill--active" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

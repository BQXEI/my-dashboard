const rooms = ["All", "Living", "Kitchen", "Bedroom", "Office", "Balcony"];

export default function RoomTabs({ selected, onSelect }) {
  return (
    <div className="tabs">
      {rooms.map((r) => (
        <button
          key={r}
          className={`tab ${selected === r ? "tab--active" : ""}`}
          onClick={() => onSelect(r)}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
//
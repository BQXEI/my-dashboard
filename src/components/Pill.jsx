export default function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
        active
          ? "bg-emerald-600 text-white border-emerald-700"
          : "bg-zinc-100 text-zinc-700 border-zinc-300 hover:bg-zinc-200"
      }`}
    >
      {children}
    </button>
  );
}

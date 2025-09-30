export default function Switch({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
        checked ? "bg-emerald-600" : "bg-zinc-300"
      }`}
      aria-pressed={checked}
      title={checked ? "On" : "Off"}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

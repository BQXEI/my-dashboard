export default function Card({ title, right, children }) {
  return (
    <div className="bg-white/80 rounded-2xl border border-zinc-200 shadow p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide uppercase text-zinc-700">
          {title}
        </h3>
        {right}
      </div>
      {children}
    </div>
  );
}

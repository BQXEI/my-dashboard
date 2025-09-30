export default function Slider({ value, setValue, min = 0, max = 100, step = 1 }) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
      className="w-full accent-emerald-600"
    />
  );
}

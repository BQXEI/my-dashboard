export default function Slider({ value, setValue, min, max }) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
      className="slider-input"
    />
  );
}

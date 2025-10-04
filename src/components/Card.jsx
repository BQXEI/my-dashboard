export default function Card({ title, right, children }) {
  return (
    <div className="card">
      <div className="card__head">
        <h3 className="card__title">{title}</h3>
        {right && <div className="card__right">{right}</div>}
      </div>
      <div className="card__content">{children}</div>
    </div>
  );
}
//
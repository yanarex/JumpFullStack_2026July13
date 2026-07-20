export default function PageHero({ eyebrow, title, text }) {
  return (
    <section className="page-hero">
      <div className="page-width">
        <p className="eyebrow light">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    </section>
  );
}

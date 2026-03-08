import mark from "../public/pyrexxbook.png";

export default function Brand({ compact = false }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <img className="brand-mark" src={mark} alt="Okai brand mark" />
      <div className="brand-copy">
        <span className="brand-name">Okai</span>
        {!compact && <span className="brand-tag">A sharper social rhythm for builders.</span>}
      </div>
    </div>
  );
}

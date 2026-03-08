import Brand from "./Brand";

export default function AuthLayout({ eyebrow, title, description, children, footer }) {
  return (
    <div className="auth-page">
      <section className="auth-visual">
        <Brand />
        <span className="auth-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="auth-stats">
          <article className="auth-stat">
            <strong>Stories</strong>
            <span>Curate quick visual moments with a cleaner storytelling rail.</span>
          </article>
          <article className="auth-stat">
            <strong>Signals</strong>
            <span>See real-time likes, follows, and comments without hunting through clutter.</span>
          </article>
          <article className="auth-stat">
            <strong>Presence</strong>
            <span>Profiles now feel like identity hubs, not placeholder records.</span>
          </article>
        </div>
      </section>

      <section className="auth-panel">
        <div className="surface auth-card">
          {children}
          {footer && <div className="auth-footer">{footer}</div>}
        </div>
      </section>
    </div>
  );
}

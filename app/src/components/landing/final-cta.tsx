import Link from "next/link";

export default function FinalCta() {
  return (
    <section className="final-cta">
      <div className="container final-cta-inner reveal">
        <span
          className="hero-badge"
          style={{ color: "var(--hero-ink-2)" }}
        >
          Free while in beta
        </span>
        <h2>
          Ready to find your <em>London home?</em>
        </h2>
        <p>
          Build your Rental Passport in two minutes. No filters. No endless
          scrolling. Just a conversation &mdash; and a shortlist that makes
          sense.
        </p>
        <Link href="/login?new=1" className="final-cta-button">
          Get started
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M5 12 H19 M13 6 L19 12 L13 18"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}

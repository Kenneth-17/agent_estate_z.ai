export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="nav-mark">Z</div>
          <span>Agent Estate Z</span>
          <span className="footer-tag">
            &middot; Built for Hackathon Track 3 &middot; The Invisible Tube
          </span>
        </div>
        <div className="footer-links">
          <a href="#problem">Problem</a>
          <a href="#how">How it works</a>
          <a href="#sources">Data</a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2 A10 10 0 0 0 8.84 21.5 C9.34 21.58 9.5 21.27 9.5 21 L9.5 19.31 C6.73 19.91 6.14 17.97 6.14 17.97 C5.68 16.81 5.03 16.5 5.03 16.5 C4.12 15.88 5.1 15.9 5.1 15.9 C6.1 15.97 6.63 16.93 6.63 16.93 C7.5 18.45 8.97 18 9.54 17.76 C9.63 17.11 9.89 16.67 10.17 16.42 C7.95 16.17 5.62 15.31 5.62 11.5 C5.62 10.39 6 9.5 6.65 8.79 C6.55 8.54 6.2 7.5 6.75 6.15 C6.75 6.15 7.59 5.88 9.5 7.17 A9.4 9.4 0 0 1 14.5 7.17 C16.41 5.88 17.25 6.15 17.25 6.15 C17.8 7.5 17.45 8.54 17.35 8.79 C18 9.5 18.38 10.39 18.38 11.5 C18.38 15.32 16.04 16.17 13.81 16.41 C14.17 16.72 14.5 17.33 14.5 18.26 L14.5 21 C14.5 21.27 14.66 21.59 15.17 21.5 A10 10 0 0 0 12 2 Z" />
            </svg>
          </a>
        </div>
        <div className="footer-copyright">
          &copy; 2026 &middot; Agent Estate Z &middot; LONDON
        </div>
      </div>
    </footer>
  );
}

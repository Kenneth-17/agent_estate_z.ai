import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-scene">
        <div className="sky"></div>
        <div className="stars"></div>
        {/* Aerial London skyline SVG */}
        <svg
          className="hero-skyline"
          viewBox="0 0 1440 400"
          preserveAspectRatio="xMidYMax slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="skyGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#1a2442" stopOpacity={0} />
              <stop offset="60%" stopColor="#0e1528" stopOpacity={0.85} />
              <stop offset="100%" stopColor="#0a0e1a" stopOpacity={1} />
            </linearGradient>
            <linearGradient id="thamesGrad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#7EB8E8" stopOpacity={0.15} />
              <stop offset="50%" stopColor="#E8C76A" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#7EB8E8" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          {/* Thames curve glow */}
          <path
            d="M -20 320 Q 220 300 380 330 T 720 310 Q 920 300 1100 340 T 1460 320 L 1460 400 L -20 400 Z"
            fill="url(#thamesGrad)"
            opacity="0.8"
          />
          {/* Far building silhouettes */}
          <g fill="#0f1a2e" opacity="0.85">
            <rect x="40" y="260" width="50" height="140" />
            <rect x="90" y="240" width="30" height="160" />
            <rect x="130" y="270" width="40" height="130" />
            {/* Shard */}
            <polygon points="360,120 395,400 325,400" />
            <rect x="440" y="220" width="45" height="180" />
            <rect x="500" y="255" width="32" height="145" />
            {/* Gherkin-ish */}
            <ellipse cx="600" cy="260" rx="18" ry="50" />
            <rect x="582" y="290" width="36" height="110" />
            {/* Big tower (Canary) */}
            <rect x="680" y="175" width="50" height="225" />
            <polygon points="680,175 705,150 730,175" />
            <rect x="750" y="230" width="38" height="170" />
            <rect x="805" y="260" width="44" height="140" />
            <rect x="870" y="210" width="52" height="190" />
            <rect x="940" y="240" width="34" height="160" />
            {/* Another cluster */}
            <rect x="1000" y="265" width="44" height="135" />
            <rect x="1060" y="235" width="38" height="165" />
            <rect x="1115" y="255" width="50" height="145" />
            <rect x="1180" y="220" width="42" height="180" />
            <rect x="1240" y="250" width="32" height="150" />
            <rect x="1290" y="270" width="46" height="130" />
            <rect x="1355" y="245" width="38" height="155" />
          </g>
          {/* Lit windows */}
          <g fill="#E8C76A" opacity="0.55">
            <rect x="370" y="180" width="2" height="3" />
            <rect x="375" y="210" width="2" height="3" />
            <rect x="455" y="240" width="2" height="3" />
            <rect x="465" y="280" width="2" height="3" />
            <rect x="475" y="320" width="2" height="3" />
            <rect x="690" y="200" width="2" height="3" />
            <rect x="700" y="240" width="2" height="3" />
            <rect x="710" y="280" width="2" height="3" />
            <rect x="720" y="320" width="2" height="3" />
            <rect x="885" y="240" width="2" height="3" />
            <rect x="895" y="280" width="2" height="3" />
            <rect x="910" y="320" width="2" height="3" />
            <rect x="1075" y="270" width="2" height="3" />
            <rect x="1085" y="310" width="2" height="3" />
            <rect x="1195" y="260" width="2" height="3" />
            <rect x="1205" y="300" width="2" height="3" />
          </g>
          {/* Sky overlay fade to bg */}
          <rect
            x="0"
            y="0"
            width="1440"
            height="400"
            fill="url(#skyGrad)"
          />
        </svg>
        {/* Network overlay (pulsing connection lines) */}
        <svg
          className="hero-network"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <g stroke="#C2F26E" strokeWidth="0.6" fill="none" opacity="0.5">
            <path
              className="pulse-line"
              d="M 180 250 Q 400 400 720 450 T 1260 250"
            />
            <path
              className="pulse-line"
              d="M 240 520 Q 480 480 720 500 T 1200 480"
              style={{ animationDelay: "-1s" }}
            />
            <path
              className="pulse-line"
              d="M 380 180 Q 600 350 720 420 T 1080 180"
              style={{ animationDelay: "-2s" }}
            />
            <path
              className="pulse-line"
              d="M 200 620 Q 500 580 720 550 T 1220 620"
              style={{ animationDelay: "-0.5s" }}
            />
          </g>
          <g fill="#C2F26E">
            <circle className="pulse-dot" cx="180" cy="250" r="3" />
            <circle
              className="pulse-dot"
              cx="1260"
              cy="250"
              r="3"
              style={{ animationDelay: "-0.5s" }}
            />
            <circle
              className="pulse-dot"
              cx="240"
              cy="520"
              r="3"
              style={{ animationDelay: "-1s" }}
            />
            <circle
              className="pulse-dot"
              cx="1200"
              cy="480"
              r="3"
              style={{ animationDelay: "-1.5s" }}
            />
            <circle
              className="pulse-dot"
              cx="380"
              cy="180"
              r="3"
              style={{ animationDelay: "-2s" }}
            />
            <circle
              className="pulse-dot"
              cx="1080"
              cy="180"
              r="3"
              style={{ animationDelay: "-2.5s" }}
            />
            <circle
              className="pulse-dot"
              cx="200"
              cy="620"
              r="3"
              style={{ animationDelay: "-3s" }}
            />
            <circle
              className="pulse-dot"
              cx="720"
              cy="420"
              r="4"
              fill="#E8C76A"
              style={{ animationDelay: "-0.3s" }}
            />
          </g>
        </svg>
      </div>

      <div className="container hero-inner">
        <div className="hero-text">
          <span className="hero-badge">AI-Powered London Rental Search</span>

          <h1>
            Stop Searching.
            <br />
            <span className="stroke">Start Matching.</span>
          </h1>
          <p className="hero-sub">
            Rental platforms give you six filters for a problem with infinite
            dimensions. We give you an AI agent that understands your life and
            scores every London listing against it.
          </p>

          <div className="hero-ctas">
            <Link href="/login?new=1" className="cta-primary">
              Find your home
              <svg
                width="14"
                height="14"
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
            <a href="#how" className="cta-secondary">
              See how it works
            </a>
          </div>

          <div className="hero-trust">
            <span>
              <span className="hero-trust-dot"></span>&nbsp; 6 live data
              sources
            </span>
            <span>&middot;</span>
            <span>Right-to-Rent ready</span>
            <span>&middot;</span>
            <span>Built in London</span>
          </div>
        </div>

        {/* Right-side London telephone box + floating mockup */}
        <div className="hero-visual">
          {/* London phone box */}
          <svg
            className="hero-phonebox"
            viewBox="0 0 200 420"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="pbBody" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#6b0e0e" />
                <stop offset="40%" stopColor="#c51f1f" />
                <stop offset="70%" stopColor="#a31818" />
                <stop offset="100%" stopColor="#4e0808" />
              </linearGradient>
              <linearGradient id="pbGlow" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#FFE9A8" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#E8C76A" stopOpacity={0.7} />
              </linearGradient>
              <radialGradient id="pbHalo" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#FFDD8A" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#FFDD8A" stopOpacity={0} />
              </radialGradient>
              <linearGradient id="pbReflect" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#FFE9A8" stopOpacity={0} />
                <stop offset="50%" stopColor="#E8C76A" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#c51f1f" stopOpacity={0} />
              </linearGradient>
            </defs>
            {/* warm halo */}
            <ellipse
              cx="100"
              cy="180"
              rx="140"
              ry="180"
              fill="url(#pbHalo)"
            />
            {/* shadow under box */}
            <ellipse cx="100" cy="400" rx="80" ry="8" fill="#000" opacity="0.45" />
            {/* base plinth */}
            <rect x="28" y="388" width="144" height="14" fill="#2a0606" />
            <rect x="34" y="384" width="132" height="6" fill="#3a0a0a" />
            {/* body */}
            <rect
              x="36"
              y="60"
              width="128"
              height="328"
              fill="url(#pbBody)"
              rx="2"
            />
            {/* body side shading */}
            <rect
              x="36"
              y="60"
              width="8"
              height="328"
              fill="#4e0808"
              opacity="0.6"
            />
            <rect
              x="156"
              y="60"
              width="8"
              height="328"
              fill="#3a0606"
              opacity="0.8"
            />
            {/* roof */}
            <rect x="26" y="48" width="148" height="14" fill="#4a0808" />
            <rect x="30" y="40" width="140" height="10" fill="#5c0a0a" />
            {/* crown cap */}
            <rect x="44" y="28" width="112" height="14" fill="#4e0808" />
            {/* TELEPHONE label plate */}
            <rect x="50" y="44" width="100" height="16" fill="#1a0404" />
            <text
              x="100"
              y="56"
              textAnchor="middle"
              fontFamily="Georgia, serif"
              fontSize="9"
              fontWeight="700"
              fill="#E8C76A"
              letterSpacing="0.1em"
            >
              TELEPHONE
            </text>
            {/* glass panes -- warm inner glow */}
            <g>
              {/* top panes */}
              <rect x="48" y="72" width="48" height="54" fill="url(#pbGlow)" />
              <rect x="104" y="72" width="48" height="54" fill="url(#pbGlow)" />
              {/* middle panes (door + fixed) */}
              <rect x="48" y="130" width="48" height="60" fill="url(#pbGlow)" />
              <rect
                x="104"
                y="130"
                width="48"
                height="60"
                fill="url(#pbGlow)"
              />
              {/* lower panes */}
              <rect x="48" y="194" width="48" height="54" fill="url(#pbGlow)" />
              <rect
                x="104"
                y="194"
                width="48"
                height="54"
                fill="url(#pbGlow)"
              />
              {/* silhouette inside */}
              <ellipse
                cx="100"
                cy="160"
                rx="14"
                ry="22"
                fill="#4e0808"
                opacity="0.35"
              />
            </g>
            {/* window frames */}
            <g stroke="#2a0606" strokeWidth="2" fill="none">
              <rect x="48" y="72" width="48" height="54" />
              <rect x="104" y="72" width="48" height="54" />
              <rect x="48" y="130" width="48" height="60" />
              <rect x="104" y="130" width="48" height="60" />
              <rect x="48" y="194" width="48" height="54" />
              <rect x="104" y="194" width="48" height="54" />
              <line x1="100" y1="72" x2="100" y2="248" />
            </g>
            {/* Lower solid panel with crown */}
            <rect x="48" y="256" width="104" height="124" fill="#8b1414" />
            <rect
              x="48"
              y="256"
              width="104"
              height="124"
              fill="none"
              stroke="#2a0606"
              strokeWidth="2"
            />
            {/* crown motif */}
            <g transform="translate(100 300)" fill="#E8C76A" opacity="0.85">
              <path d="M -14 0 L -10 -10 L -6 -4 L 0 -14 L 6 -4 L 10 -10 L 14 0 L 14 4 L -14 4 Z" />
              <rect x="-16" y="4" width="32" height="3" />
            </g>
            {/* wet-pavement reflection */}
            <rect
              x="20"
              y="402"
              width="160"
              height="18"
              fill="url(#pbReflect)"
              opacity="0.55"
            />
          </svg>

          {/* Faint tube roundel on "wall" behind */}
          <svg
            className="hero-roundel"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <circle
              cx="50"
              cy="50"
              r="32"
              fill="none"
              stroke="#DC241F"
              strokeWidth="8"
              opacity="0.7"
            />
            <rect
              x="10"
              y="44"
              width="80"
              height="12"
              fill="#1a3a7a"
              opacity="0.85"
            />
            <text
              x="50"
              y="55"
              textAnchor="middle"
              fontFamily="Helvetica, Arial, sans-serif"
              fontSize="9"
              fontWeight="700"
              fill="#fff"
              letterSpacing="0.1em"
            >
              UNDERGROUND
            </text>
          </svg>

          {/* Data-line network radiating from phonebox */}
          <svg
            className="hero-radiate"
            viewBox="0 0 500 500"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <g stroke="#7EB8E8" strokeWidth="0.8" fill="none" opacity="0.55">
              <path
                className="radiate-line"
                d="M 250 250 Q 120 180 40 80"
              />
              <path
                className="radiate-line"
                d="M 250 250 Q 380 140 480 40"
                style={{ animationDelay: "-0.6s" }}
              />
              <path
                className="radiate-line"
                d="M 250 250 Q 100 260 20 240"
                style={{ animationDelay: "-1.2s" }}
              />
              <path
                className="radiate-line"
                d="M 250 250 Q 400 260 490 260"
                style={{ animationDelay: "-1.8s" }}
              />
              <path
                className="radiate-line"
                d="M 250 250 Q 180 380 80 470"
                style={{ animationDelay: "-2.4s" }}
              />
              <path
                className="radiate-line"
                d="M 250 250 Q 330 380 440 470"
                style={{ animationDelay: "-3s" }}
              />
            </g>
            <g fill="#7EB8E8">
              <circle className="radiate-dot" cx="40" cy="80" r="2.5" />
              <circle
                className="radiate-dot"
                cx="480"
                cy="40"
                r="2.5"
                style={{ animationDelay: "-0.6s" }}
              />
              <circle
                className="radiate-dot"
                cx="20"
                cy="240"
                r="2.5"
                style={{ animationDelay: "-1.2s" }}
              />
              <circle
                className="radiate-dot"
                cx="490"
                cy="260"
                r="2.5"
                style={{ animationDelay: "-1.8s" }}
              />
              <circle
                className="radiate-dot"
                cx="80"
                cy="470"
                r="2.5"
                style={{ animationDelay: "-2.4s" }}
              />
              <circle
                className="radiate-dot"
                cx="440"
                cy="470"
                r="2.5"
                style={{ animationDelay: "-3s" }}
              />
            </g>
          </svg>

          {/* Floating mockup */}
          <div className="hero-mockup-wrap">
            <span className="orbit-badge orbit-1">
              <svg className="ico" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
                <path
                  d="M12 8 V12 L15 14"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>{" "}
              23 min commute
            </span>
            <span className="orbit-badge orbit-2">
              <svg className="ico" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3 L20 6 V13 C20 17 16 20 12 21 C8 20 4 17 4 13 V6 Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>{" "}
              Low crime
            </span>
            <span className="orbit-badge orbit-3">
              <svg className="ico" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3 V21 M8 7 C 8 7 10 5 12 5 C14 5 16 7 16 7 M7 12 C7 12 10 10 12 10 C14 10 17 12 17 12 M6 17 C6 17 9 15 12 15 C15 15 18 17 18 17"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>{" "}
              3 parks nearby
            </span>
            <span className="orbit-badge orbit-4">
              <svg className="ico" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 14 C 7 10 11 10 14 14 M8 18 C 10 15 13 15 16 18 M12 8 C 14 6 17 6 19 8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>{" "}
              Clean air
            </span>
            <span className="orbit-badge orbit-5">
              <svg className="ico" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 18 V10 L12 4 L20 10 V18 Z M10 18 V13 H14 V18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>{" "}
              2 outstanding schools
            </span>
            <span className="orbit-badge orbit-6">
              <svg className="ico" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 7 V17 M18 7 V17 M9 9 V15 M15 9 V15 M4 12 H20"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>{" "}
              4 gyms within 1km
            </span>

            <div className="hero-mockup">
              <div className="hero-mockup-head">
                <span>AEZ &middot; Top match</span>
                <span className="hero-mockup-head-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </div>
              <div className="hero-mockup-card">
                <div className="hero-mockup-img">
                  <svg
                    className="mockup-mini-skyline"
                    viewBox="0 0 400 100"
                    preserveAspectRatio="xMidYMax slice"
                    aria-hidden="true"
                  >
                    <g fill="#0a0e1a" opacity="0.8">
                      <rect x="10" y="60" width="40" height="40" />
                      <rect x="55" y="45" width="30" height="55" />
                      <rect x="90" y="55" width="38" height="45" />
                      <polygon points="140,25 160,100 120,100" />
                      <rect x="170" y="50" width="32" height="50" />
                      <rect x="210" y="35" width="40" height="65" />
                      <rect x="260" y="55" width="28" height="45" />
                      <rect x="295" y="40" width="42" height="60" />
                      <rect x="345" y="55" width="36" height="45" />
                    </g>
                    <g fill="#E8C76A" opacity="0.6">
                      <rect x="145" y="45" width="1.5" height="2" />
                      <rect x="220" y="60" width="1.5" height="2" />
                      <rect x="305" y="58" width="1.5" height="2" />
                    </g>
                  </svg>
                  <div className="hero-mockup-match">
                    <div className="hero-mockup-match-inner">
                      <div className="hero-mockup-match-num">94%</div>
                      <div className="hero-mockup-match-label">match</div>
                    </div>
                  </div>
                </div>
                <div className="hero-mockup-body">
                  <div className="hero-mockup-title">
                    Bright 1-bed &middot; Bermondsey
                  </div>
                  <div className="hero-mockup-loc">
                    SE1 &middot; 8 min walk to London Bridge
                  </div>
                  <div className="hero-mockup-row">
                    <div className="hero-mockup-price">&pound;1,650/mo</div>
                    <div className="hero-mockup-meta">
                      1 bed &middot; 46m&sup2; &middot; Available 12 May
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

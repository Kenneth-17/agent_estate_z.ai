"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const SCENARIO_IDS = ["couple", "nurse", "student"] as const;
type ScenarioId = (typeof SCENARIO_IDS)[number];

export default function ScenarioCarousel() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activate = useCallback((idx: number) => {
    setActiveIdx(idx);
  }, []);

  // Auto-rotate every 9s, pauses on hover
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % SCENARIO_IDS.length);
    }, 9000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const handleTabClick = (idx: number) => {
    activate(idx);
    // Reset timer on manual click
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPaused(false);
  };

  const activeId = SCENARIO_IDS[activeIdx];

  return (
    <section
      id="scenarios"
      className="scenarios"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container">
        <div className="section-head center reveal">
          <span className="section-eyebrow">
            <span className="section-eyebrow-dot"></span>Real stories
          </span>
          <h2 className="section-title">
            Real People. Real Chaos. <em>Real Solutions.</em>
          </h2>
          <p className="section-sub">
            No rental platform can handle this. Watch what ours does.
          </p>
        </div>

        <div className="scn-tabs reveal" role="tablist">
          <button
            className={`scn-tab${activeId === "couple" ? " active" : ""}`}
            role="tab"
            onClick={() => handleTabClick(0)}
          >
            <span className="scn-tab-n">01</span>
            <span className="scn-tab-l">The Couple</span>
          </button>
          <button
            className={`scn-tab${activeId === "nurse" ? " active" : ""}`}
            role="tab"
            onClick={() => handleTabClick(1)}
          >
            <span className="scn-tab-n">02</span>
            <span className="scn-tab-l">The Nurse</span>
          </button>
          <button
            className={`scn-tab${activeId === "student" ? " active" : ""}`}
            role="tab"
            onClick={() => handleTabClick(2)}
          >
            <span className="scn-tab-n">03</span>
            <span className="scn-tab-l">The Student</span>
          </button>
        </div>

        {/* The Couple */}
        <div
          className={`scn-panel${activeId === "couple" ? " active" : ""} reveal`}
          data-scn-panel="couple"
        >
          <div className="scn-col scn-col-person">
            <svg
              className="scn-silhouette"
              viewBox="0 0 200 260"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="sgCouple" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#1a2442" />
                  <stop offset="100%" stopColor="#0a0e1a" />
                </linearGradient>
              </defs>
              {/* Alex */}
              <g fill="url(#sgCouple)">
                <circle cx="72" cy="62" r="22" />
                <path d="M 42 100 Q 42 94 50 92 L 94 92 Q 102 94 102 100 L 102 200 L 80 200 L 78 140 L 66 140 L 64 200 L 42 200 Z" />
              </g>
              {/* Priya */}
              <g fill="url(#sgCouple)">
                <circle cx="134" cy="66" r="20" />
                {/* hair */}
                <path d="M 114 58 Q 114 44 134 44 Q 154 44 154 60 L 154 74 Q 154 84 148 84 L 120 84 Q 114 80 114 74 Z" opacity="0.6" />
                {/* body with subtle bump for pregnant */}
                <path d="M 110 102 Q 110 96 118 94 L 152 94 Q 162 96 162 102 Q 162 130 170 150 Q 170 166 158 170 L 158 200 L 136 200 L 134 150 L 120 200 L 108 200 Z" />
              </g>
              {/* floor line */}
              <rect x="20" y="218" width="160" height="1" fill="#1a2442" opacity="0.4" />
            </svg>
            <div className="scn-person-name">Alex &amp; Priya</div>
            <div className="scn-person-tag">
              Moving from Manchester &middot; &pound;1,800 budget &middot; Baby due
              Sept
            </div>
          </div>

          <div className="scn-col scn-col-chat">
            <div className="scn-chat">
              <div className="scn-chat-head">
                <span className="scn-chat-dot"></span> agent.estatez.app
              </div>
              <div className="scn-bubble me">
                We&apos;re moving to London. I work Canary Wharf, she does night
                shifts at UCLH.
              </div>
              <div className="scn-bubble them">
                Great daytime transport <em>and</em> a safe night bus route.
                What&apos;s your budget?
              </div>
              <div className="scn-bubble me">
                &pound;1,800. I need a gym within 10 min, non-negotiable.
                She&apos;s pregnant, need a GP accepting new patients.
              </div>
              <div className="scn-bubble them building">
                <span className="scn-build-spin"></span>
                Building your Rental Passport
                <span className="scn-build-tag">5 data sources connecting</span>
              </div>
            </div>
            <div className="scn-sources">
              <span className="scn-src">
                <span className="scn-src-dot" style={{ background: "#4285F4" }}></span>
                Google Maps
              </span>
              <span className="scn-src">
                <span className="scn-src-dot" style={{ background: "#DC241F" }}></span>
                TfL
              </span>
              <span className="scn-src">
                <span className="scn-src-dot" style={{ background: "#1D3557" }}></span>
                Police.uk
              </span>
              <span className="scn-src">
                <span className="scn-src-dot" style={{ background: "#7EBC6F" }}></span>
                OpenStreetMap
              </span>
              <span className="scn-src">
                <span className="scn-src-dot" style={{ background: "#8B6F3A" }}></span>
                Postcodes.io
              </span>
            </div>
          </div>

          <div className="scn-col scn-col-compare">
            <div className="scn-fail">
              <div className="scn-fail-head">
                <span className="scn-fail-logo">R</span>
                SpareRoom &amp; Rightmove say:
              </div>
              <div className="scn-fail-filters">
                <span>Budget</span>
                <span>Bedrooms</span>
                <span>Area</span>
              </div>
              <div className="scn-fail-count">847 results</div>
              <ul className="scn-fail-list">
                <li>
                  <span className="x">&#10007;</span> Night bus routes
                </li>
                <li>
                  <span className="x">&#10007;</span> GP proximity
                </li>
                <li>
                  <span className="x">&#10007;</span> Gym access
                </li>
              </ul>
              <div className="scn-fail-verdict">Good luck scrolling.</div>
            </div>

            <div className="scn-win">
              <div className="scn-win-head">
                <span className="scn-win-logo">Z</span>
                Agent Estate Z says:
              </div>
              <div className="scn-win-card">
                <div className="scn-win-score">
                  <svg viewBox="0 0 64 64">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="rgba(194,242,110,0.2)"
                      strokeWidth="4"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="#C2F26E"
                      strokeWidth="4"
                      strokeDasharray="160 200"
                      strokeLinecap="round"
                      transform="rotate(-90 32 32)"
                    />
                  </svg>
                  <span className="scn-win-num">
                    91<span>%</span>
                  </span>
                </div>
                <div className="scn-win-meta">
                  <div className="scn-win-title">2-bed flat &middot; Stepney Green</div>
                  <div className="scn-win-price">&pound;1,750/mo</div>
                </div>
              </div>
              <ul className="scn-win-list">
                <li>
                  <span className="c">&#10003;</span> 24 min commute to Canary Wharf
                </li>
                <li>
                  <span className="c">&#10003;</span> N15 night bus to UCLH, 8
                  min walk
                </li>
                <li>
                  <span className="c">&#10003;</span> PureGym, 6 min
                </li>
                <li>
                  <span className="c">&#10003;</span> GP accepting patients, 4
                  min
                </li>
                <li>
                  <span className="c">&#10003;</span> Low-crime postcode
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* The Nurse */}
        <div
          className={`scn-panel${activeId === "nurse" ? " active" : ""} reveal`}
          data-scn-panel="nurse"
        >
          <div className="scn-col scn-col-person">
            <svg
              className="scn-silhouette"
              viewBox="0 0 200 260"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="sgNurse" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#1a2f4a" />
                  <stop offset="100%" stopColor="#0a0e1a" />
                </linearGradient>
              </defs>
              <g fill="url(#sgNurse)">
                <circle cx="100" cy="64" r="24" />
                <path d="M 66 108 Q 66 98 78 96 L 122 96 Q 134 98 134 108 L 134 210 L 108 210 L 106 150 L 94 150 L 92 210 L 66 210 Z" />
              </g>
              {/* scrubs V */}
              <path d="M 86 96 L 100 118 L 114 96" fill="#0a0e1a" opacity="0.5" />
              {/* ID badge */}
              <rect x="104" y="118" width="14" height="18" rx="1.5" fill="#C2F26E" />
              <rect x="107" y="122" width="8" height="1.5" fill="#0a0e1a" />
              <rect x="107" y="126" width="6" height="1.5" fill="#0a0e1a" />
              {/* medical cross on chest */}
              <g fill="#fafaf7" opacity="0.85">
                <rect x="92" y="100" width="4" height="10" />
                <rect x="89" y="103" width="10" height="4" />
              </g>
              <rect x="20" y="218" width="160" height="1" fill="#1a2442" opacity="0.4" />
            </svg>
            <div className="scn-person-name">Rachel</div>
            <div className="scn-person-tag">
              A&amp;E Nurse, St Thomas&apos; &middot; &pound;1,400 budget &middot;
              Single mum
            </div>
          </div>

          <div className="scn-col scn-col-chat">
            <div className="scn-chat">
              <div className="scn-chat-head">
                <span className="scn-chat-dot"></span> agent.estatez.app
              </div>
              <div className="scn-bubble me">
                Night shifts at St Thomas&apos;. I finish at 3am and need to get
                home safely. Daughter starts reception in September.
              </div>
              <div className="scn-bubble them">
                24hr transport <em>and</em> great primary schools. What else?
              </div>
              <div className="scn-bubble me">
                Knee injury, max 2 flights of stairs. Mum visits weekends,
                needs parking. Budget &pound;1,400.
              </div>
              <div className="scn-bubble them building">
                <span className="scn-build-spin"></span>
                Passport ready. Searching&hellip;
                <span className="scn-build-tag">5 data sources connected</span>
              </div>
            </div>
            <div className="scn-sources">
              <span className="scn-src">
                <span className="scn-src-dot" style={{ background: "#4285F4" }}></span>
                Google Maps
              </span>
              <span className="scn-src">
                <span className="scn-src-dot" style={{ background: "#DC241F" }}></span>
                TfL
              </span>
              <span className="scn-src">
                <span className="scn-src-dot" style={{ background: "#1D3557" }}></span>
                Police.uk
              </span>
              <span className="scn-src">
                <span className="scn-src-dot" style={{ background: "#7EBC6F" }}></span>
                OpenStreetMap
              </span>
              <span className="scn-src">
                <span className="scn-src-dot" style={{ background: "#8B6F3A" }}></span>
                Postcodes.io
              </span>
            </div>
          </div>

          <div className="scn-col scn-col-compare">
            <div className="scn-fail">
              <div className="scn-fail-head">
                <span className="scn-fail-logo">R</span>
                SpareRoom &amp; Rightmove say:
              </div>
              <div className="scn-fail-filters">
                <span>Budget</span>
                <span>Bedrooms</span>
                <span>Area</span>
              </div>
              <div className="scn-fail-count">312 results</div>
              <ul className="scn-fail-list">
                <li>
                  <span className="x">&#10007;</span> Night bus routes
                </li>
                <li>
                  <span className="x">&#10007;</span> School ratings
                </li>
                <li>
                  <span className="x">&#10007;</span> Floor level
                </li>
                <li>
                  <span className="x">&#10007;</span> Parking
                </li>
              </ul>
              <div className="scn-fail-verdict">20+ hours of manual research.</div>
            </div>

            <div className="scn-win">
              <div className="scn-win-head">
                <span className="scn-win-logo">Z</span>
                Agent Estate Z says:
              </div>
              <div className="scn-win-card">
                <div className="scn-win-score">
                  <svg viewBox="0 0 64 64">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="rgba(194,242,110,0.2)"
                      strokeWidth="4"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="#C2F26E"
                      strokeWidth="4"
                      strokeDasharray="154 200"
                      strokeLinecap="round"
                      transform="rotate(-90 32 32)"
                    />
                  </svg>
                  <span className="scn-win-num">
                    88<span>%</span>
                  </span>
                </div>
                <div className="scn-win-meta">
                  <div className="scn-win-title">2-bed flat &middot; Kennington</div>
                  <div className="scn-win-price">&pound;1,350/mo</div>
                </div>
              </div>
              <ul className="scn-win-list">
                <li>
                  <span className="c">&#10003;</span> N155 night bus &middot; 6 min
                  walk &middot; every 12 min at 3am
                </li>
                <li>
                  <span className="c">&#10003;</span> Outstanding primary school,
                  3 min
                </li>
                <li>
                  <span className="c">&#10003;</span> Ground floor, no stairs
                </li>
                <li>
                  <span className="c">&#10003;</span> Parking available
                </li>
                <li>
                  <span className="c">&#10003;</span> Low crime postcode
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* The Student */}
        <div
          className={`scn-panel${activeId === "student" ? " active" : ""} reveal`}
          data-scn-panel="student"
        >
          <div className="scn-col scn-col-person">
            <svg
              className="scn-silhouette"
              viewBox="0 0 200 260"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="sgStudent" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#2a1f4a" />
                  <stop offset="100%" stopColor="#0a0e1a" />
                </linearGradient>
              </defs>
              <g fill="url(#sgStudent)">
                <circle cx="100" cy="62" r="22" />
                <path d="M 68 104 Q 68 96 78 94 L 122 94 Q 132 96 132 104 L 132 210 L 108 210 L 106 150 L 94 150 L 92 210 L 68 210 Z" />
              </g>
              {/* backpack */}
              <g fill="#4a3a8a" opacity="0.9">
                <path d="M 60 108 Q 54 112 54 124 L 54 180 Q 54 190 64 190 L 76 190 L 76 108 Z" />
                <rect x="58" y="128" width="16" height="18" fill="#2a1f4a" />
                <rect x="60" y="148" width="12" height="2" fill="#2a1f4a" />
              </g>
              {/* strap */}
              <path
                d="M 74 104 Q 78 110 80 120"
                stroke="#2a1f4a"
                strokeWidth="3"
                fill="none"
              />
              <rect x="20" y="218" width="160" height="1" fill="#1a2442" opacity="0.4" />
            </svg>
            <div className="scn-person-name">Tom</div>
            <div className="scn-person-tag">
              PhD, King&apos;s College &middot; &pound;950 stipend &middot; Three
              campuses
            </div>
          </div>

          <div className="scn-col scn-col-chat">
            <div className="scn-chat">
              <div className="scn-chat-head">
                <span className="scn-chat-dot"></span> agent.estatez.app
              </div>
              <div className="scn-bubble me">
                PhD at King&apos;s. Supervisor at Denmark Hill, lab at Waterloo,
                tutorials at Strand, three locations.
              </div>
              <div className="scn-bubble them">
                Three campuses! I&apos;ll check transport to all three from every
                property.
              </div>
              <div className="scn-bubble me">
                &pound;950 max stipend. Need a pharmacy within 5 min, daily meds.
                Sensory issues, quiet street, not above a pub.
              </div>
              <div className="scn-bubble them building">
                <span className="scn-build-spin"></span>
                Building with quiet areas, pharmacy proximity, triple-commute&hellip;
                <span className="scn-build-tag">5 data sources connected</span>
              </div>
            </div>
            <div className="scn-sources">
              <span className="scn-src">
                <span className="scn-src-dot" style={{ background: "#4285F4" }}></span>
                Google Maps
              </span>
              <span className="scn-src">
                <span className="scn-src-dot" style={{ background: "#DC241F" }}></span>
                TfL
              </span>
              <span className="scn-src">
                <span className="scn-src-dot" style={{ background: "#1D3557" }}></span>
                Police.uk
              </span>
              <span className="scn-src">
                <span className="scn-src-dot" style={{ background: "#7EBC6F" }}></span>
                OpenStreetMap
              </span>
              <span className="scn-src">
                <span className="scn-src-dot" style={{ background: "#8B6F3A" }}></span>
                Postcodes.io
              </span>
            </div>
          </div>

          <div className="scn-col scn-col-compare">
            <div className="scn-fail">
              <div className="scn-fail-head">
                <span className="scn-fail-logo">R</span>
                SpareRoom &amp; Rightmove say:
              </div>
              <div className="scn-fail-filters">
                <span>Budget</span>
                <span>Bedrooms</span>
                <span>Area</span>
              </div>
              <div className="scn-fail-count">4 results</div>
              <ul className="scn-fail-list">
                <li>
                  <span className="x">&#10007;</span> Pharmacy
                </li>
                <li>
                  <span className="x">&#10007;</span> Noise level
                </li>
                <li>
                  <span className="x">&#10007;</span> 3-destination commute
                </li>
              </ul>
              <div className="scn-fail-verdict">Cheapest is above a kebab shop.</div>
            </div>

            <div className="scn-win">
              <div className="scn-win-head">
                <span className="scn-win-logo">Z</span>
                Agent Estate Z says:
              </div>
              <div className="scn-win-card">
                <div className="scn-win-score">
                  <svg viewBox="0 0 64 64">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="rgba(194,242,110,0.2)"
                      strokeWidth="4"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="#C2F26E"
                      strokeWidth="4"
                      strokeDasharray="150 200"
                      strokeLinecap="round"
                      transform="rotate(-90 32 32)"
                    />
                  </svg>
                  <span className="scn-win-num">
                    86<span>%</span>
                  </span>
                </div>
                <div className="scn-win-meta">
                  <div className="scn-win-title">Studio &middot; Borough</div>
                  <div className="scn-win-price">&pound;925/mo</div>
                </div>
              </div>
              <ul className="scn-win-list">
                <li>
                  <span className="c">&#10003;</span> 12 min Waterloo &middot; 18 min
                  Strand &middot; 22 min Denmark Hill
                </li>
                <li>
                  <span className="c">&#10003;</span> Boots pharmacy, 3 min
                </li>
                <li>
                  <span className="c">&#10003;</span> Quiet residential street
                </li>
                <li>
                  <span className="c">&#10003;</span> 4 properties within stipend
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ProblemSection() {
  return (
    <section id="problem" className="problem">
      <div className="container">
        <div className="section-head reveal">
          <span className="section-eyebrow">
            <span className="section-eyebrow-dot"></span>The problem
          </span>
          <h2 className="section-title">
            Finding a home in London shouldn&apos;t feel like a{" "}
            <em>full-time job</em>.
          </h2>
          <p className="section-sub">
            You open fifteen browser tabs, cross-reference four websites, and
            still don&apos;t know whether the flat is actually right for your
            life. We think that&apos;s a bug &mdash; not a feature.
          </p>
        </div>

        <div className="problem-split">
          <div className="problem-panel problem-today reveal">
            <span className="problem-today-label">Today</span>
            <div className="problem-today-h">
              Fifteen tabs. Zero connection.
            </div>
            <div className="problem-chaos">
              <div className="chaos-tile">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M8 9 H16 M8 13 H14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <div className="chaos-tile-label">Rightmove</div>
              </div>
              <div className="chaos-tile">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M4 12 H20 M12 4 C 16 8 16 16 12 20 M12 4 C 8 8 8 16 12 20" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                <div className="chaos-tile-label">Zoopla</div>
              </div>
              <div className="chaos-tile">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 21 S4 14 4 9 A8 8 0 0 1 20 9 C 20 14 12 21 12 21 Z" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                <div className="chaos-tile-label">Maps</div>
              </div>
              <div className="chaos-tile">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M7 12 H17 M12 7 V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <div className="chaos-tile-label">TfL</div>
              </div>
              <div className="chaos-tile">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 3 L20 6 V13 C20 17 16 20 12 21 C8 20 4 17 4 13 V6 Z" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M9 12 L11 14 L15 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <div className="chaos-tile-label">Police.uk</div>
              </div>
              <div className="chaos-tile">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M4 18 V10 L12 4 L20 10 V18 Z M10 18 V13 H14 V18" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                <div className="chaos-tile-label">Ofsted</div>
              </div>
              <div className="chaos-tile">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 4 V20 M4 12 H20" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
                <div className="chaos-tile-label">NHS</div>
              </div>
              <div className="chaos-tile">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M4 14 C 7 10 11 10 14 14 M8 18 C 10 15 13 15 16 18 M12 8 C 14 6 17 6 19 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <div className="chaos-tile-label">London Air</div>
              </div>
              <div className="chaos-tile">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M8 9 H16 M8 13 H12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <div className="chaos-tile-label">Council tax</div>
              </div>
              <div className="chaos-tile">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M3 20 C 3 16 6 14 9 14 C 12 14 15 16 15 20" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M16 11 V 15 M14 13 H18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <div className="chaos-tile-label">GP finder</div>
              </div>
              <div className="chaos-tile">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 3 V21 M8 7 C 8 7 10 5 12 5 C14 5 16 7 16 7 M7 12 C7 12 10 10 12 10 C14 10 17 12 17 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <div className="chaos-tile-label">Parks</div>
              </div>
              <div className="chaos-tile">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M6 7 V17 M18 7 V17 M9 9 V15 M15 9 V15 M4 12 H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <div className="chaos-tile-label">Gyms</div>
              </div>
            </div>
            <div className="problem-today-footer">
              15 &mdash; 20 services &middot; Zero connection between them
            </div>
          </div>

          <div className="problem-panel problem-after reveal">
            <span className="problem-today-label">Agent Estate Z</span>
            <div className="problem-today-h">
              One passport. One score per listing.
            </div>
            <div className="passport-stage">
              <svg
                className="passport-rays"
                viewBox="0 0 400 400"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
              >
                <g>
                  <circle cx="60" cy="80" r="3" />
                  <circle cx="340" cy="90" r="3" />
                  <circle cx="50" cy="200" r="3" />
                  <circle cx="360" cy="210" r="3" />
                  <circle cx="80" cy="320" r="3" />
                  <circle cx="330" cy="320" r="3" />
                  <path d="M 60 80 Q 200 150 200 200" />
                  <path d="M 340 90 Q 240 140 200 200" />
                  <path d="M 50 200 Q 130 200 200 200" />
                  <path d="M 360 210 Q 280 200 200 200" />
                  <path d="M 80 320 Q 160 260 200 200" />
                  <path d="M 330 320 Q 240 260 200 200" />
                </g>
              </svg>
              <div className="passport-mini">
                <div className="passport-mini-eyebrow">
                  AEZ &middot; RENTAL PASSPORT
                </div>
                <div className="passport-mini-name">Ava Patel</div>
                <div className="passport-mini-row">
                  <span className="k">COMMUTE</span>
                  <span>Canary Wharf</span>
                </div>
                <div className="passport-mini-row">
                  <span className="k">BUDGET</span>
                  <span>&pound;1,650/mo</span>
                </div>
                <div className="passport-mini-row">
                  <span className="k">PRIORITIES</span>
                  <span>Air &middot; Safety &middot; Parks</span>
                </div>
                <div className="passport-mini-row">
                  <span className="k">MATCH POOL</span>
                  <span>1,284 flats</span>
                </div>
              </div>
            </div>
            <div className="problem-after-footer">
              One conversation &middot; 6 live data sources &middot; Infinite
              combinations
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

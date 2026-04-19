export default function HowItWorks() {
  return (
    <section id="how" className="howto">
      <div className="container">
        <div className="section-head center reveal">
          <span className="section-eyebrow">
            <span className="section-eyebrow-dot"></span>How it works
          </span>
          <h2 className="section-title">
            Your Rental Passport, in <em>three steps</em>.
          </h2>
          <p className="section-sub">
            No filters. No decision fatigue. Just a two-minute conversation that
            teaches our agent how you live &mdash; then a ranked shortlist that
            reasons back.
          </p>
        </div>

        <div className="howto-grid">
          <div className="howto-card reveal">
            <div className="howto-step">
              <div className="howto-num-big">1</div>
              <div className="howto-num">STEP ONE</div>
            </div>
            <div className="howto-illustration">
              <div className="illu-chat">
                <div className="illu-bubble them">
                  Where do you commute most days?
                </div>
                <div className="illu-bubble me">
                  Canary Wharf &mdash; 4 days a week
                </div>
                <div className="illu-bubble them">
                  What matters most in a neighbourhood?
                </div>
                <div
                  className="illu-bubble them"
                  style={{ maxWidth: "36px", padding: "10px 12px" }}
                >
                  <span className="illu-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </div>
              </div>
            </div>
            <div className="howto-body">
              <div className="howto-title">Tell us about your life</div>
              <div className="howto-text">
                Pick a persona, set a budget, tell us where you commute and what
                matters most. Feels like a conversation, not a form. Takes two
                minutes.
              </div>
            </div>
          </div>

          <div className="howto-card reveal">
            <div className="howto-step">
              <div className="howto-num-big">2</div>
              <div className="howto-num">STEP TWO</div>
            </div>
            <div className="howto-illustration">
              <div className="illu-passport">
                <div className="illu-passport-card">
                  <div className="illu-passport-top">
                    <span>PASSPORT</span>
                    <span>UK / GBR</span>
                  </div>
                  <div className="illu-passport-name">Ava Patel</div>
                  <div className="illu-passport-rows">
                    <div className="illu-passport-row"></div>
                    <div className="illu-passport-row"></div>
                    <div className="illu-passport-row"></div>
                    <div className="illu-passport-row"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="howto-body">
              <div className="howto-title">We build your Passport</div>
              <div className="howto-text">
                Your constraints become a living profile &mdash; budget, commute,
                priorities, household needs. Machine-readable, private, and
                portable between agents.
              </div>
            </div>
          </div>

          <div className="howto-card reveal">
            <div className="howto-step">
              <div className="howto-num-big">3</div>
              <div className="howto-num">STEP THREE</div>
            </div>
            <div className="howto-illustration">
              <div className="illu-matches">
                <div className="illu-match">
                  <div className="illu-match-img"></div>
                  <div className="illu-match-info">
                    <div className="illu-match-title">Bermondsey 1-bed</div>
                    <div className="illu-match-sub">
                      &pound;1,650 &middot; 8 min walk
                    </div>
                  </div>
                  <div className="illu-match-score">94%</div>
                </div>
                <div className="illu-match">
                  <div className="illu-match-img"></div>
                  <div className="illu-match-info">
                    <div className="illu-match-title">Rotherhithe studio</div>
                    <div className="illu-match-sub">
                      &pound;1,420 &middot; by river
                    </div>
                  </div>
                  <div className="illu-match-score">87%</div>
                </div>
                <div className="illu-match">
                  <div className="illu-match-img"></div>
                  <div className="illu-match-info">
                    <div className="illu-match-title">Deptford loft</div>
                    <div className="illu-match-sub">
                      &pound;1,550 &middot; 14 min to work
                    </div>
                  </div>
                  <div className="illu-match-score">81%</div>
                </div>
              </div>
            </div>
            <div className="howto-body">
              <div className="howto-title">AI finds your matches</div>
              <div className="howto-text">
                Our agent queries six live data sources, scores every listing
                against your unique constraints, and tells you exactly why each
                one fits &mdash; or doesn&apos;t.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

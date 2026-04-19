export default function ProductPreview() {
  return (
    <section id="preview" className="preview">
      <div className="container">
        <div className="section-head center reveal">
          <span className="section-eyebrow">
            <span className="section-eyebrow-dot"></span>Preview
          </span>
          <h2 className="section-title">
            See it <em>in action</em>.
          </h2>
          <p className="section-sub">
            This is what our agent hands back: three listings, scored
            against a real Passport. Click any score to see the reasoning trail.
          </p>
        </div>

        <div className="preview-stage reveal">
          <div className="preview-stage-head">
            <div className="preview-stage-head-left">
              <div className="preview-stage-head-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="preview-stage-title">
                agent.estatez.app / results &middot; Ava
              </div>
            </div>
            <div className="preview-stage-filter">Top 3 of 1,284</div>
          </div>

          <div className="preview-grid">
            {/* Card 1 */}
            <div className="preview-card">
              <div className="preview-card-img">
                <div className="preview-card-score">
                  94<span className="preview-card-score-sm">match</span>
                </div>
              </div>
              <div className="preview-card-body">
                <div className="preview-card-title-row">
                  <div>
                    <div className="preview-card-title">Bermondsey 1-bed</div>
                    <div className="preview-card-loc">
                      SE1 &middot; London Bridge
                    </div>
                  </div>
                  <div className="preview-card-price">&pound;1,650</div>
                </div>
                <div className="preview-card-meta">
                  1 bed &middot; 46m&sup2; &middot; Avail 12 May
                </div>
                <div className="preview-card-scores">
                  <div className="score-row">
                    <span className="score-label">Commute</span>
                    <span className="score-bar">
                      <span
                        className="score-fill"
                        style={{ width: "96%" }}
                      ></span>
                    </span>
                    <span className="score-mark">&#10003;</span>
                  </div>
                  <div className="score-row">
                    <span className="score-label">Safety</span>
                    <span className="score-bar">
                      <span
                        className="score-fill"
                        style={{ width: "92%" }}
                      ></span>
                    </span>
                    <span className="score-mark">&#10003;</span>
                  </div>
                  <div className="score-row">
                    <span className="score-label">Amenities</span>
                    <span className="score-bar">
                      <span
                        className="score-fill"
                        style={{ width: "88%" }}
                      ></span>
                    </span>
                    <span className="score-mark">&#10003;</span>
                  </div>
                  <div className="score-row">
                    <span className="score-label">Air quality</span>
                    <span className="score-bar">
                      <span
                        className="score-fill warn"
                        style={{ width: "72%" }}
                      ></span>
                    </span>
                    <span className="score-mark warn">~</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="preview-card">
              <div className="preview-card-img">
                <div className="preview-card-score">
                  87<span className="preview-card-score-sm">match</span>
                </div>
              </div>
              <div className="preview-card-body">
                <div className="preview-card-title-row">
                  <div>
                    <div className="preview-card-title">
                      Rotherhithe studio
                    </div>
                    <div className="preview-card-loc">
                      SE16 &middot; Canada Water
                    </div>
                  </div>
                  <div className="preview-card-price">&pound;1,420</div>
                </div>
                <div className="preview-card-meta">
                  Studio &middot; 32m&sup2; &middot; Avail now
                </div>
                <div className="preview-card-scores">
                  <div className="score-row">
                    <span className="score-label">Commute</span>
                    <span className="score-bar">
                      <span
                        className="score-fill"
                        style={{ width: "90%" }}
                      ></span>
                    </span>
                    <span className="score-mark">&#10003;</span>
                  </div>
                  <div className="score-row">
                    <span className="score-label">Safety</span>
                    <span className="score-bar">
                      <span
                        className="score-fill"
                        style={{ width: "86%" }}
                      ></span>
                    </span>
                    <span className="score-mark">&#10003;</span>
                  </div>
                  <div className="score-row">
                    <span className="score-label">Amenities</span>
                    <span className="score-bar">
                      <span
                        className="score-fill warn"
                        style={{ width: "64%" }}
                      ></span>
                    </span>
                    <span className="score-mark warn">~</span>
                  </div>
                  <div className="score-row">
                    <span className="score-label">Air quality</span>
                    <span className="score-bar">
                      <span
                        className="score-fill"
                        style={{ width: "89%" }}
                      ></span>
                    </span>
                    <span className="score-mark">&#10003;</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="preview-card">
              <div className="preview-card-img">
                <div className="preview-card-score">
                  81<span className="preview-card-score-sm">match</span>
                </div>
              </div>
              <div className="preview-card-body">
                <div className="preview-card-title-row">
                  <div>
                    <div className="preview-card-title">Deptford loft</div>
                    <div className="preview-card-loc">
                      SE8 &middot; New Cross
                    </div>
                  </div>
                  <div className="preview-card-price">&pound;1,550</div>
                </div>
                <div className="preview-card-meta">
                  1 bed &middot; 52m&sup2; &middot; Avail 1 Jun
                </div>
                <div className="preview-card-scores">
                  <div className="score-row">
                    <span className="score-label">Commute</span>
                    <span className="score-bar">
                      <span
                        className="score-fill warn"
                        style={{ width: "78%" }}
                      ></span>
                    </span>
                    <span className="score-mark warn">~</span>
                  </div>
                  <div className="score-row">
                    <span className="score-label">Safety</span>
                    <span className="score-bar">
                      <span
                        className="score-fill"
                        style={{ width: "83%" }}
                      ></span>
                    </span>
                    <span className="score-mark">&#10003;</span>
                  </div>
                  <div className="score-row">
                    <span className="score-label">Amenities</span>
                    <span className="score-bar">
                      <span
                        className="score-fill"
                        style={{ width: "91%" }}
                      ></span>
                    </span>
                    <span className="score-mark">&#10003;</span>
                  </div>
                  <div className="score-row">
                    <span className="score-label">Air quality</span>
                    <span className="score-bar">
                      <span
                        className="score-fill"
                        style={{ width: "84%" }}
                      ></span>
                    </span>
                    <span className="score-mark">&#10003;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="preview-chat">
            <div className="preview-chat-avatar">Z</div>
            <div className="preview-chat-msg">
              Based on your commute to <strong>Canary Wharf</strong> and priority
              on <strong>safety</strong>, these three are your strongest matches.
              Bermondsey wins on transport; Rotherhithe wins on air. Want me to
              filter for a balcony or pet-friendly?
            </div>
            <div className="preview-chat-input">Ask anything &rarr;</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DataSources() {
  return (
    <section id="sources" className="sources">
      <div className="container">
        <div className="section-head center reveal">
          <span className="section-eyebrow">
            <span className="section-eyebrow-dot"></span>Live data
          </span>
          <h2 className="section-title">
            Powered by real-time <em>London data</em>.
          </h2>
          <p className="section-sub">
            We pull from six authoritative public sources the moment you ask,
            not a stale CSV from last quarter. Your Passport is always
            scored against the London that exists right now.
          </p>
        </div>

        <div className="sources-row reveal">
          <div className="source-card">
            <div
              className="source-logo"
              style={{
                background: "linear-gradient(135deg, #4285F4, #34A853)",
              }}
            >
              G
              <span
                className="source-pulse"
                style={{ color: "#4285F4" }}
              ></span>
            </div>
            <div className="source-name">Google Maps</div>
            <div className="source-type">Commute &middot; transit</div>
          </div>
          <div className="source-card">
            <div
              className="source-logo"
              style={{
                background: "linear-gradient(135deg, #DC241F, #b01715)",
              }}
            >
              TfL
              <span
                className="source-pulse"
                style={{ color: "#DC241F" }}
              ></span>
            </div>
            <div className="source-name">Transport for London</div>
            <div className="source-type">Live travel</div>
          </div>
          <div className="source-card">
            <div
              className="source-logo"
              style={{
                background: "linear-gradient(135deg, #1D3557, #0f2440)",
              }}
            >
              UK
              <span
                className="source-pulse"
                style={{ color: "#1D3557" }}
              ></span>
            </div>
            <div className="source-name">Police.uk</div>
            <div className="source-type">Crime stats</div>
          </div>
          <div className="source-card">
            <div
              className="source-logo"
              style={{
                background: "linear-gradient(135deg, #7EBC6F, #5a9650)",
              }}
            >
              OSM
              <span
                className="source-pulse"
                style={{ color: "#7EBC6F" }}
              ></span>
            </div>
            <div className="source-name">OpenStreetMap</div>
            <div className="source-type">Amenities</div>
          </div>
          <div className="source-card">
            <div
              className="source-logo"
              style={{
                background: "linear-gradient(135deg, #2E8B57, #1e6b3e)",
              }}
            >
              Air
              <span
                className="source-pulse"
                style={{ color: "#2E8B57" }}
              ></span>
            </div>
            <div className="source-name">London Air</div>
            <div className="source-type">NO&#8322; &middot; PM2.5</div>
          </div>
          <div className="source-card">
            <div
              className="source-logo"
              style={{
                background: "linear-gradient(135deg, #8B6F3A, #6a5325)",
              }}
            >
              PC
              <span
                className="source-pulse"
                style={{ color: "#8B6F3A" }}
              ></span>
            </div>
            <div className="source-name">Postcodes.io</div>
            <div className="source-type">Borough &middot; zone</div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { runSearch, refineSearch, type Property } from "@/lib/api";
import "@/styles/passport.css";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session") || "";

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refineInput, setRefineInput] = useState("");
  const [aiSummary, setAiSummary] = useState("");

  useEffect(() => {
    if (!sessionId) return;
    runSearch(sessionId)
      .then((data) => {
        setProperties(data.top_picks || []);
        if (data.top_picks?.length > 0 && data.top_picks[0]?.messages) {
          const msgs = data.top_picks[0].messages;
          setAiSummary(msgs[msgs.length - 1]?.content || "");
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sessionId]);

  async function handleRefine() {
    if (!refineInput.trim()) return;
    setLoading(true);
    try {
      const data = await refineSearch(refineInput, sessionId);
      setProperties(data.top_picks || []);
      setRefineInput("");
    } catch {
      console.error("Refine failed");
    } finally {
      setLoading(false);
    }
  }

  function getScoreColor(score: number) {
    if (score >= 80) return "var(--pp-success)";
    if (score >= 60) return "var(--pp-warn)";
    return "var(--pp-danger)";
  }
  function getScoreBg(score: number) {
    if (score >= 80) return "var(--pp-success-wash)";
    if (score >= 60) return "var(--pp-warn-wash)";
    return "#FDE8E8";
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--pp-bg)", fontFamily: "var(--pp-sans)" }}>
      {/* Header */}
      <header style={{ background: "var(--pp-surface)", borderBottom: "1px solid var(--pp-line)", padding: "16px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--pp-ink)", color: "var(--pp-bg)", display: "grid", placeItems: "center", fontFamily: "var(--pp-serif)", fontStyle: "italic", fontWeight: 500, fontSize: 15 }}>Z</div>
            <span style={{ fontWeight: 600, fontSize: 15 }}>Agent Estate Z</span>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--pp-mono)", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--pp-success)", background: "var(--pp-success-wash)", padding: "4px 10px", borderRadius: 6 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--pp-success)" }} /> Passport Active
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 32px 64px" }}>
        {/* AI Summary */}
        {aiSummary && (
          <div style={{ background: "var(--pp-accent-wash)", border: "1px solid var(--pp-line)", borderRadius: "var(--pp-radius-lg)", padding: "18px 22px", marginBottom: 24, fontSize: 14, color: "var(--pp-ink-2)", lineHeight: 1.6 }}>
            {aiSummary}
          </div>
        )}

        {/* Results header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--pp-ink)", margin: 0 }}>
            {loading ? "Searching for your perfect home..." : `We found ${properties.length} properties matching your passport`}
          </h1>
          <p style={{ color: "var(--pp-ink-3)", marginTop: 6, fontSize: 15 }}>Sorted by best match</p>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 18 }}>
            {[1, 2, 3].map(i => <div key={i} style={{ height: 300, background: "var(--pp-surface-2)", borderRadius: "var(--pp-radius-lg)", animation: "ppPulse 1.2s ease-in-out infinite" }} />)}
          </div>
        )}

        {/* Property cards grid */}
        {!loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 18 }}>
            {properties.map((prop) => (
              <div
                key={prop.listing_id}
                onClick={() => router.push(`/property/${prop.listing_id}?session=${sessionId}`)}
                style={{
                  background: "var(--pp-surface)",
                  border: "1px solid var(--pp-line)",
                  borderRadius: "var(--pp-radius-lg)",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all .2s cubic-bezier(.2,.8,.2,1)",
                  boxShadow: "var(--pp-shadow-sm)",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--pp-shadow)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--pp-shadow-sm)"; }}
              >
                {/* Image */}
                <div style={{ height: 180, background: "var(--pp-surface-2)", position: "relative" }}>
                  {prop.images_script ? (
                    <img src={prop.images_script.split("\n")[0]} alt={prop.location} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--pp-ink-4)", fontSize: 13 }}>No image</div>
                  )}
                  {prop.overall_score && (
                    <div style={{ position: "absolute", top: 14, right: 14, padding: "6px 12px", borderRadius: 999, fontSize: 13, fontWeight: 600, color: getScoreColor(prop.overall_score), background: getScoreBg(prop.overall_score) }}>
                      {prop.overall_score}% match
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: "18px 20px" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "var(--pp-ink)", marginBottom: 4 }}>£{prop.price}/mo</div>
                  <div style={{ fontSize: 13, color: "var(--pp-ink-3)", marginBottom: 10 }}>
                    {prop.bedrooms} bed · {prop.bathrooms || "?"} bath · {prop.property_type}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--pp-ink-2)", marginBottom: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{prop.location}</div>

                  {/* Score bars */}
                  {prop.scores && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {Object.entries(prop.scores).slice(0, 4).map(([key, val]) => {
                        const pct = (val as number) * 100;
                        return (
                          <div key={key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 11, color: "var(--pp-ink-4)", width: 80, textTransform: "capitalize" }}>{key.replace(/_/g, " ")}</span>
                            <div style={{ flex: 1, height: 3, background: "var(--pp-surface-2)", borderRadius: 2, overflow: "hidden" }}>
                              <div style={{ height: "100%", borderRadius: 2, background: "var(--pp-ink)", width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Enrichment tags */}
                  {prop.enrichment && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                      {prop.enrichment.commute?.commute_text && (
                        <span style={{ fontSize: 11, background: "var(--pp-success-wash)", color: "var(--pp-success)", padding: "4px 8px", borderRadius: 999, fontWeight: 500 }}>
                          {prop.enrichment.commute.commute_text}
                        </span>
                      )}
                      {prop.enrichment.crime?.crime_category && (
                        <span style={{ fontSize: 11, background: prop.enrichment.crime.crime_category === "low" ? "var(--pp-success-wash)" : prop.enrichment.crime.crime_category === "moderate" ? "var(--pp-warn-wash)" : "#FDE8E8", color: prop.enrichment.crime.crime_category === "low" ? "var(--pp-success)" : prop.enrichment.crime.crime_category === "moderate" ? "var(--pp-warn)" : "var(--pp-danger)", padding: "4px 8px", borderRadius: 999, fontWeight: 500 }}>
                          {prop.enrichment.crime.crime_category} crime
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Refinement bar */}
        {!loading && properties.length > 0 && (
          <div style={{ marginTop: 32, background: "var(--pp-surface)", borderRadius: "var(--pp-radius-lg)", border: "1px solid var(--pp-line)", padding: "18px 22px" }}>
            <p style={{ fontSize: 12, color: "var(--pp-ink-4)", marginBottom: 10, fontFamily: "var(--pp-mono)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Adjust your search</p>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                value={refineInput}
                onChange={e => setRefineInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleRefine()}
                placeholder='Try "show me safer areas" or "under £1,500"'
                style={{ flex: 1, height: 44, borderRadius: "var(--pp-radius)", border: "1px solid var(--pp-line)", background: "var(--pp-surface-2)", padding: "0 16px", fontSize: 14, color: "var(--pp-ink)", outline: "none", fontFamily: "inherit" }}
              />
              <button
                onClick={handleRefine}
                disabled={!refineInput.trim()}
                style={{ height: 44, padding: "0 22px", borderRadius: 999, background: "var(--pp-ink)", color: "var(--pp-bg)", border: "none", fontWeight: 500, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}
              >
                Update
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--pp-bg)", color: "var(--pp-ink-4)" }}>Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}

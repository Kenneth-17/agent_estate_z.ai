"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { getProperty, type Property } from "@/lib/api";
import "@/styles/passport.css";

function PropertyContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session") || "";
  const listingId = Number(params.id);

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!listingId || !sessionId) return;
    getProperty(listingId, sessionId)
      .then(setProperty)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [listingId, sessionId]);

  if (loading) {
    return <div style={{ minHeight: "100vh", background: "var(--pp-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--pp-sans)" }}><div style={{ color: "var(--pp-ink-4)" }}>Loading property details...</div></div>;
  }
  if (!property) {
    return <div style={{ minHeight: "100vh", background: "var(--pp-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--pp-sans)" }}><p style={{ color: "var(--pp-ink-3)" }}>Property not found.</p></div>;
  }

  const e = property.enrichment;
  const scores = property.scores || {};

  return (
    <div style={{ minHeight: "100vh", background: "var(--pp-bg)", fontFamily: "var(--pp-sans)" }}>
      {/* Header */}
      <header style={{ background: "var(--pp-surface)", borderBottom: "1px solid var(--pp-line)", padding: "16px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => router.push(`/results?session=${sessionId}`)} style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--pp-ink-3)", fontSize: 14, background: "none", border: "none", cursor: "pointer", padding: "8px 12px", borderRadius: 8, fontFamily: "inherit" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12 H5 M11 6 L5 12 L11 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to results
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 32px 64px" }}>
        {/* Image */}
        <div style={{ height: 320, background: "var(--pp-surface-2)", borderRadius: "var(--pp-radius-lg)", overflow: "hidden", marginBottom: 28 }}>
          {property.images_script ? (
            <img src={property.images_script.split("\n")[0]} alt={property.location} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--pp-ink-4)" }}>No image available</div>
          )}
        </div>

        {/* Title row */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: "var(--pp-ink)", letterSpacing: "-0.02em", margin: 0 }}>{property.location}</h1>
          <p style={{ fontSize: 17, color: "var(--pp-ink-3)", marginTop: 6 }}>
            £{property.price}/mo · {property.bedrooms} bed · {property.bathrooms || "?"} bath · {property.property_type}
          </p>
          {property.agency_name && <p style={{ fontSize: 13, color: "var(--pp-ink-4)", marginTop: 4 }}>Listed by {property.agency_name}</p>}
        </div>

        {/* Match breakdown */}
        <div style={{ background: "var(--pp-surface)", border: "1px solid var(--pp-line)", borderRadius: "var(--pp-radius-lg)", padding: "24px 28px", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "var(--pp-ink)" }}>Your Match Breakdown</h2>
          {property.overall_score && (
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 36, fontWeight: 700, color: "var(--pp-accent)" }}>{property.overall_score}%</span>
              <span style={{ color: "var(--pp-ink-3)", marginLeft: 8 }}>overall match</span>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.entries(scores).map(([key, val]) => {
              const pct = (val as number) * 100;
              const label = key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
              const barColor = pct >= 80 ? "var(--pp-success)" : pct >= 50 ? "var(--pp-warn)" : "var(--pp-danger)";
              return (
                <div key={key}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                    <span style={{ color: "var(--pp-ink-3)", textTransform: "capitalize" }}>{label}</span>
                    <span style={{ fontWeight: 600, color: "var(--pp-ink)" }}>{Math.round(pct)}%</span>
                  </div>
                  <div style={{ height: 4, background: "var(--pp-surface-2)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 2, background: barColor, width: `${pct}%`, transition: "width .6s cubic-bezier(.2,.8,.2,1)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Area insights */}
        {e && (
          <div style={{ background: "var(--pp-surface)", border: "1px solid var(--pp-line)", borderRadius: "var(--pp-radius-lg)", padding: "24px 28px", marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "var(--pp-ink)" }}>Area Insights</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
              {e.transport?.nearest_station && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", background: "var(--pp-surface-2)", borderRadius: "var(--pp-radius)" }}>
                  <span style={{ fontSize: 20 }}>🚇</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--pp-ink)", margin: 0 }}>{e.transport.nearest_station}</p>
                    <p style={{ fontSize: 11, color: "var(--pp-ink-4)", margin: "4px 0 0" }}>{e.transport.walk_min}min walk · {e.transport.lines?.join(", ")}</p>
                  </div>
                </div>
              )}
              {e.crime?.crime_category && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", background: "var(--pp-surface-2)", borderRadius: "var(--pp-radius)" }}>
                  <span style={{ fontSize: 20 }}>🛡️</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--pp-ink)", margin: 0, textTransform: "capitalize" }}>{e.crime.crime_category} crime</p>
                    <p style={{ fontSize: 11, color: "var(--pp-ink-4)", margin: "4px 0 0" }}>{e.crime.crime_count ?? "?"} incidents</p>
                  </div>
                </div>
              )}
              {e.amenities && e.amenities.gyms > 0 && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", background: "var(--pp-surface-2)", borderRadius: "var(--pp-radius)" }}>
                  <span style={{ fontSize: 20 }}>🏋️</span>
                  <div><p style={{ fontSize: 13, fontWeight: 500, color: "var(--pp-ink)", margin: 0 }}>{e.amenities.gyms} gym{e.amenities.gyms > 1 ? "s" : ""} nearby</p></div>
                </div>
              )}
              {e.amenities && e.amenities.parks > 0 && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", background: "var(--pp-surface-2)", borderRadius: "var(--pp-radius)" }}>
                  <span style={{ fontSize: 20 }}>🌳</span>
                  <div><p style={{ fontSize: 13, fontWeight: 500, color: "var(--pp-ink)", margin: 0 }}>{e.amenities.parks} park{e.amenities.parks > 1 ? "s" : ""} nearby</p></div>
                </div>
              )}
              {e.borough?.borough && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", background: "var(--pp-surface-2)", borderRadius: "var(--pp-radius)" }}>
                  <span style={{ fontSize: 20 }}>📍</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--pp-ink)", margin: 0 }}>{e.borough.borough}</p>
                    <p style={{ fontSize: 11, color: "var(--pp-ink-4)", margin: "4px 0 0" }}>{e.borough.postcode}</p>
                  </div>
                </div>
              )}
              {e.air_quality?.aqi && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", background: "var(--pp-surface-2)", borderRadius: "var(--pp-radius)" }}>
                  <span style={{ fontSize: 20 }}>💨</span>
                  <div><p style={{ fontSize: 13, fontWeight: 500, color: "var(--pp-ink)", margin: 0 }}>AQI: {e.air_quality.aqi}</p></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        {property.description && (
          <div style={{ background: "var(--pp-surface)", border: "1px solid var(--pp-line)", borderRadius: "var(--pp-radius-lg)", padding: "24px 28px", marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: "var(--pp-ink)" }}>About this property</h2>
            <p style={{ fontSize: 14, color: "var(--pp-ink-2)", lineHeight: 1.6, whiteSpace: "pre-line", display: "-webkit-box", WebkitLineClamp: 6, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {property.description}
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 12 }}>
          <button style={{ flex: 1, height: 52, borderRadius: 12, background: "var(--pp-ink)", color: "var(--pp-bg)", border: "none", fontWeight: 500, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>
            Apply with Passport
          </button>
          <button style={{ height: 52, padding: "0 24px", borderRadius: 12, border: "1px solid var(--pp-line)", background: "var(--pp-surface)", color: "var(--pp-ink-2)", fontWeight: 500, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>
            Save
          </button>
        </div>
      </main>
    </div>
  );
}

export default function PropertyPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--pp-bg)", color: "var(--pp-ink-4)", fontFamily: "var(--pp-sans)" }}>Loading...</div>}>
      <PropertyContent />
    </Suspense>
  );
}

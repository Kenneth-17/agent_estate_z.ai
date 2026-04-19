"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import type { Property } from "@/lib/api";
import "@/styles/passport.css";

const MOCK_PROPERTIES: Property[] = [
  {
    listing_id: 101,
    listing_title: "Bright 1-bed flat in Bermondsey",
    price: 1650,
    bedrooms: 1,
    bathrooms: 1,
    property_type: "Flat",
    location: "Bermondsey, SE1",
    latitude: 51.498,
    longitude: -0.075,
    description: "Modern 1-bedroom flat with excellent transport links to Canary Wharf and London Bridge. Quiet residential street with low crime and great amenities.",
    amenities: ["Gym", "Concierge", "Bike storage"],
    listing_url: "",
    images_script: "",
    agency_name: "Foxtons",
    overall_score: 94,
    scores: { commute: 0.96, safety: 0.92, amenities: 0.88, air_quality: 0.72 },
    enrichment: {
      commute: { commute_minutes: 23, commute_text: "23 min commute" },
      crime: { crime_count: 12, crime_score: 0.92, crime_category: "low" },
      amenities: { gyms: 4, supermarkets: 3, pubs: 6, restaurants: 12, parks: 2 },
      air_quality: { aqi: "Moderate" },
      transport: { nearest_station: "Bermondsey", walk_min: 8, lines: ["Jubilee"] },
      borough: { postcode: "SE1 3UB", borough: "Southwark" },
    },
  },
  {
    listing_id: 102,
    listing_title: "Studio apartment in Rotherhithe",
    price: 1420,
    bedrooms: 0,
    bathrooms: 1,
    property_type: "Studio",
    location: "Rotherhithe, SE16",
    latitude: 51.503,
    longitude: -0.053,
    description: "Compact riverside studio near Canada Water. Great air quality and green spaces. Ideal for a single professional or student.",
    amenities: ["River view", "Laundry"],
    listing_url: "",
    images_script: "",
    agency_name: "Knight Frank",
    overall_score: 87,
    scores: { commute: 0.90, safety: 0.86, amenities: 0.64, air_quality: 0.89 },
    enrichment: {
      commute: { commute_minutes: 19, commute_text: "19 min commute" },
      crime: { crime_count: 18, crime_score: 0.86, crime_category: "low" },
      amenities: { gyms: 2, supermarkets: 2, pubs: 4, restaurants: 8, parks: 3 },
      air_quality: { aqi: "Good" },
      transport: { nearest_station: "Canada Water", walk_min: 6, lines: ["Jubilee", "Overground"] },
      borough: { postcode: "SE16 2XU", borough: "Southwark" },
    },
  },
  {
    listing_id: 103,
    listing_title: "Loft conversion in Deptford",
    price: 1550,
    bedrooms: 1,
    bathrooms: 1,
    property_type: "Loft",
    location: "Deptford, SE8",
    latitude: 51.479,
    longitude: -0.026,
    description: "Spacious loft conversion with character. Close to Deptford Bridge DLR and Greenwich Park. Vibrant local scene.",
    amenities: ["Balcony", "Pet-friendly"],
    listing_url: "",
    images_script: "",
    agency_name: "Savills",
    overall_score: 81,
    scores: { commute: 0.78, safety: 0.83, amenities: 0.91, air_quality: 0.84 },
    enrichment: {
      commute: { commute_minutes: 32, commute_text: "32 min commute" },
      crime: { crime_count: 28, crime_score: 0.74, crime_category: "moderate" },
      amenities: { gyms: 3, supermarkets: 4, pubs: 8, restaurants: 15, parks: 4 },
      air_quality: { aqi: "Good" },
      transport: { nearest_station: "Deptford Bridge", walk_min: 5, lines: ["DLR"] },
      borough: { postcode: "SE8 4LY", borough: "Lewisham" },
    },
  },
];

const MOCK_SUMMARY =
  "Based on your commute preferences and priorities, these three are your strongest matches. Bermondsey wins on transport and safety; Rotherhithe wins on air quality and value; Deptford has the best amenities and more space.";

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

function ResultsContent() {
  const router = useRouter();
  const properties = MOCK_PROPERTIES;

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
        <div style={{ background: "var(--pp-accent-wash)", border: "1px solid var(--pp-line)", borderRadius: "var(--pp-radius-lg)", padding: "18px 22px", marginBottom: 24, fontSize: 14, color: "var(--pp-ink-2)", lineHeight: 1.6 }}>
          {MOCK_SUMMARY}
        </div>

        {/* Results header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--pp-ink)", margin: 0 }}>
            We found {properties.length} properties matching your passport
          </h1>
          <p style={{ color: "var(--pp-ink-3)", marginTop: 6, fontSize: 15 }}>Sorted by best match</p>
        </div>

        {/* Property cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 18 }}>
          {properties.map((prop) => (
            <div
              key={prop.listing_id}
              onClick={() => router.push(`/property/${prop.listing_id}`)}
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
              {/* Image placeholder */}
              <div style={{ height: 180, background: "var(--pp-surface-2)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 13, color: "var(--pp-ink-4)" }}>
                  {prop.listing_title}
                </div>
                <div style={{ position: "absolute", top: 14, right: 14, padding: "6px 12px", borderRadius: 999, fontSize: 13, fontWeight: 600, color: getScoreColor(prop.overall_score || 0), background: getScoreBg(prop.overall_score || 0) }}>
                  {prop.overall_score}% match
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: "18px 20px" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: "var(--pp-ink)", marginBottom: 4 }}>&pound;{prop.price.toLocaleString()}/mo</div>
                <div style={{ fontSize: 13, color: "var(--pp-ink-3)", marginBottom: 10 }}>
                  {prop.bedrooms === 0 ? "Studio" : `${prop.bedrooms} bed`} &middot; {prop.bathrooms} bath &middot; {prop.property_type}
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--pp-ink-2)", marginBottom: 14 }}>{prop.location}</div>

                {/* Score bars */}
                {prop.scores && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {Object.entries(prop.scores).slice(0, 4).map(([key, val]) => {
                      const pct = (val as number) * 100;
                      return (
                        <div key={key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 11, color: "var(--pp-ink-4)", width: 80, textTransform: "capitalize" }}>{key.replace(/_/g, " ")}</span>
                          <div style={{ flex: 1, height: 3, background: "var(--pp-surface-2)", borderRadius: 2, overflow: "hidden" }}>
                            <div style={{ height: "100%", borderRadius: 2, background: pct >= 80 ? "var(--pp-success)" : pct >= 60 ? "var(--pp-warn)" : "var(--pp-danger)", width: `${pct}%` }} />
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
                      <span style={{ fontSize: 11, background: prop.enrichment.crime.crime_category === "low" ? "var(--pp-success-wash)" : "var(--pp-warn-wash)", color: prop.enrichment.crime.crime_category === "low" ? "var(--pp-success)" : "var(--pp-warn)", padding: "4px 8px", borderRadius: 999, fontWeight: 500 }}>
                        {prop.enrichment.crime.crime_category} crime
                      </span>
                    )}
                    {prop.enrichment.transport?.nearest_station && (
                      <span style={{ fontSize: 11, background: "var(--pp-accent-wash)", color: "var(--pp-accent)", padding: "4px 8px", borderRadius: 999, fontWeight: 500 }}>
                        {prop.enrichment.transport.nearest_station} &middot; {prop.enrichment.transport.walk_min} min walk
                      </span>
                    )}
                    {prop.enrichment.amenities && (
                      <span style={{ fontSize: 11, background: "var(--pp-surface-2)", color: "var(--pp-ink-3)", padding: "4px 8px", borderRadius: 999, fontWeight: 500 }}>
                        {prop.enrichment.amenities.gyms} gyms &middot; {prop.enrichment.amenities.parks} parks
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Refinement bar */}
        <div style={{ marginTop: 32, background: "var(--pp-surface)", borderRadius: "var(--pp-radius-lg)", border: "1px solid var(--pp-line)", padding: "18px 22px" }}>
          <p style={{ fontSize: 12, color: "var(--pp-ink-4)", marginBottom: 10, fontFamily: "var(--pp-mono)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Adjust your search</p>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              placeholder='Try "show me safer areas" or "under £1,500"'
              style={{ flex: 1, height: 44, borderRadius: "var(--pp-radius)", border: "1px solid var(--pp-line)", background: "var(--pp-surface-2)", padding: "0 16px", fontSize: 14, color: "var(--pp-ink)", outline: "none", fontFamily: "inherit" }}
            />
            <button
              style={{ height: 44, padding: "0 22px", borderRadius: 999, background: "var(--pp-ink)", color: "var(--pp-bg)", border: "none", fontWeight: 500, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}
            >
              Update
            </button>
          </div>
        </div>
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

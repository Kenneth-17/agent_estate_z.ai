"use client";

import { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
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
    description: "Modern 1-bedroom flat with excellent transport links to Canary Wharf and London Bridge. Quiet residential street with low crime and great amenities. Recently refurbished kitchen and bathroom. Council Tax Band C. EPC rating B.",
    amenities: ["Gym", "Concierge", "Bike storage"],
    listing_url: "",
    images_script: "/room_1.jpeg",
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
    description: "Compact riverside studio near Canada Water. Great air quality and green spaces. Ideal for a single professional or student. South-facing with river views. Council Tax Band A. EPC rating C.",
    amenities: ["River view", "Laundry"],
    listing_url: "",
    images_script: "/room_2.jpeg",
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
    description: "Spacious loft conversion with character. Close to Deptford Bridge DLR and Greenwich Park. Vibrant local scene with street markets and independent cafes. Council Tax Band B. EPC rating D.",
    amenities: ["Balcony", "Pet-friendly"],
    listing_url: "",
    images_script: "/room_3.jpeg",
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

const WHY_MATCHES: Record<number, { title: string; points: { label: string; text: string; positive: boolean }[] }> = {
  101: {
    title: "Why Bermondsey is a top match for you",
    points: [
      { label: "Commute", text: "23 minutes to your workplace via Jubilee line. Bermondsey station is just 8 minutes on foot.", positive: true },
      { label: "Safety", text: "Southwark SE1 recorded only 12 incidents in the last quarter, placing it in the low crime category.", positive: true },
      { label: "Amenities", text: "4 gyms, 3 supermarkets, and 12 restaurants within walking distance. Strong everyday convenience.", positive: true },
      { label: "Air quality", text: "Moderate AQI in this area. Acceptable but not the best if air quality is a top priority for you.", positive: false },
      { label: "Budget", text: "At £1,650/mo this sits at the upper end of typical budgets, but the transport and safety scores justify the premium.", positive: true },
      { label: "Bedrooms", text: "1 bedroom matches your requirement. 46m² is above the London average for a 1-bed flat.", positive: true },
    ],
  },
  102: {
    title: "Why Rotherhithe fits your needs",
    points: [
      { label: "Commute", text: "19 minutes via Jubilee or Overground lines from Canada Water. Quick and well-connected.", positive: true },
      { label: "Air quality", text: "Good AQI rating. Riverside location means cleaner air compared to inner-London postcodes.", positive: true },
      { label: "Safety", text: "Low crime area with 18 incidents last quarter. Quiet, residential feel.", positive: true },
      { label: "Amenities", text: "2 gyms and 2 supermarkets. Fewer options than average, but 3 parks nearby compensate.", positive: false },
      { label: "Budget", text: "£1,420/mo is excellent value for Zone 2 riverside. Strong affordability score.", positive: true },
      { label: "Space", text: "Studio layout at 32m². Compact but efficient for a single occupant.", positive: false },
    ],
  },
  103: {
    title: "Why Deptford is worth considering",
    points: [
      { label: "Amenities", text: "Best in class: 3 gyms, 4 supermarkets, 15 restaurants, and 4 parks. Deptford High Street is one of London's most vibrant.", positive: true },
      { label: "Air quality", text: "Good AQI. Greenwich Park and the Thames Path provide clean air corridors nearby.", positive: true },
      { label: "Commute", text: "32 minutes via DLR. Longer than the other two options but still within acceptable range.", positive: false },
      { label: "Safety", text: "Moderate crime with 28 incidents last quarter. Not a dealbreaker but worth weighing against the amenity score.", positive: false },
      { label: "Space", text: "Loft conversion at 52m² gives you the most space of all three matches. Pet-friendly and has a balcony.", positive: true },
      { label: "Value", text: "£1,550/mo for 52m² with a balcony is strong value per square metre in this zone.", positive: true },
    ],
  },
};

function PropertyContent() {
  const params = useParams();
  const router = useRouter();
  const listingId = Number(params.id);
  const property = MOCK_PROPERTIES.find(p => p.listing_id === listingId) || MOCK_PROPERTIES[0];
  const why = WHY_MATCHES[listingId];

  const e = property.enrichment;
  const scores = property.scores || {};

  return (
    <div style={{ minHeight: "100vh", background: "var(--pp-bg)", fontFamily: "var(--pp-sans)" }}>
      {/* Header */}
      <header style={{ background: "var(--pp-surface)", borderBottom: "1px solid var(--pp-line)", padding: "16px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => router.push("/results")} style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--pp-ink-3)", fontSize: 14, background: "none", border: "none", cursor: "pointer", padding: "8px 12px", borderRadius: 8, fontFamily: "inherit" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12 H5 M11 6 L5 12 L11 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to results
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 32px 64px" }}>
        {/* Image */}
        <div style={{ height: 320, background: "var(--pp-surface-2)", borderRadius: "var(--pp-radius-lg)", overflow: "hidden", marginBottom: 28, position: "relative" }}>
          {property.images_script ? (
            <img src={property.images_script.split("\n")[0]} alt={property.location} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--pp-ink-4)" }}>No image available</div>
          )}
          {property.overall_score && (
            <div style={{ position: "absolute", top: 20, right: 20, padding: "10px 18px", borderRadius: 999, fontSize: 16, fontWeight: 700, color: property.overall_score >= 80 ? "var(--pp-success)" : "var(--pp-warn)", background: property.overall_score >= 80 ? "var(--pp-success-wash)" : "var(--pp-warn-wash)", backdropFilter: "blur(8px)" }}>
              {property.overall_score}% match
            </div>
          )}
        </div>

        {/* Title row */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: "var(--pp-ink)", letterSpacing: "-0.02em", margin: 0 }}>{property.location}</h1>
          <p style={{ fontSize: 17, color: "var(--pp-ink-3)", marginTop: 6 }}>
            &pound;{property.price.toLocaleString()}/mo &middot; {property.bedrooms === 0 ? "Studio" : `${property.bedrooms} bed`} &middot; {property.bathrooms} bath &middot; {property.property_type}
          </p>
          {property.agency_name && <p style={{ fontSize: 13, color: "var(--pp-ink-4)", marginTop: 4 }}>Listed by {property.agency_name}</p>}
        </div>

        {/* WHY THIS MATCHES */}
        {why && (
          <div style={{ background: "var(--pp-accent-wash)", border: "1px solid var(--pp-line)", borderRadius: "var(--pp-radius-lg)", padding: "24px 28px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--pp-accent)", color: "white", display: "grid", placeItems: "center", fontFamily: "var(--pp-serif)", fontStyle: "italic", fontWeight: 500, fontSize: 13 }}>Z</div>
              <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0, color: "var(--pp-ink)" }}>{why.title}</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {why.points.map((point, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "12px 16px", background: "var(--pp-surface)", borderRadius: "var(--pp-radius-sm)", borderLeft: `3px solid ${point.positive ? "var(--pp-success)" : "var(--pp-warn)"}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontFamily: "var(--pp-mono)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--pp-ink-4)", marginBottom: 4 }}>{point.label}</div>
                    <div style={{ fontSize: 14, color: "var(--pp-ink-2)", lineHeight: 1.5 }}>{point.text}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", paddingTop: 2 }}>
                    {point.positive ? (
                      <span style={{ color: "var(--pp-success)", fontSize: 16, fontWeight: 700 }}>&#10003;</span>
                    ) : (
                      <span style={{ color: "var(--pp-warn)", fontSize: 14, fontWeight: 600 }}>~</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Match breakdown */}
        <div style={{ background: "var(--pp-surface)", border: "1px solid var(--pp-line)", borderRadius: "var(--pp-radius-lg)", padding: "24px 28px", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "var(--pp-ink)" }}>Score Breakdown</h2>
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
                  <span style={{ fontSize: 20 }}>&#128647;</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--pp-ink)", margin: 0 }}>{e.transport.nearest_station}</p>
                    <p style={{ fontSize: 11, color: "var(--pp-ink-4)", margin: "4px 0 0" }}>{e.transport.walk_min} min walk &middot; {e.transport.lines?.join(", ")}</p>
                  </div>
                </div>
              )}
              {e.crime?.crime_category && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", background: "var(--pp-surface-2)", borderRadius: "var(--pp-radius)" }}>
                  <span style={{ fontSize: 20 }}>&#128737;</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--pp-ink)", margin: 0, textTransform: "capitalize" }}>{e.crime.crime_category} crime</p>
                    <p style={{ fontSize: 11, color: "var(--pp-ink-4)", margin: "4px 0 0" }}>{e.crime.crime_count ?? "?"} incidents</p>
                  </div>
                </div>
              )}
              {e.amenities && e.amenities.gyms > 0 && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", background: "var(--pp-surface-2)", borderRadius: "var(--pp-radius)" }}>
                  <span style={{ fontSize: 20 }}>&#127947;</span>
                  <div><p style={{ fontSize: 13, fontWeight: 500, color: "var(--pp-ink)", margin: 0 }}>{e.amenities.gyms} gym{e.amenities.gyms > 1 ? "s" : ""} nearby</p></div>
                </div>
              )}
              {e.amenities && e.amenities.parks > 0 && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", background: "var(--pp-surface-2)", borderRadius: "var(--pp-radius)" }}>
                  <span style={{ fontSize: 20 }}>&#127795;</span>
                  <div><p style={{ fontSize: 13, fontWeight: 500, color: "var(--pp-ink)", margin: 0 }}>{e.amenities.parks} park{e.amenities.parks > 1 ? "s" : ""} nearby</p></div>
                </div>
              )}
              {e.borough?.borough && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", background: "var(--pp-surface-2)", borderRadius: "var(--pp-radius)" }}>
                  <span style={{ fontSize: 20 }}>&#128205;</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--pp-ink)", margin: 0 }}>{e.borough.borough}</p>
                    <p style={{ fontSize: 11, color: "var(--pp-ink-4)", margin: "4px 0 0" }}>{e.borough.postcode}</p>
                  </div>
                </div>
              )}
              {e.air_quality?.aqi && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", background: "var(--pp-surface-2)", borderRadius: "var(--pp-radius)" }}>
                  <span style={{ fontSize: 20 }}>&#128168;</span>
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
            <p style={{ fontSize: 14, color: "var(--pp-ink-2)", lineHeight: 1.6 }}>
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

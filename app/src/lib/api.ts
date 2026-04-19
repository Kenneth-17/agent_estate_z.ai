const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Passport {
  persona: string;
  budget_max: number | null;
  bedrooms_min: number | null;
  commute_destination: string;
  weights: Record<string, number>;
  flags: Record<string, boolean>;
  onboarding_complete: boolean;
}

export interface Enrichment {
  commute: { commute_minutes: number | null; commute_text: string };
  crime: { crime_count: number | null; crime_score: number | null; crime_category: string };
  amenities: { gyms: number; supermarkets: number; pubs: number; restaurants: number; parks: number };
  air_quality: { aqi: string | null };
  transport: { nearest_station: string | null; walk_min: number | null; lines: string[] };
  borough: { postcode: string | null; borough: string | null };
}

export interface Property {
  listing_id: number;
  listing_title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  property_type: string;
  location: string;
  latitude: number;
  longitude: number;
  description: string;
  amenities: string[];
  listing_url: string;
  images_script: string;
  agency_name: string;
  scores?: Record<string, number>;
  overall_score?: number;
  enrichment?: Enrichment;
}

export async function sendMessage(message: string, sessionId: string) {
  const res = await fetch(`${API_BASE}/api/onboard`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: sessionId }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function runSearch(sessionId: string) {
  const res = await fetch(`${API_BASE}/api/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getProperty(listingId: number, sessionId: string) {
  const res = await fetch(`${API_BASE}/api/property/${listingId}?session_id=${sessionId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function refineSearch(message: string, sessionId: string) {
  const res = await fetch(`${API_BASE}/api/refine`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: sessionId }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getPassport(sessionId: string) {
  const res = await fetch(`${API_BASE}/api/passport?session_id=${sessionId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export interface PassportCreateResponse {
  session_id: string;
  top_picks: Property[];
  total_candidates: number;
  total_enriched: number;
  passport: Passport;
}

export async function createPassport(data: {
  session_id: string;
  persona: string;
  budget_max: number;
  bedrooms_min: number;
  commute_destination: string;
  priorities: string[];
  priority_weights?: Record<string, string>;
}): Promise<PassportCreateResponse> {
  const res = await fetch(`${API_BASE}/api/passport/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ─── Supabase persistence ─────────────────────────────────────────
import { createBrowserClient } from "@supabase/ssr";

function getSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function savePassportToSupabase(data: {
  user_id: string;
  session_id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  sex: string;
  persona: string;
  budget_max: number;
  bedrooms_min: number;
  commute_destination: string;
  priorities: string[];
  priority_weights: Record<string, string>;
}) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("passports").upsert(data, { onConflict: "session_id" });
  if (error) throw error;
}

export async function saveResultsToSupabase(sessionId: string, results: Property[]) {
  const rows = results.map(p => ({
    session_id: sessionId,
    listing_id: p.listing_id,
    overall_score: p.overall_score ?? null,
    scores: p.scores ?? {},
    enrichment: p.enrichment ?? {},
  }));
  if (rows.length === 0) return;
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("property_results").insert(rows);
  if (error) throw error;
}

export async function getPassportFromSupabase(sessionId: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("passports").select("*").eq("session_id", sessionId).single();
  if (error) throw error;
  return data;
}

export async function getResultsFromSupabase(sessionId: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("property_results").select("*").eq("session_id", sessionId);
  if (error) throw error;
  return data;
}

"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createPassport } from "@/lib/api";
import "@/styles/passport.css";

// ─── Data ────────────────────────────────────────────────────────
const PERSONAS = [
  { id: "professional", tagline: "Moving for work", sub: "New role, career change, or relocating for a job", motif: "prof", short: "Young Professional" },
  { id: "family", tagline: "Moving with family", sub: "Space, schools, and a safe neighbourhood", motif: "fam", short: "Family" },
  { id: "student", tagline: "Coming to study", sub: "Budget-friendly, close to uni, great social scene", motif: "stu", short: "Student" },
  { id: "newcomer", tagline: "Relocating to the city", sub: "First time in London or moving from abroad", motif: "new", short: "New to London" },
];
const BUDGETS = ["£800", "£1,200", "£1,500", "£2,000", "£2,500", "£3,000+"];
const BEDROOMS = ["Studio", "1 bed", "2 beds", "3 beds", "4+"];
const COMMUTE_SUGGESTIONS = [
  { name: "Canary Wharf", zone: "Zone 2 · E14" },
  { name: "The City (Bank)", zone: "Zone 1 · EC2" },
  { name: "Westminster", zone: "Zone 1 · SW1" },
  { name: "Shoreditch (Liverpool St)", zone: "Zone 1 · EC2" },
  { name: "King's Cross", zone: "Zone 1 · N1C" },
  { name: "Paddington", zone: "Zone 1 · W2" },
  { name: "London Bridge", zone: "Zone 1 · SE1" },
  { name: "Victoria", zone: "Zone 1 · SW1" },
];
const PRIORITIES: Record<string, string[]> = {
  professional: ["Short commute", "Gym nearby", "Nightlife", "Green space", "Air quality", "Safety"],
  family: ["Good schools", "Parks nearby", "Quiet streets", "Safety", "GP nearby", "Air quality"],
  student: ["Close to uni", "Nightlife", "Budget area", "Night transport", "Safety", "Student community"],
  newcomer: ["Safety", "Easy transport", "Local amenities", "Community feel", "Green space", "English-friendly"],
};
const FIELD_NOTES: Record<number, { eyebrow: string; pull: string; body: string }> = {
  0: { eyebrow: "FIELD NOTE · YOUR DATA", pull: "We're an FCA-ready agent, not a data broker.", body: "Everything you enter is encrypted at rest and never sold. One click to delete the lot." },
  1: { eyebrow: "FIELD NOTE · WHY PERSONA", pull: "Your archetype sets the scoring weights.", body: "A Young Professional scores short commutes about 3× heavier than school catchments; a Growing Family does the opposite." },
  2: { eyebrow: "FIELD NOTE · WHAT LONDON COSTS", pull: "Median Zone 2 one-bed: £1,750/mo (Q1 2026, ONS).", body: "Setting an honest ceiling cuts through the noise. We'll still surface listings within 10% of your cap that are genuinely worth stretching for." },
  3: { eyebrow: "FIELD NOTE · SPACE IN LONDON", pull: "A 1-bed inner-London flat averages 46m².", body: "Bedroom count alone can mislead. 'Studio' in London often means sub-28m² — fine for some, claustrophobic for most." },
  4: { eyebrow: "FIELD NOTE · HOW COMMUTE WORKS", pull: "TfL journey times swing 8–22 minutes between peak and off-peak.", body: "We score against your actual travel pattern — not the fastest theoretical route at 3am. Door to door." },
  5: { eyebrow: "FIELD NOTE · WHAT RENTERS REGRET", pull: "Air quality and crime stats are the top two things renters wish they'd checked.", body: "We blend DEFRA NO₂ readings, Met Police 12-month trends, and Ofsted catchment boundaries into a single score." },
};
const DATA_SOURCES = [
  { k: "TFL", label: "TfL live travel times", note: "Journey minutes · peak hours", hex: "#DC241F" },
  { k: "MET", label: "Met Police crime stats", note: "Borough-level incidents", hex: "#1D3557" },
  { k: "DEFRA", label: "DEFRA air quality", note: "NO₂ · PM2.5 · PM10", hex: "#2E8B57" },
  { k: "OFSTED", label: "Ofsted school ratings", note: "Primary & secondary catchments", hex: "#8B6F3A" },
  { k: "NHS", label: "NHS GP catchments", note: "Registration boundaries", hex: "#005EB8" },
];
const INFO_CARDS = [
  { n: "01", title: "Why a passport?", body: "London has 40,000+ live listings. You can't scroll your way home. So we flipped the model — every flat gets scored against your life." },
  { n: "02", title: "What's inside?", body: "A machine-readable snapshot of what you want — budget, commute, priorities — wrapped in real London data. Private. Portable. Deletable." },
  { n: "03", title: "How to use it", body: "Share a single link with a landlord — they see a Right-to-Rent-ready profile. Pre-qualify for a viewing in 30 seconds instead of 30 days." },
];

// ─── Icons ───────────────────────────────────────────────────────
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12 L10 17 L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ArrowIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12 H19 M13 6 L19 12 L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const BackIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12 H5 M11 6 L5 12 L11 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const XIcon = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>;
const PinIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2 C8 2 5 5 5 9 C5 14 12 22 12 22 C12 22 19 14 19 9 C19 5 16 2 12 2 Z M12 11 A2 2 0 1 1 12 7 A2 2 0 1 1 12 11 Z" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>;

// ─── Persona Motifs ──────────────────────────────────────────────
function PersonaMotif({ kind }: { kind: string }) {
  if (kind === "prof") return <svg className="pp-motif" viewBox="0 0 200 200" fill="none"><rect x="30" y="90" width="24" height="80" rx="2" fill="#1A2FB8" opacity="0.8"/><rect x="58" y="60" width="20" height="110" rx="2" fill="#2B4BFF"/><rect x="82" y="78" width="28" height="92" rx="2" fill="#1A2FB8" opacity="0.6"/><rect x="114" y="44" width="18" height="126" rx="2" fill="#2B4BFF" opacity="0.85"/><rect x="136" y="70" width="26" height="100" rx="2" fill="#1A2FB8" opacity="0.7"/><circle cx="155" cy="48" r="11" fill="#2B4BFF"/><g fill="#fff" opacity="0.6">{[0,1,2,3,4].map(i=><rect key={i} x={62} y={70+i*16} width="4" height="6"/>)}{[0,1,2,3,4].map(i=><rect key={"a"+i} x={72} y={70+i*16} width="4" height="6"/>)}{[0,1,2,3,4,5].map(i=><rect key={"b"+i} x={118} y={54+i*16} width="4" height="6"/>)}{[0,1,2,3,4,5].map(i=><rect key={"c"+i} x={126} y={54+i*16} width="4" height="6"/>)}</g><line x1="20" y1="170" x2="180" y2="170" stroke="#1A2FB8" strokeWidth="1" opacity="0.3" strokeDasharray="2 3"/></svg>;
  if (kind === "fam") return <svg className="pp-motif" viewBox="0 0 200 200" fill="none"><path d="M60 110 L100 75 L140 110 L140 160 L60 160 Z" fill="#0F8A4C" opacity="0.2"/><path d="M60 110 L100 75 L140 110" stroke="#0F8A4C" strokeWidth="2" fill="none"/><rect x="60" y="110" width="80" height="50" stroke="#0F8A4C" strokeWidth="2" fill="none"/><rect x="92" y="128" width="16" height="32" fill="#0F8A4C"/><rect x="72" y="120" width="12" height="12" fill="#0F8A4C" opacity="0.6"/><rect x="116" y="120" width="12" height="12" fill="#0F8A4C" opacity="0.6"/><circle cx="38" cy="120" r="20" fill="#0F8A4C" opacity="0.35"/><rect x="35" y="128" width="6" height="32" fill="#0F8A4C" opacity="0.5"/><circle cx="160" cy="45" r="10" fill="#0F8A4C" opacity="0.4"/></svg>;
  if (kind === "stu") return <svg className="pp-motif" viewBox="0 0 200 200" fill="none"><rect x="40" y="120" width="120" height="14" rx="2" fill="#B8701A" opacity="0.9"/><rect x="50" y="104" width="100" height="14" rx="2" fill="#B8701A" opacity="0.65"/><rect x="35" y="88" width="130" height="14" rx="2" fill="#B8701A"/><rect x="118" y="50" width="28" height="32" rx="3" fill="#B8701A" opacity="0.75"/><path d="M146 56 Q156 60 156 68 Q156 76 146 76" stroke="#B8701A" strokeWidth="2.5" fill="none" opacity="0.6"/><path d="M126 42 Q128 34 124 28" stroke="#B8701A" strokeWidth="1.5" fill="none" opacity="0.5"/><path d="M134 42 Q136 34 132 28" stroke="#B8701A" strokeWidth="1.5" fill="none" opacity="0.5"/></svg>;
  return <svg className="pp-motif" viewBox="0 0 200 200" fill="none"><circle cx="100" cy="100" r="58" stroke="#151513" strokeWidth="1.5" fill="none"/><ellipse cx="100" cy="100" rx="58" ry="22" stroke="#151513" strokeWidth="1" opacity="0.4" fill="none"/><line x1="42" y1="100" x2="158" y2="100" stroke="#151513" strokeWidth="1" opacity="0.4"/><line x1="100" y1="42" x2="100" y2="158" stroke="#151513" strokeWidth="1" opacity="0.4"/><path d="M100 70 C92 70 86 76 86 84 C86 95 100 110 100 110 C100 110 114 95 114 84 C114 76 108 70 100 70 Z" fill="#151513"/><circle cx="100" cy="84" r="4" fill="#FBFAF7"/><path d="M60 140 Q100 110 140 60" stroke="#151513" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.6" fill="none"/><circle cx="60" cy="140" r="3" fill="#151513"/></svg>;
}

// ─── Silhouette ──────────────────────────────────────────────────
function Silhouette({ sex, size }: { sex: string; size: number }) {
  const h = size * 1.25;
  if (sex === "F") return <svg width={size} height={h} viewBox="0 0 100 125" fill="currentColor" aria-hidden="true"><path d="M22 58 C20 40 32 20 50 20 C68 20 80 40 78 58 C78 66 76 72 74 76 L84 92 L84 125 L16 125 L16 92 L26 76 C24 72 22 66 22 58 Z" opacity="0.18"/><path d="M12 125 L12 104 C12 96 22 90 38 86 L62 86 C78 90 88 96 88 104 L88 125 Z" opacity="0.9"/><path d="M42 78 L58 78 L58 90 L42 90 Z" opacity="0.9"/><ellipse cx="50" cy="52" rx="20" ry="24" opacity="0.9"/><path d="M30 46 C30 34 40 26 50 26 C62 26 70 34 70 46 C70 44 64 40 58 40 C54 40 52 42 50 42 C48 42 46 40 42 40 C36 40 30 44 30 46 Z" opacity="1"/></svg>;
  if (sex === "M") return <svg width={size} height={h} viewBox="0 0 100 125" fill="currentColor" aria-hidden="true"><path d="M10 125 L10 104 C10 94 22 88 38 84 L62 84 C78 88 90 94 90 104 L90 125 Z" opacity="0.9"/><path d="M42 76 L58 76 L58 88 L42 88 Z" opacity="0.9"/><ellipse cx="50" cy="52" rx="19" ry="22" opacity="0.9"/><path d="M30 44 C30 32 40 26 50 26 C60 26 70 32 70 44 C70 42 62 40 50 40 C38 40 30 42 30 44 Z" opacity="1"/></svg>;
  return <svg width={size} height={h} viewBox="0 0 100 125" fill="currentColor" aria-hidden="true"><path d="M12 125 L12 104 C12 95 22 89 38 85 L62 85 C78 89 88 95 88 104 L88 125 Z" opacity="0.9"/><path d="M42 77 L58 77 L58 89 L42 89 Z" opacity="0.9"/><ellipse cx="50" cy="52" rx="20" ry="23" opacity="0.9"/></svg>;
}

// ─── Step components ─────────────────────────────────────────────

function DetailsStep({ details, onChange }: { details: Record<string, string>; onChange: (v: Record<string, string>) => void }) {
  const update = (k: string, v: string) => onChange({ ...details, [k]: v });
  const emailOk = !details.email || /^\S+@\S+\.\S+$/.test(details.email);
  const dobOk = !details.dob || /^\s*\d{1,2}\s*[\/\-\.]\s*\d{1,2}\s*[\/\-\.]\s*\d{4}\s*$/.test(details.dob);
  return (
    <>
      <div className="pp-step-intro">
        <div className="pp-eyebrow"><span className="pp-bullet" />Welcome · 2 min setup</div>
        <h1 className="pp-step-title">First — a few <em>details</em> about you.</h1>
        <p className="pp-step-sub">We'll use these to save your Rental Passport. No spam — and you can delete your data any time.</p>
      </div>
      <div className="pp-details-form">
        <div className="pp-field-row">
          <label className="pp-field-label">Full name <span className="pp-req">*</span></label>
          <div className="pp-text-input-wrap wide"><input className="pp-text-input" placeholder="e.g. Ava Patel" value={details.name} onChange={e => update("name", e.target.value)} /></div>
        </div>
        <div className="pp-field-row">
          <label className="pp-field-label">Email <span className="pp-req">*</span></label>
          <div className={"pp-text-input-wrap wide" + (!emailOk ? " invalid" : "")}><input className="pp-text-input" type="email" placeholder="you@example.com" value={details.email} onChange={e => update("email", e.target.value)} /></div>
          {!emailOk && <div className="pp-field-error">Please enter a valid email address.</div>}
        </div>
        <div className="pp-field-row-split">
          <div className="pp-field-row">
            <label className="pp-field-label">Phone <span className="pp-opt">optional</span></label>
            <div className="pp-text-input-wrap wide"><span className="pp-prefix">+44</span><input className="pp-text-input" type="tel" placeholder="7700 900123" value={details.phone} onChange={e => update("phone", e.target.value)} /></div>
          </div>
          <div className="pp-field-row">
            <label className="pp-field-label">Date of birth <span className="pp-req">*</span></label>
            <div className={"pp-text-input-wrap wide" + (!dobOk ? " invalid" : "")}><input className="pp-text-input" type="text" placeholder="DD / MM / YYYY" value={details.dob} onChange={e => update("dob", e.target.value)} /></div>
            {!dobOk && <div className="pp-field-error">Please enter a valid date.</div>}
          </div>
        </div>
        <div className="pp-field-row">
          <label className="pp-field-label">Sex <span className="pp-req">*</span> <span className="pp-opt">for passport photo</span></label>
          <div className="pp-sex-options">
            {[["F", "Female"], ["M", "Male"], ["X", "Prefer not to say"]].map(([v, label]) => (
              <button key={v} type="button" className={"pp-sex-opt" + (details.sex === v ? " selected" : "")} onClick={() => update("sex", v)}>
                <span className="pp-sex-ico"><Silhouette sex={v} size={28} /></span>
                <span className="pp-sex-label">{label}</span>
                <span className="pp-sex-code">{v}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="pp-legal-row">
          <span className="pp-legal-icon">✓</span>
          <span>By continuing you agree to our <a href="#">Terms</a> and <a href="#">Privacy policy</a>. We never share personal data with landlords without your consent.</span>
        </div>
      </div>
    </>
  );
}

function PersonaStep({ details, persona, onPick }: { details: Record<string, string>; persona: string | null; onPick: (v: string) => void }) {
  const firstName = (details?.name || "").trim().split(" ")[0];
  return (
    <>
      <div className="pp-step-intro">
        <div className="pp-eyebrow"><span className="pp-bullet" />Step 2 of 6</div>
        <h1 className="pp-step-title">{firstName ? <>Nice to meet you, <em>{firstName}</em>.</> : <>Let's find your perfect <em>London home.</em></>}</h1>
        <p className="pp-step-sub">Which one sounds most like you? We'll tune every recommendation to your life, not just your budget.</p>
      </div>
      <div className="pp-persona-grid">
        {PERSONAS.map(p => (
          <button key={p.id} className={"pp-persona-card" + (persona === p.id ? " selected" : "")} onClick={() => onPick(p.id)}>
            <div className="pp-persona-media">
              <div className={"pp-p-illus " + p.motif}><PersonaMotif kind={p.motif} /></div>
              <div className="pp-persona-check"><CheckIcon /></div>
            </div>
            <div className="pp-persona-body">
              <div className="pp-persona-tagline">{p.tagline}</div>
              <div className="pp-persona-sub">{p.sub}</div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

function AIBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="pp-bubble-row">
      <div className="pp-avatar">Z</div>
      <div className="pp-bubble ai-big">
        <div className="pp-agent-name">Zephyr · AI agent</div>
        {children}
      </div>
    </div>
  );
}
function UserBubble({ children }: { children: React.ReactNode }) {
  return <div className="pp-bubble-row user"><div className="pp-bubble user-bubble">{children}</div></div>;
}

function BudgetStep({ personaObj, budget, onPick }: { personaObj: typeof PERSONAS[0] | undefined; budget: string | null; onPick: (v: string) => void }) {
  const [custom, setCustom] = useState("");
  const name = personaObj?.short?.toLowerCase() || "you";
  return (
    <div className="pp-chat">
      <AIBubble>
        <p className="pp-q">Great — a <em>{name}</em>. Now, what's your monthly budget for rent?</p>
        <div className="pp-sub">All figures in GBP. We'll scan active London listings and only surface what fits.</div>
      </AIBubble>
      {budget && <UserBubble>{budget}/month</UserBubble>}
      <div className="pp-answer-area">
        <div className="pp-chips">
          {BUDGETS.map(b => <button key={b} className={"pp-chip" + (budget === b ? " selected" : "")} onClick={() => onPick(b)}>{b} <span className="pp-chip-count">/mo</span></button>)}
        </div>
        <div className="pp-text-input-wrap">
          <span className="pp-prefix">£</span>
          <input className="pp-text-input" placeholder="Or enter a custom amount" value={custom} onChange={e => setCustom(e.target.value.replace(/[^0-9]/g, ""))} onKeyDown={e => { if (e.key === "Enter" && custom) onPick("£" + Number(custom).toLocaleString()); }} />
          <button className="pp-input-submit" disabled={!custom} onClick={() => { if (custom) onPick("£" + Number(custom).toLocaleString()); }}>Set</button>
        </div>
      </div>
    </div>
  );
}

function BedroomsStep({ budget, bedrooms, onPick }: { budget: string | null; bedrooms: string | null; onPick: (v: string) => void }) {
  return (
    <div className="pp-chat">
      <AIBubble>
        <p className="pp-q">Got it — <em>{budget}</em>. How much <em>space</em> do you need?</p>
        <div className="pp-sub">You can change this later. We'll also flag listings slightly over if they're great value.</div>
      </AIBubble>
      {bedrooms && <UserBubble>{bedrooms}</UserBubble>}
      <div className="pp-answer-area">
        <div className="pp-chips">
          {BEDROOMS.map(b => <button key={b} className={"pp-chip" + (bedrooms === b ? " selected" : "")} onClick={() => onPick(b)}>{b}</button>)}
        </div>
      </div>
    </div>
  );
}

function CommuteStep({ commute, onPick }: { commute: string | null; onPick: (v: string) => void }) {
  const [val, setVal] = useState("");
  const [showAC, setShowAC] = useState(false);
  const suggestions = useMemo(() => {
    if (!val) return COMMUTE_SUGGESTIONS.slice(0, 5);
    return COMMUTE_SUGGESTIONS.filter(s => s.name.toLowerCase().includes(val.toLowerCase())).slice(0, 5);
  }, [val]);
  return (
    <div className="pp-chat">
      <AIBubble>
        <p className="pp-q">Where will you be commuting to?</p>
        <div className="pp-sub">We'll check live TfL travel times from every property — door to door, at your peak hour.</div>
      </AIBubble>
      {commute && <UserBubble><PinIcon /> {commute}</UserBubble>}
      <div className="pp-answer-area">
        <div className="pp-chips">
          {COMMUTE_SUGGESTIONS.slice(0, 5).map(s => <button key={s.name} className={"pp-chip" + (commute === s.name ? " selected" : "")} onClick={() => onPick(s.name)}>{s.name}</button>)}
        </div>
        <div className="pp-text-input-wrap">
          <span className="pp-prefix"><PinIcon /></span>
          <input className="pp-text-input" placeholder="Or type any London area or postcode" value={val} onChange={e => { setVal(e.target.value); setShowAC(true); }} onFocus={() => setShowAC(true)} />
          <button className="pp-input-submit" disabled={!val} onClick={() => { onPick(val); setShowAC(false); setVal(""); }}>Set</button>
        </div>
        {showAC && val && (
          <div className="pp-autocomplete">
            {suggestions.length === 0 && <div className="pp-ac-item">No matches — use free text</div>}
            {suggestions.map(s => <div key={s.name} className="pp-ac-item" onClick={() => { onPick(s.name); setShowAC(false); setVal(""); }}><span>{s.name}</span><span className="pp-zone">{s.zone}</span></div>)}
          </div>
        )}
      </div>
    </div>
  );
}

function PrioritiesStep({ personaObj, priorities, toggle, onAddCustom }: { personaObj: typeof PERSONAS[0] | undefined; priorities: string[]; toggle: (p: string) => void; onAddCustom: (v: string) => void }) {
  const [custom, setCustom] = useState("");
  const opts = personaObj ? PRIORITIES[personaObj.id] : PRIORITIES.professional;
  const presetSelected = priorities.filter(p => opts.includes(p)).length;
  const customSelected = priorities.filter(p => !opts.includes(p)).length;
  const maxPreset = 3;
  const maxCustom = 3;
  return (
    <div className="pp-chat">
      <AIBubble>
        <p className="pp-q">Last one. What <em>matters most</em> in your next place?</p>
        <div className="pp-sub">Pick from the suggestions, or type your own below. Up to 6 total.</div>
      </AIBubble>
      {priorities.length > 0 && <UserBubble>{priorities.join(" · ")}</UserBubble>}
      <div className="pp-answer-area">
        <div className="pp-chips">
          {opts.map(p => {
            const selected = priorities.includes(p);
            const disabled = !selected && presetSelected >= maxPreset;
            return <button key={p} className={"pp-chip" + (selected ? " selected" : "")} onClick={() => toggle(p)} disabled={disabled} style={disabled ? { opacity: 0.4, cursor: "not-allowed" } : {}}>{p} {selected && <span className="pp-x"><XIcon /></span>}</button>;
          })}
        </div>
        <div className="pp-text-input-wrap" style={{ marginTop: 12 }}>
          <input className="pp-text-input" placeholder="Or type what matters to you…" value={custom} onChange={e => setCustom(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && custom.trim() && customSelected < maxCustom) { onAddCustom(custom.trim()); setCustom(""); } }} />
          <button className="pp-input-submit" disabled={!custom.trim() || customSelected >= maxCustom} onClick={() => { if (custom.trim() && customSelected < maxCustom) { onAddCustom(custom.trim()); setCustom(""); } }}>Add</button>
        </div>
        {customSelected > 0 && (
          <div className="pp-chips" style={{ marginTop: 8 }}>
            {priorities.filter(p => !opts.includes(p)).map(p => (
              <button key={p} className="pp-chip selected pp-chip-custom" onClick={() => toggle(p)}>{p} <span className="pp-x"><XIcon /></span></button>
            ))}
          </div>
        )}
        <div className="pp-helper-row"><span>{priorities.length} selected</span><span>·</span><span>Priorities just change the ranking — we'll still show everything.</span></div>
      </div>
    </div>
  );
}

// ─── Review Step ──────────────────────────────────────────────────
function ReviewStep({ details, personaObj, budget, bedrooms, commute, priorities }: { details: Record<string, string>; personaObj: typeof PERSONAS[0] | undefined; budget: string | null; bedrooms: string | null; commute: string | null; priorities: string[] }) {
  const rows: [string, string][] = [
    ["Persona", personaObj?.short || "—"],
    ["Budget", budget ? budget + "/mo" : "—"],
    ["Bedrooms", bedrooms || "—"],
    ["Commute", commute || "—"],
  ];
  return (
    <div className="pp-chat">
      <AIBubble>
        <p className="pp-q">Here&apos;s everything you&apos;ve told us.</p>
        <div className="pp-sub">Take a quick look — you can always go back and change things later.</div>
      </AIBubble>
      <div className="pp-answer-area" style={{ marginLeft: 0 }}>
        <div style={{ background: "var(--pp-surface)", border: "1px solid var(--pp-line)", borderRadius: "var(--pp-radius)", overflow: "hidden", maxWidth: 560 }}>
          {rows.map(([k, v], i) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderBottom: i < rows.length - 1 ? "1px solid var(--pp-line-2)" : "none" }}>
              <span style={{ fontFamily: "var(--pp-mono)", fontSize: 11, color: "var(--pp-ink-4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{k}</span>
              <span style={{ fontWeight: 500 }}>{v}</span>
            </div>
          ))}
          <div style={{ padding: "14px 18px", background: "var(--pp-surface-2)", borderTop: "1px dashed var(--pp-line)" }}>
            <div style={{ fontFamily: "var(--pp-mono)", fontSize: 11, color: "var(--pp-ink-4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Priorities</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {priorities.map(p => <span key={p} style={{ padding: "5px 12px", background: "var(--pp-surface)", border: "1px solid var(--pp-line)", borderRadius: 999, fontSize: 13, fontWeight: 500 }}>{p}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Weightage Step ───────────────────────────────────────────────
const WEIGHT_LEVELS = ["Critical", "Important", "Nice to have"] as const;
type WeightLevel = typeof WEIGHT_LEVELS[number];
const WEIGHT_WIDTHS: Record<string, string> = { Critical: "100%", Important: "65%", "Nice to have": "35%" };
const WEIGHT_COLORS: Record<string, string> = { Critical: "var(--pp-ink)", Important: "var(--pp-ink-3)", "Nice to have": "var(--pp-ink-4)" };

function WeightageStep({ priorities, weights, setWeight }: { priorities: string[]; weights: Record<string, string>; setWeight: (p: string, w: string) => void }) {
  return (
    <div className="pp-chat">
      <AIBubble>
        <p className="pp-q">How much does each one <em>matter</em>?</p>
        <div className="pp-sub">Set the importance of each priority. This shapes how we score properties for you.</div>
      </AIBubble>
      <div className="pp-answer-area" style={{ marginLeft: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 560 }}>
          {priorities.map((p, i) => {
            const currentWeight = weights[p] || (i === 0 ? "Critical" : i === 1 ? "Important" : "Nice to have");
            return (
              <div key={p} className="pp-weight-row">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontWeight: 500, fontSize: 14 }}>{p}</span>
                  <span style={{ fontFamily: "var(--pp-mono)", fontSize: 10, color: WEIGHT_COLORS[currentWeight], letterSpacing: "0.06em", textTransform: "uppercase" }}>{currentWeight}</span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {WEIGHT_LEVELS.map(w => (
                    <button key={w} className={"pp-chip" + (currentWeight === w ? " selected" : "")} style={{ flex: 1, justifyContent: "center", fontSize: 12 }} onClick={() => setWeight(p, w)}>{w}</button>
                  ))}
                </div>
                <div className="pp-priority-bar" style={{ marginTop: 6 }}>
                  <div className="pp-priority-fill" style={{ width: WEIGHT_WIDTHS[currentWeight], background: WEIGHT_COLORS[currentWeight] }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Context Note ────────────────────────────────────────────────
function ContextNote({ step }: { step: number }) {
  const note = FIELD_NOTES[step];
  if (!note) return null;
  return (
    <aside className="pp-context-note">
      <div><span style={{ fontFamily: "var(--pp-mono)", fontSize: 10, letterSpacing: "0.16em", color: "var(--pp-ink-4)", lineHeight: 1.5, paddingLeft: 16, borderLeft: "2px solid var(--pp-accent)", textTransform: "uppercase" }}>{note.eyebrow}</span></div>
      <div className="pp-context-note-body">
        <p className="pp-context-note-pull">{note.pull}</p>
        <p className="pp-context-note-text">{note.body}</p>
      </div>
    </aside>
  );
}

// ─── Loading View ────────────────────────────────────────────────
function LoadingView({ details, personaObj, budget, bedrooms, onSkip }: { details: Record<string, string>; personaObj: typeof PERSONAS[0] | undefined; budget: string | null; bedrooms: string | null; onSkip: () => void }) {
  const [tick, setTick] = useState(0);
  const [mrzIndex, setMrzIndex] = useState(0);
  const mrzFull = useMemo(() => {
    const surname = (details?.name || "TRAVELLER").split(" ").slice(-1)[0].toUpperCase().replace(/[^A-Z]/g, "");
    const given = (details?.name || "AVA").split(" ")[0].toUpperCase().replace(/[^A-Z]/g, "");
    const l1 = ("P<AEZ" + surname + "<<" + given + "<".repeat(44)).slice(0, 44);
    const l2 = (surname.slice(0, 4) + given.slice(0, 2) + "1234" + "<".repeat(44)).slice(0, 44);
    return l1 + "\n" + l2;
  }, [details]);

  useEffect(() => {
    const timers = DATA_SOURCES.map((_, i) => setTimeout(() => setTick(t => Math.max(t, i + 1)), 500 + i * 850));
    return () => timers.forEach(clearTimeout);
  }, []);
  useEffect(() => {
    if (mrzIndex >= mrzFull.length) return;
    const t = setTimeout(() => setMrzIndex(i => i + Math.ceil(mrzFull.length / 80)), 55);
    return () => clearTimeout(t);
  }, [mrzIndex, mrzFull]);
  const infoVisible = Math.min(3, Math.floor(tick / 2) + (tick >= 1 ? 1 : 0));
  const stampPositions = [{ left: "14%", top: "22%" }, { left: "62%", top: "18%" }, { left: "34%", top: "48%" }, { left: "72%", top: "56%" }, { left: "22%", top: "72%" }];

  return (
    <div className="pp-loading-view">
      <div className="pp-loading-head">
        <div className="pp-eyebrow" style={{ justifyContent: "center" }}><span className="pp-bullet pulse" /> Authenticating · please stay on this page</div>
        <h1 className="pp-loading-title">Cross-checking <em>{(details?.name || "your profile").split(" ")[0]}</em> against live London data.</h1>
        <p className="pp-loading-sub">We're stitching five public data sources into one Rental Passport. Usually takes about 5 seconds.</p>
      </div>
      <div className="pp-loading-grid">
        <div className="pp-auth-panel">
          <div className="pp-auth-panel-header">
            <span style={{ fontFamily: "var(--pp-mono)" }}>TERMINAL · AEZ-AUTH</span>
            <span className="pp-auth-timestamp"><span className="pp-blink">●</span> LIVE</span>
          </div>
          <div className="pp-auth-stage">
            <div className="pp-auth-stage-grid" />
            <div className="pp-auth-stage-scan" style={{ animationPlayState: tick >= 5 ? "paused" : "running" }} />
            <div className="pp-auth-stage-watermark">Z</div>
            {DATA_SOURCES.map((s, i) => (
              <div key={s.k} className={"pp-auth-stamp " + (tick > i ? "on" : "")} style={{ ...stampPositions[i], color: s.hex }}>
                <div className="pp-auth-stamp-ring"><span style={{ fontFamily: "var(--pp-mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em" }}>{s.k}</span></div>
              </div>
            ))}
            <div className="pp-auth-central">
              <div className="pp-auth-central-inner">
                <div style={{ fontFamily: "var(--pp-mono)", fontSize: 9, letterSpacing: "0.14em", color: "var(--pp-ink-4)", textTransform: "uppercase" }}>PASSPORT · DRAFT</div>
                <div className="pp-auth-central-name">{(details?.name || "Your Name").toUpperCase()}</div>
                <div style={{ display: "flex", gap: 12, fontSize: 9, color: "var(--pp-ink-3)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--pp-mono)" }}>
                  <span>{personaObj?.tagline?.toUpperCase() || "PROFILE"}</span>
                  <span>{budget?.toUpperCase() || "—"}</span>
                  <span>{(bedrooms || "—").toUpperCase()}</span>
                </div>
                <div style={{ height: 1, background: "var(--pp-ink)", opacity: 0.6 }} />
                <div className="pp-auth-central-mrz">
                  {mrzFull.slice(0, mrzIndex).split("\n").map((l, li) => (
                    <div key={li}>{l}{li === mrzFull.split("\n").length - 1 && mrzIndex < mrzFull.length ? <span className="pp-caret">▋</span> : null}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <ul className="pp-auth-ticker">
            {DATA_SOURCES.map((s, i) => {
              const done = tick > i;
              const active = tick === i;
              return (
                <li key={s.k} className={"pp-auth-ticker-row " + (done ? "done" : active ? "active" : "")}>
                  <span className="pp-auth-ticker-ico">
                    {done ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12 L10 17 L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      : active ? <span className="pp-auth-spinner" /> : <span className="pp-auth-empty" />}
                  </span>
                  <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span className="pp-auth-ticker-k">{s.k}</span>
                    <span className="pp-auth-ticker-name">{s.label}</span>
                  </span>
                  <span style={{ fontFamily: "var(--pp-mono)", fontSize: 10, letterSpacing: "0.06em", opacity: 0.8 }}>{done ? "OK · " + (20 + i * 13) + "ms" : active ? "handshake…" : "—"}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="pp-info-stack">
          <div style={{ fontFamily: "var(--pp-mono)", fontSize: 10, letterSpacing: "0.16em", color: "var(--pp-ink-4)", textTransform: "uppercase", paddingBottom: 6 }}>WHILE YOU WAIT</div>
          {INFO_CARDS.map((c, i) => (
            <div key={c.n} className={"pp-info-card " + (i < infoVisible ? "visible" : "")} style={{ transitionDelay: (i * 60) + "ms" }}>
              <div className="pp-info-card-n">{c.n}</div>
              <div><div className="pp-info-card-title">{c.title}</div><div className="pp-info-card-text">{c.body}</div></div>
            </div>
          ))}
          <div style={{ marginTop: "auto", paddingTop: 8, display: "flex", justifyContent: "flex-end" }}>
            <button className="pp-skip-btn" onClick={onSkip}>Skip animation →</button>
          </div>
        </div>
      </div>
      <div className="pp-loading-progress"><div className="pp-loading-progress-fill" style={{ width: `${Math.min(100, (tick / 5) * 100)}%` }} /></div>
    </div>
  );
}

// ─── Entry (passport book field) ──────────────────────────────────
function PpEntry({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="pp-entry">
      <div className="pp-entry-k">{k}</div>
      <div className={"pp-entry-v" + (mono ? " mono" : "")}>{v}</div>
    </div>
  );
}

// ─── Reveal View (Passport Book) ─────────────────────────────────
function RevealView({ details, personaObj, budget, bedrooms, commute, priorities, priorityWeights, onFindHome, submitting, onRestart }: { details: Record<string, string>; personaObj: typeof PERSONAS[0] | undefined; budget: string | null; bedrooms: string | null; commute: string | null; priorities: string[]; priorityWeights: Record<string, string>; onFindHome: () => void; submitting: boolean; onRestart: () => void }) {
  const holder = details?.name?.trim() || "UNSIGNED";
  const surname = holder.split(" ").slice(-1)[0] || "UNSIGNED";
  const given = holder.split(" ").slice(0, -1).join(" ") || holder;
  const dob = details?.dob || "—";
  const sex = details?.sex || "X";
  const today = new Date();
  const expiry = new Date(today.getFullYear(), today.getMonth() + 6, today.getDate());
  const fmt = (d: Date) => d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();

  const ppNumber = useMemo(() => {
    const src = (holder + (details?.email || "")).toUpperCase().replace(/[^A-Z0-9]/g, "");
    let n = "";
    for (let i = 0; i < 9; i++) n += src.charCodeAt(i % src.length).toString(36).toUpperCase().slice(-1);
    return "Z" + n.slice(0, 8);
  }, [holder, details?.email]);

  const mrz1 = `P<AEZ${surname.toUpperCase().replace(/[^A-Z]/g, "")}<<${given.toUpperCase().replace(/\s/g, "<").replace(/[^A-Z<]/g, "")}`.padEnd(44, "<").slice(0, 44);
  const mrz2 = `${ppNumber}<GBR${dob.replace(/\D/g, "").slice(-6)}${sex}${expiry.getFullYear().toString().slice(-2)}${String(expiry.getMonth() + 1).padStart(2, "0")}${String(expiry.getDate()).padStart(2, "0")}`.padEnd(44, "<").slice(0, 44);

  return (
    <div className="pp-reveal-wrap">
      <div className="pp-reveal-intro">
        <div className="pp-eyebrow" style={{ justifyContent: "center" }}><span className="pp-bullet" />Passport ready</div>
        <h1>Your <em>Rental Passport</em> is authenticated.</h1>
        <p>We&apos;ll use it to score every London listing against your life — and you can share it with landlords in one tap.</p>
      </div>

      <div className="pp-passport-book">
        {/* Outer cover seal */}
        <div className="pp-cover-stamp">
          <div className="pp-cover-inner">
            <div className="pp-coat">
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1" /><path d="M20 6 L22 14 L30 14 L24 19 L26 27 L20 23 L14 27 L16 19 L10 14 L18 14 Z" fill="currentColor" /></svg>
            </div>
            <div className="pp-cover-t1">AGENT ESTATE</div>
            <div className="pp-cover-t2">Z</div>
            <div className="pp-cover-t3">RENTAL PASSPORT</div>
            <div className="pp-cover-t4">UNITED KINGDOM</div>
          </div>
        </div>

        {/* Inside pages */}
        <div className="pp-spread">
          {/* LEFT PAGE — Photo + identity */}
          <div className="pp-page left">
            <div className="pp-watermark-full">Z</div>
            <div className="pp-page-header">
              <span>RENTAL PASSPORT · PASSEPORT DE LOCATION</span>
              <span>UK / GBR</span>
            </div>

            <div className="pp-photo-row">
              <div className="pp-photo">
                <div className="pp-photo-inner">
                  <Silhouette sex={sex} size={112} />
                </div>
                <div className="pp-photo-tag">PHOTO · AEZ-ID</div>
              </div>
              <div className="pp-personal">
                <PpEntry k="Surname / Nom" v={surname.toUpperCase()} />
                <PpEntry k="Given names / Prénoms" v={given.toUpperCase()} />
                <PpEntry k="Nationality / Nationalité" v="BRITISH RESIDENT" />
                <PpEntry k="Date of birth" v={dob} />
                <PpEntry k="Sex" v={sex} />
                <PpEntry k="Passport no." v={ppNumber} mono />
              </div>
            </div>

            <div className="pp-dates">
              <PpEntry k="Date of issue" v={fmt(today)} mono />
              <PpEntry k="Date of expiry" v={fmt(expiry)} mono />
              <PpEntry k="Authority" v="AGENT ESTATE Z" />
            </div>

            <div className="pp-mrz-block">
              <div>{mrz1}</div>
              <div>{mrz2}</div>
            </div>
          </div>

          {/* RIGHT PAGE — Visa stamps + rental profile */}
          <div className="pp-page right">
            <div className="pp-page-header">
              <span>RENTAL PROFILE · CRITÈRES</span>
              <span>PAGE 02</span>
            </div>

            <div className="pp-visa-stamp">
              <div className="pp-visa-inner">
                <div className="pp-visa-top">LONDON · UK</div>
                <div className="pp-visa-big">VERIFIED</div>
                <div className="pp-visa-date">{fmt(today)}</div>
                <div className="pp-visa-sub">Ready to view</div>
              </div>
            </div>

            <div className="pp-round-stamp">
              <div className="pp-round-inner">
                <div className="pp-round-top">AEZ · AUTH</div>
                <div className="pp-round-center">&#10003;</div>
                <div className="pp-round-bottom">{today.getFullYear()}</div>
              </div>
            </div>

            <div className="pp-profile">
              <PpEntry k="Persona" v={personaObj?.short || "—"} />
              <PpEntry k="Budget" v={budget ? budget + " / month" : "—"} mono />
              <PpEntry k="Bedrooms" v={bedrooms || "—"} />
              <PpEntry k="Commute" v={commute || "—"} />
            </div>

            <div className="pp-priorities-block">
              <div className="pp-block-label">PRIORITY WEIGHTS · PRIORITÉS</div>
              <div className="pp-priority-list">
                {priorities.map((p, i) => (
                  <div key={p} className="pp-priority-row">
                    <span className="pp-priority-rank">{String(i + 1).padStart(2, "0")}</span>
                    <span className="pp-priority-name">{p}</span>
                    <span className="pp-priority-bar">
                      <span className="pp-priority-fill" style={{ width: WEIGHT_WIDTHS[priorityWeights[p] || "Nice to have"], background: WEIGHT_COLORS[priorityWeights[p] || "Nice to have"] }} />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pp-signature">
              <div className="pp-sig-line">
                <span className="pp-sig-script">{holder}</span>
              </div>
              <div className="pp-sig-caption">Holder&apos;s signature · Signature du titulaire</div>
            </div>
          </div>
        </div>
      </div>

      <div className="pp-cta-bar">
        <button className="pp-big-cta" onClick={onFindHome} disabled={submitting}>
          {submitting ? "Searching London..." : "Find my home"} <ArrowIcon />
        </button>
        <button className="pp-ghost-cta" onClick={onRestart}>Edit details</button>
        <button className="pp-ghost-cta">Share with landlord</button>
      </div>

      <div className="pp-meta-strip">
        <span>END-TO-END ENCRYPTED</span><span className="pp-sep" /><span>SHAREABLE WITH LANDLORDS</span><span className="pp-sep" /><span>RIGHT-TO-RENT COMPATIBLE</span>
      </div>
    </div>
  );
}

// ─── Passport Sidebar ────────────────────────────────────────────
function PassportSidebar({ details, personaObj, budget, bedrooms, commute, priorities, step, lastFilled }: { details: Record<string, string>; personaObj: typeof PERSONAS[0] | undefined; budget: string | null; bedrooms: string | null; commute: string | null; priorities: string[]; step: number; lastFilled: string | null }) {
  const pctComplete = [!!details?.name, !!personaObj, !!budget, !!bedrooms, !!commute, priorities.length > 0].filter(Boolean).length * Math.round(100 / 6);
  return (
    <>
      <div className="pp-sb-head">
        <div className="pp-sb-title">Your Rental Passport</div>
        <div className="pp-sb-status"><span className="pp-dot-s" /> Live · {pctComplete}%</div>
      </div>
      <div className="passport-card">
        <div className="pp-hero pp-hero-photo">
          <span className="pp-watermark">Z</span>
          <div className="pp-hero-body">
            <div className="pp-label">AEZ · RENTAL PASSPORT</div>
            <div className="pp-name">{details?.name || <span style={{ color: "var(--pp-ink-4)", fontStyle: "italic" }}>Unassigned</span>}</div>
            <div className="pp-id">ID · AEZ-{Date.now().toString().slice(-6)}</div>
          </div>
          <div className="pp-hero-photo-slot">
            {details?.sex ? <Silhouette sex={details.sex} size={54} /> : <span style={{ fontFamily: "var(--pp-mono)", fontSize: 9, color: "var(--pp-ink-4)" }}>ID PHOTO</span>}
          </div>
        </div>
        <div className="pp-body">
          {[
            ["Persona", personaObj?.short],
            ["Budget", budget ? budget + "/mo" : null],
            ["Bedrooms", bedrooms],
            ["Commute", commute],
          ].map(([k, v]) => (
            <div key={k as string} className="pp-field">
              <span className="pp-k">{k as string}</span>
              <span className={"pp-v " + (!v ? "empty" : "") + (lastFilled === (k as string).toLowerCase() ? " filling" : "")}>{v || "Not set"}</span>
            </div>
          ))}
        </div>
        <div className="pp-priorities">
          <div className="pp-priorities-label">Priorities · weighted</div>
          <div className="pp-tags">
            {priorities.length === 0 && <span className="pp-tag empty">tbd</span>}
            {priorities.map((p, i) => <span key={p} className="pp-tag"><span className="pp-rank">{String(i + 1).padStart(2, "0")}</span>{p}</span>)}
          </div>
        </div>
      </div>
      <div className="pp-sb-footnote">
        <div className="pp-footnote-title">Data we'll use</div>
        <div className="pp-data-list">
          {[["TfL live travel times", "live"], ["Met Police crime stats", "monthly"], ["DEFRA air quality", "hourly"], ["Ofsted school ratings", "current"]].map(([label, freq]) => (
            <div key={label} className="pp-data-row"><span>{label}</span><span className="pp-data-v">{freq}</span></div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Main Page ───────────────────────────────────────────────────
export default function OnboardPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState<Record<string, string>>({ name: "", email: "", phone: "", dob: "", sex: "" });
  const [persona, setPersona] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [bedrooms, setBedrooms] = useState<string | null>(null);
  const [commute, setCommute] = useState<string | null>(null);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [priorityWeights, setPriorityWeights] = useState<Record<string, string>>({});
  const [lastFilled, setLastFilled] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const sessionId = useRef(`session-${Date.now()}`);
  const personaObj = PERSONAS.find(p => p.id === persona);

  const flash = useCallback((key: string) => { setLastFilled(key); setTimeout(() => setLastFilled(null), 1200); }, []);

  const onPick = (key: string, value: string | Record<string, string>) => {
    if (key === "persona") { setPersona(value as string); flash("persona"); }
    if (key === "budget") { setBudget(value as string); flash("budget"); }
    if (key === "bedrooms") { setBedrooms(value as string); flash("bedrooms"); }
    if (key === "commute") { setCommute(value as string); flash("commute"); }
    if (key === "details") setDetails(value as Record<string, string>);
  };

  const togglePriority = (p: string) => {
    setPriorities(prev => {
      if (prev.includes(p)) {
        const next = prev.filter(x => x !== p);
        setPriorityWeights(w => { const c = { ...w }; delete c[p]; return c; });
        return next;
      }
      if (prev.length >= 6) return prev;
      flash("priorities");
      return [...prev, p];
    });
  };

  const addCustomPriority = (p: string) => {
    if (priorities.includes(p) || priorities.length >= 6) return;
    flash("priorities");
    setPriorities(prev => [...prev, p]);
  };

  const setWeight = (p: string, w: string) => {
    setPriorityWeights(prev => ({ ...prev, [p]: w }));
  };

  const detailsValid = () => {
    const emailOk = /^\S+@\S+\.\S+$/.test(details.email);
    const dobOk = /^\s*\d{1,2}\s*[\/\-\.]\s*\d{1,2}\s*[\/\-\.]\s*\d{4}\s*$/.test(details.dob);
    return details.name.trim().length > 1 && emailOk && dobOk && !!details.sex;
  };

  const canAdvance = () => {
    if (step === 0) return detailsValid();
    if (step === 1) return !!persona;
    if (step === 2) return !!budget;
    if (step === 3) return !!bedrooms;
    if (step === 4) return !!commute;
    if (step === 5) return priorities.length >= 1;
    if (step === 6) return true;
    if (step === 7) return priorities.every(p => priorityWeights[p]);
    return false;
  };

  const next = () => setStep(s => Math.min(9, s + 1));
  const back = () => setStep(s => Math.max(0, s - 1));

  const parseBudget = (b: string): number => {
    const num = parseInt(b.replace(/[£,]/g, "").replace(/\/mo.*/, ""), 10);
    return isNaN(num) ? 2000 : num;
  };
  const parseBedrooms = (b: string): number => {
    if (b === "Studio") return 0;
    const num = parseInt(b, 10);
    return isNaN(num) ? 4 : num;
  };

  const handleFindHome = async () => {
    setSubmitting(true);
    setError("");
    try {
      const result = await createPassport({
        session_id: sessionId.current,
        persona: persona || "professional",
        budget_max: parseBudget(budget || "£2,000"),
        bedrooms_min: parseBedrooms(bedrooms || "1 bed"),
        commute_destination: commute || "London Bridge",
        priorities,
        priority_weights: priorityWeights,
      });
      router.push(`/results?session=${result.session_id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  // Auto-advance from loading (step 8) to reveal (step 9)
  useEffect(() => {
    if (step === 8) {
      const t = setTimeout(() => setStep(9), 6200);
      return () => clearTimeout(t);
    }
  }, [step]);

  // Set default weights when entering weightage step
  useEffect(() => {
    if (step === 7) {
      setPriorityWeights(prev => {
        const updated = { ...prev };
        priorities.forEach((p, i) => {
          if (!updated[p]) updated[p] = i === 0 ? "Critical" : i === 1 ? "Important" : "Nice to have";
        });
        return updated;
      });
    }
  }, [step, priorities]);

  const stepLabels = ["Details", "Persona", "Budget", "Bedrooms", "Commute", "Priorities", "Review", "Weightage", "Authenticating", "Passport"];
  const totalSteps = 10;

  return (
    <div className="pp-app">
      <main className="pp-main">
        <div className="pp-topbar">
          <a href="/" className="pp-brand">
            <div className="pp-brand-mark">Z</div>
            <div className="pp-brand-name">Agent Estate Z <span className="pp-light">· Rental Passport</span></div>
          </a>
          <div className="pp-top-actions">
            <button className="pp-help-btn">Need help?</button>
          </div>
        </div>

        <div className="pp-progress-wrap">
          <div className="pp-progress-label">Step {Math.min(step + 1, totalSteps).toString().padStart(2, "0")} / {totalSteps.toString().padStart(2, "0")} · {stepLabels[step]}</div>
          <div className="pp-progress-track"><div className="pp-progress-fill" style={{ width: step >= totalSteps - 1 ? "100%" : `${(step / (totalSteps - 1)) * 100}%` }} /></div>
          <div className="pp-progress-dots">
            {Array.from({ length: totalSteps }).map((_, i) => <div key={i} className={"pp-dot " + (i === step ? "active" : i < step ? "done" : "")} />)}
          </div>
        </div>

        <div className="pp-content">
          {step < 6 && (
            <div key={step} className="pp-fade-swap">
              {step === 0 && <DetailsStep details={details} onChange={v => onPick("details", v)} />}
              {step === 1 && <PersonaStep details={details} persona={persona} onPick={v => onPick("persona", v)} />}
              {step === 2 && <BudgetStep personaObj={personaObj} budget={budget} onPick={v => onPick("budget", v)} />}
              {step === 3 && <BedroomsStep budget={budget} bedrooms={bedrooms} onPick={v => onPick("bedrooms", v)} />}
              {step === 4 && <CommuteStep commute={commute} onPick={v => onPick("commute", v)} />}
              {step === 5 && <PrioritiesStep personaObj={personaObj} priorities={priorities} toggle={togglePriority} onAddCustom={addCustomPriority} />}
              <ContextNote step={step} />
            </div>
          )}
          {step === 6 && <div key={step} className="pp-fade-swap"><ReviewStep details={details} personaObj={personaObj} budget={budget} bedrooms={bedrooms} commute={commute} priorities={priorities} /></div>}
          {step === 7 && <div key={step} className="pp-fade-swap"><WeightageStep priorities={priorities} weights={priorityWeights} setWeight={setWeight} /></div>}
          {step === 8 && <LoadingView details={details} personaObj={personaObj} budget={budget} bedrooms={bedrooms} onSkip={() => setStep(9)} />}
          {step === 9 && <RevealView details={details} personaObj={personaObj} budget={budget} bedrooms={bedrooms} commute={commute} priorities={priorities} priorityWeights={priorityWeights} onFindHome={handleFindHome} submitting={submitting} onRestart={() => { setStep(1); setPersona(null); setBudget(null); setBedrooms(null); setCommute(null); setPriorities([]); setPriorityWeights({}); }} />}

          {step < 8 && (
            <div className="pp-nav-row">
              <button className="pp-back-btn" onClick={back} disabled={step === 0} style={{ visibility: step === 0 ? "hidden" : "visible" }}><BackIcon /> Back</button>
              <button className={"pp-next-btn" + (step === 7 ? " primary-cta" : "")} onClick={next} disabled={!canAdvance()}>
                {step === 5 ? "Review choices" : step === 7 ? "Build my passport" : step === 0 ? "Get started" : "Continue"} <ArrowIcon />
              </button>
            </div>
          )}
          {error && <div style={{ color: "var(--pp-danger)", marginTop: 12, textAlign: "center" }}>{error}</div>}
        </div>
      </main>

      <aside className="pp-sidebar">
        <PassportSidebar details={details} personaObj={personaObj} budget={budget} bedrooms={bedrooms} commute={commute} priorities={priorities} step={step} lastFilled={lastFilled} />
      </aside>
    </div>
  );
}

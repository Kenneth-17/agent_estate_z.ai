import json
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel

from agent.graph import build_agent
from agent.state import AgentState

load_dotenv()

agent = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global agent
    agent = build_agent()
    yield


app = FastAPI(title="Agent Estate Z", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class OnboardMessage(BaseModel):
    message: str
    session_id: str | None = None


class SearchRequest(BaseModel):
    session_id: str


class RefineMessage(BaseModel):
    message: str
    session_id: str


class PassportCreate(BaseModel):
    session_id: str
    persona: str
    budget_max: int
    bedrooms_min: int
    commute_destination: str
    priorities: list[str]


# In-memory session store (hackathon — replace with Redis/DB later)
sessions: dict[str, dict] = {}

PRIORITY_WEIGHT_MAP = {
    "short commute": ("commute", 0.35),
    "commute": ("commute", 0.35),
    "good schools": ("schools", 0.30),
    "schools": ("schools", 0.30),
    "safety": ("safety", 0.30),
    "green space": ("green_space", 0.25),
    "parks nearby": ("green_space", 0.25),
    "air quality": ("air_quality", 0.25),
    "gym nearby": ("amenities", 0.25),
    "nightlife": ("amenities", 0.25),
    "gp nearby": ("gp", 0.25),
    "close to uni": ("commute", 0.30),
    "budget area": ("budget", 0.25),
    "night transport": ("transport", 0.25),
    "student community": ("amenities", 0.20),
    "quiet streets": ("safety", 0.25),
    "easy transport": ("transport", 0.25),
    "local amenities": ("amenities", 0.25),
    "community feel": ("amenities", 0.20),
    "english-friendly": ("amenities", 0.15),
}

PERSONA_DEFAULT_WEIGHTS = {
    "professional": {"commute": 0.15, "safety": 0.15, "amenities": 0.15, "air_quality": 0.10, "green_space": 0.10},
    "family": {"schools": 0.15, "safety": 0.15, "green_space": 0.15, "gp": 0.10, "commute": 0.10},
    "student": {"commute": 0.15, "safety": 0.15, "amenities": 0.15, "transport": 0.10, "budget": 0.10},
    "newcomer": {"safety": 0.15, "commute": 0.15, "amenities": 0.15, "transport": 0.10, "green_space": 0.10},
    "relocator": {"safety": 0.15, "commute": 0.15, "amenities": 0.15, "transport": 0.10, "green_space": 0.10},
}

PERSONA_FLAGS = {
    "professional": {"new_to_london": False, "needs_schools": False},
    "family": {"new_to_london": False, "needs_schools": True},
    "student": {"new_to_london": False, "needs_schools": False},
    "newcomer": {"new_to_london": True, "needs_schools": False},
    "relocator": {"new_to_london": True, "needs_schools": False},
}


@app.post("/api/onboard")
async def onboard(body: OnboardMessage):
    """Chat-based onboarding. Send messages one at a time to build the passport."""
    state = sessions.get(body.session_id or "default", {
        "messages": [],
        "persona": "",
        "budget_max": 99999,
        "bedrooms_min": 0,
        "commute_destination": "",
        "weights": {},
        "flags": {},
        "candidates": [],
        "enriched": [],
        "ranked": [],
        "top_picks": [],
        "current_step": "onboard",
        "onboarding_complete": False,
    })

    state["messages"].append({"role": "user", "content": body.message})

    result = await agent.ainvoke(state)
    sessions[body.session_id or "default"] = result

    # Extract AI response
    ai_message = result["messages"][-1].content if result.get("messages") else ""

    return {
        "response": ai_message,
        "passport": {
            "persona": result.get("persona", ""),
            "budget_max": result.get("budget_max"),
            "bedrooms_min": result.get("bedrooms_min"),
            "commute_destination": result.get("commute_destination", ""),
            "weights": result.get("weights", {}),
            "onboarding_complete": result.get("onboarding_complete", False),
        },
    }


@app.post("/api/passport/create")
async def create_passport(body: PassportCreate):
    """Create a session directly from structured passport data (multi-step form).
    Skips chat-based onboarding. Runs the full pipeline and returns results."""
    persona = body.persona.lower()
    if persona == "new to london":
        persona = "newcomer"

    # Build weights from selected priorities
    weights = dict(PERSONA_DEFAULT_WEIGHTS.get(persona, PERSONA_DEFAULT_WEIGHTS["professional"]))
    priority_slots = [0.35, 0.25, 0.20]
    used_keys = set()
    for i, p in enumerate(body.priorities[:3]):
        p_lower = p.lower()
        match = PRIORITY_WEIGHT_MAP.get(p_lower)
        if match:
            key, _ = match
            if key not in used_keys:
                weights[key] = priority_slots[i]
                used_keys.add(key)

    # Distribute remaining weight evenly among unused keys
    remaining = 1.0 - sum(weights.values())
    unused = [k for k in weights if k not in used_keys]
    if unused and remaining > 0:
        share = remaining / len(unused)
        for k in unused:
            weights[k] = weights.get(k, 0) + share

    flags = dict(PERSONA_FLAGS.get(persona, PERSONA_FLAGS["professional"]))

    state = {
        "messages": [],
        "persona": persona,
        "budget_max": body.budget_max,
        "bedrooms_min": body.bedrooms_min,
        "property_type_pref": "",
        "commute_destination": body.commute_destination,
        "weights": weights,
        "flags": flags,
        "candidates": [],
        "enriched": [],
        "ranked": [],
        "top_picks": [],
        "current_step": "discover",
        "onboarding_complete": True,
    }

    sessions[body.session_id] = state

    # Run pipeline: discover → filter → enrich → reason → present
    result = await agent.ainvoke(state)
    sessions[body.session_id] = result

    return {
        "session_id": body.session_id,
        "top_picks": result.get("top_picks", []),
        "total_candidates": len(result.get("candidates", [])),
        "total_enriched": len(result.get("enriched", [])),
        "passport": {
            "persona": persona,
            "budget_max": result.get("budget_max"),
            "bedrooms_min": result.get("bedrooms_min"),
            "commute_destination": result.get("commute_destination", ""),
            "weights": result.get("weights", {}),
            "flags": result.get("flags", {}),
            "onboarding_complete": True,
        },
    }


@app.post("/api/search")
async def search(body: SearchRequest):
    """Run the full pipeline: filter → enrich → reason → present."""
    state = sessions.get(body.session_id or "default")
    if not state:
        raise HTTPException(status_code=404, detail="Session not found. Start with /api/onboard first.")

    # Run from filter onwards (skip onboarding)
    state["current_step"] = "filter"
    result = await agent.ainvoke(state)
    sessions[body.session_id or "default"] = result

    return {
        "top_picks": result.get("top_picks", []),
        "total_candidates": len(result.get("candidates", [])),
        "total_enriched": len(result.get("enriched", [])),
    }


@app.get("/api/property/{listing_id}")
async def get_property(listing_id: int, session_id: str = "default"):
    """Get full details for a single property with enrichment data."""
    state = sessions.get(session_id)
    if not state:
        raise HTTPException(status_code=404, detail="Session not found.")

    for prop in state.get("enriched", []):
        if prop.get("listing_id") == listing_id:
            return prop

    raise HTTPException(status_code=404, detail="Property not found.")


@app.post("/api/refine")
async def refine(body: RefineMessage):
    """Refine search based on user feedback. Re-runs pipeline from filter."""
    state = sessions.get(body.session_id or "default")
    if not state:
        raise HTTPException(status_code=404, detail="Session not found.")

    state["messages"].append({"role": "user", "content": body.message})
    state["current_step"] = "refine"

    result = await agent.ainvoke(state)
    sessions[body.session_id or "default"] = result

    return {
        "top_picks": result.get("top_picks", []),
        "response": result["messages"][-1].content if result.get("messages") else "",
    }


@app.get("/api/passport")
async def get_passport(session_id: str = "default"):
    """Get the current rental passport for this session."""
    state = sessions.get(session_id)
    if not state:
        raise HTTPException(status_code=404, detail="Session not found.")

    return {
        "persona": state.get("persona", ""),
        "budget_max": state.get("budget_max"),
        "bedrooms_min": state.get("bedrooms_min"),
        "commute_destination": state.get("commute_destination", ""),
        "weights": state.get("weights", {}),
        "flags": state.get("flags", {}),
        "onboarding_complete": state.get("onboarding_complete", False),
    }


@app.get("/api/health")
async def health():
    return {"status": "ok", "model": os.getenv("ZAI_MODEL", "glm-5.1")}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)

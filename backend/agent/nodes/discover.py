from agent.state import AgentState
from agent.llm import get_llm

PRIORITY_QUESTIONS = {
    "professional": "What matters most to you in an area? Pick your top priorities — things like short commute, gym access, nightlife, green space, air quality, safety.",
    "family": "What matters most for your family? Things like good schools, parks, quiet streets, safety, GP nearby, air quality.",
    "student": "What matters most to you? Things like walking distance to uni, nightlife, budget-friendly area, night transport, safety.",
    "relocator": "Since you're new to London, what are you most worried about? Safety? Getting around? Not knowing the areas? Finding your community?",
    "key_worker": "What matters most for your situation? Things like walking distance to work, night transport, safety, nearby essentials.",
}


async def discover_node(state: AgentState) -> dict:
    persona = state.get("persona", "professional")

    # Set default weights based on persona
    default_weights = {
        "professional": {"commute": 0.35, "safety": 0.25, "amenities": 0.20, "air_quality": 0.10, "green_space": 0.10},
        "family": {"schools": 0.30, "safety": 0.25, "green_space": 0.20, "gp": 0.15, "commute": 0.10},
        "student": {"commute": 0.30, "safety": 0.25, "amenities": 0.20, "transport": 0.15, "budget": 0.10},
        "relocator": {"safety": 0.30, "commute": 0.25, "amenities": 0.20, "transport": 0.15, "green_space": 0.10},
        "key_worker": {"commute": 0.35, "transport": 0.25, "safety": 0.20, "amenities": 0.10, "green_space": 0.10},
    }

    default_flags = {
        "professional": {"new_to_london": False, "needs_schools": False},
        "family": {"new_to_london": False, "needs_schools": True},
        "student": {"new_to_london": False, "needs_schools": False},
        "relocator": {"new_to_london": True, "needs_schools": False},
        "key_worker": {"new_to_london": False, "needs_schools": False, "shift_worker": True},
    }

    return {
        "weights": default_weights.get(persona, default_weights["professional"]),
        "flags": default_flags.get(persona, default_flags["professional"]),
        "onboarding_complete": True,
        "current_step": "discover",
    }

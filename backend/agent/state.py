from typing import TypedDict, Literal, Annotated
from operator import add
from langgraph.graph import add_messages


class AgentState(TypedDict):
    messages: Annotated[list, add_messages]

    # Passport — built during onboarding
    persona: str  # detected silently: professional, family, student, relocator, key_worker
    budget_max: int
    bedrooms_min: int
    property_type_pref: str
    commute_destination: str
    weights: dict  # e.g. {"commute": 0.35, "safety": 0.25, "amenities": 0.20, "air_quality": 0.10, "green_space": 0.10}
    flags: dict  # e.g. {"new_to_london": True, "needs_schools": False, "shift_worker": False}

    # Pipeline data
    candidates: list[dict]  # after hard filter
    enriched: list[dict]    # after API enrichment
    ranked: list[dict]      # after scoring + ranking
    top_picks: list[dict]   # top 3 with explanations

    # Flow control
    current_step: str
    onboarding_complete: bool

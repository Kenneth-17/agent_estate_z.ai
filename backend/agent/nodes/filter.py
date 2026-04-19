import json
import os
from agent.state import AgentState


def load_listings() -> list[dict]:
    data_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "london-rent-properties.json")
    listings = []
    with open(data_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                listings.append(json.loads(line))
    return listings


def filter_node(state: AgentState) -> dict:
    listings = load_listings()

    budget_max = state.get("budget_max", 99999)
    bedrooms_min = state.get("bedrooms_min", 0)

    candidates = []
    for listing in listings:
        price = listing.get("price")
        if not price:
            continue
        try:
            price = int(str(price).replace(",", "").replace("£", ""))
        except (ValueError, TypeError):
            continue

        bedrooms = listing.get("bedrooms")
        try:
            bedrooms = int(bedrooms) if bedrooms else 0
        except (ValueError, TypeError):
            bedrooms = 0

        # Hard filters
        if price > budget_max:
            continue
        if bedrooms < bedrooms_min:
            continue
        if not listing.get("latitude") or not listing.get("longitude"):
            continue

        candidates.append(listing)

    return {
        "candidates": candidates,
        "current_step": "filter",
    }

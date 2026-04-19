from agent.state import AgentState


def _normalize_score(value: float | int | None, max_val: float, lower_is_better: bool = False) -> float:
    if value is None:
        return 0.5
    score = min(value / max_val, 1.0)
    return (1 - score) if lower_is_better else score


def score_listing(listing: dict, weights: dict) -> dict:
    e = listing.get("enrichment", {})
    scores = {}

    # Commute: lower is better, max ~60 min
    commute_min = (e.get("commute") or {}).get("commute_minutes")
    scores["commute"] = _normalize_score(commute_min, 60, lower_is_better=True)

    # Crime: lower is better, max ~150 incidents
    crime_score = (e.get("crime") or {}).get("crime_count")
    scores["safety"] = _normalize_score(crime_score, 150, lower_is_better=True)

    # Amenities: more is better, max ~30 total
    amenities = e.get("amenities") or {}
    amenity_count = sum(v for v in amenities.values() if isinstance(v, int))
    scores["amenities"] = _normalize_score(amenity_count, 30)

    # Green space: parks count, max ~5
    park_count = amenities.get("parks", 0)
    scores["green_space"] = _normalize_score(park_count, 5)

    # Schools: for family persona only
    if weights.get("schools"):
        scores["schools"] = 0.7  # dummy default

    # Transport: number of lines, max ~6
    lines = (e.get("transport") or {}).get("lines", [])
    scores["transport"] = _normalize_score(len(lines), 6)

    # Weighted total
    total = 0.0
    weight_sum = 0.0
    for key, weight in weights.items():
        if key in scores:
            total += scores[key] * weight
            weight_sum += weight

    overall = (total / weight_sum * 100) if weight_sum > 0 else 0

    return {
        **listing,
        "scores": scores,
        "overall_score": round(overall, 1),
    }


def reason_node(state: AgentState) -> dict:
    enriched = state.get("enriched", [])
    weights = state.get("weights", {})

    scored = [score_listing(listing, weights) for listing in enriched]
    scored.sort(key=lambda x: x["overall_score"], reverse=True)

    top_picks = scored[:3]

    return {
        "ranked": scored,
        "top_picks": top_picks,
        "current_step": "reason",
    }

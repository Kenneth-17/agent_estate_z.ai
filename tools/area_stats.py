import json
from pathlib import Path

DATA_FILE = Path(__file__).parent.parent / "data" / "ons_rental_stats.json"

NOT_AVAILABLE = {"avg_rent_region": 0, "rental_demand": "Data not available"}


def _load_stats() -> dict:
    if not DATA_FILE.exists():
        return {}
    with open(DATA_FILE) as f:
        return json.load(f)


def _extract_outward_code(postcode: str) -> str:
    return postcode.strip().split()[0].upper()


def _lookup(stats: dict, outward: str) -> dict:
    # Try longest prefix match first (e.g. "EH" before "E", "SE" before "S")
    for length in range(min(4, len(outward)), 0, -1):
        prefix = outward[:length]
        if prefix in stats:
            return stats[prefix]
    return NOT_AVAILABLE


async def get_area_stats(postcode: str) -> dict:
    stats = _load_stats()
    if not stats:
        return NOT_AVAILABLE

    outward = _extract_outward_code(postcode)
    return _lookup(stats, outward)

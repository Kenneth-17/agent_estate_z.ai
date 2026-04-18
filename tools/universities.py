import json
import math
import sys
from pathlib import Path

DATA_FILE = Path(__file__).parent.parent / "data" / "universities.json"
EARTH_RADIUS_KM = 6371.0


def haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    rlat1, rlng1, rlat2, rlng2 = map(math.radians, [lat1, lng1, lat2, lng2])
    dlat = rlat2 - rlat1
    dlng = rlng2 - rlng1
    a = math.sin(dlat / 2) ** 2 + math.cos(rlat1) * math.cos(rlat2) * math.sin(dlng / 2) ** 2
    return EARTH_RADIUS_KM * 2 * math.asin(math.sqrt(a))


def _load_universities() -> list[dict]:
    if not DATA_FILE.exists():
        return []
    with open(DATA_FILE) as f:
        return json.load(f)


async def get_nearby_universities(
    lat: float, lng: float, radius_km: float = 10.0
) -> list[dict]:
    universities = _load_universities()
    if not universities:
        return []

    results = []
    for uni in universities:
        dist = haversine_km(lat, lng, uni["lat"], uni["lng"])
        if dist <= radius_km:
            results.append({
                "name": uni["name"],
                "distance_km": round(dist, 1),
                "postcode": uni["postcode"],
            })

    results.sort(key=lambda u: u["distance_km"])
    return results

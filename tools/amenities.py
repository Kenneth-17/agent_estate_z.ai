import os
import sys

import httpx

PLACES_BASE = "https://places.googleapis.com/v1/places:searchNearby"
REQUEST_TIMEOUT = 10.0
MAX_RESULTS = 5

CATEGORIES = {
    "supermarkets": "supermarket",
    "gyms": "gym",
    "restaurants": "restaurant",
    "parks": "park",
}


def _get_api_key() -> str:
    return os.environ.get("GOOGLE_PLACES_API_KEY", "")


async def _search_category(client: httpx.AsyncClient, api_key: str, lat: float, lng: float, category: str) -> list[dict]:
    body = {
        "locationRestriction": {
            "circle": {
                "center": {"latitude": lat, "longitude": lng},
                "radius": 1500,
            }
        },
        "includedTypes": [category],
        "pageSize": MAX_RESULTS,
    }
    headers = {
        "X-Goog-Api-Key": api_key,
        "Content-Type": "application/json",
    }
    response = await client.post(
        f"{PLACES_BASE}?fields=places.displayName",
        json=body,
        headers=headers,
    )
    response.raise_for_status()
    return response.json().get("places", [])


async def get_nearby_amenities(lat: float, lng: float) -> dict:
    api_key = _get_api_key()
    if not api_key:
        return {"error": "missing_api_key", "data": []}

    try:
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            supermarkets = await _search_category(client, api_key, lat, lng, "supermarket")
            gyms = await _search_category(client, api_key, lat, lng, "gym")
            restaurants = await _search_category(client, api_key, lat, lng, "restaurant")
            parks = await _search_category(client, api_key, lat, lng, "park")
    except httpx.TimeoutException:
        print("Amenities request timed out", file=sys.stderr)
        return {"error": "timeout", "data": []}
    except Exception as exc:
        status = getattr(getattr(exc, "response", None), "status_code", None)
        print(f"Amenities API error: {exc}", file=sys.stderr)
        return {"error": "api_error", "status": status, "data": []}

    return {
        "supermarkets": [p["displayName"]["text"] for p in supermarkets[:MAX_RESULTS]],
        "gyms": [p["displayName"]["text"] for p in gyms[:MAX_RESULTS]],
        "restaurants": len(restaurants),
        "parks": len(parks),
    }

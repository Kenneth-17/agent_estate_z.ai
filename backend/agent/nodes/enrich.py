import asyncio
import os
import httpx
from agent.state import AgentState


async def get_commute(client: httpx.AsyncClient, lat: float, lng: float, destination: str, api_key: str) -> dict:
    try:
        resp = await client.get(
            "https://maps.googleapis.com/maps/api/distancematrix/json",
            params={
                "origins": f"{lat},{lng}",
                "destinations": destination,
                "mode": "transit",
                "units": "metric",
                "key": api_key,
            },
        )
        data = resp.json()
        element = data["rows"][0]["elements"][0]
        if element.get("status") != "OK":
            return {"commute_minutes": None, "commute_text": "Unknown", "distance_text": "Unknown"}
        return {
            "commute_minutes": element["duration"]["value"] // 60,
            "commute_text": element["duration"]["text"],
            "distance_text": element["distance"]["text"],
        }
    except Exception:
        return {"commute_minutes": None, "commute_text": "Unknown", "distance_text": "Unknown"}


async def get_crime(client: httpx.AsyncClient, lat: float, lng: float) -> dict:
    try:
        resp = await client.get(
            "https://data.police.uk/api/crimes-street/all-crime",
            params={"lat": lat, "lng": lng},
        )
        crimes = resp.json()
        return {
            "crime_count": len(crimes),
            "crime_score": min(10, len(crimes) / 10),
            "crime_category": "low" if len(crimes) < 30 else "moderate" if len(crimes) < 80 else "high",
        }
    except Exception:
        return {"crime_count": None, "crime_score": None, "crime_category": "unknown"}


async def get_amenities(client: httpx.AsyncClient, lat: float, lng: float) -> dict:
    radius = 800
    query = f"""
    [out:json][timeout:10];
    (
      node["leisure"="fitness_centre"](around:{radius},{lat},{lng});
      node["shop"="supermarket"](around:{radius},{lat},{lng});
      node["amenity"="pub"](around:{radius},{lat},{lng});
      node["amenity"="restaurant"](around:{radius},{lat},{lng});
      way["leisure"="park"](around:{radius},{lat},{lng});
    );
    out body;
    """
    try:
        resp = await client.post(
            "https://overpass-api.de/api/interpreter",
            data={"data": query},
        )
        elements = resp.json().get("elements", [])
        counts = {"gyms": 0, "supermarkets": 0, "pubs": 0, "restaurants": 0, "parks": 0}
        for el in elements:
            tags = el.get("tags", {})
            if tags.get("leisure") == "fitness_centre":
                counts["gyms"] += 1
            elif tags.get("shop") == "supermarket":
                counts["supermarkets"] += 1
            elif tags.get("amenity") == "pub":
                counts["pubs"] += 1
            elif tags.get("amenity") == "restaurant":
                counts["restaurants"] += 1
            elif tags.get("leisure") == "park":
                counts["parks"] += 1
        return counts
    except Exception:
        return {"gyms": 0, "supermarkets": 0, "pubs": 0, "restaurants": 0, "parks": 0}


async def get_transport(client: httpx.AsyncClient, lat: float, lng: float) -> dict:
    try:
        resp = await client.get(
            "https://api.tfl.gov.uk/StopPoint",
            params={"lat": lat, "lon": lng, "stopTypes": "NaptanMetroStation,NaptanRailStation", "radius": 800},
        )
        data = resp.json()
        stop_points = data.get("stopPoints", [])
        if stop_points:
            nearest = stop_points[0]
            lines = [line.get("name", "") for line in nearest.get("lines", [])]
            return {
                "nearest_station": nearest.get("commonName", "Unknown"),
                "walk_min": int(nearest.get("distance", 800) / 80),
                "lines": lines[:5],
            }
        return {"nearest_station": None, "walk_min": None, "lines": []}
    except Exception:
        return {"nearest_station": None, "walk_min": None, "lines": []}


async def get_borough(client: httpx.AsyncClient, lat: float, lng: float) -> dict:
    try:
        resp = await client.get(
            f"https://api.postcodes.io/postcodes?lon={lng}&lat={lat}"
        )
        data = resp.json()
        if data.get("result"):
            result = data["result"][0]
            return {
                "postcode": result.get("postcode"),
                "borough": result.get("admin_district"),
            }
        return {"postcode": None, "borough": None}
    except Exception:
        return {"postcode": None, "borough": None}


async def enrich_node(state: AgentState) -> dict:
    candidates = state.get("candidates", [])
    destination = state.get("commute_destination", "Canary Wharf")
    google_key = os.environ.get("GOOGLE_MAPS_API_KEY", "")

    enriched = []
    async with httpx.AsyncClient(timeout=15) as client:
        for listing in candidates[:10]:
            lat = float(listing.get("latitude", 0))
            lng = float(listing.get("longitude", 0))

            commute, crime, amenities, transport, borough = await asyncio.gather(
                get_commute(client, lat, lng, destination, google_key),
                get_crime(client, lat, lng),
                get_amenities(client, lat, lng),
                get_transport(client, lat, lng),
                get_borough(client, lat, lng),
            )

            enriched.append({
                **listing,
                "enrichment": {
                    "commute": commute,
                    "crime": crime,
                    "amenities": amenities,
                    "transport": transport,
                    "borough": borough,
                },
            })

    return {
        "enriched": enriched,
        "current_step": "enrich",
    }

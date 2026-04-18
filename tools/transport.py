import os
import sys

import httpx

TFL_BASE = "https://api.tfl.gov.uk/Journey/JourneyResults"
TRANSPORT_API_BASE = "https://transportapi.com/v3/uk/public/journey"
REQUEST_TIMEOUT = 10.0

LONDON_PREFIXES = ("E", "N", "S", "W", "SE", "SW", "NW", "WC", "EC")


def _get_transport_api_key():
    app_id = os.environ.get("TRANSPORT_API_ID", "")
    app_key = os.environ.get("TRANSPORT_API_KEY", "")
    return app_id, app_key


def _is_london_postcode(postcode: str) -> bool:
    outward = postcode.strip().split()[0].upper()
    return any(outward.startswith(p) for p in LONDON_PREFIXES)


def _parse_tfl_response(data: dict) -> dict:
    journeys = data.get("journeys", [])
    if not journeys:
        return {"journey_time_mins": 0, "modes": [], "provider": "TfL"}

    best = journeys[0]
    modes = list({leg["mode"]["name"] for leg in best.get("legs", [])})

    return {
        "journey_time_mins": best.get("duration", 0),
        "modes": modes,
        "provider": "TfL",
    }


def _parse_transport_api_response(data: dict) -> dict:
    routes = data.get("routes", [])
    if not routes:
        return {"journey_time_mins": 0, "modes": [], "provider": "TransportAPI"}

    best = routes[0]
    modes = list({part["mode"] for part in best.get("route_parts", [])})

    return {
        "journey_time_mins": best.get("duration_minutes", 0),
        "modes": modes,
        "provider": "TransportAPI",
    }


async def _fetch_journey(client: httpx.AsyncClient, postcode: str, dest: str) -> dict:
    if _is_london_postcode(postcode):
        url = f"{TFL_BASE}/{postcode}/to/{dest}"
        response = await client.get(url)
        response.raise_for_status()
        return _parse_tfl_response(response.json())
    else:
        app_id, app_key = _get_transport_api_key()
        url = f"{TRANSPORT_API_BASE}/from/postcode:{postcode}/to/postcode:{dest}.json"
        response = await client.get(
            url, params={"app_id": app_id, "app_key": app_key}
        )
        response.raise_for_status()
        return _parse_transport_api_response(response.json())


async def get_transport_options(
    postcode: str, destination_postcode: str, work_postcode: str | None = None
) -> dict:
    try:
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            university_journey = await _fetch_journey(client, postcode, destination_postcode)

            if work_postcode is None:
                return university_journey

            work_journey = await _fetch_journey(client, postcode, work_postcode)
            return {
                "university_journey": university_journey,
                "work_journey": work_journey,
            }
    except httpx.TimeoutException:
        print("Transport request timed out", file=sys.stderr)
        return {"error": "timeout", "data": []}
    except Exception as exc:
        status = getattr(getattr(exc, "response", None), "status_code", None)
        print(f"Transport API error: {exc}", file=sys.stderr)
        return {"error": "api_error", "status": status, "data": []}

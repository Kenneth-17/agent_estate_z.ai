import sys
from datetime import datetime, timedelta
from collections import Counter

import httpx

BASE_URL = "https://data.police.uk/api/crimes-street/all-crime"
REQUEST_TIMEOUT = 10.0


def _derive_safety_rating(total: int) -> str:
    if total < 50:
        return "Low"
    if total <= 100:
        return "Medium"
    return "High"


def _last_three_months() -> list[str]:
    now = datetime.now()
    dates = []
    for i in range(1, 4):
        d = now - timedelta(days=30 * i)
        dates.append(d.strftime("%Y-%m"))
    return dates


async def get_crime_data(lat: float, lng: float) -> dict:
    all_crimes: list[dict] = []

    try:
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            for date in _last_three_months():
                response = await client.get(
                    BASE_URL, params={"lat": lat, "lng": lng, "date": date}
                )
                response.raise_for_status()
                all_crimes.extend(response.json())
    except httpx.TimeoutException:
        print("Crime data request timed out", file=sys.stderr)
        return {"error": "timeout", "data": []}
    except Exception as exc:
        status = getattr(getattr(exc, "response", None), "status_code", None)
        print(f"Crime data API error: {exc}", file=sys.stderr)
        return {"error": "api_error", "status": status, "data": []}

    categories = dict(Counter(c["category"] for c in all_crimes))
    total = len(all_crimes)

    return {
        "total_crimes": total,
        "categories": categories,
        "safety_rating": _derive_safety_rating(total),
    }

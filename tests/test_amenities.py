import pytest
from unittest.mock import patch, MagicMock, AsyncMock
from tools.amenities import get_nearby_amenities


def _make_client(responses_by_call=None):
    """Build an async-mocked httpx.AsyncClient with sequential responses."""
    mock_client = AsyncMock()
    mock_client.__aenter__.return_value = mock_client
    mock_client.__aexit__.return_value = False
    if responses_by_call:
        mock_client.get = AsyncMock(side_effect=responses_by_call)
        mock_client.post = AsyncMock(side_effect=responses_by_call)
    return mock_client


def _mock_places_response(names):
    resp = MagicMock()
    resp.status_code = 200
    resp.raise_for_status = MagicMock()
    resp.json.return_value = {
        "places": [{"displayName": {"text": n}} for n in names]
    }
    return resp


# --- Successful multi-category fetch ---


@pytest.mark.asyncio
async def test_returns_all_categories():
    """Should return supermarkets, gyms, restaurants count, parks count."""
    supermarket_resp = _mock_places_response(["Tesco", "Sainsbury's", "Aldi", "Lidl", "Waitrose"])
    gym_resp = _mock_places_response(["PureGym", "The Gym", "David Lloyd"])
    restaurant_resp = _mock_places_response(["Nando's", "Pizza Express", "TGI Friday's"])
    park_resp = _mock_places_response(["Heaton Park", "Platt Fields Park"])

    client = _make_client([supermarket_resp, gym_resp, restaurant_resp, park_resp])
    with patch("tools.amenities.httpx.AsyncClient", return_value=client):
        with patch("tools.amenities._get_api_key", return_value="fake_key"):
            result = await get_nearby_amenities(lat=53.4631, lng=-2.2319)

    assert "supermarkets" in result
    assert "gyms" in result
    assert "restaurants" in result
    assert "parks" in result


@pytest.mark.asyncio
async def test_supermarkets_limited_to_five():
    """Should cap supermarket results at 5."""
    supermarket_resp = _mock_places_response([f"Shop {i}" for i in range(8)])
    gym_resp = _mock_places_response([])
    restaurant_resp = _mock_places_response([])
    park_resp = _mock_places_response([])

    client = _make_client([supermarket_resp, gym_resp, restaurant_resp, park_resp])
    with patch("tools.amenities.httpx.AsyncClient", return_value=client):
        with patch("tools.amenities._get_api_key", return_value="fake_key"):
            result = await get_nearby_amenities(lat=53.4631, lng=-2.2319)

    assert len(result["supermarkets"]) == 5


@pytest.mark.asyncio
async def test_gyms_limited_to_five():
    """Should cap gym results at 5."""
    supermarket_resp = _mock_places_response([])
    gym_resp = _mock_places_response([f"Gym {i}" for i in range(7)])
    restaurant_resp = _mock_places_response([])
    park_resp = _mock_places_response([])

    client = _make_client([supermarket_resp, gym_resp, restaurant_resp, park_resp])
    with patch("tools.amenities.httpx.AsyncClient", return_value=client):
        with patch("tools.amenities._get_api_key", return_value="fake_key"):
            result = await get_nearby_amenities(lat=53.4631, lng=-2.2319)

    assert len(result["gyms"]) == 5


@pytest.mark.asyncio
async def test_restaurants_and_parks_are_counts():
    """Restaurants and parks should be integer counts."""
    supermarket_resp = _mock_places_response([])
    gym_resp = _mock_places_response([])
    restaurant_resp = _mock_places_response(["R1", "R2", "R3"])
    park_resp = _mock_places_response(["P1", "P2"])

    client = _make_client([supermarket_resp, gym_resp, restaurant_resp, park_resp])
    with patch("tools.amenities.httpx.AsyncClient", return_value=client):
        with patch("tools.amenities._get_api_key", return_value="fake_key"):
            result = await get_nearby_amenities(lat=53.4631, lng=-2.2319)

    assert result["restaurants"] == 3
    assert result["parks"] == 2
    assert isinstance(result["restaurants"], int)
    assert isinstance(result["parks"], int)


# --- Timeout handling ---


@pytest.mark.asyncio
async def test_timeout_returns_error():
    """API timeout should return error dict."""
    import httpx

    client = _make_client(responses_by_call=[httpx.TimeoutException("timeout")])
    with patch("tools.amenities.httpx.AsyncClient", return_value=client):
        with patch("tools.amenities._get_api_key", return_value="fake_key"):
            result = await get_nearby_amenities(lat=53.4631, lng=-2.2319)

    assert result["error"] == "timeout"
    assert result["data"] == []


# --- API error handling ---


@pytest.mark.asyncio
async def test_api_error_returns_error():
    """API error should return error dict."""
    mock_resp = MagicMock()
    mock_resp.status_code = 403
    mock_resp.raise_for_status = MagicMock(side_effect=Exception("403 Forbidden"))

    client = _make_client(responses_by_call=[mock_resp])
    with patch("tools.amenities.httpx.AsyncClient", return_value=client):
        with patch("tools.amenities._get_api_key", return_value="fake_key"):
            result = await get_nearby_amenities(lat=53.4631, lng=-2.2319)

    assert result["error"] == "api_error"
    assert result["data"] == []


# --- Missing API key ---


@pytest.mark.asyncio
async def test_missing_api_key_returns_error():
    """Missing Google Places API key should return error, not crash."""
    with patch("tools.amenities._get_api_key", return_value=""):
        result = await get_nearby_amenities(lat=53.4631, lng=-2.2319)

    assert result["error"] == "missing_api_key"
    assert result["data"] == []


# --- Empty results ---


@pytest.mark.asyncio
async def test_empty_places_returns_empty_lists_and_zeros():
    """No places found should return empty lists and zero counts."""
    empty_resp = _mock_places_response([])

    client = _make_client([empty_resp, empty_resp, empty_resp, empty_resp])
    with patch("tools.amenities.httpx.AsyncClient", return_value=client):
        with patch("tools.amenities._get_api_key", return_value="fake_key"):
            result = await get_nearby_amenities(lat=53.4631, lng=-2.2319)

    assert result["supermarkets"] == []
    assert result["gyms"] == []
    assert result["restaurants"] == 0
    assert result["parks"] == 0

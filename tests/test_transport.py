import pytest
from unittest.mock import patch, MagicMock, AsyncMock
from tools.transport import get_transport_options


def _make_client(get_return=None, get_side_effect=None):
    mock_client = AsyncMock()
    mock_client.__aenter__.return_value = mock_client
    mock_client.__aexit__.return_value = False
    if get_side_effect:
        mock_client.get = AsyncMock(side_effect=get_side_effect)
    else:
        mock_client.get = AsyncMock(return_value=get_return)
    return mock_client


# --- London postcode routing (TfL) ---


@pytest.mark.asyncio
async def test_london_postcode_uses_tfl():
    """London postcodes (E, N, SE, SW, NW, W, WC, EC) should route to TfL."""
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.raise_for_status = MagicMock()
    mock_response.json.return_value = {
        "journeys": [
            {
                "duration": 35,
                "legs": [
                    {"mode": {"name": "tube"}},
                    {"mode": {"name": "walking"}},
                ],
            }
        ]
    }

    client = _make_client(get_return=mock_response)
    with patch("tools.transport.httpx.AsyncClient", return_value=client):
        result = await get_transport_options("E1 6RF", "WC1E 7HX")

    assert result["provider"] == "TfL"
    assert result["journey_time_mins"] == 35
    assert "tube" in result["modes"]
    assert "walking" in result["modes"]


@pytest.mark.asyncio
async def test_london_se_postcode_routes_tfl():
    """SE prefix should be detected as London."""
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.raise_for_status = MagicMock()
    mock_response.json.return_value = {
        "journeys": [{"duration": 20, "legs": [{"mode": {"name": "bus"}}]}]
    }

    client = _make_client(get_return=mock_response)
    with patch("tools.transport.httpx.AsyncClient", return_value=client):
        result = await get_transport_options("SE1 7PB", "EC2R 8AH")

    assert result["provider"] == "TfL"
    assert result["journey_time_mins"] == 20


# --- Non-London postcode routing (TransportAPI) ---


@pytest.mark.asyncio
async def test_non_london_postcode_uses_transport_api():
    """Non-London postcodes should route to TransportAPI."""
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.raise_for_status = MagicMock()
    mock_response.json.return_value = {
        "routes": [
            {
                "duration_minutes": 45,
                "route_parts": [
                    {"mode": "train"},
                    {"mode": "walking"},
                ],
            }
        ]
    }

    client = _make_client(get_return=mock_response)
    with patch("tools.transport.httpx.AsyncClient", return_value=client):
        with patch("tools.transport._get_transport_api_key", return_value=("app_id", "app_key")):
            result = await get_transport_options("M1 1AE", "M14 5RQ")

    assert result["provider"] == "TransportAPI"
    assert result["journey_time_mins"] == 45
    assert "train" in result["modes"]
    assert "walking" in result["modes"]


# --- Timeout handling ---


@pytest.mark.asyncio
async def test_timeout_returns_error():
    """API timeout should return error dict."""
    import httpx

    client = _make_client(get_side_effect=httpx.TimeoutException("timeout"))
    with patch("tools.transport.httpx.AsyncClient", return_value=client):
        with patch("tools.transport._get_transport_api_key", return_value=("id", "key")):
            result = await get_transport_options("E1 6RF", "WC1E 7HX")

    assert result["error"] == "timeout"
    assert result["data"] == []


# --- API error handling ---


@pytest.mark.asyncio
async def test_api_error_returns_error():
    """API error should return error dict."""
    mock_response = MagicMock()
    mock_response.status_code = 400
    mock_response.raise_for_status = MagicMock(side_effect=Exception("400 Bad Request"))

    client = _make_client(get_return=mock_response)
    with patch("tools.transport.httpx.AsyncClient", return_value=client):
        result = await get_transport_options("E1 6RF", "WC1E 7HX")

    assert result["error"] == "api_error"
    assert result["data"] == []


# --- Edge: empty journeys ---


@pytest.mark.asyncio
async def test_tfl_empty_journeys():
    """TfL returning no journeys should not crash."""
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.raise_for_status = MagicMock()
    mock_response.json.return_value = {"journeys": []}

    client = _make_client(get_return=mock_response)
    with patch("tools.transport.httpx.AsyncClient", return_value=client):
        result = await get_transport_options("E1 6RF", "WC1E 7HX")

    assert result["provider"] == "TfL"
    assert result["journey_time_mins"] == 0
    assert result["modes"] == []


# --- NEW: work_postcode parameter ---


@pytest.mark.asyncio
async def test_without_work_postcode_returns_single_journey():
    """Without work_postcode, returns the original flat structure (backward compatible)."""
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.raise_for_status = MagicMock()
    mock_response.json.return_value = {
        "journeys": [{"duration": 30, "legs": [{"mode": {"name": "tube"}}]}]
    }

    client = _make_client(get_return=mock_response)
    with patch("tools.transport.httpx.AsyncClient", return_value=client):
        result = await get_transport_options("E1 6RF", "WC1E 7HX")

    assert "provider" in result
    assert "journey_time_mins" in result
    assert "university_journey" not in result
    assert "work_journey" not in result


@pytest.mark.asyncio
async def test_with_work_postcode_returns_both_journeys():
    """With work_postcode, returns university_journey and work_journey."""
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.raise_for_status = MagicMock()
    mock_response.json.return_value = {
        "journeys": [{"duration": 30, "legs": [{"mode": {"name": "tube"}}]}]
    }

    client = _make_client(get_return=mock_response)
    with patch("tools.transport.httpx.AsyncClient", return_value=client):
        result = await get_transport_options("E1 6RF", "WC1E 7HX", work_postcode="E14 4AB")

    assert "university_journey" in result
    assert "work_journey" in result
    assert result["university_journey"]["journey_time_mins"] == 30
    assert result["work_journey"]["journey_time_mins"] == 30
    assert result["university_journey"]["provider"] == "TfL"
    assert result["work_journey"]["provider"] == "TfL"


@pytest.mark.asyncio
async def test_with_work_postcode_different_durations():
    """With work_postcode, uni and work journeys return independent durations."""
    uni_resp = MagicMock()
    uni_resp.status_code = 200
    uni_resp.raise_for_status = MagicMock()
    uni_resp.json.return_value = {
        "routes": [{"duration_minutes": 20, "route_parts": [{"mode": "bus"}]}]
    }

    work_resp = MagicMock()
    work_resp.status_code = 200
    work_resp.raise_for_status = MagicMock()
    work_resp.json.return_value = {
        "routes": [{"duration_minutes": 45, "route_parts": [{"mode": "train"}]}]
    }

    client = _make_client(get_side_effect=[uni_resp, work_resp])
    with patch("tools.transport.httpx.AsyncClient", return_value=client):
        with patch("tools.transport._get_transport_api_key", return_value=("id", "key")):
            result = await get_transport_options("M1 1AE", "M14 5RQ", work_postcode="M2 2AE")

    assert result["university_journey"]["provider"] == "TransportAPI"
    assert result["university_journey"]["journey_time_mins"] == 20
    assert result["work_journey"]["provider"] == "TransportAPI"
    assert result["work_journey"]["journey_time_mins"] == 45

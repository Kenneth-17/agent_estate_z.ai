import pytest
from unittest.mock import patch, MagicMock, AsyncMock
from tools.crime import get_crime_data


def _make_client(get_return=None, get_side_effect=None):
    """Build an async-mocked httpx.AsyncClient."""
    mock_client = AsyncMock()
    mock_client.__aenter__.return_value = mock_client
    mock_client.__aexit__.return_value = False
    if get_side_effect:
        mock_client.get = AsyncMock(side_effect=get_side_effect)
    else:
        mock_client.get = AsyncMock(return_value=get_return)
    return mock_client


@pytest.mark.asyncio
async def test_get_crime_data_returns_expected_structure():
    """Crime data tool must return total_crimes, categories, and safety_rating."""
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = [
        {"category": "anti-social-behaviour"},
        {"category": "anti-social-behaviour"},
        {"category": "burglary"},
        {"category": "vehicle-crime"},
        {"category": "vehicle-crime"},
        {"category": "vehicle-crime"},
    ]
    mock_response.raise_for_status = MagicMock()

    client = _make_client(get_return=mock_response)
    with patch("tools.crime.httpx.AsyncClient", return_value=client):
        result = await get_crime_data(lat=53.4631, lng=-2.2319)

    assert "total_crimes" in result
    assert "categories" in result
    assert "safety_rating" in result
    assert isinstance(result["total_crimes"], int)
    assert isinstance(result["categories"], dict)
    assert isinstance(result["safety_rating"], str)


@pytest.mark.asyncio
async def test_get_crime_data_safety_rating_low():
    """Fewer than 50 crimes should yield safety_rating 'Low'."""
    crimes = [{"category": "burglary"}] * 10
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = crimes
    mock_response.raise_for_status = MagicMock()

    client = _make_client(get_return=mock_response)
    with patch("tools.crime.httpx.AsyncClient", return_value=client):
        result = await get_crime_data(lat=53.4631, lng=-2.2319)

    assert result["total_crimes"] == 30
    assert result["safety_rating"] == "Low"


@pytest.mark.asyncio
async def test_get_crime_data_safety_rating_medium():
    """50-100 crimes should yield safety_rating 'Medium'."""
    crimes = [{"category": "burglary"}] * 25
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = crimes
    mock_response.raise_for_status = MagicMock()

    client = _make_client(get_return=mock_response)
    with patch("tools.crime.httpx.AsyncClient", return_value=client):
        result = await get_crime_data(lat=53.4631, lng=-2.2319)

    assert result["total_crimes"] == 75  # 25 per month * 3 months
    assert result["safety_rating"] == "Medium"


@pytest.mark.asyncio
async def test_get_crime_data_safety_rating_high():
    """More than 100 crimes should yield safety_rating 'High'."""
    crimes = [{"category": "burglary"}] * 40
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = crimes
    mock_response.raise_for_status = MagicMock()

    client = _make_client(get_return=mock_response)
    with patch("tools.crime.httpx.AsyncClient", return_value=client):
        result = await get_crime_data(lat=53.4631, lng=-2.2319)

    assert result["total_crimes"] == 120  # 40 per month * 3 months
    assert result["safety_rating"] == "High"


@pytest.mark.asyncio
async def test_get_crime_data_timeout_returns_error():
    """API timeout should return an error dict, never crash."""
    import httpx

    client = _make_client(get_side_effect=httpx.TimeoutException("timeout"))
    with patch("tools.crime.httpx.AsyncClient", return_value=client):
        result = await get_crime_data(lat=53.4631, lng=-2.2319)

    assert result["error"] == "timeout"
    assert result["data"] == []


@pytest.mark.asyncio
async def test_get_crime_data_api_error_returns_error():
    """API 4xx should return an error dict."""
    mock_response = MagicMock()
    mock_response.status_code = 404
    mock_response.raise_for_status = MagicMock(
        side_effect=Exception("404 Client Error")
    )

    client = _make_client(get_return=mock_response)
    with patch("tools.crime.httpx.AsyncClient", return_value=client):
        result = await get_crime_data(lat=53.4631, lng=-2.2319)

    assert result["error"] == "api_error"
    assert result["data"] == []

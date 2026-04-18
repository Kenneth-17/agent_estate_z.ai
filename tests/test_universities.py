import pytest
from unittest.mock import patch, mock_open, MagicMock
import json
from tools.universities import get_nearby_universities, haversine_km


SAMPLE_UNIVERSITIES = [
    {"name": "University of Manchester", "lat": 53.4663, "lng": -2.2335, "postcode": "M13 9PL"},
    {"name": "University of Leeds", "lat": 53.8064, "lng": -1.5558, "postcode": "LS2 9JT"},
    {"name": "University of Birmingham", "lat": 52.4516, "lng": -1.9305, "postcode": "B15 2TT"},
    {"name": "Queen Mary University of London", "lat": 51.5248, "lng": -0.0416, "postcode": "E1 4NS"},
    {"name": "University of Edinburgh", "lat": 55.9437, "lng": -3.1897, "postcode": "EH8 9YL"},
]


# --- Haversine tests ---


def test_haversine_same_point_is_zero():
    assert haversine_km(53.4663, -2.2335, 53.4663, -2.2335) == 0.0


def test_haversine_known_distance():
    """Manchester (53.4663, -2.2335) to Leeds (53.8064, -1.5558) ~ 58km."""
    dist = haversine_km(53.4663, -2.2335, 53.8064, -1.5558)
    assert 55 < dist < 62


def test_haversine_london_to_manchester():
    """London to Manchester ~ 260-270km."""
    dist = haversine_km(51.5074, -0.1278, 53.4808, -2.2426)
    assert 255 < dist < 275


# --- get_nearby_universities tests ---


@pytest.mark.asyncio
async def test_returns_nearby_within_default_radius():
    """Default 10km radius should find University of Manchester from M14 area."""
    data = json.dumps(SAMPLE_UNIVERSITIES)
    with patch("builtins.open", mock_open(read_data=data)):
        with patch("pathlib.Path.exists", return_value=True):
            result = await get_nearby_universities(lat=53.4631, lng=-2.2319)

    assert len(result) >= 1
    assert any(u["name"] == "University of Manchester" for u in result)


@pytest.mark.asyncio
async def test_respects_custom_radius():
    """5km radius from Manchester should only find University of Manchester."""
    data = json.dumps(SAMPLE_UNIVERSITIES)
    with patch("builtins.open", mock_open(read_data=data)):
        with patch("pathlib.Path.exists", return_value=True):
            result = await get_nearby_universities(lat=53.4631, lng=-2.2319, radius_km=5)

    names = [u["name"] for u in result]
    assert "University of Manchester" in names
    assert "University of Leeds" not in names


@pytest.mark.asyncio
async def test_large_radius_finds_multiple():
    """300km radius should find Manchester, Leeds, Birmingham, London."""
    data = json.dumps(SAMPLE_UNIVERSITIES)
    with patch("builtins.open", mock_open(read_data=data)):
        with patch("pathlib.Path.exists", return_value=True):
            result = await get_nearby_universities(lat=53.4631, lng=-2.2319, radius_km=300)

    names = [u["name"] for u in result]
    assert "University of Manchester" in names
    assert "University of Leeds" in names
    assert "University of Birmingham" in names
    assert "Queen Mary University of London" in names


@pytest.mark.asyncio
async def test_output_structure():
    """Each result must have name, distance_km, postcode."""
    data = json.dumps(SAMPLE_UNIVERSITIES)
    with patch("builtins.open", mock_open(read_data=data)):
        with patch("pathlib.Path.exists", return_value=True):
            result = await get_nearby_universities(lat=53.4631, lng=-2.2319)

    for uni in result:
        assert "name" in uni
        assert "distance_km" in uni
        assert "postcode" in uni
        assert isinstance(uni["distance_km"], float)


@pytest.mark.asyncio
async def test_sorted_by_distance():
    """Results should be sorted by distance, nearest first."""
    data = json.dumps(SAMPLE_UNIVERSITIES)
    with patch("builtins.open", mock_open(read_data=data)):
        with patch("pathlib.Path.exists", return_value=True):
            result = await get_nearby_universities(lat=53.4631, lng=-2.2319, radius_km=300)

    distances = [u["distance_km"] for u in result]
    assert distances == sorted(distances)


@pytest.mark.asyncio
async def test_no_results_returns_empty_list():
    """Postcode far from all universities should return empty list."""
    data = json.dumps(SAMPLE_UNIVERSITIES)
    with patch("builtins.open", mock_open(read_data=data)):
        with patch("pathlib.Path.exists", return_value=True):
            result = await get_nearby_universities(lat=0.0, lng=0.0, radius_km=1)

    assert result == []


@pytest.mark.asyncio
async def test_missing_data_file_returns_empty():
    """If universities.json doesn't exist, return empty list — never crash."""
    with patch("pathlib.Path.exists", return_value=False):
        result = await get_nearby_universities(lat=53.4631, lng=-2.2319)

    assert result == []

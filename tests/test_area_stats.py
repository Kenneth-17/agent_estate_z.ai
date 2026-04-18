import pytest
import json
from unittest.mock import patch, mock_open
from tools.area_stats import get_area_stats


SAMPLE_STATS = {
    "M": {"avg_rent_region": 950, "rental_demand": "High"},
    "E": {"avg_rent_region": 1800, "rental_demand": "Very High"},
    "B": {"avg_rent_region": 850, "rental_demand": "Medium"},
    "SE": {"avg_rent_region": 1650, "rental_demand": "Very High"},
    "EH": {"avg_rent_region": 900, "rental_demand": "Medium"},
}


# --- Happy path ---


@pytest.mark.asyncio
async def test_returns_stats_for_manchester_postcode():
    """M14 5RQ should match 'M' outward code and return Manchester stats."""
    data = json.dumps(SAMPLE_STATS)
    with patch("builtins.open", mock_open(read_data=data)):
        with patch("pathlib.Path.exists", return_value=True):
            result = await get_area_stats("M14 5RQ")

    assert result["avg_rent_region"] == 950
    assert result["rental_demand"] == "High"


@pytest.mark.asyncio
async def test_returns_stats_for_london_e_postcode():
    """E1 6RF should match 'E' outward code and return London stats."""
    data = json.dumps(SAMPLE_STATS)
    with patch("builtins.open", mock_open(read_data=data)):
        with patch("pathlib.Path.exists", return_value=True):
            result = await get_area_stats("E1 6RF")

    assert result["avg_rent_region"] == 1800
    assert result["rental_demand"] == "Very High"


@pytest.mark.asyncio
async def test_returns_stats_for_se_postcode():
    """SE postcodes should match 'SE' prefix (2-char outward code)."""
    data = json.dumps(SAMPLE_STATS)
    with patch("builtins.open", mock_open(read_data=data)):
        with patch("pathlib.Path.exists", return_value=True):
            result = await get_area_stats("SE1 7PB")

    assert result["avg_rent_region"] == 1650
    assert result["rental_demand"] == "Very High"


@pytest.mark.asyncio
async def test_returns_stats_for_eh_postcode():
    """EH (Edinburgh) should not match E (London) — longer prefix wins."""
    data = json.dumps(SAMPLE_STATS)
    with patch("builtins.open", mock_open(read_data=data)):
        with patch("pathlib.Path.exists", return_value=True):
            result = await get_area_stats("EH8 9YL")

    assert result["avg_rent_region"] == 900
    assert result["rental_demand"] == "Medium"


@pytest.mark.asyncio
async def test_output_structure():
    """Result must contain avg_rent_region (int) and rental_demand (str)."""
    data = json.dumps(SAMPLE_STATS)
    with patch("builtins.open", mock_open(read_data=data)):
        with patch("pathlib.Path.exists", return_value=True):
            result = await get_area_stats("B15 2TT")

    assert "avg_rent_region" in result
    assert "rental_demand" in result
    assert isinstance(result["avg_rent_region"], int)
    assert isinstance(result["rental_demand"], str)


# --- Missing data ---


@pytest.mark.asyncio
async def test_unknown_postcode_returns_not_available():
    """Postcode not in data should return a 'not available' response."""
    data = json.dumps(SAMPLE_STATS)
    with patch("builtins.open", mock_open(read_data=data)):
        with patch("pathlib.Path.exists", return_value=True):
            result = await get_area_stats("ZZ1 1ZZ")

    assert result["avg_rent_region"] == 0
    assert result["rental_demand"] == "Data not available"


@pytest.mark.asyncio
async def test_missing_data_file_returns_not_available():
    """If ons_rental_stats.json doesn't exist, return not available — never crash."""
    with patch("pathlib.Path.exists", return_value=False):
        result = await get_area_stats("M14 5RQ")

    assert result["avg_rent_region"] == 0
    assert result["rental_demand"] == "Data not available"


@pytest.mark.asyncio
async def test_postcase_insensitive():
    """Lowercase postcode should still match."""
    data = json.dumps(SAMPLE_STATS)
    with patch("builtins.open", mock_open(read_data=data)):
        with patch("pathlib.Path.exists", return_value=True):
            result = await get_area_stats("m14 5rq")

    assert result["avg_rent_region"] == 950
    assert result["rental_demand"] == "High"

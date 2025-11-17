import sys
import types
import pandas as pd
import pytest


@pytest.fixture(autouse=True)
def mock_pandas(monkeypatch):
    """
    Mock pd.read_csv BEFORE ingest.py is imported.
    """
    fake_df = pd.DataFrame({
        "id": [1],
        "name": ["Test Place"],
        "type": ["Hotel"],
        "city": ["Paris"],
        "country": ["France"],
        "description": ["Nice hotel"],
        "amenities": ["WiFi"],
        "category": ["Premium"],
        "nearby_destinations": ["Louvre"],
        "latitude": [48.85],
        "longitude": [2.35],
        "average_price_usd": [150],
        "rating": [4.5],
        "rating_count": [250],
        "popularity_score": [90],
        "generated_at": ["2024-01-01"],
    })
    def fake_read_csv(*args, **kwargs):
        return fake_df

    monkeypatch.setattr("pandas.read_csv", fake_read_csv)


def test_build_text_import_after_mock():
    """
    Import ingest AFTER pandas.read_csv has been mocked.
    """
    from backend import ingest

    row = ingest.df.iloc[0]
    text = ingest.build_text(row)

    assert "Test Place" in text
    assert "Hotel" in text
    assert isinstance(text, str)

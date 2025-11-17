import pytest
from unittest.mock import patch, MagicMock

@pytest.fixture
def mock_model():
    with patch("backend.search.SentenceTransformer") as MockModel:
        instance = MockModel.return_value
        instance.encode.return_value = [0.1, 0.2, 0.3] 
        yield instance

@pytest.fixture
def mock_mongo():
    with patch("backend.search.col") as mock_collection:

        mock_collection.aggregate.return_value = [
            {
                "name": "Beach Paradise",
                "city": "Goa",
                "country": "India",
                "category": "Beach",
                "description": "A beautiful beach destination.",
                "score": 0.98,
            }
        ]

        yield mock_collection

def test_semantic_search(mock_model, mock_mongo):
    from backend.search import semantic_search

    results = semantic_search("beach", top_k=1)

    assert len(results) == 1
    assert results[0]["name"] == "Beach Paradise"
    assert "score" in results[0]

    
    mock_model.encode.assert_called_once_with("beach")
    mock_mongo.aggregate.assert_called_once()

import os
import importlib
import sys
from pathlib import Path

BACKEND_PATH = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_PATH))


def reload_config():
    """Reload backend/config.py to re-read environment variables."""
    import config
    importlib.reload(config)
    return config


def test_default_values(monkeypatch):
    """Test default values when no env vars exist."""

    for var in [
        "SECRET_KEY",
        "ALGORITHM",
        "ACCESS_TOKEN_EXPIRE_MINUTES",
        "GROQ_API_KEY",
        "MONGODB_URL",
        "DATABASE_NAME",
    ]:
        monkeypatch.delenv(var, raising=False)

    config = reload_config()

    assert config.SECRET_KEY == "testsecret"
    assert config.ALGORITHM == "HS256"
    assert config.ACCESS_TOKEN_EXPIRE_MINUTES == 30
    assert config.GROQ_API_KEY == ""
    assert config.MONGODB_URL == ""
    assert config.DATABASE_NAME == ""


def test_custom_env_values(monkeypatch):
    monkeypatch.setenv("SECRET_KEY", "abc123")
    monkeypatch.setenv("ALGORITHM", "RS256")
    monkeypatch.setenv("ACCESS_TOKEN_EXPIRE_MINUTES", "90")
    monkeypatch.setenv("GROQ_API_KEY", "groqxyz")
    monkeypatch.setenv("MONGODB_URL", "mongodb://localhost")
    monkeypatch.setenv("DATABASE_NAME", "pytestdb")

    config = reload_config()

    assert config.SECRET_KEY == "abc123"
    assert config.ALGORITHM == "RS256"
    assert config.ACCESS_TOKEN_EXPIRE_MINUTES == 90
    assert config.GROQ_API_KEY == "groqxyz"
    assert config.MONGODB_URL == "mongodb://localhost"
    assert config.DATABASE_NAME == "pytestdb"


def test_numeric_conversion(monkeypatch):
    monkeypatch.setenv("ACCESS_TOKEN_EXPIRE_MINUTES", "120")

    config = reload_config()

    assert isinstance(config.ACCESS_TOKEN_EXPIRE_MINUTES, int)
    assert config.ACCESS_TOKEN_EXPIRE_MINUTES == 120


def test_config_variables_exist():
    import config
    assert hasattr(config, "SECRET_KEY")
    assert hasattr(config, "ALGORITHM")
    assert hasattr(config, "ACCESS_TOKEN_EXPIRE_MINUTES")
    assert hasattr(config, "GROQ_API_KEY")
    assert hasattr(config, "MONGODB_URL")
    assert hasattr(config, "DATABASE_NAME")

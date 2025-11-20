
import pytest
from httpx import AsyncClient
from unittest.mock import AsyncMock, patch, MagicMock

@pytest.mark.unit
class TestMainApp:
    
    async def test_lifespan_stuff(self):
        
        from main import lifespan, app
        
        with patch("main.client") as mock_client:
            mock_client.close = MagicMock()
            
            async with lifespan(app):
                mock_client.close.assert_not_called()
            
            mock_client.close.assert_called_once()

    async def test_app_routes_and_middleware(self, test_client: AsyncClient):
        from main import app
        
        assert len(app.routes) > 0
        
        middlewares = [m for m in app.user_middleware]
        assert len(middlewares) > 0
        
        response = await test_client.options(
            "/auth/signup",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "POST"
            }
        )
        assert response.status_code in [200, 405]

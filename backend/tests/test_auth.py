import pytest
from httpx import AsyncClient
from jose import jwt
from datetime import datetime, timedelta, timezone
import os
from unittest.mock import patch, MagicMock


@pytest.mark.auth
@pytest.mark.unit
class TestAuthStuff:
    # testing all auth related things
    
    async def test_signup_scenarios(self, test_client: AsyncClient, sample_user_data, sample_user_data_invalid_email, sample_user_data_short_password, sample_user_data_short_name):
        # trying to sign up with different data
        
        # successful signup
        response = await test_client.post("/auth/signup", json=sample_user_data)
        assert response.status_code == 200
        data = response.json()
        # Now returns a token, not user data
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        
        # duplicate email check
        response = await test_client.post("/auth/signup", json=sample_user_data)
        assert response.status_code == 400
        
        # duplicate username check
        duplicate_user = sample_user_data.copy()
        duplicate_user["email_id"] = "different@example.com"
        response = await test_client.post("/auth/signup", json=duplicate_user)
        assert response.status_code == 400
        
        # invalid email
        response = await test_client.post("/auth/signup", json=sample_user_data_invalid_email)
        assert response.status_code == 422
        
        # short password
        response = await test_client.post("/auth/signup", json=sample_user_data_short_password)
        assert response.status_code == 422
        
        # short name
        response = await test_client.post("/auth/signup", json=sample_user_data_short_name)
        assert response.status_code == 422
        
        # really long name
        long_name_user = {"name": "a" * 21, "email_id": "long@test.com", "password": "pass123"}
        response = await test_client.post("/auth/signup", json=long_name_user)
        assert response.status_code == 422
        
        # really long password
        long_pass_user = {"name": "testuser2", "email_id": "longpass@test.com", "password": "a" * 21}
        response = await test_client.post("/auth/signup", json=long_pass_user)
        assert response.status_code == 422
        
        # missing stuff
        incomplete_data = {"name": "testuser"}
        response = await test_client.post("/auth/signup", json=incomplete_data)
        assert response.status_code == 422
        
        # empty stuff
        empty_data = {"name": "", "email_id": "", "password": ""}
        response = await test_client.post("/auth/signup", json=empty_data)
        assert response.status_code == 422
        
        # weird name
        special_user = {"name": "test@user#123", "email_id": "special@example.com", "password": "pass123"}
        response = await test_client.post("/auth/signup", json=special_user)
        assert response.status_code == 200

    async def test_login_scenarios(self, test_client: AsyncClient, sample_user_data):
        # trying to login
        
        # need to signup first
        await test_client.post("/auth/signup", json=sample_user_data)
        
        # correct login
        login_data = {
            "username": sample_user_data["email_id"],
            "password": sample_user_data["password"]
        }
        response = await test_client.post(
            "/auth/token",
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        
        # checking if token is valid
        token = data["access_token"]
        decoded = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
        assert decoded["sub"] == sample_user_data["email_id"]
        
        # wrong password
        wrong_login = {
            "username": sample_user_data["email_id"],
            "password": "wrongpassword"
        }
        response = await test_client.post(
            "/auth/token",
            data=wrong_login,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        assert response.status_code == 401
        
        # user doesn't exist
        fake_login = {
            "username": "nonexistent@example.com",
            "password": "password123"
        }
        response = await test_client.post(
            "/auth/token",
            data=fake_login,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        assert response.status_code == 401
        
        # missing data
        response = await test_client.post(
            "/auth/token",
            data={},
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        assert response.status_code == 422
        
        # empty password
        empty_pass_login = {
            "username": sample_user_data["email_id"],
            "password": ""
        }
        response = await test_client.post(
            "/auth/token",
            data=empty_pass_login,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        assert response.status_code == 401

    async def test_get_current_user_direct(self, mock_users_collection):
        # testing the function directly to get 100% coverage
        # sometimes integration tests miss these lines
        from router.auth_routes import get_current_user
        from fastapi import HTTPException
        import pytest as pt
        import os
        from jose import jwt
        
        # we need to patch the collection inside the module because it's already imported
        with patch("router.auth_routes.users_collection", mock_users_collection):
            # setup a user
            valid_user = {
                "_id": "507f1f77bcf86cd799439011",
                "name": "testuser",
                "email_id": "test@example.com",
                "hashed_password": "hashed",
                "search_history": []
            }
            await mock_users_collection.insert_one(valid_user)
            
            token = jwt.encode(
                {"sub": "test@example.com"},
                os.getenv("SECRET_KEY"),
                algorithm=os.getenv("ALGORITHM")
            )
            
            # should work
            result = await get_current_user(token)
            assert result.email_id == "test@example.com"
            
            # token without sub claim - this hits line 28
            no_sub_token = jwt.encode(
                {"user": "test@example.com"},
                os.getenv("SECRET_KEY"),
                algorithm=os.getenv("ALGORITHM")
            )
            
            with pt.raises(HTTPException) as exc_info:
                await get_current_user(no_sub_token)
            assert exc_info.value.status_code == 401
            
            # totally invalid token
            with pt.raises(HTTPException) as exc_info:
                await get_current_user("invalid_token")
            assert exc_info.value.status_code == 401
            
            # user not found in db - this hits line 34
            fake_token = jwt.encode(
                {"sub": "nonexistent@example.com"},
                os.getenv("SECRET_KEY"),
                algorithm=os.getenv("ALGORITHM")
            )
            
            with pt.raises(HTTPException) as exc_info:
                await get_current_user(fake_token)
            assert exc_info.value.status_code == 401

    async def test_me_endpoint(self, test_client: AsyncClient, authenticated_user, sample_user_data, mock_users_collection):
        # testing /me endpoint
        
        # valid token
        token = authenticated_user["token"]
        headers = {"Authorization": f"Bearer {token}"}
        response = await test_client.get("/auth/me", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["email_id"] == authenticated_user["user_data"]["email_id"]
        
        # no token
        response = await test_client.get("/auth/me")
        assert response.status_code == 401
        
        # bad token
        headers = {"Authorization": "Bearer invalid_token_here"}
        response = await test_client.get("/auth/me", headers=headers)
        assert response.status_code == 401
        
        # weird format
        headers = {"Authorization": "InvalidFormat token"}
        response = await test_client.get("/auth/me", headers=headers)
        assert response.status_code == 401
        
        # expired token
        expire = datetime.now(timezone.utc) - timedelta(minutes=30)
        token_data = {"sub": sample_user_data["email_id"], "exp": expire}
        expired_token = jwt.encode(
            token_data,
            os.getenv("SECRET_KEY"),
            algorithm=os.getenv("ALGORITHM")
        )
        headers = {"Authorization": f"Bearer {expired_token}"}
        response = await test_client.get("/auth/me", headers=headers)
        assert response.status_code == 401
        
        # no bearer prefix
        token = authenticated_user["token"]
        headers = {"Authorization": token}
        response = await test_client.get("/auth/me", headers=headers)
        assert response.status_code == 401
        
        # tampered token
        tampered_token = token[:-5] + "XXXXX"
        headers = {"Authorization": f"Bearer {tampered_token}"}
        response = await test_client.get("/auth/me", headers=headers)
        assert response.status_code == 401
        
        # token with no sub
        # removed local import to fix UnboundLocalError
        no_sub_token = jwt.encode(
            {"user": "test@example.com"},
            os.getenv("SECRET_KEY"),
            algorithm=os.getenv("ALGORITHM")
        )
        headers = {"Authorization": f"Bearer {no_sub_token}"}
        response = await test_client.get("/auth/me", headers=headers)
        assert response.status_code == 401
        
        # check other endpoints too
        response2 = await test_client.get("/travel/generate", params={"prompt": "test"}, headers=headers)
        assert response2.status_code == 401
        
        # user doesn't exist
        fake_user_token = jwt.encode(
            {"sub": "nonexistent@example.com"},
            os.getenv("SECRET_KEY"),
            algorithm=os.getenv("ALGORITHM")
        )
        headers = {"Authorization": f"Bearer {fake_user_token}"}
        response = await test_client.get("/auth/me", headers=headers)
        assert response.status_code == 401
        
        # check recommendations endpoint
        response3 = await test_client.get("/recommendations/personalized", headers=headers)
        assert response3.status_code == 401
        
        # mocking jwt decode error
        with patch("router.auth_routes.jwt.decode") as mock_decode:
            from jose import JWTError
            mock_decode.side_effect = JWTError("Invalid token")
            
            response = await test_client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
            assert response.status_code == 401
        
        # totally invalid token format
        response = await test_client.get("/auth/me", headers={"Authorization": "Bearer notavalidtoken"})
        assert response.status_code == 401
        
        # wrong signature
        wrong_secret_token = jwt.encode(
            {"sub": sample_user_data["email_id"]},
            "wrong_secret_key",
            algorithm=os.getenv("ALGORITHM")
        )
        response = await test_client.get("/auth/me", headers={"Authorization": f"Bearer {wrong_secret_token}"})
        assert response.status_code == 401

    async def test_password_hashing_check(self, test_client: AsyncClient, sample_user_data, mock_users_collection):
        # making sure we don't save plain passwords
        
        await test_client.post("/auth/signup", json=sample_user_data)
        stored_user = await mock_users_collection.find_one({"email_id": sample_user_data["email_id"]})
        assert stored_user is not None
        assert "hashed_password" in stored_user
        assert stored_user["hashed_password"] != sample_user_data["password"]
        
        # different salts check
        user1 = {"name": "user1test", "email_id": "user1@test.com", "password": "samepassword"}
        user2 = {"name": "user2test", "email_id": "user2@test.com", "password": "samepassword"}
        await test_client.post("/auth/signup", json=user1)
        await test_client.post("/auth/signup", json=user2)
        stored_user1 = await mock_users_collection.find_one({"email_id": user1["email_id"]})
        stored_user2 = await mock_users_collection.find_one({"email_id": user2["email_id"]})
        assert stored_user1["hashed_password"] != stored_user2["hashed_password"]

    async def test_full_flow(self, test_client: AsyncClient, sample_user_data):
        # testing the whole process
        
        # signup
        signup_response = await test_client.post("/auth/signup", json=sample_user_data)
        assert signup_response.status_code == 200
        
        # login
        login_data = {
            "username": sample_user_data["email_id"],
            "password": sample_user_data["password"]
        }
        login_response = await test_client.post(
            "/auth/token",
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        assert login_response.status_code == 200
        token = login_response.json()["access_token"]
        
        # use token
        headers = {"Authorization": f"Bearer {token}"}
        me_response = await test_client.get("/auth/me", headers=headers)
        assert me_response.status_code == 200
        assert me_response.json()["email_id"] == sample_user_data["email_id"]

    async def test_otp_flow(self, test_client: AsyncClient):
        # testing OTP functionality
        
        email = "test@voyagr.com"
        
        # Mock requests.post for SendGrid
        with patch("auth.requests.post") as mock_post:
            mock_response = MagicMock()
            mock_response.raise_for_status.return_value = None
            mock_post.return_value = mock_response
            
            # Send OTP
            response = await test_client.post("/auth/send-otp", json={"email": email})
            assert response.status_code == 200
            assert response.json()["message"] == "OTP sent successfully"
            mock_post.assert_called_once()
            
        # Verify OTP
        # We need to know the OTP that was generated. 
        # Since it's random, we can mock the OTP generation or inspect the store if possible.
        # Or better, mock the check_otp function or the store directly.
        
        from auth import OTP_STORE
        assert email in OTP_STORE
        otp = OTP_STORE[email]["otp"]
        
        # Correct OTP
        response = await test_client.post("/auth/verify-otp", json={"email": email, "otp": otp})
        assert response.status_code == 200
        assert response.json()["message"] == "OTP verified"
        
        # OTP should be removed after use
        assert email not in OTP_STORE
        
        # Try verifying again (should fail)
        response = await test_client.post("/auth/verify-otp", json={"email": email, "otp": otp})
        assert response.status_code == 400
        
        # Invalid OTP
        # Generate a new one first
        with patch("auth.requests.post"):
            await test_client.post("/auth/send-otp", json={"email": email})
        
        response = await test_client.post("/auth/verify-otp", json={"email": email, "otp": "000000"})
        assert response.status_code == 400
        
        # Expired OTP
        # Manually expire it in the store
        OTP_STORE[email]["expires_at"] = 0 # Past timestamp
        
        response = await test_client.post("/auth/verify-otp", json={"email": email, "otp": OTP_STORE[email]["otp"]})
        assert response.status_code == 400

    async def test_logout(self, test_client: AsyncClient, authenticated_user):
        # testing logout
        token = authenticated_user["token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        response = await test_client.post("/auth/logout", headers=headers)
        assert response.status_code == 200
        assert response.json()["message"] == "Logged out successfully"
        
        # Logout without token
        response = await test_client.post("/auth/logout")
        assert response.status_code == 401

        # Test SendGrid config missing
        with patch("auth.SENDGRID_API_KEY", None):
            from auth import send_otp_email
            with pytest.raises(RuntimeError):
                send_otp_email("test@test.com", "123456")

        # Test Email Sending Failure (Endpoint)
        email = "test@voyagr.com"
        with patch("auth.send_otp_email") as mock_send:
            mock_send.side_effect = Exception("SendGrid down")
            response = await test_client.post("/auth/send-otp", json={"email": email})
            assert response.status_code == 500
            assert response.json()["detail"] == "Could not send OTP email"
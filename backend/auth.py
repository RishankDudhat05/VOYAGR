from typing import Dict
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from passlib.exc import UnknownHashError
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, SENDGRID_API_KEY, SENDGRID_SENDER_EMAIL, SENDGRID_SENDER_NAME
import random
import time
import requests

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def generate_otp() -> str:
    """Generate a 6-digit OTP."""
    return f"{random.randint(0, 999999):06d}"

OTP_STORE: Dict[str, Dict[str, float]] = {}

def save_otp(email: str, otp: str, ttl_seconds: int = 300) -> None:
    """Save OTP with expiry for an email."""
    OTP_STORE[email] = {
        "otp": otp,
        "expires_at": time.time() + ttl_seconds,
    }


def check_otp(email: str, otp: str) -> bool:
    """Check if OTP is correct and not expired."""
    data = OTP_STORE.get(email)
    if not data:
        return False

    # expired
    if time.time() > data["expires_at"]:
        del OTP_STORE[email]
        return False

    # wrong
    if data["otp"] != otp:
        return False

    # success -> remove so it can't be reused
    del OTP_STORE[email]
    return True


def send_otp_email(email: str, otp: str) -> None:
    """Send OTP via SendGrid Email API."""
    if not SENDGRID_API_KEY or not SENDGRID_SENDER_EMAIL:
        raise RuntimeError("SendGrid config is missing")

    url = "https://api.sendgrid.com/v3/mail/send"

    headers = {
        "Authorization": f"Bearer {SENDGRID_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "personalizations": [
            {
                "to": [{"email": email}],
                "subject": "Your VOYAGR OTP Code",
            }
        ],
        "from": {
            "email": SENDGRID_SENDER_EMAIL,
            "name": SENDGRID_SENDER_NAME,
        },
        "content": [
            {
                "type": "text/html",
                "value": f"""
                    <p>Your OTP code is <strong>{otp}</strong>.</p>
                    <p>It is valid for 5 minutes.</p>
                """,
            }
        ],
    }

    r = requests.post(url, json=payload, headers=headers)
    r.raise_for_status()

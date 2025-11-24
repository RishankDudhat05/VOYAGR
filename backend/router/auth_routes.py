from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt

from database import users_collection
from schemas import UserCreate, UserResponse, Token, SendOtpRequest, VerifyOtpRequest
from auth import hash_password, verify_password, create_access_token, generate_otp, save_otp, check_otp, send_otp_email
from config import SECRET_KEY, ALGORITHM

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email_id: str = payload.get("sub")
        if email_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = await users_collection.find_one({"email_id": email_id})
    if user is None:
        raise credentials_exception
    
    user["_id"] = str(user["_id"])
    return UserResponse(**user)

@router.post("/signup", response_model=UserResponse)
async def signup(user: UserCreate):
    # Check if a user with the same email already exists
    existing_user_by_email = await users_collection.find_one({"email_id": user.email_id})
    if existing_user_by_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered."
        )

    # Check if a user with the same name already exists
    existing_user_by_name = await users_collection.find_one({"name": user.name})
    if existing_user_by_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists. Please choose another one."
        )

    new_user = {
        "name": user.name,
        "email_id": user.email_id,
        "hashed_password": hash_password(user.password)
    }
    
    result = await users_collection.insert_one(new_user)
    new_user["_id"] = str(result.inserted_id)
    
    return UserResponse(**new_user)


@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await users_collection.find_one({"email_id": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user["email_id"]})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
async def read_me(current_user: UserResponse = Depends(get_current_user)):
    return current_user

@router.post("/send-otp")
async def send_otp_endpoint(body: SendOtpRequest):
    otp = generate_otp()
    save_otp(body.email, otp, ttl_seconds=300)  # 5 minutes

    try:
        send_otp_email(body.email, otp)
    except Exception as e:
        print("Error sending OTP email:", e)
        raise HTTPException(status_code=500, detail="Could not send OTP email")

    return {"message": "OTP sent successfully"}


@router.post("/verify-otp")
async def verify_otp_endpoint(body: VerifyOtpRequest):
    ok = check_otp(body.email, body.otp)
    if not ok:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    # here you can also update DB that this email is verified
    return {"message": "OTP verified"}


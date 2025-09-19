from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import User
from schemas import UserCreate, UserResponse

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@app.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing_user_by_email = db.query(User).filter(User.email_id == user.email_id).first()
    if existing_user_by_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered."
        )

    existing_user_by_name = db.query(User).filter(User.name == user.name).first()
    if existing_user_by_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists. Please choose another one."
        )

    new_user = User(
        name=user.name,
        email_id=user.email_id,
        password=user.password   # ⚠️ plain text storage
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@app.post("/login", status_code=status.HTTP_200_OK)
async def login(data: UserModel):
    for user in user_data:
        if user.username == data.username and user.password == data.password:
            return {"message": "Login Successful"}
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid username or password"
    )

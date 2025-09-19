from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    _tablename_ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String,unique=True)
    email_id = Column(String, unique=True, index=True)
    hashed_password = Column(String)

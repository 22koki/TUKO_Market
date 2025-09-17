from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    name: str
    phone: Optional[str]

class UserCreate(UserBase):
    password: str
    role: str = Field(..., regex="^(vendor|customer)$")

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    phone: Optional[str]
    role: str
    is_verified: bool

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[int] = None

class VendorProfileCreate(BaseModel):
    business_name: Optional[str] = None
    categories: Optional[str] = None  # comma separated
    address: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None
    allow_phone_public: Optional[bool] = False
    supports_delivery: Optional[bool] = True
    supports_pickup: Optional[bool] = True

class VendorProfileResponse(VendorProfileCreate):
    id: int
    user_id: int
    class Config:
        orm_mode = True

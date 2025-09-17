from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from .session import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="customer")  # "vendor" or "customer" or "admin"
    is_verified = Column(Boolean, default=False)

    vendor_profile = relationship("VendorProfile", back_populates="user", uselist=False)

class VendorProfile(Base):
    __tablename__ = "vendor_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    business_name = Column(String, nullable=True)
    categories = Column(String, nullable=True)  # comma-separated for MVP
    address = Column(String, nullable=True)
    lat = Column(Float, nullable=True)
    lon = Column(Float, nullable=True)
    allow_phone_public = Column(Boolean, default=False)
    supports_delivery = Column(Boolean, default=True)
    supports_pickup = Column(Boolean, default=True)

    user = relationship("User", back_populates="vendor_profile")

from sqlalchemy.orm import Session
from . import models, schemas
from .utils.security import get_password_hash

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed = get_password_hash(user.password)
    db_user = models.User(email=user.email, name=user.name, phone=user.phone or None,
                          hashed_password=hashed, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    # If vendor, create vendor profile stub
    if user.role == "vendor":
        vp = models.VendorProfile(user_id=db_user.id)
        db.add(vp)
        db.commit()
        db.refresh(vp)
    return db_user

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_or_update_vendor_profile(db: Session, user_id: int, vp: schemas.VendorProfileCreate):
    profile = db.query(models.VendorProfile).filter(models.VendorProfile.user_id == user_id).first()
    if not profile:
        profile = models.VendorProfile(user_id=user_id)
        db.add(profile)
    for field, value in vp.dict(exclude_unset=True).items():
        setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return profile

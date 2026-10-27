from datetime import datetime

import bcrypt
from fastapi import Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
from fastapi.routing import APIRouter

from connection.Db_connect import SessionLocation
from models.user_models import User_reg_details
from schemas.User_log import user_login
from schemas.user_validate import user_validate
from validate_token.dependencies import get_current_user
from validate_token.jwt_token import create_token

rt=APIRouter()


@rt.post("/user_reg")
def send_user_data(values:user_validate):
    db=SessionLocation()
    try:
        email = values.email.strip().lower()
        if db.query(User_reg_details).filter(func.lower(User_reg_details.email) == email).first():
            raise HTTPException(status_code=409, detail="An account with this email already exists.")
        get_hash_pass=bcrypt.hashpw(values.password.encode("UTF-8"),bcrypt.gensalt()).decode("UTF-8")
        new_user_details=User_reg_details(
            id=values.id,
            name=values.name,
            email=email,
            password=get_hash_pass,
            created_at=values.created_at or datetime.utcnow()
        )

        db.add(new_user_details)
        try:
            db.commit()
        except IntegrityError as exc:
            db.rollback()
            raise HTTPException(status_code=409, detail="An account with this email or ID already exists.") from exc
        return {"message": "Account created"}
    finally:
        db.close()


@rt.post("/user_log")
def user_login(data:user_login):
    db=SessionLocation()
    try:
        email = data.email.strip().lower()
        get_valiate_data=db.query(User_reg_details).filter(func.lower(User_reg_details.email)==email).first()
        if not get_valiate_data or not bcrypt.checkpw(data.password.encode("UTF-8"),get_valiate_data.password.encode("UTF-8")):
            raise HTTPException(status_code=401,detail="Invalid email or password")

        pass_token=create_token(get_valiate_data.email)
        return {
                "message": "done",
                "access_token":pass_token,
                "name": get_valiate_data.name,
                "email": get_valiate_data.email,
                }
    finally:
        db.close()
    


 
@rt.get("/profile")
def validate_profile(current_user=Depends(get_current_user)):
    return {"name": current_user.name, "email": current_user.email}
    

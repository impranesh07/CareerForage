from fastapi import Header, HTTPException, status
from jose import JWTError
from sqlalchemy import func

from connection.Db_connect import SessionLocation
from models.user_models import User_reg_details
from validate_token.jwt_token import validate_token


def get_current_user(authorization: str | None = Header(default=None)):
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="A valid bearer token is required.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not authorization:
        raise unauthorized

    scheme, separator, token = authorization.partition(" ")
    if not separator or scheme.lower() != "bearer" or not token.strip():
        raise unauthorized

    try:
        payload = validate_token(token.strip())
    except (JWTError, RuntimeError) as exc:
        raise unauthorized from exc

    email = payload.get("sub")
    if not isinstance(email, str):
        raise unauthorized

    db = SessionLocation()
    try:
        user = db.query(User_reg_details).filter(func.lower(User_reg_details.email) == email.lower()).first()
        if user is None:
            raise unauthorized
        return user
    finally:
        db.close()

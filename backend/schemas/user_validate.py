from pydantic import BaseModel
from datetime import datetime

class user_validate(BaseModel):
    id:str
    name:str
    email:str
    password:str
    created_at:datetime | None=None



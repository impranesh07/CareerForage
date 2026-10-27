from pydantic import BaseModel

class user_login(BaseModel):
    email:str
    password:str

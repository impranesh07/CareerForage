from sqlalchemy import Column,String,Integer,DateTime
from connection.Db_connect import Base
from datetime import datetime

class User_reg_details(Base):
    __tablename__="userreg1"
    id=Column(String,primary_key=True,index=True)
    name=Column(String)
    email=Column(String, nullable=False)
    password=Column(String)
    created_at=Column(DateTime,default=datetime.utcnow)

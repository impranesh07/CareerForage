from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ruoters.routes import rt
from ai.routes import router as ai_router
from ai.interview_routes import router as interview_router
from resume_match.routes import router as resume_match_router
from connection.Db_connect import Base,engine
from models.user_models import User_reg_details
from sqlalchemy import Index
app=FastAPI()

app.add_middleware(
	CORSMiddleware,
	allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
	allow_methods=["*"],
	allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
# create_all does not add constraints to tables that already exist.
Index("uq_userreg1_email", User_reg_details.email, unique=True).create(bind=engine, checkfirst=True)

app.include_router(rt)
app.include_router(ai_router)
app.include_router(interview_router)
app.include_router(resume_match_router)


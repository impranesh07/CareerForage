from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, Text

from connection.Db_connect import Base


class ResumeMatchReport(Base):
    __tablename__ = "resume_match_reports"

    id = Column(Integer, primary_key=True, index=True)
    resume_name = Column(Text, nullable=False)
    job_description = Column(Text, nullable=False)
    report_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

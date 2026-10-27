import json
import os

from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile
from sqlalchemy.orm import Session

from connection.Db_connect import SessionLocation
from resume_match.models import ResumeMatchReport
from resume_match.service import analyze, cache_key, extract_resume_text
from validate_token.dependencies import get_current_user

router = APIRouter(prefix="/resume-match", tags=["Resume matching"])
MAX_UPLOAD_BYTES = 5 * 1024 * 1024


def _redis_client():
    url = os.getenv("REDIS_URL")
    if not url:
        return None
    try:
        import redis
        client = redis.Redis.from_url(url, decode_responses=True, socket_connect_timeout=0.4)
        client.ping()
        return client
    except Exception:
        return None


@router.post("/analyze")
async def analyze_resume(request: Request, resume: UploadFile = File(...), job_description: str = Form(...), current_user=Depends(get_current_user)):
    if not job_description.strip():
        raise HTTPException(status_code=400, detail="Enter at least one job title or keyword.")
    if len(job_description) > 30_000:
        raise HTTPException(status_code=413, detail="The job description is too long (30,000 characters maximum).")
    content = await resume.read(MAX_UPLOAD_BYTES + 1)
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Resume file exceeds the 5 MB limit.")
    try:
        resume_text = extract_resume_text(resume.filename or "resume", content)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    if len(resume_text) < 50:
        raise HTTPException(status_code=400, detail="Not enough readable text was found. Try a text-based PDF, DOCX, or TXT file.")

    client = _redis_client()
    key = cache_key(resume_text, job_description)
    report = None
    if client:
        try:
            client_key = request.client.host if request.client else "shared"
            limit_key = f"resume-match:limit:{client_key}"
            count = client.incr(limit_key)
            if count == 1:
                client.expire(limit_key, 60)
            if count > 20:
                raise HTTPException(status_code=429, detail="Too many analyses. Please wait a minute and try again.")
            cached = client.get(f"resume-match:report:{key}")
            if cached:
                report = json.loads(cached)
        except HTTPException:
            raise
        except Exception:
            client = None
    if report is None:
        report = analyze(resume_text, job_description)

    db: Session = SessionLocation()
    try:
        record = ResumeMatchReport(
            resume_name=(resume.filename or "resume")[:255],
            job_description=job_description,
            report_json=json.dumps(report),
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        report["report_id"] = record.id
        report["created_at"] = record.created_at.isoformat()
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=503, detail="Could not save the report. Check the database connection and retry.") from exc
    finally:
        db.close()
    if client:
        try:
            client.setex(f"resume-match:report:{key}", 900, json.dumps({k: v for k, v in report.items() if k not in {"report_id", "created_at"}}))
        except Exception:
            pass
    return report

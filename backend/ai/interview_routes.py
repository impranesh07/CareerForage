import json

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from ai.interview import generate_interview_questions
from ai.mock_interview import generate_mock_turn
from resume_match.service import extract_resume_text
from validate_token.dependencies import get_current_user


router = APIRouter(prefix="/interview", tags=["Interview preparation"])
MAX_UPLOAD_BYTES = 5 * 1024 * 1024


@router.post("/topics")
async def interview_questions(resume: UploadFile = File(...), current_user=Depends(get_current_user)):
    content = await resume.read(MAX_UPLOAD_BYTES + 1)
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Resume file exceeds the 5 MB limit.")
    try:
        resume_text = extract_resume_text(resume.filename or "resume", content)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    if len(resume_text) < 50:
        raise HTTPException(status_code=400, detail="Not enough readable text was found. Try a text-based PDF, DOCX, or TXT file.")

    return generate_interview_questions(resume_text)


@router.post("/mock")
async def mock_interview_turn(
    resume: UploadFile = File(...),
    answer: str = Form(default=""),
    history: str = Form(default="[]"),
    current_user=Depends(get_current_user),
):
    content = await resume.read(MAX_UPLOAD_BYTES + 1)
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Resume file exceeds the 5 MB limit.")
    try:
        resume_text = extract_resume_text(resume.filename or "resume", content)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    if len(resume_text) < 50:
        raise HTTPException(status_code=400, detail="Not enough readable text was found. Try a text-based PDF, DOCX, or TXT file.")
    if len(answer) > 5_000:
        raise HTTPException(status_code=413, detail="Interview answers must be 5,000 characters or fewer.")
    try:
        messages = json.loads(history)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=400, detail="Interview history is invalid.") from exc
    if not isinstance(messages, list) or any(
        not isinstance(item, dict)
        or item.get("role") not in {"assistant", "user"}
        or not isinstance(item.get("content"), str)
        for item in messages
    ):
        raise HTTPException(status_code=400, detail="Interview history is invalid.")
    return generate_mock_turn(resume_text, messages[-12:], answer.strip())

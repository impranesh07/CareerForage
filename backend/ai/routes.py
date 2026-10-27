from fastapi import APIRouter, Depends, HTTPException

from ai.schemas import ChatRequest, ChatResponse
from ai.service import MODEL, get_career_assistance
from validate_token.dependencies import get_current_user


router = APIRouter(prefix="/ai", tags=["AI assistance"])


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest, current_user=Depends(get_current_user)) -> ChatResponse:
    try:
        reply = get_career_assistance(request.message, request.history)
    except RuntimeError as exc:
        detail = str(exc)
        status_code = 503 if "busy" in detail or "connect" in detail else 502
        if "GROQ_API_KEY" in detail:
            status_code = 503
        raise HTTPException(status_code=status_code, detail=detail) from exc

    return ChatResponse(reply=reply, model=MODEL)

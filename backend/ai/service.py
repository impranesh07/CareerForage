import os
from pathlib import Path

from dotenv import load_dotenv
from groq import APIConnectionError, APIStatusError, Groq, RateLimitError

from ai.prompts import CAREER_ASSISTANT_PROMPT
from ai.schemas import ChatMessage


load_dotenv(Path(__file__).resolve().parents[1] / ".env")

MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")


def _client() -> Groq:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not configured in backend/.env")
    return Groq(api_key=api_key)


def get_career_assistance(message: str, history: list[ChatMessage]) -> str:
    messages = [{"role": "system", "content": CAREER_ASSISTANT_PROMPT}]
    messages.extend(item.model_dump() for item in history)
    messages.append({"role": "user", "content": message})

    try:
        completion = _client().chat.completions.create(
            model=MODEL,
            messages=messages,
            temperature=0.7,
            max_completion_tokens=1_024,
        )
    except RateLimitError as exc:
        raise RuntimeError("The AI service is busy. Please try again shortly.") from exc
    except APIConnectionError as exc:
        raise RuntimeError("Could not connect to the AI service.") from exc
    except APIStatusError as exc:
        raise RuntimeError("The AI service could not complete the request.") from exc

    reply = completion.choices[0].message.content
    if not reply:
        raise RuntimeError("The AI service returned an empty response.")
    return reply

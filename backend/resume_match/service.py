import hashlib
import json
import os
import re
import zipfile
from io import BytesIO
from xml.etree import ElementTree

from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

SKILLS = [
    "Python", "Java", "JavaScript", "TypeScript", "React", "Node.js", "FastAPI",
    "Django", "Flask", "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Git", "Linux", "REST API",
    "GraphQL", "CI/CD", "Machine Learning", "Data Analysis", "Excel", "Power BI",
    "Tableau", "Communication", "Leadership", "Agile", "Project Management",
]


def extract_resume_text(filename: str, content: bytes) -> str:
    suffix = Path(filename).suffix.lower()
    if suffix == ".txt":
        return content.decode("utf-8", errors="replace").strip()
    if suffix == ".docx":
        try:
            with zipfile.ZipFile(BytesIO(content)) as archive:
                xml = ElementTree.fromstring(archive.read("word/document.xml"))
            paragraphs = []
            for paragraph in xml.iter():
                if paragraph.tag.endswith("}p"):
                    text = "".join(node.text or "" for node in paragraph.iter() if node.tag.endswith("}t"))
                    if text.strip():
                        paragraphs.append(text.strip())
            return "\n".join(paragraphs)
        except (KeyError, zipfile.BadZipFile, ElementTree.ParseError) as exc:
            raise ValueError("This DOCX file could not be read. Please try another file.") from exc
    if suffix == ".pdf":
        try:
            from pypdf import PdfReader
            reader = PdfReader(BytesIO(content))
            return "\n".join(page.extract_text() or "" for page in reader.pages).strip()
        except ImportError as exc:
            raise ValueError("PDF support is unavailable. Install the backend requirements and retry.") from exc
        except Exception as exc:
            raise ValueError("This PDF could not be read. Please try another file.") from exc
    raise ValueError("Upload a PDF, DOCX, or TXT resume.")


def _find_terms(text: str) -> list[str]:
    found = []
    for skill in SKILLS:
        pattern = r"(?<!\w)" + re.escape(skill).replace(r"\ ", r"\s+") + r"(?!\w)"
        if re.search(pattern, text, flags=re.IGNORECASE):
            found.append(skill)
    return found


def _suggestions(score: int, missing: list[str], resume_text: str, job_description: str) -> list[str]:
    fallback = []
    if missing:
        fallback.append("If accurate, add evidence for these job keywords: " + ", ".join(missing[:8]) + ".")
    if not re.search(r"\b\d+(?:\.\d+)?%?\b", resume_text):
        fallback.append("Add measurable outcomes to relevant experience bullets, such as time saved, revenue, or users supported.")
    fallback.append("Tailor the opening summary and most relevant experience bullets to the role's core responsibilities.")
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return fallback[:4]
    try:
        from groq import Groq
        response = Groq(api_key=api_key).chat.completions.create(
            model=os.getenv("GROQ_MODEL", "openai/gpt-oss-20b"),
            messages=[
                {"role": "system", "content": "Give 3 concise, specific resume improvement suggestions grounded only in the supplied resume and job. Never advise claiming skills or experience the candidate does not have. Return a JSON array of strings only."},
                {"role": "user", "content": json.dumps({"resume": resume_text[:7000], "job": job_description[:5000], "score": score, "missing_skills": missing})},
            ], temperature=0.3, max_completion_tokens=500,
        )
        body = response.choices[0].message.content or ""
        parsed = json.loads(body[body.find("["):body.rfind("]") + 1])
        return [str(item) for item in parsed[:4] if isinstance(item, str)] or fallback[:4]
    except Exception:
        return fallback[:4]


def analyze(resume_text: str, job_description: str) -> dict:
    resume_skills = _find_terms(resume_text)
    required_skills = _find_terms(job_description)
    matched = [skill for skill in required_skills if skill in resume_skills]
    missing = [skill for skill in required_skills if skill not in resume_skills]
    keyword_tokens = {word.lower() for word in re.findall(r"[A-Za-z][A-Za-z+.#/-]{2,}", job_description)}
    resume_tokens = {word.lower() for word in re.findall(r"[A-Za-z][A-Za-z+.#/-]{2,}", resume_text)}
    keyword_score = round(100 * len(keyword_tokens & resume_tokens) / max(len(keyword_tokens), 1))
    skill_score = round(100 * len(matched) / max(len(required_skills), 1)) if required_skills else keyword_score
    score = round(skill_score * 0.7 + keyword_score * 0.3)
    suggestions = _suggestions(score, missing, resume_text, job_description)
    qualification_patterns = [
        r"\b(?:bachelor(?:'s)?|master(?:'s)?|b\.?s\.?|b\.?a\.?|m\.?s\.?|m\.?b\.?a\.?|ph\.?d\.?|associate(?:'s)?)\b[^\n.;]{0,70}",
        r"\b(?:certified|certification|certification in)\b[^\n.;]{0,70}",
    ]
    qualifications = []
    for pattern in qualification_patterns:
        qualifications.extend(match.group(0).strip(" ,:-") for match in re.finditer(pattern, resume_text, re.IGNORECASE))
    qualifications = list(dict.fromkeys(qualifications))[:8]
    experience_matches = re.findall(r"\b(\d{1,2})\+?\s+years?\s+(?:of\s+)?(?:professional\s+)?experience\b", resume_text, re.IGNORECASE)
    experience_years = max((int(years) for years in experience_matches), default=None)
    return {
        "score": score,
        "keyword_score": keyword_score,
        "skill_score": skill_score,
        "required_skills": required_skills,
        "matched_skills": matched,
        "missing_skills": missing,
        "resume_skills": resume_skills,
        "experience_years": experience_years,
        "qualifications": qualifications,
        "suggestions": suggestions,
        "summary": (f"Your resume matches {len(matched)} of {len(required_skills)} identified skills in this job description." if len(job_description.split()) > 8 else "This quick match uses the job title or keywords you entered. Add a full description for a more detailed comparison.") if required_skills else "No skills from the built-in skill list were found in the job description; the score uses keyword overlap.",
        "input_mode": "keywords" if len(job_description.split()) <= 8 else "description",
    }


def cache_key(resume_text: str, job_description: str) -> str:
    return hashlib.sha256((resume_text + "\0" + job_description).encode()).hexdigest()

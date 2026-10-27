import json
import os
import re

from resume_match.service import SKILLS


BASIC_QUESTIONS = [
    "Tell me about yourself.",
    "Why are you interested in this role?",
    "What are your greatest strengths?",
    "What is one skill you are currently working to improve?",
    "Describe a challenge you faced and how you handled it.",
    "Tell me about a time you worked with a team.",
    "What kind of work environment helps you do your best work?",
    "Where would you like your career to go over the next few years?",
    "Why should we hire you?",
    "What questions do you have for us?",
]


def _resume_facts(resume_text: str) -> dict:
    lines = [line.strip(" \t-") for line in resume_text.splitlines() if line.strip()]
    skills = []
    for skill in SKILLS:
        pattern = r"(?<!\w)" + re.escape(skill).replace(r"\ ", r"\s+") + r"(?!\w)"
        if re.search(pattern, resume_text, re.IGNORECASE):
            skills.append(skill)

    def section_lines(*names):
        start = next((i for i, line in enumerate(lines) if any(name in line.lower() for name in names)), None)
        if start is None:
            return []
        found = []
        for line in lines[start + 1:]:
            if found and re.fullmatch(r"[A-Z][A-Z &/]{2,}", line):
                break
            if len(line) > 2:
                found.append(line[:220])
            if len(found) == 5:
                break
        return found

    certifications = re.findall(r"[^\n]{0,70}\b(?:certified|certification|certificate)\b[^\n]{0,100}", resume_text, re.IGNORECASE)
    education = re.findall(r"[^\n]{0,100}\b(?:bachelor|master|b\.?s\.?|b\.?a\.?|m\.?s\.?|m\.?b\.?a\.?|ph\.?d\?|associate)\b[^\n]{0,100}", resume_text, re.IGNORECASE)
    return {
        "skills": skills[:25],
        "experience": section_lines("experience", "employment", "work history", "internship", "internships"),
        "projects": section_lines("projects", "selected work"),
        "education": education[:8],
        "certifications": certifications[:8],
    }


def _fallback_questions(facts: dict) -> dict:
    skills = facts["skills"] or ["the skills listed on your CV"]
    skill_questions = [
        f"Your CV lists {skill}. Can you describe a specific time you used it and the result?"
        for skill in skills[:5]
    ]
    project_questions = []
    for project in facts["projects"][:5]:
        project_name = project[:120]
        project_questions.extend([
            f"For “{project_name}”, what problem were you solving, who was it for, and how did you decide what to build?",
            f"For “{project_name}”, what was your personal role? Which parts did you design or implement yourself?",
            f"For “{project_name}”, what technical or practical challenge took the most effort, and how did you work through it?",
            f"For “{project_name}”, what alternatives or tradeoffs did you consider, and why did you choose your approach?",
            f"How did you test or evaluate “{project_name}”? What result or feedback showed whether it worked?",
            f"If you continued “{project_name}”, what would you improve next and why?",
        ])
    if not project_questions:
        project_questions.append("Choose a project from your CV. What problem did it solve, what was your role, and what would you improve next time?")
    experience_questions = []
    for experience in facts["experience"][:3]:
        detail = experience[:120]
        experience_questions.extend([
            f"Your CV describes this experience: {detail}. What were your main responsibilities and what did you personally deliver?",
            f"During {detail}, what was a challenge you faced, how did you handle it, and what did you learn?",
        ])
    return {
        "skill_questions": skill_questions,
        "basic_questions": BASIC_QUESTIONS,
        "project_questions": project_questions,
        "experience_questions": experience_questions,
    }


def generate_interview_questions(resume_text: str) -> dict:
    facts = _resume_facts(resume_text)
    api_key = os.getenv("GROQ_API_KEY")
    if api_key:
        try:
            from groq import Groq
            response = Groq(api_key=api_key).chat.completions.create(
                model=os.getenv("GROQ_MODEL", "openai/gpt-oss-20b"),
                messages=[
                    {"role": "system", "content": "Create interview preparation with skill-based questions, common basic interview questions, project questions, and work experience or internship questions when those entries appear on the CV. Personalize questions using details explicitly present in the CV. For every project named on the CV, create 4 to 6 detailed follow-up questions covering the problem and users, candidate's personal contribution, implementation and design choices, challenges, tradeoffs, testing or results, and possible improvements. Mention the relevant project in each question. For each work or internship entry, create 2 to 3 concise follow-up questions grounded in its details. If there is no work or internship experience, return an empty experience_questions list. Never invent skills, projects, employers, or responsibilities. Basic questions should be common interview questions, not CV-specific. Return only valid JSON: {\"skill_questions\":[string],\"basic_questions\":[string],\"project_questions\":[string],\"experience_questions\":[string]}"},
                    {"role": "user", "content": "Candidate CV:\n" + resume_text[:12000]},
                ],
                temperature=0.3,
                max_completion_tokens=3000,
            )
            body = response.choices[0].message.content or ""
            start, end = body.find("{"), body.rfind("}")
            parsed = json.loads(body[start:end + 1])
            skill_questions = [item.strip() for item in parsed.get("skill_questions", []) if isinstance(item, str) and item.strip()]
            basics = [item.strip() for item in parsed.get("basic_questions", []) if isinstance(item, str) and item.strip()]
            project_questions = [item.strip() for item in parsed.get("project_questions", []) if isinstance(item, str) and item.strip()]
            experience_questions = [item.strip() for item in parsed.get("experience_questions", []) if isinstance(item, str) and item.strip()]
            if skill_questions and basics and project_questions:
                return {"skill_questions": skill_questions[:15], "basic_questions": basics[:12], "project_questions": project_questions[:30], "experience_questions": experience_questions[:9], "resume_facts": facts, "generation_mode": "AI personalized"}
        except Exception:
            pass

    return {**_fallback_questions(facts), "resume_facts": facts, "generation_mode": "resume-based"}

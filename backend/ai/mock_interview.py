import json
import os

from ai.interview import _resume_facts


MAX_ANSWERS = 6


def _fallback_turn(resume_text: str, history: list[dict], answer: str) -> dict:
    facts = _resume_facts(resume_text)
    answers_so_far = sum(item.get("role") == "user" for item in history) + (1 if answer else 0)
    if not answer:
        if facts["projects"]:
            question = f"Your CV mentions {facts['projects'][0][:150]}. Could you walk me through the problem it addressed and your role in the project?"
        elif facts["experience"]:
            question = f"Your CV mentions {facts['experience'][0][:150]}. What was your main contribution in that role or internship?"
        elif facts["skills"]:
            question = f"Your CV lists {', '.join(facts['skills'][:3])}. Which of these skills are you strongest in, and can you give an example of using it?"
        else:
            question = "To start, could you briefly introduce yourself and describe the experience most relevant to the role you want?"
        return {"feedback": "", "next_question": question, "complete": False, "generation_mode": "resume-based"}

    if answers_so_far >= MAX_ANSWERS:
        return {"feedback": "Thanks for completing the mock interview. Review your examples and practice adding clear details about your actions and results.", "next_question": "", "complete": True, "generation_mode": "resume-based"}

    response_feedback = "Thanks for your answer. In a real interview, make your response stronger by explaining your specific actions and the result."
    next_index = answers_so_far
    if facts["projects"] and next_index <= len(facts["projects"]):
        project = facts["projects"][min(next_index - 1, len(facts["projects"]) - 1)][:120]
        question = f"For the project entry “{project}”, what was the most difficult technical or practical challenge, and how did you resolve it?"
    elif facts["skills"] and next_index <= len(facts["projects"]) + len(facts["skills"]):
        skill_index = (next_index - len(facts["projects"]) - 1) % len(facts["skills"])
        skill = facts["skills"][skill_index]
        question = f"Your CV lists {skill}. How have you used it to solve a problem, and what was the outcome?"
    elif facts["experience"]:
        experience = facts["experience"][(next_index - 1) % len(facts["experience"])][:120]
        question = f"Thinking about “{experience}”, how did you collaborate with others or respond to feedback?"
    else:
        question = "Tell me about a challenging situation you faced while learning or working. How did you approach it, and what did you learn?"
    return {"feedback": response_feedback, "next_question": question, "complete": False, "generation_mode": "resume-based"}


def generate_mock_turn(resume_text: str, history: list[dict], answer: str) -> dict:
    answers_so_far = sum(item.get("role") == "user" for item in history) + (1 if answer else 0)
    if answers_so_far > MAX_ANSWERS:
        return {
            "feedback": "This mock interview has reached its six-answer limit. Restart to practice again.",
            "next_question": "",
            "complete": True,
            "generation_mode": "resume-based",
        }

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return _fallback_turn(resume_text, history, answer)

    try:
        from groq import Groq
        messages = [{
            "role": "system",
            "content": (
                "You are a friendly, realistic job interviewer conducting a mock interview based on the candidate's CV. "
                "Ask exactly one concise question per turn. Ground tailored questions only in the supplied CV; never invent details. "
                "After an answer, give brief, constructive feedback (one or two sentences) on clarity, evidence, and specificity, then ask the next question. "
                f"Cover relevant CV skills, projects, work or internship experience, and behavioral topics. Conduct at most {MAX_ANSWERS} candidate-answer turns. "
                "The first call has no answer: greet briefly in feedback and ask the opening CV-based question. "
                "When the candidate has completed six answers, give a short closing feedback, set complete=true and next_question to an empty string. "
                "Return only valid JSON with keys feedback (string), next_question (string), complete (boolean)."
            ),
        }, {
            "role": "user",
            "content": "Candidate CV (use only these details for personalized questions):\n" + resume_text[:12000],
        }]
        messages.extend(history[-12:])
        if answer:
            messages.append({"role": "user", "content": "Candidate's latest answer:\n" + answer[:5000] + "\nGive feedback and ask the next question."})
        else:
            messages.append({"role": "user", "content": "Start the mock interview with one question based on this CV."})
        response = Groq(api_key=api_key).chat.completions.create(
            model=os.getenv("GROQ_MODEL", "openai/gpt-oss-20b"),
            messages=messages,
            temperature=0.5,
            max_completion_tokens=700,
        )
        body = response.choices[0].message.content or ""
        start, end = body.find("{"), body.rfind("}")
        result = json.loads(body[start:end + 1])
        if not isinstance(result.get("feedback"), str) or not isinstance(result.get("next_question"), str):
            raise ValueError("Invalid mock interview response")
        if answer and answers_so_far >= MAX_ANSWERS:
            result["complete"] = True
            result["next_question"] = ""
            if not result["feedback"].strip():
                result["feedback"] = "Thanks for completing the mock interview. Review your examples and practice adding clear details about your actions and results."
        else:
            result["complete"] = bool(result.get("complete"))
        result["generation_mode"] = "AI mock interview"
        return result
    except Exception:
        return _fallback_turn(resume_text, history, answer)

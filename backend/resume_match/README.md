# Resume match feature

The ATS Checker sends a multipart `POST /resume-match/analyze` request with a `resume` file and `job_description` text. Supported resume formats are text based PDF, DOCX, and TXT; uploads are limited to 5 MB. Reports are stored in the existing SQLAlchemy database using the `resume_match_reports` table.

The backend uses `DATABASE_URL` for storage. Set it in `backend/.env` to a PostgreSQL connection string, for example:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/careerforge
```

Redis caching and per-client rate limiting are enabled when `REDIS_URL` is configured. AI suggestions use the configured `GROQ_API_KEY` and optional `GROQ_MODEL`; when the key is unavailable, the analyzer returns grounded rule-based suggestions. Install `backend/req.txt` to enable PDF parsing, Redis, and multipart uploads.

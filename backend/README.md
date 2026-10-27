# Backend configuration

Create `backend/.env` with a strong, private `JWT_SECRET_KEY` before using login. For example, generate one with:

```powershell
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

Store the generated value as `JWT_SECRET_KEY=...`. Do not commit `.env` or share this key. Existing access tokens expire after 60 minutes; users must sign in again after expiry.

AI chat, interview preparation, resume matching, and `/profile` require `Authorization: Bearer <access_token>`. Registration and login remain public. User listing is not exposed.

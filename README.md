# Organic Farming AI Assistant
Next.js 14 + TypeScript + Tailwind. No database, no OTP. Browser data lives in localStorage.
## Run
```
npm install
cp .env.example .env.local   # optional
npm run dev                  # http://localhost:3000
```
## AI
- No `ANTHROPIC_API_KEY`: assistant runs in **labelled demo mode** (prewritten answers from `src/data/content.json`).
- With a key (server-side only, `.env.local`): `/api/chat` calls the provider with a scope-restricting system prompt. Scope is also checked on the server (`src/lib/scope.ts`) and out-of-scope questions get the fixed refusal message.
## Notes
- Login/signup is a browser-only demo (salted SHA-256 hash, not production auth).
- Content in `src/data/content.json` is short example material; extend it, and have it reviewed by agronomists.
- Telugu: UI, navigation and guide titles are translated; guide body text is English. Romanized Telugu is recognised by the assistant's topic filter.
## Deploy on Render
Web Service · Build: `npm install && npm run build` · Start: `npm start` · Env: `NODE_VERSION=20` (optional `ANTHROPIC_API_KEY`, `AI_MODEL`). `package.json` must be at the repo root (or set Root Directory).

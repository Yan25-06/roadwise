# Rules for AI agents working on RoadWise

## Project
RoadWise turns HCMC road-closure notices into structured traffic rules. The LLM only extracts draft rules; an admin approves them; the routing engine (GraphHopper) computes routes from approved rules. Never let LLM output affect routing without approval.

## Stack
TypeScript (strict), Node.js 22, React + Leaflet (planned), PostgreSQL/PostGIS (planned), GraphHopper, Gemini API.

## Commands
- `npm run check` — lint, format, typecheck and tests. Run it before saying a task is done.
- `npm test` — Vitest.

## Conventions
- Code in `src/`, tests next to the code as `*.test.ts`.
- Every rule-related change needs a test: direction, vehicle type, exceptions, effective time.
- Dates are stored with time zone; HCMC local time is UTC+7.
- Error responses keep the shape `{ "error", "message" }`.

## Boundaries
- Never commit secrets. API keys go in `.env` (see `.env.example`).
- Do not send user data to the model; only public notice text.
- Do not add dependencies or change CI without saying why in the PR.
- Record AI-assisted work in `AI-LOG.md`.

# RoadWise — Road Closure Notices to Verified Route Guidance

**Team:** 23127303 Hồ Tấn Quốc · 23127499 Lê Huy Toàn · 23127510 Phùng Ngọc Tuấn
**Repository:** <REPO_LINK>

## 1. Problem and users

Minh is a student who rides a motorbike from Thủ Đức to the city centre at 7 a.m. When a street on his route is closed for Metro Line 2 works, made one-way, or blocked for an event, he finds out at the barrier. **Problem: commuters cannot ask "can I still take this road, in this direction, on this vehicle, at this time?" when a closure is first announced.** Today Minh scrolls Facebook groups, reads long notices from the police or the city press centre, or looks at a static diagram in a news article. Google Maps often shows the change days later, and a diagram cannot be routed through.

RoadWise turns those public notices into verified road rules on a map and computes routes that avoid them.

## 2. The LLM feature and the cost of being wrong

**Feature: notice-to-rule extraction.** An admin pastes a notice URL or text. The LLM returns a structured draft rule: street, segment boundaries (from intersection X to Y), restricted direction, vehicle types, exceptions (e.g. buses allowed both ways), start and end time, and the officially suggested detour. Each field links back to the sentence it came from; missing or ambiguous fields are flagged, not guessed. The LLM never computes routes — GraphHopper does, using only approved rules.

**Cost of being wrong**, for the commuter who follows our route:
- *Reversed direction:* the route sends a motorbike the wrong way down a one-way segment — a fine of 4–6 million VND under Decree 168/2024 and a safety risk. **Cannot be undone.**
- *Wrong vehicle type* (a car-only ban applied to motorbikes): the user detours 2–3 km for nothing. Annoying, **recoverable**.
- *Wrong end time:* a closure stays active after it ends, or ends early and routes users into the barrier.

**Where we stop it.** One human gate: an admin must approve a rule before it is activated, because activation is the step that affects every user's route and cannot be undone once they act on it. No gate elsewhere: a draft affects nobody; routing is deterministic and checked automatically; expired rules switch off by time. Automatic guardrails: output must pass a JSON schema; a draft with any flagged field cannot be approved until edited; after activation, a route checker rejects any route that crosses an active rule.

**How we know it is wrong.** An eval set of 40 notices labelled by hand (roadworks, events, long-term reorganisation). Targets: direction and vehicle type correct in ≥ 95% of rules, all ambiguous notices flagged, zero returned routes crossing an active rule.

**Data sent outside.** Only the public notice text goes to the model provider. No user data, location history or accounts are sent, so Google's right to use free-tier inputs to improve its products is acceptable.

## 3. Scope

**In:** central Ho Chi Minh City (wards of the former Districts 1, 3 and 10); notices from 4 sources (HCMC Police, HCMC Press Centre, VnExpress, Tuổi Trẻ), submitted by an admin; LLM extraction to draft rules; admin login and review dashboard (edit, approve, reject, deactivate, history); map of active rules with source link; A→B route search by motorbike or car that respects segment, direction, vehicle and time rules; automatic expiry; deployment.

**Out:** natural-language route questions or any chatbot; automatic crawling of all news sites; reading diagram images; live traffic, congestion or GPS turn-by-turn navigation; coverage outside the chosen area; publishing any rule without admin approval.

## 4. Plan and ownership

The six milestones follow the course calendar; the final build is due 20/12/2026 and the oral is on 24/12/2026. Each milestone has one lead; everyone works in parallel on their own area.
Areas: **Quốc** — backend API, database and LLM extraction. **Toàn** — frontend (map UI, route search, admin dashboard), CI and deployment. **Tuấn** — map data, routing and route checker.

| Milestone | Assigned → due | Lead | Deliverable |
|---|---|---|---|
| PA#1 Proposal | 16/10 → 22/10 | Toàn | This proposal. Quốc: 20 hand-labelled notices. Tuấn: GraphHopper proof of concept blocking one direction of Cách Mạng Tháng Tám for cars. Toàn: repository skeleton. |
| PA#2 Harness | 13/11 → 19/11 | Toàn | Convention files, lint, type check, CI that blocks merges, one Playwright test. Quốc: contract tests for the rules API and schema-validation tests for extraction. Tuấn: route-checker unit tests. |
| PA#3 LLM prototype | 27/11 → 03/12 | Quốc | Notice → draft rule → admin approval → route avoiding it, end to end with guardrails. Quốc: extraction and rules API. Tuấn: routing with approved rules. Toàn: admin dashboard, login and map display. |
| PA#4 Evals and gate | 04/12 → 10/12 | Quốc | Eval run on 40 notices against the targets; response to the other team's red-team report. Tuấn: route-violation tests. Toàn: approval audit view and flagged-field UI. |
| PA#5 Final and ops | 11/12 → 20/12 | Tuấn | Final build; metrics for route violations; one incident post-mortem. Quốc: logs and metrics for model calls (tokens, latency, failures). Toàn: deployment and dashboards. |
| PA#6 Oral | 24/12 | each | Each member explains their own area and one other area's decisions. |

## 5. Risks

1. **A notice cannot be mapped to exact road segments.** "Cách Mạng Tháng Tám from Lý Thường Kiệt to 3 Tháng 2" must become specific OSM edges and a direction. *This week:* Quốc and Tuấn map the 20 labelled notices by hand; anything that cannot be mapped narrows the supported rule types before we build on them.
2. **GraphHopper cannot enforce our rules**, especially by direction or time window. *This week:* Tuấn's proof of concept blocks one real segment for cars only and checks that motorbike routes still use it. If time windows fail, the backend activates and deactivates rules on schedule instead.

## 6. Technology choices

- **React + TypeScript:** one codebase for the map, route search and admin dashboard; the team already uses it.
- **Leaflet + OpenStreetMap:** free map tiles and road data that our routing engine reads directly.
- **GraphHopper (self-hosted, OSM extract of HCMC):** custom models can block edges by vehicle type; free, and the city extract runs on a small VM.
- **Node.js + PostgreSQL/PostGIS:** rules are stored as geometries and matched to road segments with spatial queries.
- **Gemini 3.8 Flash (`gemini-3.8-flash`):** structured JSON output and good Vietnamese reading. Free tier for development; evals run on the paid tier ($0.75 input / $3.75 output per 1M tokens until 31/12/2026). About 3k input + 1k output tokens per notice ≈ $0.006, so 40 notices × 20 eval runs ≈ $5. Fallback: `gemini-3.5-flash-lite` ($0.30 / $2.50).
- **Docker + one cloud VM:** the same image runs locally and in deployment.

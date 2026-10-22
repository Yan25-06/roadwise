# RoadWise

Turns public road-closure notices in Ho Chi Minh City into verified road rules on a map, and computes routes that avoid them.

An LLM extracts a draft rule from each notice (segment, direction, vehicle types, effective time). An admin approves it before it becomes active. GraphHopper computes routes using approved rules only.

**Course:** CSC13114 Advanced Web Application Development, HCMUS, HK1 2026–2027.

## Team

| Student ID | Name | Area |
|---|---|---|
| 23127303 | Hồ Tấn Quốc | Backend API, database, LLM extraction |
| 23127499 | Lê Huy Toàn | Frontend, CI, deployment |
| 23127510 | Phùng Ngọc Tuấn | Map data, routing, route checker |

## Documents

- [Proposal (PA#1)](docs/proposal.md)
- [AI-LOG.md](AI-LOG.md)
- [Rules for AI agents](CLAUDE.md)

## Development

Requires Node.js 22.

```sh
npm ci
npm run check   # lint, format, typecheck, tests — the same gates as CI
```

CI runs on every push to `main` and every pull request; a red check blocks the merge.

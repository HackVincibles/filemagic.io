# Project development log (industry-style)

## Phase 1 — Data model

- Designed normalized MySQL schema: `subscription_plans`, `users`, `stored_files`, `file_history`, `usage_daily`, `payments`, `refresh_tokens`.
- Indexed foreign keys and `usage_daily (usage_date, subject_key)` for idempotent upserts.

## Phase 2 — Processing engine (isolated JAR)

- Implemented `file-processing-engine` with packages: `compression.huffman`, `compression.lz77`, `compression.rle`, `conversion.text`, `core`, `io`.
- No ZIP/Deflate libraries; formats identified by magic bytes `FMH1`, `FML1`, `FMR1`.

## Phase 3 — Backend API

- Spring Boot 3.2, JDBC `JdbcTemplate`, layered **controller → service → repository**.
- JWT for users; guest cookie + SHA-256 fingerprint for anonymous quotas.
- Bucket4j rate limiting filter in **middleware** package.
- Global exception handler for consistent JSON errors.

## Phase 4 — Frontend

- Vite + React + Tailwind; PDFgear-inspired layout with a distinct sage/plum palette.
- XHR-based upload/download progress; lazy route loading; SEO meta in `index.html`.

## Phase 5 — DevOps

- Multi-module Maven root; Docker Compose for MySQL + API; Dockerfile multi-stage build.
- Docs: architecture, algorithms, API, setup.

## Next steps (backlog)

- Razorpay webhooks; premium file history persistence to `stored_files`; S3 storage; async job queue.

## Current sprint (in progress)

- Add `Resources` page and nav link, plus route `/resources`.
- Enforce `AUTO` compression in frontend and push algorithm selection to backend heuristics.
- Add progress tracking and UX consistency improvements in upload page.
- Provide step-by-step runtime design notes in docs and README.

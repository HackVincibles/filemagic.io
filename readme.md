# filemagic.io

A full-stack file utility platform (compress, decompress, convert) with a **custom Java processing engine** (no ZIP/Deflate libraries for core compression), a **Spring Boot** API, **MySQL**, and a **React + Vite + Tailwind** frontend. UI patterns are inspired by [PDFgear](https://www.pdfgear.com/) — clear hero, tool grid, and trust sections — with a softer sage/plum palette and subtle motion.

## Repository layout

```
file-compressor-platform-project/
├── frontend/                 # React SPA (pages, components, services, styles)
├── backend/                  # Spring Boot API (controller, service, repository, security, middleware)
├── file-processing-engine/   # Huffman, LZ77, RLE, text conversion, core facades
├── database/                 # schema.sql, seed.sql, migrations/
├── infra/                    # Docker, nginx notes, AWS outline
├── docs/                     # architecture, API, algorithms, setup, dev log
├── scripts/                  # build.sh, start.ps1
├── pom.xml                   # Multi-module Maven root
└── docker-compose.yml
```

## Features (current)

- **Guest** processing with HttpOnly cookie + daily limits; **JWT** for registered users.
- **Compression**: `HUFFMAN`, `LZ77`, `RLE`, or `AUTO` (heuristic).
- **Decompression**: auto-detect `FMH1` / `FML1` / `FMR1`.
- **Conversion**: UTF-8 ↔ UTF-16 BE, line endings, CSV→TSV (text paths).
- **Rate limiting** (per IP), **CORS**, **usage tracking** in `usage_daily`.
- **Frontend**: upload + download progress (XHR), lazy routes, SEO meta tags.

## HTML vs XML in this repo

- **Frontend:** the app shell is **`frontend/index.html`** (standard **HTML5**). React components use **JSX** (HTML-like syntax). There is no XML frontend format.
- **Backend:** Maven build files are **`pom.xml`** (XML). That is normal for Java and does not affect the website markup.

## Quick start — run the full project

**Prerequisites:** JDK 17, Maven, Node 18+. **MySQL is optional** for local demos.

### API without MySQL (embedded H2)

Plans, auth, and file limits work against an **in-memory H2** database:

```bash
mvn clean package -DskipTests
java -jar backend/target/filemagic-api-0.1.0-SNAPSHOT.jar --spring.profiles.active=embedded
```

Then open the frontend and **Pricing** (`/api/plans`) loads from the DB. No MySQL install required.

### API with MySQL (production-style)

1. Run `database/schema.sql` in MySQL and create a user/password matching `backend` config.
2. From repo root:
   ```bash
   mvn clean package -DskipTests
   java -jar backend/target/filemagic-api-0.1.0-SNAPSHOT.jar
   ```
   Set environment variables: `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, `JWT_SECRET` (32+ characters).

If MySQL is down, the API still **falls back to embedded plan data** in memory so `GET /api/plans` returns the four tiers (but JDBC-dependent features may fail until the DB is up).
3. **Frontend** — in another terminal:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Opens **http://localhost:5173** — Vite proxies `/api` to **http://localhost:8080**, so login, register, and file tools call the backend automatically.

**Frontend only (UI + static pages, API calls fail until backend runs):** `cd frontend && npm install && npm run dev` — browse Home, Upload, Pricing; file processing needs the API.

**Routes:** `/` landing, **`/upload` file tools**, `/login`, `/register`, `/dashboard`, `/pricing`.

See [docs/setup-guide.md](docs/setup-guide.md) and [docs/PROJECT_DEVELOPMENT_LOG.md](docs/PROJECT_DEVELOPMENT_LOG.md).

## Docker

```bash
docker compose up --build
```

MySQL loads `database/schema.sql` on first init. API listens on **8080**. Run the Vite dev server locally for the UI, or build `frontend/dist` and serve behind nginx (see `infra/nginx/README.md`).

## Cloud & payments integration (premium roadmap)

- AWS S3 (or compatible storage):
  1. Add Spring `FileStorageService` using `AmazonS3` SDK.
  2. In `FileProcessingService`, on premium plans save processed data to S3 and persist metadata in `stored_files` + `file_history`.
  3. Use lifecycle policy to auto-delete in 7/15 days by plan (or implement scheduled purge job in Spring).
  4. Add signed URL endpoint `GET /api/files/history/{id}/download` returning `presignedUrl`.

- Razorpay:
  1. Backend endpoint `POST /api/payments/create-order` generates order and returns `orderId`.
  2. Frontend checkout widget interacts with Razorpay SDK and posts success webhook to `POST /api/payments/webhook`.
  3. On webhook verify signature, update `payments` table and set `users.subscription_plan_id`.
  4. Guard premium endpoints with `PlanResolutionService`.

- MySQL connection troubleshoot:
  - Ensure `DB_URL` in `application.yml`/env includes `jdbc:mysql://.../filemagic?useSSL=false`.
  - Run `database/schema.sql` to create schema before the first API startup.
  - Check `backend/src/main/resources/application.yml` for `spring.datasource.*` values.

## Tech stack

| Area | Stack |
|------|--------|
| UI | React 18, Vite 5, Tailwind 3, React Router 6, Axios |
| API | Spring Boot 3.2, JDBC, Spring Security, JJWT, Bucket4j |
| Engine | Java 17, custom codecs |
| DB | MySQL 8 |

## License

Proprietary — adjust for your product.

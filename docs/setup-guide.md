# Setup

## Prerequisites

- JDK 17+, Maven 3.9+
- Node 20+ (for frontend)
- MySQL 8+

## Database

```bash
mysql -u root -p < database/schema.sql
```

Or use Docker Compose (schema mounts into MySQL init).

## Backend

```bash
export MYSQL_HOST=localhost
export MYSQL_USER=filemagic
export MYSQL_PASSWORD=filemagic
export MYSQL_DATABASE=filemagic
export JWT_SECRET="your-32+char-secret"
mvn -f pom.xml clean package -DskipTests
java -jar backend/target/filemagic-api-0.1.0-SNAPSHOT.jar
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite proxies `/api` to `http://localhost:8080` — leave `VITE_API_URL` empty in dev.

## Docker

```bash
docker compose up --build
```

API on `:8080`, MySQL on `:3306`. Run the frontend locally with `npm run dev` and point the proxy at the container.

## Tailwind

Configured in `frontend/tailwind.config.js` and `postcss.config.js`; entry CSS is `src/styles/main.css`.

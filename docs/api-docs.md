# API (v0.1)

Base URL: `http://localhost:8080` (dev) or your deployed host.

## Health

- `GET /api/health` — `{ "status": "UP", "service": "filemagic-api" }`

## Plans

- `GET /api/plans` — list subscription tiers (JSON array).

## Auth

- `POST /api/auth/register` — body `{ "email", "password", "displayName?" }` → `{ ok, accessToken, tokenType }`
- `POST /api/auth/login` — body `{ "email", "password" }` → same shape.

Use `Authorization: Bearer <accessToken>` for authenticated routes.

## File processing

- `POST /api/files/process` — `multipart/form-data`
  - `file` (required)
  - `operation`: `COMPRESS` | `DECOMPRESS` | `CONVERT`
  - `compressionAlgorithm` (optional, compress only): `AUTO` | `HUFFMAN` | `LZ77` | `RLE`
  - `conversionMode` (required for CONVERT): e.g. `UTF8_TO_UTF16BE`, `LINE_CRLF`, `CSV_TO_TSV`

Response: binary file download with `Content-Disposition`.

Guest cookie `fm_guest` is set for anonymous quota tracking (`credentials` required on the client).

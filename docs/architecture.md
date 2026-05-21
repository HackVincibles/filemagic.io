# Architecture

## Layers

| Layer | Responsibility |
|--------|----------------|
| **frontend** | React SPA, upload/download progress (XHR), JWT in `sessionStorage`, guest cookies via `withCredentials`. |
| **backend** | Spring Boot REST, JDBC, JWT + guest identity, rate limiting (Bucket4j), usage quotas. |
| **file-processing-engine** | Pure Java: Huffman, LZ77, RLE, text transcoding, format detection. |
| **database** | MySQL — users, plans, usage_daily, payments, file metadata (history ready). |

## Request flow (process file)

1. `RateLimitFilter` (IP bucket) → `JwtAuthenticationFilter` (optional Bearer) → `FileController`.
2. `GuestIdentityService` issues HttpOnly `fm_guest` cookie; fingerprint `g:sha256…` for `usage_daily`.
3. `PlanResolutionService` picks GUEST vs user plan; `UsageLimitService` checks daily cap.
4. `FileProcessingService` calls `CompressionEngine` / `TextTranscoder` from the engine module.
5. Binary response streamed to client; usage incremented on success.

## Future scaling

- Queue (Kafka/RabbitMQ) for long jobs; chunk uploads; S3-backed storage; separate worker pods consuming the same `file-processing-engine` JAR.

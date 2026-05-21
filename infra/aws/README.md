# AWS deployment (outline)

- **EC2**: Run Docker Compose or Kubernetes workers; attach IAM role for S3/RDS.
- **RDS**: MySQL 8 — point `MYSQL_HOST` / credentials via Secrets Manager.
- **S3**: Store `stored_files` payloads instead of local disk (replace `FileWriterUtil` paths with S3 SDK in a future iteration).
- **ALB**: TLS termination, health checks on `/api/health`.
- **CloudFront**: CDN for static frontend (Vercel is an alternative as requested).

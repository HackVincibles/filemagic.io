# Nginx (production)

Serve the Vite `frontend/dist` static bundle behind HTTPS and proxy `/api` to the Spring Boot service.

Example location blocks:

- `location /api/` → `proxy_pass http://127.0.0.1:8080/;`
- `location /` → `root` to static files, `try_files $uri /index.html` for SPA routing.

Enable `client_max_body_size` to match your max upload setting.

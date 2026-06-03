# Deployment Readiness Checklist

## 1. Required Environment Variables

### Frontend
- `REACT_APP_API_URL` — public backend API URL, e.g. `https://api.example.com`

### Backend
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — strong random JWT signing secret
- `JWT_EXPIRES_IN` — token expiration time, e.g. `1h`
- `REDIS_URL` — Redis connection string
- `S3_ENDPOINT` — MinIO/S3 endpoint URL
- `S3_ACCESS_KEY` — object storage access key
- `S3_SECRET_KEY` — object storage secret key
- `S3_BUCKET` — object storage bucket name
- `CORS_ORIGIN` — frontend origin allowed by CORS
- `PORT` — backend listen port
- `NODE_ENV=production`

## 2. Backend Production Readiness

- `backend/Dockerfile` now uses a build stage and prunes dev dependencies.
- `backend/docker-compose.prod.yml` includes persistent volumes for Postgres, Redis, MinIO, and upload storage.
- `backend/.env.example` now uses production-safe placeholder values and includes `CORS_ORIGIN`.
- `backend/package.json` now includes `prisma:migrate:prod` for production migrations.
- Socket.IO CORS origin is now controlled by `CORS_ORIGIN`.
- Frontend socket client now allows fallback transports for proxy-friendly real-time connectivity.

## 3. Deployment Steps

### Backend
1. Create `backend/.env` from `backend/.env.example`.
2. Set production values and keep secrets out of source control.
3. Build and run:
   ```bash
   cd "d:\ai project\pa-ground\backend"
   docker compose -f docker-compose.prod.yml up -d --build
   ```
4. Run production migrations:
   ```bash
   cd "d:\ai project\pa-ground\backend"
   npx prisma migrate deploy
   ```
5. Verify app health:
   ```bash
   curl http://localhost:4000/api/health
   ```

### Frontend
1. Create `.env.production` or use environment variables in the build environment.
   - `REACT_APP_API_URL=https://api.example.com`
2. Build the frontend:
   ```bash
   cd "d:\ai project\pa-ground"
   npm install
   npm run build
   ```
3. Deploy the `build` folder to static hosting or serve it behind your reverse proxy.

## 4. Reverse Proxy and WebSocket Notes

- Ensure the reverse proxy forwards WebSocket upgrades:
  - `proxy_set_header Upgrade $http_upgrade;`
  - `proxy_set_header Connection "Upgrade";`
- Use the same `CORS_ORIGIN` value that the browser frontend uses.
- Socket.IO client is now configured for compatibility with proxies.

## 5. Known Production Risks

- Uploads are still stored on the backend container filesystem and require a persistent volume.
- The current backend upload controller does not yet implement MinIO/S3 storage.
- `backend/docker-compose.yml` is development-focused; use `backend/docker-compose.prod.yml` for production.
- `backend/README.md` and `backend/SETUP.md` still describe dev migrations and should be updated before launch.

## 6. Rollback Plan

1. If deployment fails, roll back to the last known working backend image.
2. Restore the previous database migration state if necessary from backup.
3. Revert the frontend static host to the prior build.
4. Validate API, auth, and socket behavior after rollback.

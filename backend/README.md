# PA Ground - Backend

This folder contains the Express + TypeScript backend for the PA Ground project.

Quick start (local):

1. Copy `.env.example` to `.env` and adjust values.
2. Start dependencies with Docker Compose:

```bash
docker compose up -d postgres redis minio
```

3. Install dependencies and start in dev mode:

```bash
npm install
npm run dev
```

Prisma:

```bash
npm run prisma:generate
npm run prisma:migrate
```

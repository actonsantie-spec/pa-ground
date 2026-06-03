# Backend Setup Instructions

## Prerequisites

Before proceeding, ensure you have:
- Docker Desktop or Docker Engine installed and running
- Node.js 18+ installed locally
- npm 8+ installed locally

## Setup Progress

✅ **Completed:**
- npm install (550 packages)
- TypeScript compilation (zero errors)
- Prisma schema validation
- Prisma client generated
- .env file created

⏳ **Next Steps:**

### Step 1: Start Docker Services

Start PostgreSQL, Redis, and MinIO:

```bash
cd "d:\ai project\pa-ground\backend"
docker compose up -d postgres redis minio
```

Verify services are running:
```bash
docker compose ps
```

Expected output should show postgres, redis, and minio in "Up" status.

### Step 2: Run Prisma Migrations

Once PostgreSQL is running, apply the schema:

```bash
cd "d:\ai project\pa-ground\backend"
npx prisma migrate dev --name init
```

This will:
- Create all database tables
- Run the Prisma Client generator
- Output migration summary

### Step 3: Seed the Database

Populate sample data:

```bash
cd "d:\ai project\pa-ground\backend"
npx ts-node prisma/seed.ts
```

Expected output: "Seeding completed"

This creates:
- 1 admin user (admin@example.com / adminpass)
- 1 seller user (seller@example.com / sellerpass)
- 1 buyer user (buyer@example.com / buyerpass)
- 1 seller business (Tech Hub Malawi)
- 2 sample products
- 1 sample order with 2 tracking checkpoints

### Step 4: Start Development Server

```bash
cd "d:\ai project\pa-ground\backend"
npm run dev
```

Expected output:
```
Server listening on port 4000
```

### Step 5: Verify Backend is Running

Open in browser or curl:

```bash
# Health check
curl http://localhost:4000/api/health

# Expected response:
# {"status":"ok","env":"development"}
```

Access Swagger UI:
```
http://localhost:4000/docs
```

## Testing Endpoints

### 1. Register User
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"testpass123","role":"BUYER"}'
```

### 2. Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"buyer@example.com","password":"buyerpass"}'
```

Capture the returned `token` for next requests.

### 3. Get Current User (Authenticated)
```bash
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. List Products
```bash
curl http://localhost:4000/api/products
```

### 5. Get Orders
```bash
curl http://localhost:4000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Get Order Tracking
```bash
# Use order ID from seeded data or from orders list
curl http://localhost:4000/api/orders/{orderId}/track \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 7. Upload Profile Picture
```bash
curl -X POST http://localhost:4000/api/uploads/profile-picture \
  -F "file=@/path/to/image.jpg" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 8. Get Admin Stats
```bash
curl "http://localhost:4000/api/admin/stats?range=30days" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

## Troubleshooting

### Docker services won't start
- Ensure Docker Desktop is running
- Check if ports 5432, 6379, 9000 are already in use
- Run `docker compose down` then `docker compose up -d`

### Prisma migration fails
- Verify DATABASE_URL is set in .env
- Verify PostgreSQL is running: `docker compose logs postgres`
- Check for connection errors in logs

### Seed fails
- Ensure migrations have completed first
- Check PostgreSQL is accessible
- Run `npx prisma db push` if migration not applied

### Server won't start
- Check port 4000 is not in use
- Verify .env file exists with all required variables
- Check for TypeScript compilation errors: `npm run build`

## Production Build

To create a production build:

```bash
npm run build
npm start
```

This compiles TypeScript to `dist/` and runs the compiled JavaScript.

## Next: Frontend Integration

After the backend is running successfully:

1. Update frontend API endpoints to use `http://localhost:4000`
2. Wire frontend components to backend endpoints
3. Remove mock data from frontend components
4. Test full flow end-to-end

See [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md) for detailed frontend wiring instructions.

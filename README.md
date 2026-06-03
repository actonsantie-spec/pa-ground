# PA Ground

## Project overview

PA Ground is a Malawi-focused marketplace application with buyer, seller, and admin portals. It pairs a React frontend with an Express + TypeScript backend, Prisma ORM, PostgreSQL, Redis, and Socket.IO for real-time order tracking.

## Features

### Buyer functionality

- Browse products and sellers across categories
- View product details, add items to cart, and checkout
- Place orders and track order status in real time
- Access buyer dashboard, profile, and order history
- Browse seller directory and search products

### Seller functionality

- Register as a seller and manage seller profile
- Create, edit, and list products
- View seller dashboard and order management
- Manage active orders and monitor status updates

### Admin functionality

- Admin dashboard with access control
- Seller approval and seller management pages
- Order management and listing moderation
- Category management, payment methods, statistics, and reports

### Real-time order tracking

- Socket.IO integration for live order checkpoint updates
- Buyers receive order status changes without page refresh
- Backend authorizes socket connections and order room subscriptions

## Technology stack

- React (frontend)
- Express (backend)
- TypeScript (backend)
- Prisma (ORM)
- PostgreSQL (database)
- Redis (cache/session support)
- Socket.IO (real-time events)

## Local development setup

### Frontend

```bash
cd "d:\ai project\pa-ground"
npm install
npm start
```

The React app runs on `http://localhost:3000` and proxies API requests to the backend.

### Backend

```bash
cd "d:\ai project\pa-ground\backend"
npm install
npm run dev
```

The backend runs on `http://localhost:4000` by default.

## Environment variables

Create a `backend/.env` file based on `backend/.env.example`.

Required backend variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `REDIS_URL`
- `S3_ENDPOINT`
- `S3_ACCESS_KEY`
- `S3_SECRET_KEY`
- `S3_BUCKET`
- `PORT`
- `NODE_ENV`
- `CORS_ORIGIN`

Frontend environment example:

- `REACT_APP_API_URL=https://api.example.com`

## Database migrations

From `backend/`:

```bash
npm run prisma:generate
npm run prisma:migrate
```

For production migration deployment:

```bash
npm run prisma:migrate:prod
```

## Docker development setup

From `backend/`:

```bash
docker compose up -d postgres redis minio
```

This starts:

- PostgreSQL
- Redis
- MinIO

The backend service can then be run locally with `npm run dev`.

## Production deployment using docker-compose.prod.yml

From `backend/`:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

The production compose file uses these services:

- `postgres`
- `redis`
- `minio`
- `backend`

It also mounts persistent volumes for database, Redis, MinIO storage, and uploads.

## Common commands

- `npm install` — install frontend dependencies
- `npm run dev` — run backend in development mode
- `npm run build` — build frontend for production
- `npm run prisma:generate` — generate Prisma client
- `npm run prisma:migrate` — apply Prisma dev migrations
- `npm run prisma:migrate:prod` — deploy Prisma migrations in production

## Troubleshooting

- If the frontend cannot reach the backend, verify `REACT_APP_API_URL` and backend `CORS_ORIGIN` values.
- If migrations fail, confirm `DATABASE_URL` points to the correct PostgreSQL instance.
- If socket connections fail behind a proxy, ensure WebSocket upgrades are enabled and `CORS_ORIGIN` matches the frontend origin.
- If uploads are lost after container restart, make sure `uploads_data` volume is mounted in production compose.
- Use `docker compose ps` to confirm service status.

## Project structure overview

```text
.
├── backend                 # Express + TypeScript backend
│   ├── prisma              # Prisma schema and seed files
│   ├── src
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── routes
│   │   ├── sockets
│   │   └── utils
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   ├── package.json
│   └── .env.example
├── public                  # React public static assets
├── src                     # React frontend source
│   ├── api
│   ├── components
│   ├── contexts
│   └── socket
├── build                   # frontend production build output
├── package.json            # frontend dependencies and scripts
└── README.md
```

## Notes

- The current backend upload flow stores files in `backend/uploads` and requires persistence in production.
- Admin, seller, and buyer routes are protected using role-based routing in the frontend.
- Real-time order status updates are powered by Socket.IO with backend JWT authorization.

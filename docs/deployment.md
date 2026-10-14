# Deployment Guide

## Production Environment Variables

### Backend (`dilli_tour_backend/.env`)

```env
DATABASE_URL=mysql://dbuser:securepassword@production-mysql-host:3306/delhi_tourism
JWT_SECRET=your-strong-production-random-secret
JWT_EXPIRES_IN=7d
PORT=5000
FRONTEND_URL=https://delhitourism.example.com
NODE_ENV=production
```

### Frontend (`dilli_tour_frontend/.env.local` or host environment)

```env
NEXT_PUBLIC_API_URL=https://api.delhitourism.example.com/api/v1
NEXT_PUBLIC_MAP_PROVIDER=google
```

## Database Migrations

Apply pending database migrations safely on production:

```bash
cd dilli_tour_backend
npx prisma migrate deploy
```

## Backend Deployment (Node.js / Express)

Compatible with:
- Railway / Render / Fly.io
- AWS EC2 / ECS / App Runner
- DigitalOcean App Platform

Build & Start:
```bash
cd dilli_tour_backend
npm install --production
node src/server.js
```

## Frontend Deployment (Next.js)

Recommended platforms:
- Vercel (native support for Next.js 14 App Router)
- AWS Amplify / CloudFront
- Self-hosted Node.js / Docker

Build & Start:
```bash
cd dilli_tour_frontend
npm install
npm run build
npm start
```

## Docker Production Deployment

A production-ready `docker-compose.yml` is provided at the repository root:

```bash
docker compose up -d --build
```

Services started:
- `delhi_tourism_mysql` (MySQL 8.0 on port 3306)
- `delhi_tourism_backend` (Express API on port 5000)
- `delhi_tourism_frontend` (Next.js App on port 3000)

## Security & SSL / HTTPS

1. Terminate SSL using Nginx, Caddy, or your cloud provider's load balancer.
2. Ensure CORS `FRONTEND_URL` in backend matches the production domain.
3. Change default `SUPER_ADMIN` credentials (`admin@delhitourism.dev`).

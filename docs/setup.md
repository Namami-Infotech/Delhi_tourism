# Setup Guide

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MySQL >= 8.0

## Step-by-Step Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd delhi_tourism
```

### 2. Backend Setup

```bash
cd dilli_tour_backend
npm install
cp .env.example .env
# Edit .env with your MySQL credentials and JWT secret
```

### 3. Frontend Setup

```bash
cd ../dilli_tour_frontend
npm install
cp .env.example .env.local
# Edit .env.local with your API URL (default: http://localhost:5000/api/v1)
```

### 4. Create MySQL Database

```sql
CREATE DATABASE delhi_tourism CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. Run Prisma Migrations

```bash
cd dilli_tour_backend
npx prisma migrate dev --name init
```

### 6. Generate Prisma Client

```bash
npx prisma generate
```

### 7. Seed the Database

Populate categories, circuits, tourist places, itineraries, events, and banners:

```bash
npm run seed
```

### 8. Start Development Servers

Terminal 1 — Backend:
```bash
cd dilli_tour_backend
npm run dev
```

Terminal 2 — Frontend:
```bash
cd dilli_tour_frontend
npm run dev
```

### 9. Verify Setup

- Frontend: http://localhost:3000
- Backend Health: http://localhost:5000/api/health
- Admin Login: http://localhost:3000/admin/login

## Default Admin Credentials (Development Only)

- Email: `admin@delhitourism.dev`
- Password: `Admin@123`
- Role: `SUPER_ADMIN`

**Change these credentials immediately in any production environment.**

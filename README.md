# Delhi Tourism Platform

A modern, full-stack tourism platform dedicated to Delhi — built with Next.js, Node.js, Express, Prisma, and MySQL.

---

## Project Overview

The Delhi Tourism Platform allows visitors to:

- Discover Delhi's tourist destinations with high-resolution imagery and rich histories
- Explore curated tourism categories and circuits (Spiritual, Heritage, Cultural, Culinary, etc.)
- Read detailed stories, opening/closing hours, ticket rates, and contact details
- View media photo galleries attached to places, circuits, and events
- Find locations on interactive maps with coordinate markers
- Follow suggested multi-day and single-day itineraries
- Discover upcoming Delhi festivals, fairs, and cultural events
- Use fast global search across all content entities

It includes a complete **Admin CMS** for managing all content (Places, Categories, Circuits, Events, Itineraries, Media Galleries, Home Banners, and Team Members) without modifying frontend code.

---

## Technology Stack

| Layer     | Technology                              |
|-----------|----------------------------------------|
| Frontend  | Next.js 14 (App Router), React, Tailwind CSS, JavaScript |
| Backend   | Node.js, Express.js, JavaScript        |
| Database  | MySQL 8.0                              |
| ORM       | Prisma ORM                             |
| Auth      | JWT + bcrypt password hashing          |
| Security  | Helmet, CORS, Express-Validator, Rate Limiting |

---

## Folder Structure

```text
delhi-tourism/
│
├── dilli_tour_frontend/     # Next.js 14 application (App Router)
├── dilli_tour_backend/      # Node.js + Express API & Prisma ORM
├── docs/                    # 10 comprehensive architecture & setup guides
├── .gitignore
├── README.md
└── docker-compose.yml       # Production-ready multi-container configuration
```

---

## Requirements

- Node.js >= 18
- npm >= 9
- MySQL >= 8.0

---

## Installation

### 1. Clone the repository

```bash
git clone <repo-url>
cd delhi_tourism
```

### 2. Install backend dependencies

```bash
cd dilli_tour_backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../dilli_tour_frontend
npm install
```

---

## Environment Variables

### Backend (`dilli_tour_backend/.env`)

Copy from `dilli_tour_backend/.env.example`:

```bash
cp dilli_tour_backend/.env.example dilli_tour_backend/.env
```

Configuration:

```env
DATABASE_URL="mysql://delhi_user:delhi_password@localhost:3306/delhi_tourism"
JWT_SECRET="your_strong_jwt_secret_key"
JWT_EXPIRES_IN="7d"
PORT=5000
FRONTEND_URL="http://localhost:3000"
NODE_ENV="development"
```

### Frontend (`dilli_tour_frontend/.env.local`)

Copy from `dilli_tour_frontend/.env.example`:

```bash
cp dilli_tour_frontend/.env.example dilli_tour_frontend/.env.local
```

Configuration:

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
NEXT_PUBLIC_MAP_PROVIDER="google"
```

---

## Database Setup

### 1. Create MySQL database

```sql
CREATE DATABASE delhi_tourism CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Run Prisma migrations

```bash
cd dilli_tour_backend
npx prisma migrate dev --name init
```

### 3. Seed the database

Populate the database with rich initial categories, circuits, tourist places, itineraries, events, and banners:

```bash
npm run seed
```

---

## Running the Application

### Development

**Terminal 1 — Backend:**
```bash
cd dilli_tour_backend
npm run dev
```
Backend runs on: `http://localhost:5000` (Health check: `http://localhost:5000/api/health`)

**Terminal 2 — Frontend:**
```bash
cd dilli_tour_frontend
npm run dev
```
Frontend runs on: `http://localhost:3000`

### Admin CMS Access

- Admin URL: `http://localhost:3000/admin/login`
- Default email: `admin@delhitourism.dev`
- Default password: `Admin@123`

---

## Production Build & Verification

### Run Automated Tests (Backend)

```bash
cd dilli_tour_backend
npm test
```
*Current test suite: 61 passed, 0 failed.*

### Lint Frontend

```bash
cd dilli_tour_frontend
npm run lint
```
*0 warnings, 0 errors.*

### Production Build (Frontend)

```bash
cd dilli_tour_frontend
npm run build
npm start
```

---

## API Overview

Base URL: `/api/v1`

| Method | Endpoint                  | Description                          | Protection |
|--------|---------------------------|--------------------------------------|------------|
| GET    | `/home`                   | Aggregated homepage content          | Public     |
| GET    | `/categories`             | List all active categories           | Public     |
| GET    | `/categories/:slug`       | Category details and linked places   | Public     |
| POST   | `/categories`             | Create category                      | Admin      |
| PUT    | `/categories/:id`         | Update category                      | Admin      |
| DELETE | `/categories/:id`         | Deactivate category                  | Admin      |
| GET    | `/circuits`               | List curated tourism circuits        | Public     |
| GET    | `/circuits/:slug`         | Circuit details and places           | Public     |
| POST   | `/circuits`               | Create circuit                       | Admin      |
| PUT    | `/circuits/:id`           | Update circuit                       | Admin      |
| DELETE | `/circuits/:id`         | Deactivate circuit                   | Admin      |
| GET    | `/places`                 | Filter and search tourist places     | Public     |
| GET    | `/places/:slug`           | Tourist destination details          | Public     |
| POST   | `/places`                 | Create place                         | Admin      |
| PUT    | `/places/:id`             | Update place                         | Admin      |
| DELETE | `/places/:id`             | Soft delete / deactivate place       | Admin      |
| GET    | `/itineraries`            | List touring itineraries             | Public     |
| GET    | `/itineraries/:slug`      | Itinerary details and day-by-day stops | Public   |
| POST   | `/itineraries`            | Create itinerary with stops          | Admin      |
| PUT    | `/itineraries/:id`        | Update itinerary and stops           | Admin      |
| DELETE | `/itineraries/:id`        | Deactivate itinerary                 | Admin      |
| GET    | `/events`                 | List upcoming events & festivals     | Public     |
| GET    | `/events/:slug`           | Event details                        | Public     |
| POST   | `/events`                 | Create event                         | Admin      |
| PUT    | `/events/:id`             | Update event                         | Admin      |
| DELETE | `/events/:id`             | Deactivate event                     | Admin      |
| GET    | `/banners`                | Hero banners carousel                | Public     |
| POST   | `/banners`                | Create hero banner                   | Admin      |
| PUT    | `/banners/:id`            | Update hero banner                   | Admin      |
| DELETE | `/banners/:id`            | Deactivate hero banner               | Admin      |
| GET    | `/galleries`              | Photo gallery items                  | Public     |
| POST   | `/galleries`              | Attach photo to entity               | Admin      |
| DELETE | `/galleries/:id`          | Remove photo from gallery            | Admin      |
| GET    | `/search?q=`              | Unified global search across entities | Public   |
| POST   | `/auth/login`             | Admin authentication (JWT)           | Public     |
| GET    | `/auth/me`                | Current logged-in admin profile      | Admin      |
| GET    | `/admin/stats`            | Admin CMS dashboard statistics       | Admin      |
| GET    | `/admin/users`            | List admin team members              | Super Admin |
| POST   | `/admin/users`            | Create new admin user                | Super Admin |

---

## Documentation

| Document | Description |
|---|---|
| [docs/architecture.md](docs/architecture.md) | Complete system architecture, flow & design decisions |
| [docs/setup.md](docs/setup.md) | Local installation, prerequisites & database migration guide |
| [docs/database.md](docs/database.md) | Prisma schema, relations, entities & ER details |
| [docs/api.md](docs/api.md) | Complete REST API endpoints, request & response schemas |
| [docs/frontend.md](docs/frontend.md) | Next.js App Router architecture, UI components & state |
| [docs/backend.md](docs/backend.md) | Express MVC structure, services, middlewares & error handling |
| [docs/admin.md](docs/admin.md) | Admin CMS user guide, roles, permissions & workflows |
| [docs/content-model.md](docs/content-model.md) | Detailed data modeling and relational mapping |
| [docs/deployment.md](docs/deployment.md) | Docker Compose, environment vars & production deployment |
| [docs/contributing.md](docs/contributing.md) | Development standards, git workflow & coding guidelines |

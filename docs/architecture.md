# System Architecture

## Overview

The Delhi Tourism Platform is a monorepo full-stack application.

```
delhi-tourism/
├── frontend/     Next.js 14 (App Router) — served on port 3000
├── backend/      Node.js + Express REST API — served on port 5000
└── docs/         Documentation
```

## Architecture Principles

- Frontend consumes backend REST APIs — no direct database access from frontend
- All content is database-driven — no hardcoded tourism data in components
- Backend follows: Routes → Controllers → Services → Prisma → MySQL
- Frontend follows: Page → Components → Services → API → Backend

## Data Flow

```
User Browser
    ↓
Next.js (SSR / SSG / CSR)
    ↓
REST API (/api/v1/...)
    ↓
Express Controllers
    ↓
Services (business logic)
    ↓
Prisma ORM
    ↓
MySQL Database
```

## Authentication Flow

```
Admin → POST /api/v1/auth/login
      → JWT returned
      → Stored client-side
      → Sent as Authorization: Bearer <token>
      → Protected routes verified by auth middleware
```

## Key Design Decisions

- **Soft deletes**: Major content (places, circuits, categories) use `isActive: false` rather than hard deletes
- **Slug-based routing**: All public content accessible by human-readable slug
- **Polymorphic gallery**: Single Gallery model supports multiple entity types
- **Map abstraction**: Map component abstracts provider — supports Google Maps and Mapbox
- **Content-driven**: All homepage sections driven by backend API, not hardcoded

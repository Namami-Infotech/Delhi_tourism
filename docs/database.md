
# Database Schema

## Overview

Database: MySQL 8.0
ORM: Prisma

## Entities

### Admin
Stores admin user accounts.
- Roles: `SUPER_ADMIN`, `ADMIN`, `EDITOR`
- Passwords stored as bcrypt hashes

### Category
Tourism categories (Spiritual, Heritage, Cultural, etc.)
- Soft-deletable via `isActive`
- Ordered via `displayOrder`

### Circuit
Curated tourism experiences grouping multiple places.
- Belongs to one Category
- Many-to-many with Places via `CircuitPlace`

### Place
Tourist destinations with full information.
- Many-to-many with Categories via `PlaceCategory`
- Many-to-many with Circuits via `CircuitPlace`
- Has PlaceFeatures
- Has ItineraryStops
- Has Gallery

### Itinerary
Curated day-by-day travel plans.
- Has ItineraryStops (ordered by day + sequence)

### ItineraryStop
A place within an itinerary on a specific day.

### Event
Tourism events with dates and venue information.

### Gallery
Polymorphic image gallery.
- `entityType`: `place`, `circuit`, `category`, `event`, `itinerary`
- `entityId`: the ID of the related entity

### PlaceCategory
Join table: Place ↔ Category (many-to-many)

### CircuitPlace
Join table: Circuit ↔ Place (many-to-many), with sequence ordering

### PlaceFeature
Structured feature tags for places (Historical, Spiritual, etc.)

## Key Relations

```
Category
  ├── Circuit (one-to-many)
  └── Place (many-to-many via PlaceCategory)

Circuit
  ├── Category (many-to-one)
  ├── Place (many-to-many via CircuitPlace)
  └── Gallery (one-to-many)

Place
  ├── Category (many-to-many via PlaceCategory)
  ├── Circuit (many-to-many via CircuitPlace)
  ├── Gallery (one-to-many)
  ├── PlaceFeature (one-to-many)
  └── ItineraryStop (one-to-many)

Itinerary
  ├── ItineraryStop (one-to-many)
  └── Gallery (one-to-many)

Event
  └── Gallery (one-to-many)
```

## Migration & Seed Commands

```bash
# Push schema directly to database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Apply migrations
npx prisma migrate deploy

# Run seed data
npm run seed
```

## Seed Credentials

- **Super Admin**: `admin@delhitourism.dev` / `Admin@123`


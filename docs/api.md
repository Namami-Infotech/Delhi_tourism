# API Reference

Base URL: `/api/v1`

## Response Format

All responses follow this structure:

Success:
```json
{
  "success": true,
  "data": {}
}
```

Error:
```json
{
  "success": false,
  "message": "Error description"
}
```

Validation error:
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    { "field": "email", "message": "Valid email required." }
  ]
}
```

---

## Authentication

### POST /api/v1/auth/login
Login with email and password.

Request:
```json
{
  "email": "admin@delhitourism.dev",
  "password": "Admin@123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJ...",
    "admin": {
      "id": 1,
      "name": "Super Admin",
      "email": "admin@delhitourism.dev",
      "role": "SUPER_ADMIN"
    }
  }
}
```

### GET /api/v1/auth/me
Get current authenticated admin.
Requires: `Authorization: Bearer <token>`

### POST /api/v1/auth/logout
Logout (client discards token).
Requires: `Authorization: Bearer <token>`

---

## Categories

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /categories | No | List all active categories |
| GET | /categories/:slug | No | Get category by slug |
| POST | /categories | Admin | Create category |
| PUT | /categories/:id | Admin | Update category |
| DELETE | /categories/:id | Admin | Deactivate category |

Query params for GET /categories:
- `featured=true` — filter to featured only

---

## Circuits

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /circuits | No | List all active circuits |
| GET | /circuits/:slug | No | Get circuit by slug |
| POST | /circuits | Admin | Create circuit |
| PUT | /circuits/:id | Admin | Update circuit |
| DELETE | /circuits/:id | Admin | Deactivate circuit |

Query params:
- `featured=true`
- `categoryId=<id>`

---

## Places

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /places | No | List all active places |
| GET | /places/:slug | No | Get place by slug |
| POST | /places | Admin | Create place |
| PUT | /places/:id | Admin | Update place |
| DELETE | /places/:id | Admin | Deactivate place |

Query params:
- `featured=true`
- `locality=<locality>`

---

## Itineraries

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /itineraries | No | List all active itineraries |
| GET | /itineraries/:slug | No | Get itinerary by slug |
| POST | /itineraries | Admin | Create itinerary |
| PUT | /itineraries/:id | Admin | Update itinerary |
| DELETE | /itineraries/:id | Admin | Deactivate itinerary |

---

## Events

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /events | No | List all active events |
| GET | /events/:slug | No | Get event by slug |
| POST | /events | Admin | Create event |
| PUT | /events/:id | Admin | Update event |
| DELETE | /events/:id | Admin | Deactivate event |

Query params:
- `featured=true`
- `upcoming=true`

---

## Search

### GET /api/v1/search?q=<query>

Returns categorised results across places, circuits, categories, events, and itineraries.

Response:
```json
{
  "success": true,
  "data": {
    "places": [],
    "circuits": [],
    "categories": [],
    "events": [],
    "itineraries": []
  }
}
```

---

## Galleries

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /galleries | No | List gallery images (filterable by `entityType`, `entityId`) |
| GET | /galleries/:id | No | Get single gallery image |
| POST | /galleries | Admin/Editor | Create gallery image |
| PUT | /galleries/:id | Admin/Editor | Update gallery image |
| DELETE | /galleries/:id | Admin | Delete gallery image |

---

## Admin Panel Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /admin/stats | Admin | Overview statistics for dashboard |
| GET | /admin/users | Super Admin | List all admin user accounts |
| GET | /admin/users/:id | Super Admin | Get single admin user |
| POST | /admin/users | Super Admin | Create new admin/editor user |
| PUT | /admin/users/:id | Super Admin | Update admin user account |
| DELETE | /admin/users/:id | Super Admin | Deactivate admin user account |


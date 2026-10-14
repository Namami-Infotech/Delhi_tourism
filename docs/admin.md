# Admin CMS Guide

## Access

URL: `/admin/login`
Default credentials (development only):
- Email: `admin@delhitourism.dev`
- Password: `Admin@123`

## Roles

| Role | Permissions |
|------|-------------|
| SUPER_ADMIN | Full access — all CRUD, user management |
| ADMIN | Manage all content |
| EDITOR | Read + update content |

## Dashboard

Overview of:
- Total categories, circuits, places, events
- Featured content
- Recently created content

## Content Management

### Categories
- Create / edit / deactivate categories
- Set display order and featured status
- Upload category image

### Circuits
- Create circuits and assign to a category
- Add / remove places from a circuit
- Set cover image, duration, best time

### Places
- Full place management
- Assign categories and circuits
- Manage features, gallery, location data

### Itineraries
- Create itineraries
- Add stops per day with sequence ordering

### Events
- Create and manage events
- Set dates, venue, category

### Gallery
- Upload and manage images per entity
- Set display order and alt text

## API Authentication

Admin API routes require:
```
Authorization: Bearer <jwt_token>
```

Token is returned from `POST /api/v1/auth/login`.

# Content Model Reference

## Category

| Field | Type | Notes |
|-------|------|-------|
| name | string | Display name |
| slug | string | URL-safe unique identifier |
| shortDescription | text | Used in cards |
| description | longtext | Full page description |
| image | string | Image URL |
| icon | string | Icon identifier |
| displayOrder | int | Sort order |
| isFeatured | bool | Show on homepage |
| isActive | bool | Soft delete |

## Circuit

| Field | Type | Notes |
|-------|------|-------|
| name | string | |
| slug | string | |
| tagline | string | Hero subheading |
| shortDescription | text | |
| description | longtext | |
| coverImage | string | |
| duration | string | e.g. "1 full day" |
| bestTime | string | e.g. "October to March" |
| categoryId | int | FK to Category |
| displayOrder | int | |
| isFeatured | bool | |
| isActive | bool | |

## Place

| Field | Type | Notes |
|-------|------|-------|
| name | string | |
| slug | string | |
| shortDescription | text | |
| description | longtext | |
| historicalInformation | longtext | |
| address | string | |
| locality | string | Neighbourhood |
| latitude | decimal | |
| longitude | decimal | |
| openingTime | string | HH:MM |
| closingTime | string | HH:MM |
| ticketInformation | text | |
| contactInformation | string | |
| website | string | |
| coverImage | string | |
| isFeatured | bool | |
| isActive | bool | |

## Itinerary

| Field | Type | Notes |
|-------|------|-------|
| title | string | |
| slug | string | |
| description | longtext | |
| duration | string | e.g. "2 days" |
| coverImage | string | |
| isFeatured | bool | |
| isActive | bool | |

## ItineraryStop

| Field | Type | Notes |
|-------|------|-------|
| itineraryId | int | |
| placeId | int | |
| day | int | Day number |
| sequence | int | Order within day |
| estimatedDuration | string | e.g. "2 hours" |
| notes | text | |

## Event

| Field | Type | Notes |
|-------|------|-------|
| title | string | |
| slug | string | |
| description | longtext | |
| startDate | datetime | |
| endDate | datetime | |
| venue | string | |
| address | string | |
| coverImage | string | |
| category | string | Free text category |
| isFeatured | bool | |
| isActive | bool | |

## Gallery

| Field | Type | Notes |
|-------|------|-------|
| entityType | string | place/circuit/category/event/itinerary |
| entityId | int | ID of related entity |
| imageUrl | string | |
| title | string | |
| altText | string | For accessibility |
| displayOrder | int | |

## PlaceFeature

| Field | Type | Notes |
|-------|------|-------|
| placeId | int | |
| feature | string | Historical, Spiritual, etc. |

# Frontend Architecture

## Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS 3
- JavaScript (no TypeScript)
- Axios / native fetch
- React Hook Form

## Folder Structure

```
frontend/
├── app/                   # Next.js App Router pages
│   ├── layout.js          # Root layout + metadata
│   ├── page.js            # Homepage
│   ├── globals.css        # Global styles + Tailwind
│   ├── categories/
│   ├── circuits/
│   ├── places/
│   ├── itineraries/
│   ├── events/
│   ├── search/
│   └── admin/
│
├── components/            # Reusable React components
│   ├── layout/            # Header, Footer, Container
│   ├── navigation/        # Breadcrumbs
│   ├── search/            # GlobalSearchModal
│   └── ui/                # Button, Badge, Card, SectionHeading, Spinner, Modal, Input
│
├── lib/
│   ├── api.js             # API client with JWT token management
│   ├── constants.js       # App-wide endpoints and navigation
│   └── utils.js           # Utility functions (cn, formatDate, truncateText)
│
├── services/              # API service layer
│   ├── admin.service.js
│   ├── auth.service.js
│   ├── category.service.js
│   ├── circuit.service.js
│   ├── event.service.js
│   ├── gallery.service.js
│   ├── itinerary.service.js
│   ├── place.service.js
│   └── search.service.js
│
└── hooks/                 # Custom React hooks
```

## Design System

- Primary colour: warm gold (`#d4821e`)
- Serif headings: Playfair Display
- Body: Inter
- Spacing: generous — premium feel
- Mobile-first responsive

## Data Fetching

- Server Components: use native fetch directly in page components with ISR revalidation
- Client Components: use service layer (`services/*.service.js`) + API client (`lib/api.js`)
- No direct database access from frontend

## Discovery Pages (Phase 6 Implementation)

- **Places Discovery** (`/places` & `/places/[slug]`):
  - Catalog with feature filter pills, search bar, sort options, and responsive grid.
  - Detailed place view: image gallery with interactive lightbox modal, quick specs (timings, tickets, category badges, metro accessibility), historical overview, interactive OpenStreetMap container with driving/transit links, and nearby recommendations.
- **Circuits Discovery** (`/circuits` & `/circuits/[slug]`):
  - Curated route cards with duration badges, best season tags, and stop counts.
  - Detail page: step-by-step route timeline, sequence markers, map with all circuit stops, and actionable navigation prompts.
- **Categories Hub** (`/categories` & `/categories/[slug]`):
  - Exploration grid highlighting monuments, spiritual sites, culinary spots, and shopping avenues.
  - Dynamic category listings with place count counters and nested place cards.
- **Itineraries** (`/itineraries` & `/itineraries/[slug]`):
  - Multi-day trip planners with day-by-day itineraries, morning/afternoon/evening schedules, and practical tips.
- **Events & Festivals** (`/events` & `/events/[slug]`):
  - Event calendar with date, time, venue address, ticket info, and maps.
- **Global Search** (`/search`):
  - Multi-entity live search spanning Places, Circuits, Categories, Events, and Itineraries with tabbed filters.
- **Components**:
  - `MapComponent.jsx`: OpenStreetMap iframe integration with Google Maps fallback links.
  - `ImageGallery.jsx`: Interactive photo grid with high-resolution lightbox modal.


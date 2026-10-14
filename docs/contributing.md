# Contributing Guide

## Development Setup

See [setup.md](setup.md) for full setup instructions.

## Code Style

### Backend
- JavaScript only — no TypeScript
- ESLint: `npm run lint` (must pass before committing)
- Follow: Routes → Controllers → Services → Prisma
- No database logic in controllers or routes
- Use centralized error handling (`next(err)`)

### Frontend
- JavaScript + JSX only — no TypeScript
- ESLint: `next lint` (must pass)
- Follow: Page → Components → Services → API client
- No direct API calls in page/component files — use service layer
- All UI components in `components/`
- All reusable logic in `lib/` or `hooks/`

## Naming Conventions

- Files: `kebab-case.js`
- Components: `PascalCase`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Database fields: `camelCase` in Prisma, `snake_case` in MySQL

## Branching

- `main`: production-ready code
- `dev`: active development
- Feature branches: `feature/description`
- Bug fixes: `fix/description`

## Adding Content

- All content must be added via the Admin CMS or seed file
- Never hardcode tourism data in frontend components
- Image URLs should point to externally hosted images (CDN recommended)

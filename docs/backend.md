# Backend Architecture

## Stack

- Node.js >= 18
- Express.js 4
- Prisma ORM
- MySQL 8
- JWT authentication
- bcryptjs
- express-validator
- Helmet + CORS + Morgan
- express-rate-limit

## Folder Structure

```
backend/src/
├── config/
│   ├── database.js      # Prisma client singleton
│   └── env.js           # Environment variable validation
│
├── controllers/         # Request/response handling
│   ├── admin.controller.js
│   ├── auth.controller.js
│   ├── category.controller.js
│   ├── circuit.controller.js
│   ├── event.controller.js
│   ├── gallery.controller.js
│   ├── itinerary.controller.js
│   ├── place.controller.js
│   └── search.controller.js
│
├── services/            # Business logic
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
├── routes/              # Express route definitions
│   ├── admin.routes.js
│   ├── auth.routes.js
│   ├── category.routes.js
│   ├── circuit.routes.js
│   ├── event.routes.js
│   ├── gallery.routes.js
│   ├── itinerary.routes.js
│   ├── place.routes.js
│   └── search.routes.js
│
├── validators/          # Input schema validations
│   ├── admin.validator.js
│   ├── auth.validator.js
│   ├── category.validator.js
│   ├── circuit.validator.js
│   ├── event.validator.js
│   ├── gallery.validator.js
│   ├── itinerary.validator.js
│   └── place.validator.js
│
├── middleware/
│   ├── auth.middleware.js       # JWT verification + role restriction
│   ├── error.middleware.js      # Centralised error handler
│   └── validation.middleware.js # express-validator result handler
│
├── utils/
│   └── index.js                 # Shared utilities
│
├── tests/
│   └── api.test.js              # Comprehensive E2E API test suite
│
├── app.js               # Express app setup
└── server.js            # Server startup + DB connection
```

## Request Flow

```
HTTP Request
  → Express Router
  → Auth Middleware (if protected)
  → Validation Middleware (if validated)
  → Controller
  → Service
  → Prisma
  → MySQL
  → JSON Response
```

## Error Handling

All errors use `next(err)` to reach the centralized `errorMiddleware`.
Services throw errors with a `statusCode` property.
Never expose stack traces or secrets in production responses.

## Security

- Helmet: sets secure HTTP headers
- CORS: whitelisted frontend origin only
- Rate limiting: 20 requests per 15 min on auth endpoints
- Prisma: prevents SQL injection by construction
- JWT: signed with env secret, 7-day expiry
- bcrypt: passwords hashed with cost factor 12

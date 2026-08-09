# Meridian POS Backend

Node.js/Express + MongoDB backend for the Meridian restaurant POS frontend, plus a
webhook API for a separately-built WhatsApp AI ordering bot.

## Prerequisites

- Node.js 18+
- A running MongoDB instance (local or hosted). For the order-creation transaction
  to work, MongoDB needs to be a replica set (the default `mongodb://localhost:27017`
  single-node instance is **not** a replica set). If transactions aren't available,
  the webhook falls back to validating stock before any writes, then writing
  sequentially — see the note under Webhook endpoints below.

## Setup

```bash
cp .env.example .env
# edit .env if needed (Mongo URI, JWT secret, webhook secret, CORS origin)

npm install
npm run seed   # creates admin + cashier users and sample foods
npm run dev    # starts the server with nodemon on PORT (default 5000)
```

Seeded accounts:

| Role    | Email                  | Password   |
|---------|------------------------|------------|
| admin   | admin@restaurant.com   | admin123   |
| cashier | cashier@restaurant.com | cashier123 |

## Environment variables

| Var             | Description                                   |
|------------------|------------------------------------------------|
| `PORT`           | Port the server listens on (default 5000)     |
| `MONGO_URI`      | MongoDB connection string                     |
| `JWT_SECRET`     | Secret used to sign auth JWTs                 |
| `JWT_EXPIRES_IN` | JWT expiry (e.g. `7d`)                        |
| `WEBHOOK_SECRET` | Shared secret required by `/api/webhook/*`    |
| `CORS_ORIGIN`    | Origin allowed to call this API (POS frontend)|

## Auth model

- All routes except `POST /api/auth/login` and `/api/webhook/*` require
  `Authorization: Bearer <token>`, verified by `requireAuth`.
- `/api/webhook/*` routes require header `x-webhook-secret: <WEBHOOK_SECRET>`
  instead of a JWT — used by the WhatsApp bot, not the POS UI.
- Every error response (status >= 400) is `{ "message": "..." }`.
- Every list endpoint returns `{ data, page, pageSize, total, totalPages }`.

## Endpoints

### Auth

| Method | Path              | Auth | Description                          |
|--------|-------------------|------|---------------------------------------|
| POST   | /api/auth/login   | none | Returns `{ user, token }`             |

### Foods

| Method | Path             | Auth        | Description             |
|--------|------------------|-------------|--------------------------|
| GET    | /api/foods       | any staff   | Paginated, filterable    |
| POST   | /api/foods       | admin       | Create food              |
| PATCH  | /api/foods/:id   | admin       | Partial update           |
| DELETE | /api/foods/:id   | admin       | Delete (204)             |

### Orders

| Method | Path                    | Auth      | Description                         |
|--------|-------------------------|-----------|---------------------------------------|
| GET    | /api/orders             | any staff | Paginated, filterable                |
| GET    | /api/orders/:id         | any staff | Single order                         |
| PATCH  | /api/orders/:id/status  | any staff | Update status                        |

(No POST — orders are created only via the webhook.)

### Customers

| Method | Path                | Auth      | Description                        |
|--------|----------------------|-----------|-------------------------------------|
| GET    | /api/customers        | any staff | Paginated, filterable              |
| GET    | /api/customers/:id    | any staff | `{ customer, orders }`             |

### Analytics

| Method | Path                             | Auth      | Description                              |
|--------|-----------------------------------|-----------|--------------------------------------------|
| GET    | /api/analytics/stats              | any staff | Today's orders/revenue, pending, deltas   |
| GET    | /api/analytics/sales              | any staff | `?range=daily\|weekly\|monthly` series    |
| GET    | /api/analytics/popular-foods      | any staff | `?limit=5` top-selling foods              |
| GET    | /api/analytics/status-breakdown   | any staff | Order counts by status                    |
| GET    | /api/analytics/unavailable-foods  | any staff | Foods with `available: false`             |
| GET    | /api/analytics/summary            | any staff | `?range=...` totals + series              |

### Webhook (WhatsApp AI bot — `x-webhook-secret` header, not JWT)

| Method | Path                     | Description                                             |
|--------|--------------------------|-----------------------------------------------------------|
| GET    | /api/webhook/foods       | Flat array of available foods with stock                |
| POST   | /api/webhook/orders      | Create order; validates stock, decrements it, returns receipt |
| GET    | /api/webhook/orders/:id  | Order status lookup                                      |

**Order creation limitation:** `POST /api/webhook/orders` wraps the stock check,
customer upsert, stock decrement, and order creation in a MongoDB transaction
when the connected MongoDB deployment supports one (replica set / Atlas). On a
standalone `mongod` (no replica set), transactions aren't available; in that case
the endpoint validates all item availability/stock **before** making any writes,
so a rejected order never leaves partial state, but the sequence of writes
(customer upsert → stock decrement → order create → customer stats update)
is not atomic. For production, run MongoDB as a (single-node) replica set to get
full transactional safety.

## Health check

`GET /api/health` → `{ status: "ok", timestamp }`

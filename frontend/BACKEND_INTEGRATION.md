# Backend Integration Guide

This frontend is now wired to a real REST API. Configure the API base URL with:

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

Create a local `.env` or `.env.local` for your environment-specific value. Commit only `.env.example`.

## Auth Flow

1. `POST /api/auth/login` with `{ email, password }`.
2. The backend returns `{ user: User, token: string }`.
3. The token is stored in localStorage under the existing `meridian.pos.session` key.
4. Every subsequent request sends `Authorization: Bearer <token>`.
5. A `401` response should still produce an error message that flows into the existing login form error handling.

Logout is currently client-only in the frontend: it clears the local session and does not call a logout endpoint.

## Shared Response Shapes

The frontend already consumes these TypeScript shapes from `src/types/index.ts`:

- `User`
- `Food`
- `Order`
- `Customer`
- `Paginated<T>`
- `DashboardStats`
- `SalesPoint`
- `PopularFood`

Additional shapes already used by the UI:

- `GET /api/customers/:id` returns `{ customer: Customer, orders: Order[] }`
- `GET /api/analytics/status-breakdown` returns `Array<{ status: OrderStatus; count: number }>`
- `GET /api/analytics/unavailable-foods` returns `Food[]`
- `GET /api/analytics/summary` returns `{ revenue: number; orders: number; avgOrderValue: number; series: SalesPoint[] }`

## Frontend API Calls

### Authentication

| Method | Path | Request | Response |
| --- | --- | --- | --- |
| `POST` | `/api/auth/login` | `{ email: string, password: string }` | `{ user: User, token: string }` |

### Foods

| Method | Path | Query params | Request body | Response |
| --- | --- | --- | --- | --- |
| `GET` | `/api/foods` | `search`, `category`, `availability`, `page`, `pageSize` | none | `Paginated<Food>` |
| `GET` | `/api/foods` | `page=1&pageSize=1000` | none | `Paginated<Food>` then the client reads `data` for `listAll()` |
| `POST` | `/api/foods` | none | `FoodPayload` (`name`, `description`, `category`, `price`, `imageUrl`, `available`) | `Food` |
| `PATCH` | `/api/foods/:id` | none | `Partial<FoodPayload>` | `Food` |
| `DELETE` | `/api/foods/:id` | none | none | no body expected |

### Orders

| Method | Path | Query params | Request body | Response |
| --- | --- | --- | --- | --- |
| `GET` | `/api/orders` | `search`, `status`, `from`, `to`, `sort`, `page`, `pageSize`, `customerId` | none | `Paginated<Order>` |
| `GET` | `/api/orders` | `page=1&pageSize=1000` | none | `Paginated<Order>` then the client reads `data` for `listAll()` |
| `GET` | `/api/orders/:id` | none | none | `Order` |
| `PATCH` | `/api/orders/:id/status` | none | `{ status: OrderStatus }` | `Order` |

### Customers

| Method | Path | Query params | Request body | Response |
| --- | --- | --- | --- | --- |
| `GET` | `/api/customers` | `search`, `page`, `pageSize`, `sort` | none | `Paginated<Customer>` |
| `GET` | `/api/customers/:id` | none | none | `{ customer: Customer, orders: Order[] }` |

## Analytics Endpoints

These endpoints are **new / not in the original spec** and are now expected to exist on the backend so the frontend does not have to aggregate mock arrays locally.

| Method | Path | Query params | Request body | Response |
| --- | --- | --- | --- | --- |
| `GET` | `/api/analytics/stats` | none | none | `DashboardStats` |
| `GET` | `/api/analytics/sales` | `range=daily|weekly|monthly` | none | `SalesPoint[]` |
| `GET` | `/api/analytics/popular-foods` | `limit=5` | none | `PopularFood[]` |
| `GET` | `/api/analytics/status-breakdown` | none | none | `Array<{ status: OrderStatus, count: number }>` |
| `GET` | `/api/analytics/unavailable-foods` | none | none | `Food[]` |
| `GET` | `/api/analytics/summary` | `range=daily|weekly|monthly` | none | `{ revenue: number, orders: number, avgOrderValue: number, series: SalesPoint[] }` |

## Backend Checklist

- Return consistent JSON error bodies with a `message` field so frontend `ApiError` messages stay readable.
- Support the `Authorization: Bearer <token>` header on all protected endpoints.
- Implement server-side pagination for list endpoints using `page` and `pageSize`, and return `Paginated<T>` with `data`, `page`, `pageSize`, `total`, and `totalPages`.
- Keep `Food.imageUrl` as a usable URL. If the backend will accept uploads later, it still needs hosted URLs or an upload flow; the current UI only stores the URL string.
- Ensure order/customer detail endpoints return the exact shapes documented above so no frontend refactor is needed later.
- Decide whether to add a real logout endpoint for token revocation. The frontend does not require one today.
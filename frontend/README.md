# Bistro Flow

# Premium Restaurant POS — Frontend Only

Build a **production-quality Restaurant POS frontend** using **React + Tailwind CSS**.

This is a frontend-only project for now. **Do not build a backend, database, authentication server, WhatsApp AI, or API server.** Use realistic mock data and create a clean API-ready service layer so the backend can be connected later without restructuring the UI.

## Product Concept

This POS is for a restaurant where there are only two roles:

### Admin

* View dashboard and analytics
* Add food
* Edit food
* Delete food
* Toggle food availability
* View all orders
* View customers
* View order details

### Cashier

* View orders
* View order details
* Update order status
* View customer information
* Cannot add, edit, delete, or modify food
* Cannot access admin-only sections

The restaurant also has an existing **WhatsApp AI ordering system**. The AI is already built separately and will later communicate with the backend through REST APIs.

Do NOT build the AI.

The future flow is:

Customer → WhatsApp AI → Backend API → Database → POS

The POS must therefore be designed around the same data model that the AI will use later.

---

# Design Direction

Create a **premium, modern, industrial-level SaaS dashboard**, not a generic admin template.

Visual inspiration:

* Modern restaurant technology
* Premium SaaS dashboards
* Industrial control interfaces
* High-end fintech/product dashboards
* Clean Apple-level spacing and typography
* Subtle futuristic elements

Use:

* Tailwind CSS
* Framer Motion for UI transitions and micro-interactions
* GSAP only for meaningful advanced animations
* Three.js only for subtle decorative effects where appropriate
* Lucide React icons
* Recharts for analytics

Do NOT overuse animations, gradients, glassmorphism, or Three.js.

The interface must remain fast, readable, and professional.

---

# Theme

Support:

* Dark mode
* Light mode

Default to a premium dark theme.

Use a restrained color system:

* Neutral/dark base
* One strong accent color
* Semantic green for available/success
* Red for unavailable/errors
* Amber for warnings

Maintain excellent contrast and accessibility.

---

# Main Application Layout

Create a persistent dashboard layout:

```text
┌──────────────────────────────────────────────┐
│ Sidebar              Topbar                  │
│                                              │
│ Dashboard             Search     Profile    │
│ Orders                                         │
│ Foods                                          │
│ Customers                                      │
│ Analytics                                      │
│                                              │
│              Main Content                    │
│                                              │
└──────────────────────────────────────────────┘
```

### Sidebar

Admin:

* Dashboard
* Orders
* Foods
* Customers
* Analytics

Cashier:

* Dashboard
* Orders

Include:

* Active navigation state
* Icons
* Collapsible sidebar
* Mobile drawer
* User profile
* Logout
* Role indicator

---

# Pages

## 1. Login

Create a premium login screen.

Include:

* Restaurant branding
* Email
* Password
* Show/hide password
* Remember me
* Login button
* Loading state
* Validation errors

For now use mock authentication.

Create demo credentials for:

Admin:
`admin@restaurant.com`

Cashier:
`cashier@restaurant.com`

After login redirect based on role.

---

# 2. Dashboard

Create a highly polished analytics dashboard.

Top statistics:

* Today's Orders
* Today's Revenue
* Pending Orders
* Available Foods

Include:

### Sales Overview

Interactive chart showing sales over time.

### Order Status

Visual breakdown:

* Pending
* Preparing
* Ready
* Delivered
* Cancelled

### Popular Foods

Show top-selling food items.

### Recent Orders

Table/list containing:

* Order ID
* Customer
* Items
* Total
* Status
* Time

### Low Availability

Show foods that are currently unavailable.

Use realistic mock data.

---

# 3. Orders

Create a professional order management interface.

Features:

* Search orders
* Filter by status
* Filter by date
* Sort orders
* Pagination

Order table:

* Order ID
* Customer
* Items
* Total
* Status
* Created At
* Actions

Statuses:

```text
Pending
Preparing
Ready
Delivered
Cancelled
```

Use visually distinct status badges.

---

# 4. Order Details

When an order is opened, show a detailed order page/drawer.

Display:

### Customer

* Name
* Phone
* Address

### Order

* Order ID
* Date
* Ordered foods
* Quantity
* Price
* Subtotal
* Discount
* Total

### Status Timeline

```text
Order Received
      ↓
Preparing
      ↓
Ready
      ↓
Delivered
```

Allow Cashier/Admin to update status according to their permissions.

Add confirmation dialogs for destructive actions.

---

# 5. Foods

Admin-only page.

Create a beautiful food management interface.

Display foods as either:

* Premium cards
* Table view

Include:

* Food image
* Name
* Category
* Price
* Availability
* Actions

Actions:

* Add
* Edit
* Delete
* Toggle availability

### Add/Edit Food Modal

Fields:

* Food name
* Description
* Category
* Price
* Image
* Availability

Use React Hook Form + Zod validation.

Unavailable foods should have a clear visual state.

Cashier must not be able to access this page.

---

# 6. Customers

Display:

* Customer name
* Phone
* Address
* Total orders
* Total spending
* Last order

Add customer details view.

Customer details should show:

* Personal information
* Order history
* Total orders
* Total spending
* Recent activity

Use mock data.

---

# 7. Analytics

Create a dedicated analytics page.

Include:

* Revenue
* Orders
* Average Order Value
* Popular Foods
* Order Status
* Revenue trends
* Daily/weekly/monthly filters

Use clean Recharts visualizations.

Do not make the analytics visually overwhelming.

---

# Role-Based UI

Implement frontend role protection.

Create:

```text
Admin
Cashier
```

Admin can access:

```text
Dashboard
Orders
Foods
Customers
Analytics
```

Cashier can access:

```text
Dashboard
Orders
```

If a cashier manually navigates to an admin route, show a proper **403 Unauthorized** page.

Hide admin navigation items from the cashier completely.

---

# Mock API Architecture

Create an API-ready structure.

Example:

```text
src/
├── components/
├── layouts/
├── pages/
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── foods/
│   ├── orders/
│   ├── customers/
│   └── analytics/
├── services/
│   ├── authService.ts
│   ├── foodService.ts
│   ├── orderService.ts
│   └── customerService.ts
├── hooks/
├── store/
├── types/
├── utils/
└── routes/
```

Keep all mock data and API calls separated so they can later be replaced with Axios REST API calls.

Do not hardcode data directly throughout components.

---

# UX Requirements

Implement:

* Responsive design
* Loading skeletons
* Empty states
* Error states
* Toast notifications
* Confirmation dialogs
* Form validation
* Hover states
* Smooth page transitions
* Button loading states
* Disabled states
* Search
* Filters
* Pagination
* Keyboard-friendly interactions

Every interactive element should have a clear visual feedback.

---

# Animation

Use Framer Motion for:

* Page transitions
* Modal animations
* Sidebar transitions
* Card entrance animations
* Hover interactions
* Dropdowns
* Toasts

Use GSAP only where it genuinely improves the experience.

Use Three.js only for a subtle background/ambient visual on the dashboard or login screen.

**Do not use Three.js for the entire interface.**

The POS must remain performant.

---

# Important Product Requirement

The POS is NOT a customer-facing food ordering website.

It is an **internal restaurant operations dashboard**.

Prioritize:

* Speed
* Clarity
* Information density
* Easy order management
* Fast navigation
* Professional data visualization
* Operational usability

Avoid unnecessary marketing sections, landing-page animations, huge hero sections, or excessive decorative elements.

---

# Future Backend Compatibility

Design the frontend so that later the backend can provide:

```text
GET    /api/foods
POST   /api/foods
PATCH  /api/foods/:id
DELETE /api/foods/:id

GET    /api/orders
GET    /api/orders/:id
PATCH  /api/orders/:id/status

GET    /api/customers
GET    /api/customers/:id

POST   /api/auth/login
```

The future WhatsApp AI will use the same backend to:

```text
GET  available foods
POST customers
POST orders
GET  order status
```

Do not implement these backend APIs now. Just structure the frontend so integration is straightforward later.

---

# Final Quality Standard

The final result should look like a **real commercial restaurant POS product**, not a student dashboard.

Prioritize:

1. Excellent UI/UX
2. Clean component architecture
3. Consistent design system
4. Role-based experience
5. Fast order management
6. Responsive layout
7. Smooth but restrained animations
8. API-ready architecture
9. Accessibility
10. Production-quality visual polish

Generate the complete React frontend with all pages, components, routing, mock data, role-based navigation, responsive layouts, animations, forms, charts, dialogs, loading states, and empty states.

Do not leave major sections as placeholders.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://aura-dine-ops.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ad682099-7617-4fe2-8a0b-1d9c86d5551a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

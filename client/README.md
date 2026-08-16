# Meridian: Premium Restaurant Experience

Build a complete, production-quality customer-facing restaurant website called "Meridian".

IMPORTANT:

This task is FRONTEND ONLY.

Do NOT build a backend, database, server, payment gateway, WhatsApp AI, or API server yet.

The frontend must be fully functional using realistic mock data and a clean API-ready architecture so that a Node.js/Express/MongoDB backend can be connected later without redesigning the frontend.

==================================================

BRAND

==================================================

Brand name: Meridian

Use the chef-hat logo as inspiration, but do not simply use the low-resolution image as the final logo.

Create/refine a premium, minimal restaurant brand identity around the chef-hat concept.

The logo should work in:

- Header

- Footer

- Mobile navigation

- Favicon

- Dark mode

- Light mode

If necessary, create a cleaner vector-style version of the logo while keeping the same general concept.

==================================================

TECH STACK

==================================================

Use:

- React

- TypeScript

- Vite

- Tailwind CSS

- React Router

- Framer Motion

- GSAP where genuinely useful

- Lucide React

- Recharts where analytics are required

Do NOT add unnecessary libraries.

Keep the project performant and production-oriented.

==================================================

DESIGN DIRECTION

==================================================

Create a premium, modern, high-end restaurant website.

The design should feel like a real commercial product, not a student project or generic template.

Visual direction:

- Premium restaurant

- Modern SaaS-level UX

- Strong typography

- Excellent spacing

- High-quality food presentation

- Sophisticated dark/light theme

- Subtle glass effects only where useful

- Smooth micro-interactions

- Elegant animations

- Strong visual hierarchy

- Mobile-first responsive design

Use animations carefully.

Do NOT:

- Overuse gradients

- Overuse glassmorphism

- Add unnecessary 3D effects

- Make every element animated

- Use huge animations that hurt performance

- Create unnecessary sections just to make the website longer

Three.js is NOT required for this customer website unless a very subtle decorative effect genuinely improves the experience.

==================================================

CORE WEBSITE STRUCTURE

==================================================

Create these routes:

PUBLIC ROUTES:

/

/menu

/menu/:id

/about

/contact

/login

/signup

/forgot-password

/404

PROTECTED CUSTOMER ROUTES:

/cart

/checkout

/orders

/orders/:id

/profile

/favorites

The cart should be accessible only to authenticated users.

If a guest tries to access:

- /cart

- /checkout

- /orders

- /orders/:id

- /profile

- /favorites

redirect them to:

/login

After successful login, redirect them back to the page they originally attempted to access.

Example:

Guest → /checkout

        ↓

     /login

        ↓

successful login

        ↓

     /checkout

==================================================

AUTHENTICATION FRONTEND

==================================================

Implement frontend authentication state using mock authentication for now.

Create:

- Login

- Sign Up

- Forgot Password

- Logout

- Auth context/store

- ProtectedRoute component

Use realistic mock users.

Do NOT build real JWT authentication yet.

Structure the authentication layer so it can later be replaced with:

POST /api/auth/login

POST /api/auth/register

POST /api/auth/forgot-password

GET /api/auth/me

Do not hardcode authentication logic inside pages.

==================================================

NAVBAR

==================================================

Create a premium responsive navbar.

Desktop:

Meridian logo

Home

Menu

About

Contact

Right side:

Search

Favorites

Cart

Account

Mobile:

- Hamburger menu

- Slide-out navigation

- Cart indicator

- Account access

Cart should show item count.

If user is logged in:

- Show profile/avatar

- Account menu

- Orders

- Profile

- Logout

If user is logged out:

- Show Login / Sign Up

Navbar should remain consistent across public and protected pages.

==================================================

HOME / LANDING PAGE

==================================================

Create a complete restaurant landing page.

Sections:

1. Premium Hero

- Strong headline

- Supporting text

- Order Now CTA

- Explore Menu CTA

- High-quality food visual

- Subtle entrance animation

2. Featured Foods

- Food cards

- Price

- Rating

- Availability

- Add to Cart

- Favorite button

3. Categories

Examples:

- Burgers

- Pizza

- Chicken

- Sides

- Drinks

- Desserts

4. Popular Foods

5. Why Meridian

- Fresh ingredients

- Fast delivery

- Quality

- Secure payment

6. How It Works

- Choose food

- Add to cart

- Checkout

- Track order

7. Customer Reviews

8. Restaurant CTA

9. Newsletter / Updates

10. Professional Footer

Footer should contain:

- Meridian branding

- Navigation

- Menu links

- Contact information

- Social icons

- Legal links

- Copyright

==================================================

MENU PAGE

==================================================

Create a complete food discovery experience.

Features:

- Search foods

- Categories

- Filters

- Sort

- Price filtering

- Availability filtering

Food cards must contain:

- Image

- Name

- Short description

- Category

- Price

- Rating

- Availability

- Favorite button

- Add to Cart

Unavailable foods:

- Clearly show "Unavailable"

- Disable Add to Cart

- Visually distinguish the item

Use mock food data.

Keep food data centralized so it can later be replaced by:

GET /api/foods

==================================================

FOOD DETAILS

==================================================

Create /menu/:id.

Show:

- Large food image

- Name

- Description

- Category

- Rating

- Price

- Availability

- Quantity selector

- Add to Cart

- Favorite

Include:

- Related foods

- Back to menu

If unavailable:

- Disable ordering

- Clearly explain that the item is currently unavailable

==================================================

CART

==================================================

Create a premium cart experience.

Show:

- Food image

- Food name

- Price

- Quantity

- Increase/decrease quantity

- Remove item

- Save to favorites

- Subtotal

- Delivery fee

- Discount if applicable

- Total

Include:

Continue Shopping

Proceed to Checkout

Create excellent empty cart UI.

Persist cart state so refreshing the page does not unnecessarily lose the cart.

==================================================

CHECKOUT

==================================================

Create a professional multi-section checkout page.

Sections:

1. Customer Information

- Full Name

- Phone Number

- Email

- Delivery Address

2. Order Summary

3. Delivery Information

4. Payment Method

Create UI for:

- Cash on Delivery

- Card

- Online Payment

IMPORTANT:

Do not implement a real payment gateway yet.

Create only the frontend payment-selection UI and structure it so a real payment provider can later be connected through the backend.

5. Place Order

Before placing order:

- Validate required fields

- Validate cart

- Prevent ordering unavailable foods

After placing a mock order:

redirect to:

/orders/:id

==================================================

ORDER TRACKING

==================================================

Create an excellent real-time-style order tracking UI.

Statuses:

Pending

Confirmed

Preparing

Ready

Out for Delivery

Delivered

Cancelled

Show:

Order ID

Customer

Items

Total

Payment status

Delivery address

Create a visual status timeline:

Order Received

      ↓

Confirmed

      ↓

Preparing

      ↓

Ready

      ↓

Out for Delivery

      ↓

Delivered

Use Framer Motion for subtle status transitions.

For now use mock order state.

Later this will connect to backend/WebSocket updates.

==================================================

MY ORDERS

==================================================

Create /orders.

Show:

- Active orders

- Previous orders

- Order ID

- Date

- Items

- Total

- Status

- View Order button

Add filters:

- All

- Active

- Delivered

- Cancelled

==================================================

PROFILE

==================================================

Create /profile.

Sections:

Personal Information

- Name

- Email

- Phone

Delivery Address

- Address

- City

- Postal Code

Account Settings

Security

Logout

Create a polished account dashboard.

==================================================

FAVORITES

==================================================

Create /favorites.

Allow users to:

- Add food to favorites

- Remove food

- Add favorite directly to cart

If user is not authenticated and attempts to favorite an item:

redirect to login.

==================================================

CONTACT PAGE

==================================================

Create a professional contact page.

Include:

- Contact form

- Restaurant phone

- Email

- Address

- Opening hours

- Social links

- Map placeholder

Contact form should have:

- Name

- Email

- Subject

- Message

Use frontend validation.

Do not implement real email sending yet.

==================================================

ABOUT PAGE

==================================================

Create a premium restaurant story page.

Include:

- Meridian story

- Restaurant philosophy

- Quality

- Ingredients

- Team

- Visual sections

- CTA to order

==================================================

SEARCH

==================================================

Create a global food search experience.

Search should work across the mock food catalog.

Include:

- Search suggestions

- Recent searches

- Matching foods

- No results state

==================================================

RESPONSIVE UX

==================================================

The entire website must be fully responsive.

Desktop

Tablet

Mobile

Do not simply shrink the desktop layout.

Create mobile-specific UX where necessary.

Mobile navigation should be excellent.

Cart and checkout must be easy to use on mobile.

==================================================

LOADING / ERROR / EMPTY STATES

==================================================

Every major page must have:

Loading state

Skeleton state

Empty state

Error state

Examples:

No foods found

Empty cart

No orders

No favorites

Invalid food

404 page

Authentication error

Do not leave blank screens.

==================================================

TOASTS AND DIALOGS

==================================================

Use elegant toast notifications for:

Food added to cart

Food removed

Favorite added

Favorite removed

Login successful

Logout successful

Order placed

Use confirmation dialogs for destructive actions where appropriate.

==================================================

ANIMATIONS

==================================================

Use Framer Motion for:

- Page transitions

- Food card entrance

- Modal animations

- Mobile navigation

- Cart updates

- Favorite interactions

- Order status transitions

Use GSAP only for advanced hero/scroll interactions where useful.

Animations must be:

- Fast

- Smooth

- Subtle

- Professional

Respect prefers-reduced-motion.

==================================================

FRONTEND ARCHITECTURE

==================================================

Use a clean feature-based architecture.

Example:

src/

components/

layouts/

pages/

features/

auth/

foods/

cart/

orders/

profile/

favorites/

checkout/

services/

authService.ts

foodService.ts

orderService.ts

customerService.ts

paymentService.ts

hooks/

context/

store/

types/

utils/

data/

routes/

Do not put everything into App.tsx.

Create reusable components.

Examples:

Navbar

Footer

FoodCard

FoodGrid

CategoryFilter

SearchBar

CartItem

OrderStatus

ProtectedRoute

AuthProvider

Modal

Button

Input

EmptyState

LoadingSkeleton

Toast

==================================================

API-READY ARCHITECTURE

==================================================

The backend does NOT exist yet.

Use mock services for now.

Do not hardcode API URLs throughout components.

Create service functions such as:

getFoods()

getFoodById()

login()

register()

getCurrentUser()

getOrders()

getOrderById()

createOrder()

updateProfile()

getFavorites()

Later these can be replaced with Axios calls.

Future API examples:

GET /api/foods

GET /api/foods/:id

POST /api/auth/login

POST /api/auth/register

GET /api/auth/me

GET /api/orders

GET /api/orders/:id

POST /api/orders

GET /api/customers/me

PATCH /api/customers/me

GET /api/favorites

POST /api/favorites

DELETE /api/favorites/:id

Do NOT implement these backend endpoints now.

==================================================

DATA MODEL PREPARATION

==================================================

Structure mock data around future backend models.

Food:

id

name

description

category

price

image

rating

available

User:

id

name

email

phone

address

role

Order:

id

customer

items

subtotal

deliveryFee

total

paymentMethod

paymentStatus

status

deliveryAddress

createdAt

source

Order source should support:

website

whatsapp

This is important because the existing WhatsApp AI will later create orders through the same backend.

==================================================

IMPORTANT SYSTEM RULES

==================================================

1. Public pages must never require login:

Home

Menu

Food Details

About

Contact

Login

Signup

Forgot Password

2. Protected pages must require authentication:

Cart

Checkout

Orders

Order Details

Profile

Favorites

3. If unauthenticated:

redirect protected routes to /login.

4. Preserve the originally requested route and redirect back after login.

5. Cart state must work correctly.

6. Unavailable food cannot be added to cart.

7. Checkout must validate the cart before placing an order.

8. Never trust frontend prices as final prices. The future backend will recalculate totals.

9. Do not implement real payments yet.

10. Do not implement the WhatsApp AI.

11. Do not implement backend functionality.

==================================================

QUALITY STANDARD

==================================================

The final website should look like a real premium restaurant product that could be launched commercially.

It must NOT look like:

- A generic Tailwind template

- A basic CRUD application

- A student project

- A simple restaurant landing page

Prioritize:

- Excellent UX

- Clear navigation

- Fast ordering

- Beautiful food presentation

- Strong responsive design

- Accessibility

- Consistent design system

- Reusable components

- Clean React architecture

- Backend readiness

- Smooth but restrained animations

- Professional error/loading/empty states

Build all required pages and functionality now using mock data.

Do not leave major sections as placeholders.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f7e8f345-2310-42d5-ba68-3e3d20332af3).

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

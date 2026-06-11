# BookMart Client

Frontend application for BookMart, an online bookstore with public book browsing, customer accounts, cart checkout, payments, recommendations, and a professional admin console.

## Web Tracking And Recommendations

The client records lightweight product interaction events so BookMart can show popular books and recommendation results.

Tracked actions:

- `view` when a book detail page is opened.
- `add_to_cart` when a book is added to cart.
- `buy` when checkout is started from a book.

Guest users receive a `guest_session_id` cookie so anonymous browsing can still contribute to recommendations. Logged-in users include their `user_id` in activity events.

The frontend sends these events through the RTK Query activity endpoint to `POST /activities/`. Payment details are not tracked through this flow; payment processing is handled separately by Stripe and the backend payment endpoints.

## Features

- Public landing page and book catalogue.
- Search, category filtering, sorting, and pagination.
- Book detail pages with recommendations.
- Book cards with `Add to cart` and `Buy now` actions.
- Customer signup/signin using backend cookie authentication.
- Customer profile management with birthday, gender, phone, and address book.
- Cart management, checkout, payment page, and order history.
- Complete-payment action for unpaid orders.
- Admin dashboard with sales, order, inventory, customer, payment, and performance summaries.
- Admin inventory table plus separate book details/edit page.
- Admin category management.
- Admin order table plus separate order details/status management page.
- Admin users table with customer/admin tabs and user detail pages.
- Responsive admin sidebar, reusable modals, tables, form controls, and footer wave styling.

## Tech Stack

- React 19
- TypeScript
- Vite
- Redux Toolkit Query
- React Router
- Tailwind CSS
- Flowbite React
- React Icons
- Framer Motion

## Requirements

- Node.js 20 or newer is recommended.
- npm
- Running BookMart backend API.

## Environment

Create `.env` from `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

For production builds, set `VITE_API_BASE_URL` to the deployed backend URL.

## Setup

```bash
npm install
npm run dev
```

The app runs at:

```text
http://localhost:5173
```

The backend must allow the frontend origin in `CORS_ORIGINS`.

## Scripts

```bash
npm run dev       # Start Vite development server
npm run lint      # Run ESLint
npm run build     # Type-check and build production assets
npm run preview   # Preview the production build locally
```

## Routes

Public:

- `/` - Landing page
- `/home` - Book catalogue
- `/book/:id` - Book details and recommendations
- `/signin` - Sign in
- `/signup` - Sign up
- `/authredirect` - Post-auth redirect helper

Customer:

- `/cart` - Shopping cart
- `/orders` - Customer orders
- `/payment/:orderId` - Payment page
- `/profile` - Profile and address book

Admin:

- `/admin/dashboard` - Admin dashboard
- `/admin/books` - Legacy redirect to inventory
- `/admin/inventory` - Inventory table
- `/admin/inventory/:bookId` - Book details and editing
- `/admin/categories` - Category management
- `/admin/orders` - Orders table
- `/admin/orders/:orderId` - Order details and status management
- `/admin/users` - Customer/admin user tables
- `/admin/users/:userId` - User details and order list

## Project Structure

```text
src/
  assets/              # Images and logo
  components/
    pages/             # Route-level page wrappers
      admin/
      customer/
      public/
    templates/         # Navbar, footer, shared templates
    UI/
      atoms/           # Small reusable UI controls
      molecules/       # Modals and composed controls
      organisms/       # Feature-level UI sections
  const/               # API paths, colors, countries
  features/admin/      # Admin layout, tabs, constants
  routes/              # Route definitions
  services/            # RTK Query API slice
  types/               # TypeScript domain types
  utils/               # Shared formatting helpers
```

## API Layer

All backend calls are centralized in:

```text
src/services/bookmartApi.ts
```

The client uses Redux Toolkit Query with `credentials: "include"` so the backend HTTP-only auth cookie is sent with API requests.

## Auth Behavior

- Logged-out users are redirected to `/signin` for protected pages.
- Logged-in customers are redirected away from `/signin` to `/home`.
- Logged-in admins are redirected to `/admin/dashboard`.
- Admin users are redirected away from customer-only routes.
- Logout clears local auth state and RTK Query cache.

## Local Backend Pairing

Frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Backend `.env` should include:

```env
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
FRONTEND_BASE_URL=http://localhost:5173
```

## Quality Checks

Run before pushing frontend changes:

```bash
npm run lint
npm run build
npm audit
```

After dependency upgrades, manually verify:

- Sign in and logout.
- Book search/filter/sort/pagination.
- Add to cart and buy now.
- Checkout/payment flow.
- Profile and address book.
- Admin dashboard, inventory, categories, orders, and users.

## Build Output

Production assets are generated in:

```text
dist/
```

`dist/` is ignored by git and should be generated during deployment.

# Inventory & Order Management System

A full-stack application for managing product inventory, customers, and orders —
with stock deduction handled safely inside atomic database transactions.

## 🔗 Live Demo

- **Frontend (Vercel):** https://inventory-order-beta.vercel.app/
- **API docs (Swagger):** https://inventory-order-system-do81.onrender.com/docs
- **Docker image:** https://hub.docker.com/r/varshith13/inventory-backend
- **Source:** https://github.com/varshith13/inventory-order-system

> ⏳ The backend runs on Render's free tier and may take ~30 seconds to wake on
> the first request after a period of inactivity. Subsequent requests are fast.



## 🛠 Tech Stack

| Layer    | Technology                                           |
|----------|------------------------------------------------------|
| Backend  | FastAPI, SQLAlchemy, Alembic, PostgreSQL             |
| Frontend | React (Vite), Mantine v7, TanStack Query, React Router |
| Infra    | Docker, Docker Compose, Render, Vercel               |

## ✨ Features

- Full CRUD for products and customers
- Multi-item order creation with a live running total
- Automatic stock deduction performed inside a single atomic transaction
- Dashboard with summary stats, low-stock alerts, and an orders-over-time chart
- Responsive layout — desktop sidebar collapses to a mobile drawer
- Consistent error handling surfaced to the user as toast notifications

## 🧠 Business Rules Implemented

- Product SKUs and customer emails are unique, enforced at the database level
- An order deducts stock **only if every line item has sufficient quantity** —
  if any item is short, the entire order is rejected and no stock changes
- Stock deduction, order creation, and line-item creation all happen in one
  transaction, so a failure rolls everything back (no partial orders)
- Each order line stores a **price snapshot**, so order history remains accurate
  even if a product's price changes later
- Customers and products referenced by an existing order cannot be deleted
  (foreign-key RESTRICT), protecting order history from being orphaned

## 🏗 Architecture

```
   Browser  ──HTTP──>  FastAPI backend  ──SQL──>  PostgreSQL
      │                     │                        │
   (Vercel)             (Render)                  (Render)
```

The frontend is a static React bundle served from Vercel. It calls the FastAPI
backend on Render, which persists data to a managed PostgreSQL instance.

## 🚀 Running Locally

The entire stack runs with a single command using Docker Compose:

```bash
git clone https://github.com/varshith13/inventory-order-system.git
cd inventory-order-system
cp .env.example .env        # adjust values if you wish
docker compose up --build
```

- Frontend: http://localhost:3000
- API docs:  http://localhost:8000/docs

Database migrations run automatically when the backend container starts.

To reset to a clean slate (wipes the database volume):

```bash
docker compose down -v
docker compose up --build
```

## 🔑 Environment Variables

| Variable          | Description                                   |
|-------------------|-----------------------------------------------|
| POSTGRES_USER     | Database user                                 |
| POSTGRES_PASSWORD | Database password                             |
| POSTGRES_DB       | Database name                                 |
| DATABASE_URL      | Full SQLAlchemy connection string             |
| CORS_ORIGINS      | Allowed frontend origin(s), comma-separated   |
| VITE_API_URL      | Backend base URL the frontend calls           |

A complete template is provided in `.env.example`.

## 📁 Project Structure

```
inventory-order-system/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app, CORS, routers, error handlers
│   │   ├── config.py          # Environment configuration
│   │   ├── database.py        # SQLAlchemy engine, session, get_db dependency
│   │   ├── models/            # SQLAlchemy ORM models
│   │   ├── schemas/           # Pydantic request/response schemas
│   │   └── routers/           # API route handlers
│   ├── alembic/               # Database migrations
│   ├── Dockerfile
│   ├── entrypoint.sh          # Runs migrations, then starts the server
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/               # axios client + endpoint functions
│   │   ├── components/        # Layout, forms, reusable UI
│   │   ├── pages/             # Dashboard, Products, Customers, Orders
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf             # SPA fallback for client-side routing
│   └── package.json
├── docs/screenshots/
├── docker-compose.yml
└── README.md
```

## 🔭 Future Improvements

- Authentication and role-based access control
- Order status workflow (pending → shipped → delivered)
- Server-side pagination and search for large datasets
- Automated tests (pytest for the API, Vitest for components)

## 👤 Author

**Varshith** — https://github.com/varshith13

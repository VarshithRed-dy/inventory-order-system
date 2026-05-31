import os

from dotenv import load_dotenv

# Reads a local .env file (if present) into environment variables.
load_dotenv()

PROJECT_NAME = "Inventory & Order Management System"
API_VERSION = "0.1.0"

# Which frontend origins are allowed to call this API (CORS).
# Comma-separated in the env var; defaults to the local Vite dev server.
CORS_ORIGINS = ["https://inventory-order-system-5woiyy4i4-varshith-reddy-projects.vercel.app/", "http://localhost:3000"]

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://inventory_db_67uk_user:CphJtKqwfdlC5hLqB8nDUI26oiOXOYoL@dpg-d8e32g58nd3s73a8k2tg-a/inventory_db_67uk",
)
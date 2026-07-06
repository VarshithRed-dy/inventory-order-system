import os

from dotenv import load_dotenv

load_dotenv()

PROJECT_NAME = "Inventory & Order Management System"
API_VERSION = "0.1.0"

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is not set")

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Optional debug, remove after deploy succeeds
from urllib.parse import urlparse
print("Using DB host:", urlparse(DATABASE_URL).hostname)
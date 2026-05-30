from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import config

from app.routers import products

app = FastAPI(
    title=config.PROJECT_NAME,
    version=config.API_VERSION,
)

#This Allows the React frontend to call this API from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)


@app.get("/health", tags=["system"])
def health_check():
    """Liveness probe — Docker and Render hit this to confirm the API is up."""
    return {"status": "ok", "project_name": config.PROJECT_NAME}
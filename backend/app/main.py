from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware

from app import config

from app.routers import customers, orders, products

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
app.include_router(customers.router)
app.include_router(orders.router)


@app.exception_handler(IntegrityError)
async def integrity_error_handler(request: Request, exc: IntegrityError):
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={
            "detail": "A record with one of these unique values already exists.",
            "code": "integrity_error",
        },
    )


@app.get("/health", tags=["system"])
def health_check():
    """Liveness probe — Docker and Render hit this to confirm the API is up."""
    return {"status": "ok", "project_name": config.PROJECT_NAME}
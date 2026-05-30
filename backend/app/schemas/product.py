from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    sku: str = Field(..., min_length=1, max_length=100)
    price: float = Field(..., gt=0, description="Unit price; must be positive")
    quantity: int = Field(0, ge=0, description="Stock on hand; cannot be negative")


class ProductCreate(ProductBase):
    # ProductCreate has everything ProductBase has, but no extra fields for now.
    pass


class ProductUpdate(BaseModel):

    name: str | None = Field(None, min_length=1, max_length=255)
    sku: str | None = Field(None, min_length=1, max_length=100)
    price: float | None = Field(None, gt=0)
    quantity: int | None = Field(None, ge=0)


class ProductResponse(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
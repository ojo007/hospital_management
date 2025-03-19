from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Product name")
    category_name: str = Field(..., description="Product category name")
    price: str
    weight_value: Optional[float] = None
    weight_unit: Optional[str] = None
    quantity: Optional[int] = None
    expiry_date: Optional[date] = None
    critical_level: Optional[int] = None
    description: Optional[str] = None
    status: str = 'Active'
    created_by: Optional[str] = None

class ProductResponse(ProductCreate):
    product_id: Optional[int] = None
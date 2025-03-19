from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class ProductCategoryCreate(BaseModel):
    category_name: str = Field(..., min_length=1, max_length=255, description="Product Category Name")
    created_by: Optional[str] = None

class ProductCategoryResponse(ProductCategoryCreate):
    date_created: Optional[date] = None
    updated_at: Optional[date] = None
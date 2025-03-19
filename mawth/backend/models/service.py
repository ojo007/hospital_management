from pydantic import BaseModel, Field
from typing import Optional

class ServiceCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Service name")
    department: str
    price: str
    status: str = 'Active'
    description: Optional[str] = None
    created_by: Optional[str] = None

class ServiceResponse(ServiceCreate):
    id: Optional[int] = None
from pydantic import BaseModel, Field
from typing import Optional

class DepartmentCreate(BaseModel):
    department_name: str = Field(..., min_length=1, max_length=255, description="Department name")
    department_description: Optional[str] = Field(None, max_length=255, description="Department description")
    created_by: Optional[str] = None
    last_modified_by: Optional[str] = None
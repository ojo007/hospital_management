from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    role: str
    department: Optional[str] = None
    password: str
    created_by: Optional[str] = None
    status: str = 'Active'

class UserStatusUpdate(BaseModel):
    email: str
    status: str
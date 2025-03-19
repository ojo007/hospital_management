from pydantic import BaseModel
from typing import Optional

class ProfileUpdateModel(BaseModel):
    email: str
    first_name: Optional[str] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None
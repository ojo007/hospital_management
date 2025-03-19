from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ActivityLogCreate(BaseModel):
    user_id: int
    activity_type: str
    ip_address: Optional[str] = None
    device_type: Optional[str] = None
    user_role: str
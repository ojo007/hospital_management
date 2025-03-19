from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ServicePaymentItemCreate(BaseModel):
    service_id: int
    quantity: int
    unit_price: float
    total: float

class ServicePaymentCreate(BaseModel):
    items: List[ServicePaymentItemCreate]
    customer_name: str
    payment_status: str
    payment_mode: str
    total_amount: float
    created_by: str


class ServicePaymentResponse(BaseModel):
    payment_id: int
    receipt_number: str
    customer_name: str
    total_amount: float
    items_count: int
    created_at: str
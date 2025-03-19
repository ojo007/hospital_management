from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class SaleItemCreate(BaseModel):
    product_id: int
    quantity: int
    unit_price: float
    total: float

class SaleCreate(BaseModel):
    items: List[SaleItemCreate]
    payment_status: str = Field(..., description="Payment status (PAID, NOT PAID)")
    payment_mode: str = Field(..., description="Payment mode (CASH, POS, TRANSFER)")
    total_amount: float
    created_by: Optional[str] = None

class SaleResponse(BaseModel):
    sale_id: int
    invoice_number: str
    total_amount: float
    payment_status: str
    payment_mode: str
    created_at: datetime
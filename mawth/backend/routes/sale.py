from fastapi import APIRouter, HTTPException, status, Depends, Query
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from services.sale_service import SaleService
from repositories.sale_repository import SaleRepository


# Define Pydantic models for request validation
class SaleItemCreate(BaseModel):
    product_id: int
    quantity: int
    unit_price: float
    total: float


class SaleCreate(BaseModel):
    items: List[SaleItemCreate]
    payment_status: str
    payment_mode: str
    total_amount: float
    created_by: str


# Define response model
class SaleResponse(BaseModel):
    sale_id: int
    receipt_number: str
    total_amount: float
    items_count: int
    created_at: str


# Create router
router = APIRouter(tags=["sales"])


@router.get("/sales")
async def get_sales():
    return SaleRepository.get_all_sales()

@router.post("/create-sale", response_model=SaleResponse)
async def create_sale(sale: SaleCreate):
    """
    Create a new sale transaction and update inventory
    """
    try:
        # Process the sale
        result = SaleService.create_sale(sale.dict(), sale.created_by)

        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process sale: {str(e)}"
        )

from fastapi import HTTPException

@router.get("/search-invoice/{receipt_number}")
async def search_invoice(receipt_number: str):
    try:
        return SaleService.search_sale_by_receipt_number(receipt_number)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/sales-report")
async def generate_sales_report(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    user: Optional[str] = Query(None),
    department: Optional[str] = Query(None)
):
    return SaleService.generate_sales_report(start_date, end_date, user, department)
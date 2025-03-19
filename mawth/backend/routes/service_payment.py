from fastapi import APIRouter, HTTPException, status
from services.service_payment_service import ServicePaymentService
from models.service_payment import ServicePaymentCreate, ServicePaymentResponse

# Create router
router = APIRouter(tags=["service_payments"])


@router.post("/create-service-payment", response_model=ServicePaymentResponse)
async def create_service_payment(payment: ServicePaymentCreate):
    """
    Create a new service payment transaction
    """
    try:
        # Process the payment
        result = ServicePaymentService.create_service_payment(payment.dict(), payment.created_by)

        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process service payment: {str(e)}"
        )

@router.get("/service-payments")
async def get_service_payments():
    return ServicePaymentService.get_all_service_payments()

@router.get("/search-service-invoice/{receipt_number}")
async def search_service_invoice(receipt_number: str):
    try:
        return ServicePaymentService.search_service_payment_by_receipt_number(receipt_number)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
from fastapi import APIRouter, HTTPException, status
from models.service import ServiceCreate
from services.service_service import ServiceService

router = APIRouter(tags=["services"])


@router.post("/create-service")
async def create_service(service: ServiceCreate):
    try:
        # Validate service name is not empty
        if not service.name.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Service name cannot be empty"
            )

        created_service = ServiceService.create_service(service)
        if created_service:
            return {"message": "Service created successfully"}
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create service"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/services")
async def get_services():
    try:
        services = ServiceService.get_all_services()
        return services
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
from fastapi import APIRouter, HTTPException, status
from models.department import DepartmentCreate
from services.department_service import DepartmentService

router = APIRouter(tags=["departments"])

@router.post("/create-department")
async def create_department(department: DepartmentCreate):
    try:
        # Validate department name is not empty
        if not department.department_name.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Department name cannot be empty"
            )

        created_department = DepartmentService.create_department(department)
        if created_department:
            return {"message": "Department created successfully"}
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create department"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    
@router.get("/departments")
async def get_departments():
    try:
        departments = DepartmentService.get_all_departments()
        return departments
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
from fastapi import APIRouter, HTTPException, status
from models.create_user import UserCreate, UserStatusUpdate
from services.create_user_service import UserService

router = APIRouter()

@router.post("/create-user")
async def create_user(user: UserCreate):
    try:
        created_user = UserService.create_user(user)
        return {"message": "User created successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/users")
async def get_users():
    try:
        users = UserService.get_all_users()
        return users
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    
@router.put("/update-user-status")
async def update_user_status(user_status: UserStatusUpdate):
    try:
        updated = UserService.update_user_status(user_status.email, user_status.status)
        if updated:
            return {"message": "User status updated successfully"}
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
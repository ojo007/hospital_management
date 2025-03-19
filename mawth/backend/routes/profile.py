from fastapi import APIRouter, HTTPException, status
from models.profile import ProfileUpdateModel
from services.profile_service import ProfileService

router = APIRouter()

@router.put("/update-profile")
async def update_profile(profile_data: ProfileUpdateModel):
    try:
        updated = ProfileService.update_profile(profile_data)
        if updated:
            return {"message": "Profile updated successfully"}
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Profile update failed. Check your current password."
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
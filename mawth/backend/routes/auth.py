import socket
from fastapi import APIRouter, HTTPException, status, Request
from models.user import UserLogin, UserResponse
from services.auth_service import AuthService
from models.activity_log import ActivityLogCreate
from services.activity_log_service import ActivityLogService
from repositories.user_repository import UserRepository

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login")
async def login(user_login: UserLogin):
    try:
        # Authenticate user
        authenticated_user = AuthService.login(user_login)

        if not authenticated_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        # Create activity log for login
        activity_log = ActivityLogCreate(
            user_id=authenticated_user.user_id,
            activity_type="Login",
            ip_address=socket.gethostbyname(socket.gethostname()),
            device_type="Web Browser",
            user_role=authenticated_user.role
        )

        # Log the activity
        ActivityLogService.create_activity_log(activity_log)

        return authenticated_user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/logout")
async def logout(request: Request):
    try:
        # Try to get email from request body
        body = await request.json()
        email = body.get('email')

        if not email:
            # Fallback to getting email from user data in local storage
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is required for logout"
            )

        # Find the user to get user_id and role
        user = UserRepository.get_user_by_email(email)

        if user:
            # Create activity log for logout
            activity_log = ActivityLogCreate(
                user_id=user['user_id'],
                activity_type="Logout",
                ip_address=socket.gethostbyname(socket.gethostname()),
                device_type="Web Browser",
                user_role=user['role']
            )

            # Log the activity
            ActivityLogService.create_activity_log(activity_log)

        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
from fastapi import APIRouter
from services.activity_log_service import ActivityLogService

router = APIRouter(tags=["Activity Logs"])

@router.get("/activity-logs")
async def get_activity_logs():
    return ActivityLogService.get_all_activity_logs()
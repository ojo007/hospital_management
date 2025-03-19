from repositories.activity_log_repository import ActivityLogRepository
from models.activity_log import ActivityLogCreate

class ActivityLogService:
    @staticmethod
    def create_activity_log(activity_log: ActivityLogCreate):
        return ActivityLogRepository.create_activity_log(activity_log)

    @staticmethod
    def get_all_activity_logs():
        return ActivityLogRepository.get_all_activity_logs()
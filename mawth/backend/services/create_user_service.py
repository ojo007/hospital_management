from models.create_user import UserCreate
from repositories.create_user_repository import UserRepository

class UserService:
    @staticmethod
    def create_user(user: UserCreate):
        return UserRepository.create_user(user)

    @staticmethod
    def get_all_users():
        return UserRepository.get_all_users()

    @staticmethod
    def update_user_status(email: str, status: str):
        return UserRepository.update_user_status(email, status)
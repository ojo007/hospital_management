from models.user import UserLogin
from repositories.user_repository import UserRepository


class AuthService:
    @staticmethod
    def login(user_login: UserLogin):
        print(f"Auth Service - Login attempt: {user_login}")

        # Validate input before authentication
        if not user_login.email or not user_login.password:
            print("Invalid login: Missing email or password")
            return None

        # Get authenticated user with role
        authenticated_user = UserRepository.authenticate_user(user_login)

        if authenticated_user:
            print(f"Auth Service - Authenticated user: {authenticated_user}")
            return authenticated_user

        return None
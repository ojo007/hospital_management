from models.profile import ProfileUpdateModel
from repositories.profile_repository import ProfileRepository

class ProfileService:
    @staticmethod
    def update_profile(profile_data: ProfileUpdateModel):
        return ProfileRepository.update_profile(profile_data)
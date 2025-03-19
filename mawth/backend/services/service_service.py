from models.service import ServiceCreate
from repositories.service_repository import ServiceRepository


class ServiceService:
    @staticmethod
    def create_service(service: ServiceCreate):
        return ServiceRepository.create_service(service)

    @staticmethod
    def get_all_services():
        return ServiceRepository.get_all_services()
from models.department import DepartmentCreate
from repositories.department_repository import DepartmentRepository

class DepartmentService:
    @staticmethod
    def create_department(department: DepartmentCreate):
        return DepartmentRepository.create_department(department)
    
    @staticmethod
    def get_all_departments():
        return DepartmentRepository.get_all_departments()
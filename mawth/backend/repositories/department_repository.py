from database.connection import DatabaseConnection
import mysql.connector
from models.department import DepartmentCreate

class DepartmentRepository:
    @staticmethod
    def create_department(department: DepartmentCreate):
        connection = DatabaseConnection.get_connection()
        if not connection:
            return None

        try:
            cursor = connection.cursor()
            
            query = """
            INSERT INTO manage_departments 
            (department_name, department_description, created_by, last_modified_by) 
            VALUES (%s, %s, %s, %s)
            """
            
            values = (
                department.department_name, 
                department.department_description, 
                department.created_by or 'system',  # Fallback to 'system' if no email provided
                department.last_modified_by or 'system'
            )

            cursor.execute(query, values)
            connection.commit()

            return department
        except mysql.connector.Error as err:
            print(f"Error creating department: {err}")
            connection.rollback()
            return None
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_all_departments():
        connection = DatabaseConnection.get_connection()
        if not connection:
            return []

        try:
            cursor = connection.cursor(dictionary=True)
            
            query = """
            SELECT 
                department_name, 
                department_description
            FROM manage_departments
            """
            
            cursor.execute(query)
            departments = cursor.fetchall()

            return departments
        except mysql.connector.Error as err:
            print(f"Error fetching departments: {err}")
            return []
        finally:
            cursor.close()
            connection.close()
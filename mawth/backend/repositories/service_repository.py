from database.connection import DatabaseConnection
import mysql.connector
from models.service import ServiceCreate


class ServiceRepository:
    @staticmethod
    def create_service(service: ServiceCreate):
        connection = DatabaseConnection.get_connection()
        if not connection:
            return None

        try:
            cursor = connection.cursor()

            query = """
            INSERT INTO our_services 
            (name, department, price, status, description, created_by, last_modified_by) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """

            values = (
                service.name,
                service.department,
                service.price,
                service.status,
                service.description,
                service.created_by or 'system',
                service.created_by or 'system'
            )

            cursor.execute(query, values)
            connection.commit()

            return service
        except mysql.connector.Error as err:
            print(f"Error creating service: {err}")
            connection.rollback()
            return None
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_all_services():
        connection = DatabaseConnection.get_connection()
        if not connection:
            return []

        try:
            cursor = connection.cursor(dictionary=True)

            query = """
            SELECT 
                service_id,  # Make sure to select the ID 
                name, 
                department, 
                price, 
                status,
                description
            FROM our_services
            """

            cursor.execute(query)
            services = cursor.fetchall()

            return services
        except mysql.connector.Error as err:
            print(f"Error fetching services: {err}")
            return []
        finally:
            cursor.close()
            connection.close()
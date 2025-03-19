from database.connection import DatabaseConnection
import mysql.connector
from models.create_user import UserCreate

class UserRepository:
    @staticmethod
    def create_user(user: UserCreate):
        connection = DatabaseConnection.get_connection()
        if not connection:
            return None

        try:
            cursor = connection.cursor()

            # Insert into manage_users table
            manage_users_query = """
            INSERT INTO manage_users 
            (first_name, last_name, phone, email, role, department, status, created_by) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """

            manage_users_values = (
                user.first_name,
                user.last_name,
                user.phone,
                user.email,
                user.role,
                user.department,
                'Active',
                user.created_by or 'system@mawth'
            )

            # Insert into users_login table
            users_login_query = """
            INSERT INTO users_login 
            (email, password) 
            VALUES (%s, %s)
            """

            users_login_values = (
                user.email,
                user.password
            )

            # Execute both inserts
            cursor.execute(manage_users_query, manage_users_values)
            cursor.execute(users_login_query, users_login_values)

            # Commit the transaction
            connection.commit()

            return user
        except mysql.connector.Error as err:
            print(f"Error creating user: {err}")
            connection.rollback()
            return None
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_all_users():
        connection = DatabaseConnection.get_connection()
        if not connection:
            return []

        try:
            cursor = connection.cursor(dictionary=True)
            
            query = """
            SELECT 
                first_name, 
                last_name, 
                phone, 
                email, 
                role, 
                department, 
                status
            FROM manage_users
            """
            
            cursor.execute(query)
            users = cursor.fetchall()

            return users
        except mysql.connector.Error as err:
            print(f"Error fetching users: {err}")
            return []
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def update_user_status(email: str, status: str):
        connection = DatabaseConnection.get_connection()
        if not connection:
            return False

        try:
            cursor = connection.cursor()
            
            query = """
            UPDATE manage_users 
            SET status = %s 
            WHERE email = %s
            """
            
            cursor.execute(query, (status, email))
            connection.commit()

            # Check if any row was affected
            if cursor.rowcount > 0:
                return True
            return False
        except mysql.connector.Error as err:
            print(f"Error updating user status: {err}")
            connection.rollback()
            return False
        finally:
            cursor.close()
            connection.close()
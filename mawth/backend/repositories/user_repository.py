from database.connection import DatabaseConnection
import mysql.connector
from models.user import UserLogin, UserResponse

class UserRepository:
    @staticmethod
    def authenticate_user(user_login: UserLogin):
        connection = DatabaseConnection.get_connection()
        if not connection:
            return None

        try:
            cursor = connection.cursor(dictionary=True)

            # Check login credentials
            login_query = "SELECT * FROM users_login WHERE email = %s AND password = %s"
            cursor.execute(login_query, (user_login.email, user_login.password))
            login_record = cursor.fetchone()

            if login_record:
                # Update last_login timestamp
                update_last_login_query = "UPDATE users_login SET last_login = NOW() WHERE email = %s"
                cursor.execute(update_last_login_query, (user_login.email,))
                connection.commit()

                # Fetch user details including role and status
                user_query = """
                SELECT user_id, email, first_name, role, status 
                FROM manage_users 
                WHERE email = %s AND status = 'Active'
                """
                cursor.execute(user_query, (user_login.email,))
                user_record = cursor.fetchone()

                if user_record:
                    print(f"Found user record: {user_record}")  # Debug print
                    return UserResponse(
                        user_id=user_record['user_id'],  # Add this line
                        email=user_record['email'],
                        first_name=user_record['first_name'],
                        role=user_record['role'],
                        status=user_record['status']
                    )

            return None
        except mysql.connector.Error as err:
            print(f"Error authenticating user: {err}")
            connection.rollback()
            return None
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_user_by_email(email):
        connection = DatabaseConnection.get_connection()
        if not connection:
            return None

        try:
            cursor = connection.cursor(dictionary=True)
            query = """
            SELECT user_id, first_name, last_name, email, role, status 
            FROM manage_users 
            WHERE email = %s
            """
            cursor.execute(query, (email,))
            user = cursor.fetchone()
            return user
        except mysql.connector.Error as err:
            print(f"Error fetching user: {err}")
            return None
        finally:
            cursor.close()
            connection.close()
from database.connection import DatabaseConnection
import mysql.connector
from models.profile import ProfileUpdateModel

class ProfileRepository:
    @staticmethod
    def update_profile(profile_data: ProfileUpdateModel):
        connection = DatabaseConnection.get_connection()
        if not connection:
            return False

        try:
            cursor = connection.cursor()
            
            # Check if current password is correct if changing password
            if profile_data.current_password and profile_data.new_password:
                verify_query = "SELECT * FROM users_login WHERE email = %s AND password = %s"
                cursor.execute(verify_query, (profile_data.email, profile_data.current_password))
                user = cursor.fetchone()
                
                if not user:
                    return False

            # Update queries
            update_queries = []
            update_values = []

            # Update first name if provided
            if profile_data.first_name:
                update_queries.append("UPDATE manage_users SET first_name = %s WHERE email = %s")
                update_values.extend([profile_data.first_name, profile_data.email])

            # Update password if new password is provided
            if profile_data.new_password:
                update_queries.append("UPDATE users_login SET password = %s WHERE email = %s")
                update_values.extend([profile_data.new_password, profile_data.email])

            # Execute updates
            for query in update_queries:
                cursor.execute(query, update_values[update_queries.index(query)*2:update_queries.index(query)*2+2])

            connection.commit()
            return True

        except mysql.connector.Error as err:
            print(f"Error updating profile: {err}")
            connection.rollback()
            return False
        finally:
            cursor.close()
            connection.close()
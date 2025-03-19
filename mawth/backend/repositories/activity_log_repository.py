from database.connection import DatabaseConnection
import mysql.connector
from models.activity_log import ActivityLogCreate
from datetime import datetime


class ActivityLogRepository:
    @staticmethod
    def create_activity_log(activity_log: ActivityLogCreate):
        connection = DatabaseConnection.get_connection()
        if not connection:
            return None

        try:
            cursor = connection.cursor()

            query = """
            INSERT INTO activity_logs 
            (user_id, activity_type, ip_address, device_type, user_role, created_at) 
            VALUES (%s, %s, %s, %s, %s, %s)
            """

            values = (
                activity_log.user_id,
                activity_log.activity_type,
                activity_log.ip_address,
                activity_log.device_type,
                activity_log.user_role,
                datetime.now()
            )

            cursor.execute(query, values)
            connection.commit()

            return cursor.lastrowid
        except mysql.connector.Error as err:
            print(f"Error creating activity log: {err}")
            connection.rollback()
            return None
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_all_activity_logs():
        connection = DatabaseConnection.get_connection()
        if not connection:
            return []

        try:
            cursor = connection.cursor(dictionary=True)

            query = """
            SELECT 
                al.log_id,
                CONCAT(mu.first_name, ' ', mu.last_name) AS name,
                mu.email,
                al.activity_type,
                al.ip_address,
                al.device_type,
                al.user_role,
                al.created_at
            FROM activity_logs al
            JOIN manage_users mu ON al.user_id = mu.user_id
            ORDER BY al.created_at DESC
            """

            cursor.execute(query)
            logs = cursor.fetchall()

            return logs
        except mysql.connector.Error as err:
            print(f"Error fetching activity logs: {err}")
            return []
        finally:
            cursor.close()
            connection.close()
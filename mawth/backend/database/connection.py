import mysql.connector
from mysql.connector import Error

class DatabaseConnection:
    @staticmethod
    def get_connection():
        try:
            connection = mysql.connector.connect(
                host='localhost',
                database='mawth',
                user='root',
                password=''
            )
            return connection
        except Error as e:
            print(f"Error connecting to MySQL database: {e}")
            return None
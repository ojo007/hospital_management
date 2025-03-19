from database.connection import DatabaseConnection
import mysql.connector
from models.product_category import ProductCategoryCreate
from datetime import datetime


class ProductCategoryRepository:
    @staticmethod
    def create_product_category(category: ProductCategoryCreate):
        connection = DatabaseConnection.get_connection()
        if not connection:
            return None

        try:
            cursor = connection.cursor()

            # Get current timestamp
            current_time = datetime.now()

            query = """
            INSERT INTO product_categories 
            (category_name, created_by, last_modified_by, created_at, updated_at) 
            VALUES (%s, %s, %s, %s, %s)
            """

            values = (
                category.category_name,
                category.created_by or 'system',
                category.created_by or 'system',
                current_time,  # created_at
                current_time  # updated_at
            )

            cursor.execute(query, values)
            connection.commit()

            return category
        except mysql.connector.Error as err:
            print(f"Error creating product category: {err}")
            connection.rollback()
            return None
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_all_product_categories():
        connection = DatabaseConnection.get_connection()
        if not connection:
            return []

        try:
            cursor = connection.cursor(dictionary=True)

            query = """
            SELECT 
                category_name, 
                DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as date_created, 
                DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
            FROM product_categories
            """

            cursor.execute(query)
            categories = cursor.fetchall()

            return categories
        except mysql.connector.Error as err:
            print(f"Error fetching product categories: {err}")
            return []
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_category_by_name(category_name: str):
        connection = DatabaseConnection.get_connection()
        if not connection:
            return None

        try:
            cursor = connection.cursor(dictionary=True)
            query = "SELECT * FROM product_categories WHERE category_name = %s"

            # Print the query and parameters for debugging
            print(f"Executing query: {query}")
            print(f"With parameter: {category_name}")

            cursor.execute(query, (category_name,))
            category = cursor.fetchone()

            return category
        except mysql.connector.Error as err:
            print(f"Error fetching category by name: {err}")
            return None
        finally:
            cursor.close()
            connection.close()
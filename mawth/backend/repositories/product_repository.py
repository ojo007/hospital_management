from database.connection import DatabaseConnection
import mysql.connector
from models.product import ProductCreate


class ProductRepository:
    @staticmethod
    @staticmethod
    def create_product(product: ProductCreate):
        connection = DatabaseConnection.get_connection()
        if not connection:
            return None

        try:
            cursor = connection.cursor()

            query = """
            INSERT INTO our_products 
            (name, category_name, price, weight_value, weight_unit, 
            expiry_date, critical_level, description, status, 
            created_by, last_modified_by) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """

            values = (
                product.name,
                product.category_name,
                product.price,
                product.weight_value,
                product.weight_unit,
                product.expiry_date,
                product.critical_level,
                product.description,
                product.status,
                product.created_by or 'system',
                product.created_by or 'system'
            )

            cursor.execute(query, values)

            # Get the last inserted product ID
            product_id = cursor.lastrowid

            # Insert into product inventory
            inventory_query = """
            INSERT INTO product_inventory 
            (product_id, quantity_in_stock, last_updated_by) 
            VALUES (%s, %s, %s)
            """

            inventory_values = (
                product_id,
                product.quantity or 0,
                product.created_by or 'system'
            )

            cursor.execute(inventory_query, inventory_values)

            connection.commit()

            return product
        except mysql.connector.Error as err:
            print(f"Error creating product: {err}")
            connection.rollback()
            return None
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_all_products():
        connection = DatabaseConnection.get_connection()
        if not connection:
            return []

        try:
            cursor = connection.cursor(dictionary=True)

            query = """
            SELECT 
                p.product_id,
                p.name, 
                p.category_name AS category, 
                p.price,
                CONCAT(p.weight_value, ' ', p.weight_unit) AS weight,
                i.quantity_in_stock AS quantity,
                p.critical_level,
                p.expiry_date,
                p.status
            FROM our_products p
            LEFT JOIN product_inventory i ON p.product_id = i.product_id
            """

            cursor.execute(query)
            products = cursor.fetchall()

            return products
        except mysql.connector.Error as err:
            print(f"Error fetching products: {err}")
            return []
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
                category_id,
                category_name, 
                created_at, 
                updated_at
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
    def get_dashboard_stats():
        connection = DatabaseConnection.get_connection()
        if not connection:
            return None

        try:
            cursor = connection.cursor(dictionary=True)

            # Total Product List
            total_products_query = "SELECT COUNT(*) as total_products FROM our_products"
            cursor.execute(total_products_query)
            total_products = cursor.fetchone()['total_products']

            # Total Categories
            total_categories_query = "SELECT COUNT(*) as total_categories FROM product_categories"
            cursor.execute(total_categories_query)
            total_categories = cursor.fetchone()['total_categories']

            # Total Active Products
            active_products_query = "SELECT COUNT(*) as active_products FROM our_products WHERE status = 'Active'"
            cursor.execute(active_products_query)
            active_products = cursor.fetchone()['active_products']

            # Critical Level Products
            critical_products_query = """
            SELECT 
                p.product_id,
                p.name,
                CONCAT(p.weight_value, ' ', p.weight_unit) as weight,
                p.weight_unit as unit,
                i.quantity_in_stock,
                p.critical_level,
                p.category_name,
                p.expiry_date,
                p.last_updated as last_accessed
            FROM our_products p
            JOIN product_inventory i ON p.product_id = i.product_id
            WHERE i.quantity_in_stock <= p.critical_level AND p.critical_level IS NOT NULL
            ORDER BY i.quantity_in_stock ASC
            """
            cursor.execute(critical_products_query)
            critical_products = cursor.fetchall()

            return {
                'total_products': total_products,
                'total_categories': total_categories,
                'active_products': active_products,
                'critical_products': critical_products
            }

        except mysql.connector.Error as err:
            print(f"Error fetching dashboard stats: {err}")
            return None
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_current_stock():
        connection = DatabaseConnection.get_connection()
        if not connection:
            return []

        try:
            cursor = connection.cursor(dictionary=True)

            query = """
            SELECT 
                p.name, 
                i.quantity_in_stock
            FROM our_products p
            JOIN product_inventory i ON p.product_id = i.product_id
            ORDER BY i.quantity_in_stock DESC
            """

            cursor.execute(query)
            stock_items = cursor.fetchall()

            return stock_items
        except mysql.connector.Error as err:
            print(f"Error fetching current stock: {err}")
            return []
        finally:
            cursor.close()
            connection.close()
from database.connection import DatabaseConnection
import mysql.connector
from datetime import datetime
from typing import List, Dict, Any


class SaleRepository:
    @staticmethod
    def create_sale(sale_data: Dict[str, Any], user_email: str):
        """
        Create a sales transaction and update inventory
        """
        connection = DatabaseConnection.get_connection()
        if not connection:
            return None

        try:
            cursor = connection.cursor(dictionary=True)
            # Start transaction
            connection.start_transaction()

            # Create the sale header record
            sale_query = """
            INSERT INTO sales (
                total_amount, 
                payment_status, 
                payment_mode, 
                created_by, 
                created_at
            ) VALUES (%s, %s, %s, %s, %s)
            """

            sale_values = (
                sale_data['total_amount'],
                sale_data['payment_status'],
                sale_data['payment_mode'],
                user_email,
                datetime.now()
            )

            cursor.execute(sale_query, sale_values)
            sale_id = cursor.lastrowid

            # Insert sale items and update inventory
            for item in sale_data['items']:
                # Add sale item
                item_query = """
                INSERT INTO sale_items (
                    sale_id, 
                    product_id, 
                    quantity, 
                    unit_price, 
                    total
                ) VALUES (%s, %s, %s, %s, %s)
                """

                item_values = (
                    sale_id,
                    item['product_id'],
                    item['quantity'],
                    item['unit_price'],
                    item['total']
                )

                cursor.execute(item_query, item_values)

                # Update product inventory
                inventory_query = """
                UPDATE product_inventory 
                SET quantity_in_stock = quantity_in_stock - %s,
                    last_updated = %s,
                    last_updated_by = %s
                WHERE product_id = %s
                """

                inventory_values = (
                    item['quantity'],
                    datetime.now(),
                    user_email,
                    item['product_id']
                )

                cursor.execute(inventory_query, inventory_values)

                # Check if the inventory quantity is now at or below critical level
                check_critical_query = """
                SELECT p.name, p.critical_level, i.quantity_in_stock
                FROM our_products p
                JOIN product_inventory i ON p.product_id = i.product_id
                WHERE p.product_id = %s AND i.quantity_in_stock <= p.critical_level
                """

                cursor.execute(check_critical_query, (item['product_id'],))
                critical_item = cursor.fetchone()

                if critical_item:
                    # Log critical level alert
                    alert_query = """
                    INSERT INTO inventory_alerts (
                        product_id, 
                        current_quantity, 
                        critical_level, 
                        alert_type, 
                        created_at
                    ) VALUES (%s, %s, %s, %s, %s)
                    """

                    alert_values = (
                        item['product_id'],
                        critical_item['quantity_in_stock'],
                        critical_item['critical_level'],
                        'CRITICAL_LEVEL',
                        datetime.now()
                    )

                    # Only execute if you have an alerts table
                    # cursor.execute(alert_query, alert_values)

            # Generate receipt number
            receipt_number = f"RCP-{sale_id}-{datetime.now().strftime('%Y%m%d%H%M%S')}"

            # Update sale with receipt number
            update_receipt_query = """
            UPDATE sales 
            SET receipt_number = %s
            WHERE sale_id = %s
            """

            cursor.execute(update_receipt_query, (receipt_number, sale_id))

            # Commit transaction
            connection.commit()

            # Return sale details including receipt number
            return {
                "sale_id": sale_id,
                "receipt_number": receipt_number,
                "total_amount": sale_data['total_amount'],
                "items_count": len(sale_data['items']),
                "created_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }

        except mysql.connector.Error as err:
            print(f"Error creating sale: {err}")
            connection.rollback()
            return None
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_all_sales():
        connection = DatabaseConnection.get_connection()
        if not connection:
            return []

        try:
            cursor = connection.cursor(dictionary=True)
            query = """
            SELECT 
                sale_id,
                receipt_number,
                total_amount,
                payment_status,
                payment_mode,
                created_by,
                created_at
            FROM sales
            ORDER BY created_at DESC
            """

            cursor.execute(query)
            sales = cursor.fetchall()

            return sales
        except mysql.connector.Error as err:
            print(f"Error fetching sales: {err}")
            return []
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def search_sale_by_receipt_number(receipt_number):
        connection = DatabaseConnection.get_connection()
        if not connection:
            return None

        try:
            cursor = connection.cursor(dictionary=True)

            # Fetch sale details
            sale_query = """
            SELECT 
                sale_id,
                receipt_number,
                total_amount,
                payment_status,
                payment_mode,
                created_by,
                created_at
            FROM sales
            WHERE receipt_number = %s
            """

            cursor.execute(sale_query, (receipt_number,))
            sale = cursor.fetchone()

            if not sale:
                return None

            # Fetch sale items
            items_query = """
            SELECT 
                p.name,
                si.quantity,
                si.unit_price,
                si.total
            FROM sale_items si
            JOIN our_products p ON si.product_id = p.product_id
            WHERE si.sale_id = %s
            """

            cursor.execute(items_query, (sale['sale_id'],))
            sale['items'] = cursor.fetchall()

            return sale
        except mysql.connector.Error as err:
            print(f"Error searching sale: {err}")
            return None
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def generate_sales_report(start_date=None, end_date=None, user=None, department=None):
        connection = DatabaseConnection.get_connection()
        if not connection:
            return []

        try:
            cursor = connection.cursor(dictionary=True)

            # Base query
            query = """
            SELECT 
                s.sale_id,
                s.receipt_number,
                s.total_amount,
                s.payment_status,
                s.payment_mode,
                s.created_by,
                s.created_at,
                mu.first_name,
                mu.last_name,
                mu.department
            FROM sales s
            JOIN manage_users mu ON s.created_by = mu.email
            WHERE 1=1
            """

            # Params to prevent SQL injection
            params = []

            # Date range filter
            if start_date and end_date:
                query += " AND s.created_at BETWEEN %s AND %s"
                params.extend([start_date, end_date])

            # User filter
            if user:
                # Extract name from the full user string
                name_parts = user.split(' of ')[0].split()
                if len(name_parts) >= 2:
                    query += " AND mu.first_name = %s AND mu.last_name = %s"
                    params.extend([name_parts[0], name_parts[1]])

            # Department filter
            if department:
                query += " AND mu.department = %s"
                params.append(department)

            # Order by date
            query += " ORDER BY s.created_at DESC"

            # Execute query
            cursor.execute(query, params)
            sales = cursor.fetchall()

            # Fetch items for each sale
            for sale in sales:
                items_query = """
                SELECT 
                    p.name AS product_name, 
                    si.quantity, 
                    si.unit_price, 
                    si.total
                FROM sale_items si
                JOIN our_products p ON si.product_id = p.product_id
                WHERE si.sale_id = %s
                """
                cursor.execute(items_query, (sale['sale_id'],))
                sale['items'] = cursor.fetchall()

            return sales
        except mysql.connector.Error as err:
            print(f"Error generating sales report: {err}")
            return []
        finally:
            cursor.close()
            connection.close()
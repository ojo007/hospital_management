from database.connection import DatabaseConnection
import mysql.connector
from datetime import datetime
from typing import Dict, Any, List


class ServicePaymentRepository:
    @staticmethod
    def create_service_payment(payment_data: Dict[str, Any], user_email: str):
        """
        Create a service payment transaction
        """
        connection = DatabaseConnection.get_connection()
        if not connection:
            return None

        try:
            cursor = connection.cursor(dictionary=True)
            # Start transaction
            connection.start_transaction()

            # Create the service payment header record
            current_time = datetime.now()

            payment_query = """
            INSERT INTO service_payments (
                customer_name,
                total_amount, 
                payment_status, 
                payment_mode, 
                created_by, 
                created_at
            ) VALUES (%s, %s, %s, %s, %s, %s)
            """

            payment_values = (
                payment_data['customer_name'],
                payment_data['total_amount'],
                payment_data['payment_status'],
                payment_data['payment_mode'],
                user_email,
                current_time
            )

            cursor.execute(payment_query, payment_values)
            payment_id = cursor.lastrowid

            # Insert payment items
            for item in payment_data['items']:
                # Add payment item
                item_query = """
                INSERT INTO service_payment_items (
                    payment_id, 
                    service_id, 
                    quantity, 
                    unit_price, 
                    total
                ) VALUES (%s, %s, %s, %s, %s)
                """

                item_values = (
                    payment_id,
                    item['service_id'],
                    item['quantity'],
                    item['unit_price'],
                    item['total']
                )

                cursor.execute(item_query, item_values)

            # Generate receipt number
            receipt_number = f"SRVC-{payment_id}-{current_time.strftime('%Y%m%d%H%M%S')}"

            # Update payment with receipt number
            update_receipt_query = """
            UPDATE service_payments 
            SET receipt_number = %s
            WHERE payment_id = %s
            """

            cursor.execute(update_receipt_query, (receipt_number, payment_id))

            # Commit transaction
            connection.commit()

            # Return payment details including receipt number
            return {
                "payment_id": payment_id,
                "receipt_number": receipt_number,
                "customer_name": payment_data['customer_name'],
                "total_amount": payment_data['total_amount'],
                "items_count": len(payment_data['items']),
                "created_at": current_time.strftime('%Y-%m-%d %H:%M:%S')
            }

        except mysql.connector.Error as err:
            print(f"Error creating service payment: {err}")
            connection.rollback()
            return None
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def get_all_service_payments():
        connection = DatabaseConnection.get_connection()
        if not connection:
            return []

        try:
            cursor = connection.cursor(dictionary=True)
            query = """
            SELECT 
                payment_id,
                receipt_number,
                customer_name,
                total_amount,
                payment_status,
                payment_mode,
                created_by,
                created_at
            FROM service_payments
            ORDER BY created_at DESC
            """

            cursor.execute(query)
            service_payments = cursor.fetchall()

            return service_payments
        except mysql.connector.Error as err:
            print(f"Error fetching service payments: {err}")
            return []
        finally:
            cursor.close()
            connection.close()

    @staticmethod
    def search_service_payment_by_receipt_number(receipt_number):
        connection = DatabaseConnection.get_connection()
        if not connection:
            return None

        try:
            cursor = connection.cursor(dictionary=True)

            # Fetch service payment details
            payment_query = """
            SELECT 
                payment_id,
                receipt_number,
                customer_name,
                total_amount,
                payment_status,
                payment_mode,
                created_by,
                created_at
            FROM service_payments
            WHERE receipt_number = %s
            """

            cursor.execute(payment_query, (receipt_number,))
            payment = cursor.fetchone()

            if not payment:
                return None

            # Fetch service payment items
            items_query = """
            SELECT 
                s.name as service_name,
                spi.quantity,
                spi.unit_price,
                spi.total
            FROM service_payment_items spi
            JOIN our_services s ON spi.service_id = s.service_id
            WHERE spi.payment_id = %s
            """

            cursor.execute(items_query, (payment['payment_id'],))
            payment['items'] = cursor.fetchall()

            return payment
        except mysql.connector.Error as err:
            print(f"Error searching service payment: {err}")
            return None
        finally:
            cursor.close()
            connection.close()
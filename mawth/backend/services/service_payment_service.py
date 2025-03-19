from typing import Dict, Any
from repositories.service_payment_repository import ServicePaymentRepository


class ServicePaymentService:
    @staticmethod
    def create_service_payment(payment_data: Dict[str, Any], user_email: str):
        """
        Process a service payment transaction

        Args:
            payment_data: Dictionary containing payment information
            user_email: Email of the user creating the payment

        Returns:
            Dictionary with payment details on success, None on failure
        """
        # Basic validation
        if not payment_data.get('items') or len(payment_data['items']) == 0:
            raise ValueError("Payment must contain at least one service item")

        if not payment_data.get('customer_name') or not payment_data['customer_name'].strip():
            raise ValueError("Customer name is required")

        # Validate total amount
        calculated_total = sum(item['total'] for item in payment_data['items'])
        if abs(calculated_total - payment_data['total_amount']) > 0.01:  # Allow small rounding differences
            raise ValueError(f"Total amount mismatch: {calculated_total} vs {payment_data['total_amount']}")

        # Process the payment
        result = ServicePaymentRepository.create_service_payment(payment_data, user_email)

        if not result:
            raise Exception("Failed to process service payment")

        return result

    @staticmethod
    def get_all_service_payments():
        return ServicePaymentRepository.get_all_service_payments()

    @staticmethod
    def search_service_payment_by_receipt_number(receipt_number):
        payment = ServicePaymentRepository.search_service_payment_by_receipt_number(receipt_number)
        if not payment:
            raise ValueError("Invoice not found")
        return payment
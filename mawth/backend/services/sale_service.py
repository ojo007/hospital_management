from typing import Dict, Any
from repositories.sale_repository import SaleRepository


class SaleService:
    @staticmethod
    def create_sale(sale_data: Dict[str, Any], user_email: str):
        """
        Process a sale transaction

        Args:
            sale_data: Dictionary containing sale information
            user_email: Email of the user creating the sale

        Returns:
            Dictionary with sale details on success, None on failure
        """
        # Basic validation
        if not sale_data.get('items') or len(sale_data['items']) == 0:
            raise ValueError("Sale must contain at least one item")

        # Validate total amount
        calculated_total = sum(item['total'] for item in sale_data['items'])
        if abs(calculated_total - sale_data['total_amount']) > 0.01:  # Allow small rounding differences
            raise ValueError(f"Total amount mismatch: {calculated_total} vs {sale_data['total_amount']}")

        # Process the sale
        result = SaleRepository.create_sale(sale_data, user_email)

        if not result:
            raise Exception("Failed to process sale")

        return result

    @staticmethod
    def search_sale_by_receipt_number(receipt_number):
        sale = SaleRepository.search_sale_by_receipt_number(receipt_number)
        if not sale:
            raise ValueError("Invoice not found")
        return sale

    @staticmethod
    def generate_sales_report(start_date=None, end_date=None, user=None, department=None):
        return SaleRepository.generate_sales_report(start_date, end_date, user, department)
from models.product import ProductCreate
from repositories.product_repository import ProductRepository
from repositories.product_category_repository import ProductCategoryRepository


class ProductService:
    @staticmethod
    def create_product(product: ProductCreate):
        # Validate category exists in database
        category = ProductCategoryRepository.get_category_by_name(product.category_name)

        # Print the category for debugging
        print(f"Retrieved category: {category}")

        if not category:
            raise ValueError(f"Category '{product.category_name}' does not exist")

        return ProductRepository.create_product(product)

    @staticmethod
    def get_all_products():
        return ProductRepository.get_all_products()

    @staticmethod
    def get_dashboard_stats():
        return ProductRepository.get_dashboard_stats()

    @staticmethod
    def get_current_stock():
        return ProductRepository.get_current_stock()
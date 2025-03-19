from models.product_category import ProductCategoryCreate
from repositories.product_category_repository import ProductCategoryRepository


class ProductCategoryService:
    @staticmethod
    def create_product_category(category: ProductCategoryCreate):
        return ProductCategoryRepository.create_product_category(category)

    @staticmethod
    def get_all_product_categories():
        return ProductCategoryRepository.get_all_product_categories()
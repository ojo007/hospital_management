from fastapi import APIRouter, HTTPException, status
from models.product_category import ProductCategoryCreate
from services.product_category_service import ProductCategoryService

router = APIRouter(tags=["product_categories"])


@router.post("/create-product-category")
async def create_product_category(category: ProductCategoryCreate):
    try:
        # Validate category name is not empty
        if not category.category_name.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Product category name cannot be empty"
            )

        created_category = ProductCategoryService.create_product_category(category)
        if created_category:
            return {"message": "Product category created successfully"}
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create product category"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/product-categories")
async def get_product_categories():
    try:
        categories = ProductCategoryService.get_all_product_categories()
        return categories
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
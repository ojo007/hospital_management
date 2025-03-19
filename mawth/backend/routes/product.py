from fastapi import APIRouter, HTTPException, status
from models.product import ProductCreate
from services.product_service import ProductService

router = APIRouter(tags=["products"])


@router.post("/create-product")
async def create_product(product: ProductCreate):
    try:
        print(f"Received product data: {product}")  # Log the entire product data

        # Validate category
        if not product.category_name or product.category_name.strip() == '':
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category name cannot be empty"
            )

        created_product = ProductService.create_product(product)
        return {"message": "Product created successfully"}
    except Exception as e:
        print(f"Error creating product: {e}")  # Log any errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/products")
async def get_products():
    try:
        products = ProductService.get_all_products()
        return products
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/dashboard-stats")
async def get_dashboard_stats():
    stats = ProductService.get_dashboard_stats()
    if not stats:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dashboard statistics"
        )
    return stats

@router.get("/current-stock")
async def get_current_stock():
    return ProductService.get_current_stock()
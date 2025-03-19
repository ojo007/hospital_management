from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, create_user, profile, department, product, service, product_category, sale, service_payment, activity_log

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(auth.router)
app.include_router(create_user.router)
app.include_router(profile.router)
app.include_router(department.router)
app.include_router(product.router)
app.include_router(service.router)
app.include_router(product_category.router)
app.include_router(sale.router)
app.include_router(service_payment.router)
app.include_router(activity_log.router)


# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to MAWTH Backend"}
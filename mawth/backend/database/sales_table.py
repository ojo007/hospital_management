from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Boolean, DECIMAL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

# Import Base from your existing tables.py
from database.tables import Base


# Define the Sales tables
class Sales(Base):
    __tablename__ = 'sales'

    sale_id = Column(Integer, primary_key=True, autoincrement=True)
    receipt_number = Column(String(50), unique=True, nullable=True)
    total_amount = Column(DECIMAL(10, 2), nullable=False)
    payment_status = Column(String(20), nullable=False)
    payment_mode = Column(String(20), nullable=False)
    created_by = Column(String(255), ForeignKey('manage_users.email'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class SaleItems(Base):
    __tablename__ = 'sale_items'

    item_id = Column(Integer, primary_key=True, autoincrement=True)
    sale_id = Column(Integer, ForeignKey('sales.sale_id'), nullable=False)
    product_id = Column(Integer, ForeignKey('our_products.product_id'), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(DECIMAL(10, 2), nullable=False)
    total = Column(DECIMAL(10, 2), nullable=False)


class InventoryAlerts(Base):
    __tablename__ = 'inventory_alerts'

    alert_id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey('our_products.product_id'), nullable=False)
    current_quantity = Column(Integer, nullable=False)
    critical_level = Column(Integer, nullable=False)
    alert_type = Column(String(50), nullable=False)
    is_resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)


def create_sales_tables():
    # Replace with your actual database connection string
    DATABASE_URL = "mysql+mysqlconnector://root:@localhost/mawth"

    # Create engine
    engine = create_engine(DATABASE_URL, echo=True)

    # Create tables
    # This will only create tables that don't exist yet
    Base.metadata.create_all(engine)

    print("Sales tables created successfully!")


if __name__ == "__main__":
    create_sales_tables()
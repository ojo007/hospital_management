from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, DECIMAL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

# Import Base from your existing tables.py
from database.tables import Base


# Define the Service Payment tables
class ServicePayments(Base):
    __tablename__ = 'service_payments'

    payment_id = Column(Integer, primary_key=True, autoincrement=True)
    receipt_number = Column(String(50), unique=True, nullable=True)
    customer_name = Column(String(255), nullable=False)
    total_amount = Column(DECIMAL(10, 2), nullable=False)
    payment_status = Column(String(20), nullable=False)
    payment_mode = Column(String(20), nullable=False)
    created_by = Column(String(255), ForeignKey('manage_users.email'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class ServicePaymentItems(Base):
    __tablename__ = 'service_payment_items'

    item_id = Column(Integer, primary_key=True, autoincrement=True)
    payment_id = Column(Integer, ForeignKey('service_payments.payment_id'), nullable=False)
    service_id = Column(Integer, ForeignKey('our_services.service_id'), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(DECIMAL(10, 2), nullable=False)
    total = Column(DECIMAL(10, 2), nullable=False)


def create_service_payment_tables():
    # Replace with your actual database connection string
    DATABASE_URL = "mysql+mysqlconnector://root:@localhost/mawth"

    # Create engine
    engine = create_engine(DATABASE_URL, echo=True)

    # Create tables
    # This will only create tables that don't exist yet
    Base.metadata.create_all(engine)

    print("Service payment tables created successfully!")


if __name__ == "__main__":
    create_service_payment_tables()
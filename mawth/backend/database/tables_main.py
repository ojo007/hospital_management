from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, UniqueConstraint, Boolean, DECIMAL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

# ----------------- Tables from tables.py -----------------
class ManageUsers(Base):
    __tablename__ = 'manage_users'

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    phone = Column(String(20), nullable=False)
    role = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False)
    department = Column(String(255), nullable=True)
    created_by = Column(String(255), nullable=True)
    last_modified_by = Column(String(255), nullable=True)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class UsersLogin(Base):
    __tablename__ = 'users_login'

    login_id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), ForeignKey('manage_users.email'), nullable=False)
    password = Column(String(255), nullable=False)
    last_login = Column(DateTime, nullable=True)

class ManageDepartments(Base):
    __tablename__ = 'manage_departments'

    department_id = Column(Integer, primary_key=True, autoincrement=True)
    department_name = Column(String(255), nullable=False, unique=True)
    department_description = Column(String(500), nullable=True)
    created_by = Column(String(255), ForeignKey('manage_users.email'), nullable=False)
    last_modified_by = Column(String(255), ForeignKey('manage_users.email'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ProductCategories(Base):
    __tablename__ = 'product_categories'

    category_id = Column(Integer, primary_key=True, autoincrement=True)
    category_name = Column(String(255), nullable=False)
    created_by = Column(String(255), ForeignKey('manage_users.email'), nullable=False)
    last_modified_by = Column(String(255), ForeignKey('manage_users.email'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class OurProducts(Base):
    __tablename__ = 'our_products'

    product_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    category_name = Column(String(255), nullable=False)
    price = Column(String(50), nullable=False)
    weight_value = Column(Float, nullable=True)
    weight_unit = Column(String(20), nullable=True)
    expiry_date = Column(DateTime, nullable=True)
    critical_level = Column(Integer, nullable=True)
    description = Column(String(500), nullable=True)
    status = Column(String(50), nullable=False)
    created_by = Column(String(255), ForeignKey('manage_users.email'), nullable=False)
    last_modified_by = Column(String(255), ForeignKey('manage_users.email'), nullable=False)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ProductInventory(Base):
    __tablename__ = 'product_inventory'

    inventory_id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey('our_products.product_id'), nullable=False)
    quantity_in_stock = Column(Integer, nullable=False, default=0)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_updated_by = Column(String(255), ForeignKey('manage_users.email'), nullable=False)
    warehouse_location = Column(String(255), nullable=True)
    batch_number = Column(String(100), nullable=True)

class OurServices(Base):
    __tablename__ = 'our_services'

    service_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    department = Column(String(255), nullable=False)
    price = Column(String(50), nullable=False)
    description = Column(String(500), nullable=True)
    status = Column(String(50), nullable=False)
    created_by = Column(String(255), ForeignKey('manage_users.email'), nullable=False)
    last_modified_by = Column(String(255), ForeignKey('manage_users.email'), nullable=False)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

def create_tables(engine):
    Base.metadata.create_all(engine)

def main_tables():
    DATABASE_URL = "mysql+mysqlconnector://root:@localhost/mawth"
    engine = create_engine(DATABASE_URL, echo=True)
    create_tables(engine)
    print("Tables created successfully!")


# ----------------- Tables from sales_table.py -----------------
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
    DATABASE_URL = "mysql+mysqlconnector://root:@localhost/mawth"
    engine = create_engine(DATABASE_URL, echo=True)
    Base.metadata.create_all(engine)
    print("Sales tables created successfully!")


# ----------------- Tables from service_payment_tables.py -----------------
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
    DATABASE_URL = "mysql+mysqlconnector://root:@localhost/mawth"
    engine = create_engine(DATABASE_URL, echo=True)
    Base.metadata.create_all(engine)
    print("Service payment tables created successfully!")


# ----------------- Main Execution -----------------
if __name__ == "__main__":
    main_tables()
    create_sales_tables()
    create_service_payment_tables()

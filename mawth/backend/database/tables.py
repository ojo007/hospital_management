from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

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

def main():
    # Replace with your actual database connection string
    DATABASE_URL = "mysql+mysqlconnector://root:@localhost/mawth"

    # Create engine
    engine = create_engine(DATABASE_URL, echo=True)

    # Create tables
    create_tables(engine)

    print("Tables created successfully!")

if __name__ == "__main__":
    main()
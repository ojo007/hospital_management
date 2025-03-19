from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from tables_main import Base, ManageUsers

class ActivityLogs(Base):
    __tablename__ = 'activity_logs'

    log_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('manage_users.user_id'), nullable=False)
    activity_type = Column(String(50), nullable=False)
    ip_address = Column(String(45), nullable=True)
    device_type = Column(String(100), nullable=True)
    user_role = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationship to ManageUsers
    user = relationship("ManageUsers", back_populates="activity_logs")

# Update the ManageUsers model to include the back reference
def update_manage_users_model():
    ManageUsers.activity_logs = relationship("ActivityLogs", back_populates="user")

# Function to create the table
def create_activity_logs_table(engine):
    ActivityLogs.__table__.create(engine)
    print("Activity Logs table created successfully!")

# You can call this in your main script or migration script
if __name__ == "__main__":
    from sqlalchemy import create_engine

    # Replace with your actual database URL
    DATABASE_URL = "mysql+mysqlconnector://root:@localhost/mawth"
    engine = create_engine(DATABASE_URL, echo=True)

    # First update the ManageUsers model
    update_manage_users_model()

    # Then create the table
    create_activity_logs_table(engine)
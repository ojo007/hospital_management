from pydantic import BaseModel, validator
import re

class UserLogin(BaseModel):
    email: str
    password: str

    @validator('email')
    def validate_email(cls, v):
        if not v.endswith('@mawth'):
            raise ValueError('Email must end with @mawth')

        email_regex = r'^[a-zA-Z0-9._%+-]+@mawth$'
        if not re.match(email_regex, v):
            raise ValueError('Invalid email format')

        return v

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        return v

class UserResponse(BaseModel):
    user_id: int  # Add this line
    email: str
    first_name: str
    role: str
    status: str = 'Active'  # Default value
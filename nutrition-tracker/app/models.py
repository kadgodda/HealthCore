from sqlalchemy import Column, Integer, String, Float, Date, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from datetime import date
from app.database import Base

class DailyProgress(Base):
    __tablename__ = "daily_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, default=date.today, index=True)
    day_of_week = Column(String)  # monday, tuesday, etc.
    system_name = Column(String)  # cardiovascular, detox, etc.
    targets_data = Column(JSON)   # Store progress for each target
    cannabis_sessions = Column(Integer, default=0)
    buffer_requirements = Column(JSON)  # Auto-calculated buffer foods
    completion_percentage = Column(Float, default=0.0)
    performance_metrics = Column(JSON)  # energy, focus, etc.
    water_glasses = Column(Integer, default=0)  # Track water intake
    water_goal = Column(Integer, default=8)  # Daily water goal

class ShoppingList(Base):
    __tablename__ = "shopping_lists"
    
    id = Column(Integer, primary_key=True, index=True)
    week_start_date = Column(Date, index=True)
    items_data = Column(JSON)  # Full shopping list organized by category
    cannabis_adjustment = Column(Float, default=1.0)  # Multiplier for buffer foods
    generated_date = Column(Date, default=date.today)
    is_active = Column(Boolean, default=True)

class UserSettings(Base):
    __tablename__ = "user_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    household_size = Column(Integer, default=1)
    average_cannabis_sessions = Column(Float, default=3.0)
    preferred_stores = Column(JSON)  # Store preferences for shopping
    dietary_restrictions = Column(JSON)  # Allergies, preferences
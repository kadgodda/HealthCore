#!/usr/bin/env python3
"""
Reset database - creates a fresh database with all tables
"""
import os
from app.database import engine
from app.models import Base

DB_PATH = "nutrition_tracker.db"

def reset_database():
    """Delete and recreate the database"""
    
    # Remove existing database
    if os.path.exists(DB_PATH):
        print(f"Removing existing database: {DB_PATH}")
        os.remove(DB_PATH)
        print("✓ Database removed")
    
    # Create all tables
    print("Creating new database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ All tables created successfully!")
    
    print("\nDatabase has been reset. The app should now start without errors.")

if __name__ == "__main__":
    response = input("This will DELETE all existing data. Are you sure? (yes/no): ")
    if response.lower() == "yes":
        reset_database()
    else:
        print("Database reset cancelled.")
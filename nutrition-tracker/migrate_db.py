#!/usr/bin/env python3
"""
Database migration script to add water tracking columns
"""
import sqlite3
import os
from datetime import date

DB_PATH = "nutrition_tracker.db"

def migrate_database():
    """Add water tracking columns to existing database"""
    
    if not os.path.exists(DB_PATH):
        print(f"Database {DB_PATH} not found. No migration needed.")
        return
    
    print(f"Migrating database: {DB_PATH}")
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if columns already exist
        cursor.execute("PRAGMA table_info(daily_progress)")
        columns = [column[1] for column in cursor.fetchall()]
        
        # Add water_glasses column if it doesn't exist
        if 'water_glasses' not in columns:
            print("Adding water_glasses column...")
            cursor.execute("ALTER TABLE daily_progress ADD COLUMN water_glasses INTEGER DEFAULT 0")
            print("✓ water_glasses column added")
        else:
            print("✓ water_glasses column already exists")
        
        # Add water_goal column if it doesn't exist
        if 'water_goal' not in columns:
            print("Adding water_goal column...")
            cursor.execute("ALTER TABLE daily_progress ADD COLUMN water_goal INTEGER DEFAULT 8")
            print("✓ water_goal column added")
        else:
            print("✓ water_goal column already exists")
        
        # Update existing records to have appropriate water goals
        print("Updating water goals based on body systems...")
        cursor.execute("""
            UPDATE daily_progress 
            SET water_goal = CASE 
                WHEN system_name = 'detox' THEN 10
                WHEN system_name = 'cardiovascular' THEN 9
                ELSE 8
            END + cannabis_sessions
            WHERE water_goal IS NULL OR water_goal = 8
        """)
        
        conn.commit()
        print("✓ Migration completed successfully!")
        
    except Exception as e:
        print(f"✗ Migration failed: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_database()
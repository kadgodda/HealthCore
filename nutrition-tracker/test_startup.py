#!/usr/bin/env python3
"""Test script to check if all modules load correctly"""

import sys
import traceback

def test_imports():
    """Test all imports"""
    print("Testing imports...")
    
    try:
        print("  - Testing database...")
        from app.database import engine, get_db, Base
        print("    ✓ Database imports OK")
    except Exception as e:
        print(f"    ✗ Database import failed: {e}")
        traceback.print_exc()
        return False
    
    try:
        print("  - Testing models...")
        from app.models import DailyProgress, ShoppingList, UserSettings
        print("    ✓ Models import OK")
    except Exception as e:
        print(f"    ✗ Models import failed: {e}")
        traceback.print_exc()
        return False
    
    try:
        print("  - Testing body systems data...")
        from app.data.body_systems import BODY_SYSTEMS, get_today_system, get_day_system
        print("    ✓ Body systems import OK")
        
        # Test that all days exist
        for day in ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]:
            system = get_day_system(day)
            if not system:
                print(f"    ✗ Missing system for {day}")
                return False
        print("    ✓ All days have systems")
        
    except Exception as e:
        print(f"    ✗ Body systems import failed: {e}")
        traceback.print_exc()
        return False
    
    try:
        print("  - Testing main app...")
        from app.main import app
        print("    ✓ Main app imports OK")
    except Exception as e:
        print(f"    ✗ Main app import failed: {e}")
        traceback.print_exc()
        return False
    
    print("\nAll imports successful!")
    return True

def test_database():
    """Test database connection"""
    print("\nTesting database connection...")
    
    try:
        from app.database import engine, SessionLocal
        from app.models import Base
        
        # Create tables
        Base.metadata.create_all(bind=engine)
        print("  ✓ Tables created successfully")
        
        # Test connection
        from sqlalchemy import text
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        print("  ✓ Database connection successful")
        
    except Exception as e:
        print(f"  ✗ Database test failed: {e}")
        traceback.print_exc()
        return False
    
    return True

def test_templates():
    """Test that template files exist"""
    print("\nChecking template files...")
    
    import os
    template_dir = "app/templates"
    required_templates = [
        "base.html",
        "daily_mission.html",
        "shopping_list.html",
        "week_overview.html",
        "components/food_target.html",
        "components/cannabis_tracker.html",
        "components/buffer_item.html",
        "components/metrics.html",
        "components/water_tracker.html"
    ]
    
    all_exist = True
    for template in required_templates:
        path = os.path.join(template_dir, template)
        if os.path.exists(path):
            print(f"  ✓ {template}")
        else:
            print(f"  ✗ {template} - MISSING!")
            all_exist = False
    
    return all_exist

if __name__ == "__main__":
    print("Body Systems Nutrition Tracker - Startup Test")
    print("=" * 50)
    
    all_ok = True
    
    if not test_imports():
        all_ok = False
    
    if not test_database():
        all_ok = False
    
    if not test_templates():
        all_ok = False
    
    print("\n" + "=" * 50)
    if all_ok:
        print("✓ All tests passed! The app should start correctly.")
        print("\nTo run the app: python run.py")
    else:
        print("✗ Some tests failed. Please fix the issues above.")
        sys.exit(1)
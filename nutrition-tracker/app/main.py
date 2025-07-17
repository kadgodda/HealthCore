from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from datetime import date, datetime
import json
import logging
import traceback

from app.database import engine, get_db
from app.models import Base, DailyProgress, ShoppingList, UserSettings
from app.data.body_systems import get_today_system, get_day_system, get_weekly_shopping_items

# Configure logging
logger = logging.getLogger(__name__)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Body Systems Nutrition Tracker")

# Add exception handler
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}")
    logger.error(f"Traceback: {traceback.format_exc()}")
    logger.error(f"Request URL: {request.url}")
    logger.error(f"Request method: {request.method}")
    return HTMLResponse(
        content=f"<h1>Internal Server Error</h1><p>{str(exc)}</p><pre>{traceback.format_exc()}</pre>",
        status_code=500
    )

# Middleware to log all requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"REQUEST: {request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"RESPONSE: {response.status_code}")
    return response

# Static files and templates
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

def get_or_create_daily_progress(db: Session, target_date: date = None):
    """Get or create daily progress for a given date"""
    if target_date is None:
        target_date = date.today()
    
    logger.info(f"Getting progress for date: {target_date}")
    
    # Get day of week
    days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    day_of_week = days[target_date.weekday()]
    logger.info(f"Day of week: {day_of_week}")
    
    # Get system for this day
    system = get_day_system(day_of_week)
    if not system:
        logger.error(f"No system found for day: {day_of_week}")
        raise ValueError(f"No system found for day: {day_of_week}")
    
    logger.info(f"System: {system['system']}")
    
    # Look for existing progress
    progress = db.query(DailyProgress).filter(
        DailyProgress.date == target_date
    ).first()
    
    if not progress:
        # Initialize targets data
        targets_data = {}
        for target in system["targets"]:
            targets_data[target["id"]] = {
                "completed": 0,
                "amount": target["amount"],
                "name": target["name"],
                "unit": target["unit"],
                "examples": target["examples"]
            }
        
        # Initialize buffer requirements
        buffer_requirements = {}
        for buffer in system["cannabis_buffers"]:
            buffer_requirements[buffer["id"]] = {
                "completed": 0,
                "amount": 0,  # Will be calculated based on sessions
                "name": buffer["name"],
                "unit": buffer["unit"],
                "per_session": buffer.get("per_session", False)
            }
        
        # Calculate initial water goal based on system
        water_goal = 8  # Default
        if system["system"] == "detox":
            water_goal = 10
        elif system["system"] == "cardiovascular":
            water_goal = 9
            
        progress = DailyProgress(
            date=target_date,
            day_of_week=day_of_week,
            system_name=system["system"],
            targets_data=targets_data,
            cannabis_sessions=0,
            buffer_requirements=buffer_requirements,
            completion_percentage=0.0,
            performance_metrics={"energy": 0, "focus": 0, "mood": 0},
            water_glasses=0,
            water_goal=water_goal
        )
        db.add(progress)
        db.commit()
        db.refresh(progress)
    
    return progress, system

def calculate_completion_percentage(progress: DailyProgress):
    """Calculate overall completion percentage"""
    targets = progress.targets_data
    buffers = progress.buffer_requirements
    
    # Calculate target completion
    target_total = sum(t["amount"] for t in targets.values())
    target_completed = sum(t["completed"] for t in targets.values())
    
    # Calculate buffer completion
    buffer_total = sum(b["amount"] for b in buffers.values() if b["amount"] > 0)
    buffer_completed = sum(b["completed"] for b in buffers.values())
    
    # Combined percentage
    total = target_total + buffer_total
    completed = target_completed + buffer_completed
    
    return (completed / total * 100) if total > 0 else 0

@app.get("/", response_class=HTMLResponse)
async def daily_mission(request: Request, day: str = None, db: Session = Depends(get_db)):
    """Main daily mission dashboard"""
    if day:
        # View specific day
        system = get_day_system(day.lower())
        if not system:
            # Invalid day, redirect to today
            return templates.TemplateResponse("daily_mission.html", {
                "request": request,
                "error": "Invalid day"
            })
        # Get or create progress for the current week's specified day
        from datetime import timedelta
        today = date.today()
        days_ahead = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].index(day.lower()) - today.weekday()
        target_date = today + timedelta(days=days_ahead)
        progress, _ = get_or_create_daily_progress(db, target_date)
        display_date = target_date.strftime("%A, %B %d")
    else:
        # Today's mission
        progress, system = get_or_create_daily_progress(db)
        display_date = date.today().strftime("%A, %B %d")
    
    # Calculate completion
    progress.completion_percentage = calculate_completion_percentage(progress)
    
    return templates.TemplateResponse("daily_mission.html", {
        "request": request,
        "system": system,
        "progress": progress,
        "display_date": display_date,
        "current_day": day or date.today().strftime("%A").lower()
    })

@app.post("/api/update-target")
async def update_target(
    request: Request,
    target_id: str = None,
    increment: int = 0,
    db: Session = Depends(get_db)
):
    """Update food target progress via HTMX"""
    logger.info(f"API CALL: /api/update-target - target_id={target_id}, increment={increment}")
    
    # Parse form data
    form_data = await request.form()
    target_id = form_data.get("target_id", target_id)
    increment = int(form_data.get("increment", increment))
    
    logger.info(f"Parsed data: target_id={target_id}, increment={increment}")
    
    progress, system = get_or_create_daily_progress(db)
    
    # Update target
    if target_id in progress.targets_data:
        current = progress.targets_data[target_id]["completed"]
        maximum = progress.targets_data[target_id]["amount"]
        new_value = max(0, min(maximum, current + increment))
        progress.targets_data[target_id]["completed"] = new_value
        
        # Mark as changed for SQLAlchemy
        progress.targets_data = dict(progress.targets_data)
        
        # Update completion percentage
        progress.completion_percentage = calculate_completion_percentage(progress)
        
        db.commit()
    
    # Return updated component
    return templates.TemplateResponse("components/food_target.html", {
        "request": request,
        "target": progress.targets_data[target_id],
        "target_id": target_id,
        "system_color": system["color"]
    })

@app.post("/api/log-cannabis-session")
async def log_cannabis_session(
    request: Request,
    action: str = "increment",
    db: Session = Depends(get_db)
):
    """Log cannabis session and update buffer requirements"""
    logger.info(f"API CALL: /api/log-cannabis-session - action={action}")
    
    # Parse form data
    form_data = await request.form()
    action = form_data.get("action", action)
    logger.info(f"Cannabis action: {action}")
    
    progress, system = get_or_create_daily_progress(db)
    
    # Update session count
    if action == "increment":
        progress.cannabis_sessions += 1
    elif action == "decrement" and progress.cannabis_sessions > 0:
        progress.cannabis_sessions -= 1
    
    # Update buffer requirements
    for buffer in system["cannabis_buffers"]:
        if buffer["id"] in progress.buffer_requirements:
            if buffer.get("per_session", False):
                # Update requirement based on sessions
                progress.buffer_requirements[buffer["id"]]["amount"] = (
                    buffer["amount"] * progress.cannabis_sessions
                )
            # Copy other buffer details
            progress.buffer_requirements[buffer["id"]]["examples"] = buffer.get("examples", [])
    
    # Mark as changed for SQLAlchemy
    progress.buffer_requirements = dict(progress.buffer_requirements)
    
    # Update water goal based on cannabis sessions
    base_water_goal = 8
    if system["system"] == "detox":
        base_water_goal = 10
    elif system["system"] == "cardiovascular":
        base_water_goal = 9
    progress.water_goal = base_water_goal + progress.cannabis_sessions
    
    # Update completion percentage
    progress.completion_percentage = calculate_completion_percentage(progress)
    
    db.commit()
    
    # Return both cannabis and water sections since water goal changes with cannabis
    return templates.TemplateResponse("components/cannabis_and_water.html", {
        "request": request,
        "progress": progress,
        "system": system
    })

@app.post("/api/update-buffer")
async def update_buffer(
    request: Request,
    buffer_id: str = None,
    increment: int = 0,
    db: Session = Depends(get_db)
):
    """Update buffer food progress"""
    # Parse form data
    form_data = await request.form()
    buffer_id = form_data.get("buffer_id", buffer_id)
    increment = int(form_data.get("increment", increment))
    
    progress, system = get_or_create_daily_progress(db)
    
    # Update buffer
    if buffer_id in progress.buffer_requirements:
        current = progress.buffer_requirements[buffer_id]["completed"]
        maximum = progress.buffer_requirements[buffer_id]["amount"]
        new_value = max(0, min(maximum, current + increment))
        progress.buffer_requirements[buffer_id]["completed"] = new_value
        
        # Mark as changed for SQLAlchemy
        progress.buffer_requirements = dict(progress.buffer_requirements)
        
        # Update completion percentage
        progress.completion_percentage = calculate_completion_percentage(progress)
        
        db.commit()
    
    # Find buffer details from system data
    buffer_details = None
    for buffer in system["cannabis_buffers"]:
        if buffer["id"] == buffer_id:
            buffer_details = buffer
            break
    
    # Return updated component
    return templates.TemplateResponse("components/buffer_item.html", {
        "request": request,
        "buffer": progress.buffer_requirements[buffer_id],
        "buffer_id": buffer_id,
        "buffer_details": buffer_details,
        "system_color": system["color"]
    })

@app.get("/shopping-list", response_class=HTMLResponse)
async def shopping_list(request: Request, db: Session = Depends(get_db)):
    """Generate and display shopping list"""
    weekly_list = get_weekly_shopping_items()
    
    # Get user settings for adjustments
    settings = db.query(UserSettings).first()
    if not settings:
        settings = UserSettings()
        db.add(settings)
        db.commit()
    
    return templates.TemplateResponse("shopping_list.html", {
        "request": request,
        "shopping_list": weekly_list,
        "settings": settings
    })

@app.get("/api/shopping-list/export")
async def export_shopping_list(db: Session = Depends(get_db)):
    """Export shopping list in Instacart-friendly format"""
    weekly_list = get_weekly_shopping_items()
    
    # Flatten into simple list
    export_list = []
    for category, items in weekly_list.items():
        export_list.extend(items)
    
    return {
        "items": export_list,
        "total_items": len(export_list),
        "generated_date": datetime.now().isoformat()
    }

@app.post("/api/update-metric")
async def update_metric(
    request: Request,
    metric: str = None,
    value: int = 0,
    db: Session = Depends(get_db)
):
    """Update performance metrics (energy, focus, mood)"""
    logger.info(f"API CALL: /api/update-metric - metric={metric}, value={value}")
    
    # Parse form data
    form_data = await request.form()
    metric = form_data.get("metric", metric)
    value = int(form_data.get("value", value))
    logger.info(f"Updating metric: {metric} = {value}")
    
    progress, system = get_or_create_daily_progress(db)
    
    # Update metric
    if metric in ["energy", "focus", "mood"]:
        progress.performance_metrics[metric] = value
        # Mark as changed for SQLAlchemy
        progress.performance_metrics = dict(progress.performance_metrics)
        db.commit()
    
    # Return updated metrics section
    return templates.TemplateResponse("components/metrics.html", {
        "request": request,
        "progress": progress
    })

@app.post("/api/update-water")
async def update_water(
    request: Request,
    action: str = "increment",
    db: Session = Depends(get_db)
):
    """Update water intake"""
    # Parse form data
    form_data = await request.form()
    action = form_data.get("action", action)
    
    progress, system = get_or_create_daily_progress(db)
    
    # Update water glasses
    if action == "increment":
        progress.water_glasses += 1
    elif action == "decrement" and progress.water_glasses > 0:
        progress.water_glasses -= 1
    
    # Check if system has special water requirements
    water_goal = 8  # Default
    if system["system"] == "detox":
        water_goal = 10  # More water for detox day
    elif system["system"] == "cardiovascular":
        water_goal = 9  # Extra for cardiovascular
        
    # Add extra water for cannabis sessions
    water_goal += progress.cannabis_sessions
    
    progress.water_goal = water_goal
    
    db.commit()
    
    # Return updated water tracker
    return templates.TemplateResponse("components/water_tracker.html", {
        "request": request,
        "progress": progress,
        "system": system
    })

@app.get("/week-overview", response_class=HTMLResponse)
async def week_overview(request: Request, db: Session = Depends(get_db)):
    """Show weekly overview of all body systems"""
    from datetime import timedelta
    today = date.today()
    start_of_week = today - timedelta(days=today.weekday())
    
    # Get progress for all days of current week
    week_data = []
    for i, day_name in enumerate(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]):
        target_date = start_of_week + timedelta(days=i)
        progress, system = get_or_create_daily_progress(db, target_date)
        progress.completion_percentage = calculate_completion_percentage(progress)
        
        week_data.append({
            "day_name": day_name.capitalize(),
            "date": target_date,
            "system": system,
            "progress": progress,
            "is_today": target_date == today,
            "is_future": target_date > today
        })
    
    return templates.TemplateResponse("week_overview.html", {
        "request": request,
        "week_data": week_data,
        "week_start": start_of_week.strftime("%B %d"),
        "week_end": (start_of_week + timedelta(days=6)).strftime("%B %d, %Y")
    })

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}
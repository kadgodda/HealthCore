"""API routes for game state management."""
from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any
from services.game_service import game_service

router = APIRouter(prefix="/api/game", tags=["game"])


@router.get("/state/{user_id}")
async def get_game_state(user_id: str):
    """Get current game state for a user."""
    game_state = game_service.get_game_state(user_id)
    return {
        "success": True,
        "data": game_state
    }


@router.post("/mission-complete")
async def complete_mission(
    user_id: str = Body(...),
    mission_id: str = Body(...),
    completion_data: Dict[str, Any] = Body(...)
):
    """Handle mission completion."""
    result = game_service.complete_mission(user_id, mission_id, completion_data)
    return result


@router.post("/level-up")
async def level_up(
    user_id: str = Body(...),
    level: int = Body(...),
    time_window: str = Body(...)
):
    """Handle level up."""
    result = game_service.level_up(user_id, level, time_window)
    return result


@router.post("/reset/{user_id}")
async def reset_game_state(user_id: str):
    """Reset game state for a user."""
    result = game_service.reset_game_state(user_id)
    return result
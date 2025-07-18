"""API routes for missions."""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from services.mission_service import mission_service

router = APIRouter(prefix="/api/missions", tags=["missions"])


@router.get("/{time_window}/{level}")
async def get_missions(time_window: str, level: int):
    """Get missions for a specific time window and level."""
    try:
        missions = mission_service.get_missions(time_window, level)
        return {
            "success": True,
            "data": missions,
            "count": len(missions)
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/")
async def get_all_missions():
    """Get all missions organized by time window and level."""
    missions = mission_service.get_all_missions()
    return {
        "success": True,
        "data": missions
    }


@router.get("/by-id/{mission_id}")
async def get_mission_by_id(mission_id: str):
    """Get a specific mission by ID."""
    mission = mission_service.get_mission_by_id(mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    
    return {
        "success": True,
        "data": mission
    }


@router.get("/by-category/{category}")
async def get_missions_by_category(category: str):
    """Get all missions of a specific category."""
    missions = mission_service.get_missions_by_category(category)
    return {
        "success": True,
        "data": missions,
        "count": len(missions)
    }


@router.get("/by-receptor/{receptor}")
async def get_missions_by_receptor(receptor: str):
    """Get all missions that target a specific receptor."""
    missions = mission_service.get_missions_by_receptor(receptor)
    return {
        "success": True,
        "data": missions,
        "count": len(missions)
    }
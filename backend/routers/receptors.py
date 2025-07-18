"""API routes for receptor data and status."""
from fastapi import APIRouter, HTTPException, Body, Query
from typing import List, Optional
from services.receptor_service import receptor_service
from models.nutrition import NutrientInput

router = APIRouter(prefix="/api/receptors", tags=["receptors"])


@router.post("/status")
async def get_receptor_status(
    nutrients: List[NutrientInput] = Body(...),
    user_id: Optional[str] = Query(None)
):
    """Calculate receptor status based on nutrient inputs."""
    status = receptor_service.get_receptor_status(nutrients, user_id)
    
    # Convert to serializable format
    status_dict = {}
    for system_key, system_status in status.items():
        status_dict[system_key] = {
            "system": system_status.system.value,
            "efficiency": system_status.efficiency,
            "active_receptors": system_status.active_receptors,
            "receptor_details": [
                {
                    "receptor_type": rd.receptor_type.value,
                    "efficiency_percentage": rd.efficiency_percentage,
                    "limiting_factors": rd.limiting_factors,
                    "enhancement_factors": rd.enhancement_factors
                }
                for rd in system_status.receptor_details
            ],
            "last_updated": system_status.last_updated.isoformat(),
            "notes": system_status.notes
        }
    
    return {
        "success": True,
        "data": status_dict
    }


@router.get("/info/{receptor_name}")
async def get_receptor_info(receptor_name: str):
    """Get detailed information about a specific receptor."""
    info = receptor_service.get_receptor_info(receptor_name)
    if not info:
        raise HTTPException(status_code=404, detail="Receptor not found")
    
    return {
        "success": True,
        "data": info
    }


@router.get("/system/{system}")
async def get_system_receptors(system: str):
    """Get all receptors for a specific body system."""
    receptors = receptor_service.get_system_receptors(system)
    if not receptors:
        raise HTTPException(status_code=404, detail="System not found")
    
    return {
        "success": True,
        "data": receptors,
        "count": len(receptors)
    }


@router.get("/systems")
async def get_all_systems():
    """Get information about all body systems."""
    systems = receptor_service.receptor_data
    
    # Format for response
    systems_info = {}
    for system_key, system_data in systems.items():
        systems_info[system_key] = {
            "name": system_data.get("name", ""),
            "icon": system_data.get("icon", ""),
            "description": system_data.get("description", ""),
            "receptor_count": len(system_data.get("receptors", {}))
        }
    
    return {
        "success": True,
        "data": systems_info
    }
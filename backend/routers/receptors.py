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
    
    # Convert to frontend-friendly format with clusters
    status_dict = {}
    for system_key, system_status in status.items():
        # Get system data
        system_data = receptor_service.receptor_data.get(system_key, {})
        
        # Create clusters from receptors
        clusters = []
        for receptor_key, receptor_info in system_data.get('receptors', {}).items():
            # Find corresponding efficiency data
            receptor_efficiency = next(
                (rd for rd in system_status.receptor_details 
                 if receptor_info.get('primary_receptor', '').lower() in rd.receptor_type.value.lower()),
                None
            )
            
            # Determine status based on efficiency
            efficiency = receptor_efficiency.efficiency_percentage if receptor_efficiency else 100
            if efficiency >= 90:
                status_level = 'optimal'
            elif efficiency >= 70:
                status_level = 'good'
            elif efficiency >= 50:
                status_level = 'attention'
            else:
                status_level = 'concern'
            
            # Get current nutrients affecting this receptor
            current_nutrients = []
            if receptor_efficiency:
                current_nutrients = (
                    receptor_efficiency.enhancement_factors + 
                    receptor_efficiency.limiting_factors
                )
            
            clusters.append({
                "id": receptor_key,
                "name": receptor_info.get("name", receptor_key),
                "icon": receptor_info.get("icon", "🔬"),
                "description": receptor_info.get("description", ""),
                "status": status_level,
                "efficiency": int(efficiency),
                "receptors": [receptor_info.get("primary_receptor", "")],
                "currentNutrients": current_nutrients,
                "recommendations": receptor_info.get("recommendations", [])
            })
        
        # Generate dynamic commentary
        commentary = receptor_service.generate_expert_commentary(
            system_key, 
            system_status.efficiency,
            nutrients
        )
        
        status_dict[system_key] = {
            "system": system_status.system.value,
            "efficiency": system_status.efficiency,
            "active_receptors": system_status.active_receptors,
            "clusters": clusters,
            "commentary": commentary,
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
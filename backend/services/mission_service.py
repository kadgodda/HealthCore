"""Mission service for managing nutrition game missions."""
from typing import List, Dict, Any, Optional
from datetime import datetime
from data.missions import MISSIONS_DATA, MissionCategory, RequirementType


class MissionService:
    """Service for managing nutrition game missions."""
    
    def __init__(self):
        self.missions_data = MISSIONS_DATA
        
    def get_missions(self, time_window: str, level: int) -> List[Dict[str, Any]]:
        """Get missions for a specific time window and level."""
        level_key = f"level{level}"
        
        if time_window not in self.missions_data:
            raise ValueError(f"Invalid time window: {time_window}")
            
        if level_key not in self.missions_data[time_window]:
            raise ValueError(f"Invalid level: {level} for time window: {time_window}")
            
        # Convert enum values to strings for JSON serialization
        missions = []
        for mission in self.missions_data[time_window][level_key]:
            mission_copy = mission.copy()
            if isinstance(mission_copy.get('category'), MissionCategory):
                mission_copy['category'] = mission_copy['category'].value
                
            # Convert requirement types to strings
            if 'requirements' in mission_copy:
                for req in mission_copy['requirements']:
                    if isinstance(req.get('type'), RequirementType):
                        req['type'] = req['type'].value
                        
            missions.append(mission_copy)
            
        return missions
    
    def get_mission_by_id(self, mission_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific mission by ID."""
        for time_window in self.missions_data:
            for level_key in self.missions_data[time_window]:
                for mission in self.missions_data[time_window][level_key]:
                    if mission['id'] == mission_id:
                        mission_copy = mission.copy()
                        if isinstance(mission_copy.get('category'), MissionCategory):
                            mission_copy['category'] = mission_copy['category'].value
                        return mission_copy
        return None
    
    def get_all_missions(self) -> Dict[str, Dict[str, List[Dict[str, Any]]]]:
        """Get all missions organized by time window and level."""
        all_missions = {}
        
        for time_window in self.missions_data:
            all_missions[time_window] = {}
            for level_key in self.missions_data[time_window]:
                missions = []
                for mission in self.missions_data[time_window][level_key]:
                    mission_copy = mission.copy()
                    if isinstance(mission_copy.get('category'), MissionCategory):
                        mission_copy['category'] = mission_copy['category'].value
                    missions.append(mission_copy)
                all_missions[time_window][level_key] = missions
                
        return all_missions
    
    def get_missions_by_category(self, category: str) -> List[Dict[str, Any]]:
        """Get all missions of a specific category."""
        missions = []
        
        for time_window in self.missions_data:
            for level_key in self.missions_data[time_window]:
                for mission in self.missions_data[time_window][level_key]:
                    mission_category = mission.get('category')
                    if isinstance(mission_category, MissionCategory):
                        mission_category = mission_category.value
                        
                    if mission_category == category:
                        mission_copy = mission.copy()
                        mission_copy['category'] = mission_category
                        missions.append(mission_copy)
                        
        return missions
    
    def get_missions_by_receptor(self, receptor: str) -> List[Dict[str, Any]]:
        """Get all missions that target a specific receptor."""
        missions = []
        
        for time_window in self.missions_data:
            for level_key in self.missions_data[time_window]:
                for mission in self.missions_data[time_window][level_key]:
                    if receptor in mission.get('targetReceptors', []):
                        mission_copy = mission.copy()
                        if isinstance(mission_copy.get('category'), MissionCategory):
                            mission_copy['category'] = mission_copy['category'].value
                        missions.append(mission_copy)
                        
        return missions


# Singleton instance
mission_service = MissionService()
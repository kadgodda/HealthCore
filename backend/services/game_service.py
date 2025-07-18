"""Game service for managing nutrition game state and progress."""
from typing import Dict, List, Any, Optional
from datetime import datetime
from dataclasses import dataclass, field
from enum import Enum


class TimeWindow(str, Enum):
    MORNING = "morning"
    MIDDAY = "midday"
    AFTERNOON = "afternoon"
    EVENING = "evening"


@dataclass
class GameState:
    """Game state for a user."""
    user_id: str
    current_level: int = 1
    total_points: float = 0.0
    mission_progress: Dict[str, Dict[str, bool]] = field(default_factory=dict)
    requirement_progress: Dict[str, Dict[str, bool]] = field(default_factory=dict)
    level_progress: Dict[str, Dict[str, Any]] = field(default_factory=dict)
    completed_missions: List[str] = field(default_factory=list)
    achievements: List[str] = field(default_factory=list)
    last_updated: datetime = field(default_factory=datetime.now)
    

class GameService:
    """Service for managing game state and progress."""
    
    def __init__(self):
        # In a real app, this would be backed by a database
        self.game_states: Dict[str, GameState] = {}
        
    def get_or_create_game_state(self, user_id: str) -> GameState:
        """Get existing game state or create new one."""
        if user_id not in self.game_states:
            self.game_states[user_id] = GameState(
                user_id=user_id,
                level_progress={
                    "level1": {
                        "completed": 0,
                        "total": 4,
                        "canLevelUp": False,
                        "leveledUpAt": None
                    },
                    "level2": {
                        "locked": True,
                        "completed": 0,
                        "total": 3,
                        "canLevelUp": False,
                        "leveledUpAt": None
                    },
                    "level3": {
                        "locked": True,
                        "completed": 0,
                        "total": 2,
                        "canLevelUp": False,
                        "leveledUpAt": None
                    }
                }
            )
        return self.game_states[user_id]
    
    def complete_mission(
        self, 
        user_id: str,
        mission_id: str,
        completion_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Handle mission completion."""
        game_state = self.get_or_create_game_state(user_id)
        
        # Track requirement completion
        requirement_id = completion_data.get('requirementId')
        if requirement_id:
            if mission_id not in game_state.requirement_progress:
                game_state.requirement_progress[mission_id] = {}
            game_state.requirement_progress[mission_id][requirement_id] = True
        
        # Calculate points earned
        points_earned = completion_data.get('pointsEarned', 0)
        game_state.total_points += points_earned
        
        # Check if all requirements are complete for this mission
        # In a real app, we'd check against the mission definition
        # For now, assume 4 requirements per mission
        requirements_complete = len(game_state.requirement_progress.get(mission_id, {}))
        mission_complete = requirements_complete >= 4  # Placeholder
        
        if mission_complete and mission_id not in game_state.completed_missions:
            game_state.completed_missions.append(mission_id)
            
            # Update level progress
            current_level_key = f"level{game_state.current_level}"
            if current_level_key in game_state.level_progress:
                level_data = game_state.level_progress[current_level_key]
                level_data['completed'] += 1
                
                # Check if can level up
                if level_data['completed'] >= level_data['total']:
                    level_data['canLevelUp'] = True
        
        # Update last modified
        game_state.last_updated = datetime.now()
        
        return {
            "success": True,
            "pointsEarned": points_earned,
            "newAchievements": [],
            "levelUpAvailable": game_state.level_progress[f"level{game_state.current_level}"].get('canLevelUp', False),
            "missionComplete": mission_complete,
            "totalPoints": game_state.total_points
        }
    
    def level_up(
        self,
        user_id: str,
        level: int,
        time_window: str
    ) -> Dict[str, Any]:
        """Handle level up."""
        game_state = self.get_or_create_game_state(user_id)
        
        # Update current level
        game_state.current_level = level
        
        # Mark level as completed
        level_key = f"level{level}"
        if level_key in game_state.level_progress:
            game_state.level_progress[level_key]['leveledUpAt'] = datetime.now().isoformat()
            game_state.level_progress[level_key]['canLevelUp'] = False
        
        # Unlock next level
        next_level_key = f"level{level + 1}"
        if next_level_key in game_state.level_progress:
            game_state.level_progress[next_level_key]['locked'] = False
        
        # Generate insight (placeholder)
        insight = {
            "title": f"Welcome to Level {level + 1}!",
            "content": "You've unlocked new nutritional optimization strategies.",
            "highlights": [
                {
                    "value": f"{game_state.total_points:.0f}",
                    "label": "Total Points",
                    "explanation": "Keep up the great work!"
                }
            ]
        }
        
        return {
            "success": True,
            "newLevel": level + 1,
            "unlockedMissions": [],
            "specialRewards": [],
            "insight": insight,
            "achievements": [],
            "bonusPoints": 100,
            "nextLevelMissions": []
        }
    
    def get_game_state(self, user_id: str) -> Dict[str, Any]:
        """Get current game state for a user."""
        game_state = self.get_or_create_game_state(user_id)
        
        return {
            "userId": game_state.user_id,
            "currentLevel": game_state.current_level,
            "totalPoints": game_state.total_points,
            "missionProgress": game_state.mission_progress,
            "requirementProgress": game_state.requirement_progress,
            "levelProgress": game_state.level_progress,
            "completedMissions": game_state.completed_missions,
            "achievements": game_state.achievements,
            "lastUpdated": game_state.last_updated.isoformat()
        }
    
    def reset_game_state(self, user_id: str) -> Dict[str, Any]:
        """Reset game state for a user."""
        if user_id in self.game_states:
            del self.game_states[user_id]
        
        # Create fresh state
        new_state = self.get_or_create_game_state(user_id)
        
        return {
            "success": True,
            "message": "Game state reset successfully",
            "gameState": self.get_game_state(user_id)
        }


# Singleton instance
game_service = GameService()
import React, { useState } from 'react';
import DailyReceptorDashboard from './DailyReceptorDashboard';
import { GameState, TimeWindow, Level, MissionCompletionData, CannabisConsumption } from '../../types/nutrition-game';
import { getMissionsByTimeWindow } from '../../data/missions';

// Create initial game state with mission data
const createInitialGameState = (): GameState => {
  const now = new Date();
  const timeWindows: TimeWindow[] = ['morning', 'midday', 'afternoon', 'evening'];
  
  const levels: GameState['levels'] = {} as GameState['levels'];
  
  timeWindows.forEach(window => {
    const level1Missions = getMissionsByTimeWindow(window).filter(m => m.level === 1);
    const level2Missions = getMissionsByTimeWindow(window).filter(m => m.level === 2);
    const level3Missions = getMissionsByTimeWindow(window).filter(m => m.level === 3);
    
    levels[window] = {
      level1: {
        level: 1,
        timeWindow: window,
        missions: level1Missions,
        completed: 0, // Start fresh with no completions
        total: level1Missions.length,
        canLevelUp: false,
        progress: {}
      },
      level2: {
        level: 2,
        timeWindow: window,
        missions: level2Missions,
        completed: 0,
        total: level2Missions.length,
        canLevelUp: false,
        progress: {}
      },
      level3: {
        level: 3,
        timeWindow: window,
        missions: level3Missions,
        completed: 0,
        total: level3Missions.length,
        canLevelUp: false,
        progress: {}
      }
    };
  });

  return {
    id: `game-${Date.now()}`,
    userId: 'demo-user',
    currentDate: now.toISOString().split('T')[0],
    levels,
    dailyProgress: {}, // Start with empty progress
    requirementProgress: {}, // Track individual requirements
    dailyPoints: 0, // Start with 0 points
    totalPoints: 0,
    streakDays: 0,
    unlockedAchievements: [],
    currentLevel: 1,
    lastActiveDate: now.toISOString()
  };
};

const NutritionGameWrapper: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());

  const handleMissionComplete = async (missionId: string, data: MissionCompletionData) => {
    
    // Handle requirement completion
    setGameState(prev => {
      const newState = { ...prev };
      
      // Initialize requirement progress if needed
      if (!newState.requirementProgress[missionId]) {
        newState.requirementProgress[missionId] = {};
      }
      
      // Mark requirement as completed
      if (data.requirementId) {
        newState.requirementProgress[missionId][data.requirementId] = true;
      }
      
      // Award points for this requirement
      const pointsEarned = data.pointsEarned || 0;
      newState.dailyPoints = prev.dailyPoints + pointsEarned;
      newState.totalPoints = prev.totalPoints + pointsEarned;
      
      // Find the mission to check if all requirements are complete
      let mission = null;
      let timeWindow: TimeWindow | null = null;
      let level: Level | null = null;
      
      // Search for the mission across all levels and time windows
      Object.entries(newState.levels).forEach(([tw, levels]) => {
        Object.entries(levels).forEach(([lvl, levelData]) => {
          levelData.missions.forEach(m => {
            if (m.id === missionId) {
              mission = m;
              timeWindow = tw as TimeWindow;
              level = parseInt(lvl.replace('level', '')) as Level;
            }
          });
        });
      });
      
      if (mission && timeWindow && level) {
        // Check if all requirements are completed
        const requirementIds = mission.requirements.map((_, idx) => `${missionId}-req-${idx}`);
        const allRequirementsComplete = requirementIds.every(reqId => 
          newState.requirementProgress[missionId]?.[reqId] === true
        );
        
        // Initialize mission progress if needed
        if (!newState.dailyProgress[missionId]) {
          newState.dailyProgress[missionId] = {
            missionId,
            completed: false,
            progress: 0,
            requirementsCompleted: 0,
            totalRequirements: mission.requirements.length
          };
        }
        
        // Update mission progress
        const completedCount = requirementIds.filter(reqId => 
          newState.requirementProgress[missionId]?.[reqId] === true
        ).length;
        
        newState.dailyProgress[missionId].requirementsCompleted = completedCount;
        newState.dailyProgress[missionId].progress = Math.round((completedCount / mission.requirements.length) * 100);
        
        // If all requirements are complete and mission wasn't already marked complete
        if (allRequirementsComplete && !newState.dailyProgress[missionId].completed) {
          newState.dailyProgress[missionId].completed = true;
          newState.dailyProgress[missionId].completedAt = new Date().toISOString();
          
          // Update level completion count
          const levelKey = `level${level}` as 'level1' | 'level2' | 'level3';
          if (newState.levels[timeWindow] && newState.levels[timeWindow][levelKey]) {
            newState.levels[timeWindow][levelKey].completed += 1;
            
            // Check if can level up
            const levelData = newState.levels[timeWindow][levelKey];
            if (levelData.completed >= levelData.total && !levelData.canLevelUp) {
              levelData.canLevelUp = true;
            }
          }
        }
      }
      
      return newState;
    });

    // Return success response
    return {
      success: true,
      pointsEarned: data.pointsEarned || 0,
      newAchievements: [],
      levelUpAvailable: false
    };
  };

  const handleLevelUp = async (level: Level, timeWindow: TimeWindow) => {
    
    // Update game state
    setGameState(prev => {
      const newState = { ...prev };
      newState.currentLevel = Math.max(prev.currentLevel, level + 1);
      
      // Mark the level as completed
      const levelKey = `level${level}` as 'level1' | 'level2' | 'level3';
      if (newState.levels[timeWindow] && newState.levels[timeWindow][levelKey]) {
        newState.levels[timeWindow][levelKey].leveledUpAt = new Date().toISOString();
      }
      
      return newState;
    });

    // Return success response
    return {
      success: true,
      newLevel: level + 1,
      unlockedMissions: [],
      specialRewards: []
    };
  };

  const handleCannabisUpdate = (consumption: CannabisConsumption) => {
    // Handle cannabis update logic here
  };
  
  // Debug function to reset state
  const resetGameState = () => {
    setGameState(createInitialGameState());
  };

  return (
    <DailyReceptorDashboard
      userId="demo-user"
      initialGameState={gameState}
      onMissionComplete={handleMissionComplete}
      onLevelUp={handleLevelUp}
      onCannabisUpdate={handleCannabisUpdate}
      onReset={resetGameState}
    />
  );
};

export default NutritionGameWrapper;
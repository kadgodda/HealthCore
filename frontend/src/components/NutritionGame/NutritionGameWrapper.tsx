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
        completed: window === 'morning' ? 2 : 0, // 2 completed in morning for demo
        total: level1Missions.length,
        canLevelUp: window === 'morning' && level1Missions.length === 4, // Can level up if 3/4 complete
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
    dailyProgress: {
      // Pre-populate some completed missions for demo
      'morning-l1-hydration': {
        missionId: 'morning-l1-hydration',
        completed: true,
        progress: 100,
        completedAt: new Date().toISOString(),
        completedRequirements: [{
          requirementId: 'water-16oz',
          completedValue: '18',
          completedUnit: 'oz'
        }]
      },
      'morning-l1-movement': {
        missionId: 'morning-l1-movement',
        completed: true,
        progress: 100,
        completedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
        completedRequirements: [{
          requirementId: 'cardio-10min',
          completedValue: '12',
          completedUnit: 'minutes'
        }]
      },
      'morning-l1-iron': {
        missionId: 'morning-l1-iron',
        completed: false,
        progress: 60,
        startedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString() // 15 mins ago
      }
    },
    dailyPoints: 110, // 50 + 60 from completed missions
    totalPoints: 847,
    streakDays: 5,
    unlockedAchievements: [],
    currentLevel: 1,
    lastActiveDate: now.toISOString()
  };
};

const NutritionGameWrapper: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());

  const handleMissionComplete = async (missionId: string, data: MissionCompletionData) => {
    console.log('Mission completed:', missionId, data);
    
    // Find the mission to get base points
    let basePoints = 80; // default
    gameState.levels.morning.level1.missions.forEach(m => {
      if (m.id === missionId) basePoints = m.basePoints;
    });
    gameState.levels.morning.level2.missions.forEach(m => {
      if (m.id === missionId) basePoints = m.basePoints;
    });
    gameState.levels.morning.level3.missions.forEach(m => {
      if (m.id === missionId) basePoints = m.basePoints;
    });
    
    const pointsEarned = data.pointsEarned || basePoints;
    
    // Update game state
    setGameState(prev => {
      const newState = {
        ...prev,
        dailyProgress: {
          ...prev.dailyProgress,
          [missionId]: {
            missionId,
            completed: true,
            progress: 100,
            completedAt: new Date().toISOString(),
            completedRequirements: data.completedItems
          }
        },
        dailyPoints: prev.dailyPoints + pointsEarned,
        totalPoints: prev.totalPoints + pointsEarned
      };
      
      // Update level completion counts
      const timeWindow = missionId.split('-')[0] as TimeWindow;
      const level = parseInt(missionId.split('-')[1].replace('l', '')) as Level;
      const levelKey = `level${level}` as 'level1' | 'level2' | 'level3';
      
      if (newState.levels[timeWindow] && newState.levels[timeWindow][levelKey]) {
        newState.levels[timeWindow][levelKey].completed += 1;
        
        // Check if can level up
        const levelData = newState.levels[timeWindow][levelKey];
        if (levelData.completed === levelData.total) {
          levelData.canLevelUp = true;
        }
      }
      
      return newState;
    });

    // Return success response
    return {
      success: true,
      pointsEarned: pointsEarned,
      newAchievements: [],
      levelUpAvailable: false
    };
  };

  const handleLevelUp = async (level: Level, timeWindow: TimeWindow) => {
    console.log('Level up:', level, timeWindow);
    
    // Update game state
    setGameState(prev => ({
      ...prev,
      currentLevel: Math.max(prev.currentLevel, level + 1)
    }));

    // Return success response
    return {
      success: true,
      newLevel: level + 1,
      unlockedMissions: [],
      specialRewards: []
    };
  };

  const handleCannabisUpdate = (consumption: CannabisConsumption) => {
    console.log('Cannabis consumption updated:', consumption);
    // Handle cannabis update logic here
  };

  return (
    <DailyReceptorDashboard
      userId="demo-user"
      initialGameState={gameState}
      onMissionComplete={handleMissionComplete}
      onLevelUp={handleLevelUp}
      onCannabisUpdate={handleCannabisUpdate}
    />
  );
};

export default NutritionGameWrapper;
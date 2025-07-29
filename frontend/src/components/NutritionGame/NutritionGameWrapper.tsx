import React, { useEffect } from 'react';
import { useNutritionStore } from '../../store/nutritionStore';
import DailyReceptorDashboard from './DailyReceptorDashboard';
import { 
  TimeWindow, 
  Level, 
  MissionCompletionData, 
  CannabisConsumption 
} from '../../types/nutrition-game';
import { Card, Spinner, Alert, AlertDescription } from '../../lib/anteacore-bridge';

const NutritionGameWrapper: React.FC = () => {
  const {
    gameState,
    missions,
    cannabisStatus,
    isLoading,
    error,
    fetchMissions,
    syncGameState,
    updateMissionProgress,
    levelUp,
    updateCannabisConsumption,
    toggleCannabisTracking,
    resetGame
  } = useNutritionStore();

  // Get current time window
  const getCurrentTimeWindow = (): TimeWindow => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'morning';
    if (hour >= 11 && hour < 14) return 'midday';
    if (hour >= 14 && hour < 17) return 'afternoon';
    return 'evening';
  };

  const currentTimeWindow = getCurrentTimeWindow();

  // Load initial data with proper dependency tracking
  useEffect(() => {
    let mounted = true;
    
    const loadInitialData = async () => {
      if (!mounted) return;
      
      try {
        // Sync game state from backend
        await syncGameState();
        
        if (!mounted) return;
        
        // Load missions for ALL time windows and ALL levels
        const timeWindows: TimeWindow[] = ['morning', 'midday', 'afternoon', 'evening'];
        const levels: Level[] = [1, 2, 3];
        
        for (const window of timeWindows) {
          for (const level of levels) {
            if (!mounted) return;
            await fetchMissions(window, level);
          }
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };
    
    loadInitialData();
    
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array means this runs once on mount

  // Handle mission completion
  const handleMissionComplete = async (missionId: string, data: MissionCompletionData) => {
    await updateMissionProgress(missionId, data);
    
    // Return the expected response format
    return {
      success: true,
      pointsEarned: data.pointsEarned || 0,
      newLevelUnlocked: false,
      nextSuggestions: [],
      updatedGameState: transformGameState()
    };
  };

  // Handle level up
  const handleLevelUp = async (level: Level, timeWindow: TimeWindow) => {
    try {
      const result = await levelUp(level, timeWindow);
      
      // Return level up data for celebration modal
      const defaultInsight = {
        id: `level-${level}-${timeWindow}`,
        level: `Level ${level + 1}`,
        timeWindow,
        title: 'Level Up!',
        subtitle: 'Achievement Unlocked',
        content: `Congratulations! You've reached Level ${level + 1} in the ${timeWindow} window.`,
        highlights: [
          {
            value: `${gameState.totalPoints}`,
            label: 'Total Points',
            explanation: 'Keep up the great work!'
          }
        ]
      };
      
      return {
        success: true,
        insight: result.insight || defaultInsight,
        achievements: result.achievements || [],
        bonusPoints: result.bonusPoints || 100,
        nextLevelMissions: []
      };
    } catch (error) {
      console.error('Failed to level up:', error);
      throw error; // Let the component handle the error
    }
  };

  // Handle cannabis update
  const handleCannabisUpdate = (consumption: CannabisConsumption) => {
    updateCannabisConsumption(consumption);
  };

  // Handle cannabis toggle
  const handleCannabisToggle = () => {
    toggleCannabisTracking();
  };

  // Handle reset
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your progress? This cannot be undone.')) {
      resetGame();
    }
  };

  // Get missions for current time window
  const getMissionsForDisplay = () => {
    const timeWindowMissions = missions[currentTimeWindow] || {};
    return {
      level1: timeWindowMissions.level1 || [],
      level2: timeWindowMissions.level2 || [],
      level3: timeWindowMissions.level3 || []
    };
  };

  // Transform backend game state to frontend format
  const transformGameState = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Debug log to see what missions we have
    console.log('Missions data:', missions);
    console.log('Current time window:', currentTimeWindow);
    
    // Build the complex levels structure expected by DailyReceptorDashboard
    const levels = {} as any;
    
    // Initialize all time windows
    ['morning', 'midday', 'afternoon', 'evening'].forEach((window) => {
      levels[window] = {};
      
      // Initialize all levels for each time window
      [1, 2, 3].forEach((level) => {
        const levelKey = `level${level}`;
        const missionsList = missions[window as TimeWindow]?.[levelKey as `level${Level}`] || [];
        
        // Debug specific window/level
        if (window === currentTimeWindow) {
          console.log(`Missions for ${window} ${levelKey}:`, missionsList);
        }
        
        levels[window][levelKey] = {
          level: level as Level,
          timeWindow: window as TimeWindow,
          completed: gameState.levelProgress[levelKey]?.completed || 0,
          total: missionsList.length || gameState.levelProgress[levelKey]?.total || 4,
          missions: missionsList,
          canLevelUp: gameState.levelProgress[levelKey]?.canLevelUp || false,
          leveledUpAt: gameState.levelProgress[levelKey]?.leveledUpAt
        };
      });
    });
    
    return {
      id: gameState.userId + '-' + currentDate,
      userId: gameState.userId,
      currentDate,
      currentTimeWindow,
      levels,
      dailyPoints: gameState.totalPoints,
      totalPoints: gameState.totalPoints,
      streakDays: 0, // TODO: Calculate from backend
      unlockedAchievements: gameState.achievements || [],
      currentLevel: gameState.currentLevel,
      lastActiveDate: currentDate,
      totalLevelUps: 0,
      cannabisStatus,
      dailyProgress: gameState.missionProgress || {},
      requirementProgress: gameState.requirementProgress || {}
    };
  };

  // Show loading state
  if (isLoading && !missions[currentTimeWindow]) {
    return (
      <Card className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
        <p className="ml-4">Loading nutrition game...</p>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return (
      <Alert variant="error" className="m-4">
        <AlertDescription>
          {error}
          <button 
            className="ml-4 underline" 
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </AlertDescription>
      </Alert>
    );
  }

  // Transform game state if we have missions loaded
  const hasMissions = Object.keys(missions).length > 0;
  const transformedGameState = hasMissions ? transformGameState() : null;

  // Show loading if no game state
  if (!transformedGameState) {
    return (
      <Card className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
        <p className="ml-4">Initializing game state...</p>
      </Card>
    );
  }

  return (
    <div className="nutrition-game-wrapper">
      <DailyReceptorDashboard
        userId={gameState.userId}
        initialGameState={transformedGameState}
        onMissionComplete={handleMissionComplete}
        onLevelUp={handleLevelUp}
        onCannabisUpdate={handleCannabisUpdate}
        onReset={handleReset}
      />
    </div>
  );
};

export default NutritionGameWrapper;
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
        
        // Load missions for current level and time window
        const level = gameState.currentLevel as Level;
        await fetchMissions(currentTimeWindow, level);
        
        if (!mounted) return;
        
        // Load missions for all levels in current time window
        for (let i = 1; i <= 3; i++) {
          if (!mounted) return;
          await fetchMissions(currentTimeWindow, i as Level);
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
  };

  // Handle level up
  const handleLevelUp = async (level: Level, timeWindow: TimeWindow) => {
    try {
      const result = await levelUp(level, timeWindow);
      
      // Return level up data for celebration modal
      return {
        success: true,
        newLevel: level + 1,
        unlockedMissions: [],
        specialRewards: [],
        insight: result.insight,
        achievements: result.achievements || [],
        bonusPoints: result.bonusPoints || 0,
        nextLevelMissions: []
      };
    } catch (error) {
      console.error('Failed to level up:', error);
      return {
        success: false,
        error: 'Failed to level up'
      };
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

  return (
    <div className="nutrition-game-wrapper">
      <DailyReceptorDashboard
        currentLevel={gameState.currentLevel as Level}
        totalPoints={gameState.totalPoints}
        levelProgress={gameState.levelProgress}
        requirementProgress={gameState.requirementProgress}
        missions={getMissionsForDisplay()}
        cannabisStatus={cannabisStatus}
        onMissionComplete={handleMissionComplete}
        onLevelUp={handleLevelUp}
        onCannabisUpdate={handleCannabisUpdate}
        onCannabisToggle={handleCannabisToggle}
        onReset={handleReset}
      />
    </div>
  );
};

export default NutritionGameWrapper;
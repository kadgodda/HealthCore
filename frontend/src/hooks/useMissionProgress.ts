import { useState, useEffect, useCallback } from 'react';
import { GameState, MissionCompletionData, Level, TimeWindow, UseMissionProgressHook } from '../types/nutrition-game';
import { MISSIONS_DATA } from '../data/missions';

/**
 * Custom hook for managing mission progress and game state
 */
export const useMissionProgress = (
  userId: string,
  initialState?: GameState
): UseMissionProgressHook => {
  const [gameState, setGameState] = useState<GameState | null>(initialState || null);
  const [loading, setLoading] = useState(!initialState);
  const [error, setError] = useState<string | undefined>();

  // Initialize game state
  useEffect(() => {
    if (!initialState) {
      initializeGameState();
    }
  }, [userId, initialState]);

  const initializeGameState = async () => {
    try {
      setLoading(true);
      setError(undefined);
      
      // In a real app, this would fetch from API
      // For now, we'll create a default state
      const today = new Date().toISOString().split('T')[0];
      
      const defaultGameState: GameState = {
        userId,
        date: today,
        currentTimeWindow: getCurrentTimeWindow(),
        levels: {
          morning: {
            level1: {
              level: 1,
              timeWindow: 'morning',
              completed: 3,
              total: 4,
              missions: MISSIONS_DATA.morning.level1,
              canLevelUp: false
            },
            level2: {
              level: 2,
              timeWindow: 'morning',
              completed: 1,
              total: 3,
              missions: MISSIONS_DATA.morning.level2,
              canLevelUp: false
            },
            level3: {
              level: 3,
              timeWindow: 'morning',
              completed: 0,
              total: 3,
              missions: MISSIONS_DATA.morning.level3,
              canLevelUp: false
            }
          },
          midday: {
            level1: {
              level: 1,
              timeWindow: 'midday',
              completed: 0,
              total: 4,
              missions: MISSIONS_DATA.midday.level1,
              canLevelUp: false
            },
            level2: {
              level: 2,
              timeWindow: 'midday',
              completed: 0,
              total: 3,
              missions: MISSIONS_DATA.midday.level2,
              canLevelUp: false
            },
            level3: {
              level: 3,
              timeWindow: 'midday',
              completed: 0,
              total: 3,
              missions: MISSIONS_DATA.midday.level3,
              canLevelUp: false
            }
          },
          afternoon: {
            level1: {
              level: 1,
              timeWindow: 'afternoon',
              completed: 0,
              total: 4,
              missions: MISSIONS_DATA.afternoon.level1,
              canLevelUp: false
            },
            level2: {
              level: 2,
              timeWindow: 'afternoon',
              completed: 0,
              total: 3,
              missions: MISSIONS_DATA.afternoon.level2,
              canLevelUp: false
            },
            level3: {
              level: 3,
              timeWindow: 'afternoon',
              completed: 0,
              total: 3,
              missions: MISSIONS_DATA.afternoon.level3,
              canLevelUp: false
            }
          },
          evening: {
            level1: {
              level: 1,
              timeWindow: 'evening',
              completed: 0,
              total: 4,
              missions: MISSIONS_DATA.evening.level1,
              canLevelUp: false
            },
            level2: {
              level: 2,
              timeWindow: 'evening',
              completed: 0,
              total: 3,
              missions: MISSIONS_DATA.evening.level2,
              canLevelUp: false
            },
            level3: {
              level: 3,
              timeWindow: 'evening',
              completed: 0,
              total: 3,
              missions: MISSIONS_DATA.evening.level3,
              canLevelUp: false
            }
          }
        },
        dailyPoints: 847,
        streakDays: 5,
        totalLevelUps: 3,
        dailyProgress: {}
      };

      setGameState(defaultGameState);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize game state');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTimeWindow = (): TimeWindow => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 10) return 'morning';
    if (hour >= 10 && hour < 14) return 'midday';
    if (hour >= 14 && hour < 18) return 'afternoon';
    return 'evening';
  };

  const updateProgress = useCallback(async (
    missionId: string, 
    data: MissionCompletionData
  ): Promise<void> => {
    if (!gameState) throw new Error('Game state not initialized');

    try {
      setLoading(true);
      
      // Find the mission in the current state
      const mission = findMissionById(missionId);
      if (!mission) throw new Error(`Mission ${missionId} not found`);

      // Calculate points earned
      const pointsEarned = calculatePointsEarned(mission, data);

      // Update game state
      setGameState(prevState => {
        if (!prevState) return prevState;

        const newState = { ...prevState };
        
        // Update mission progress
        newState.dailyProgress = {
          ...prevState.dailyProgress,
          [missionId]: {
            missionId,
            completed: true,
            progress: 100,
            completedAt: new Date(),
            data
          }
        };

        // Update level progress
        const levelKey = `level${mission.level}` as keyof typeof newState.levels[typeof mission.timeWindow];
        const levelProgress = newState.levels[mission.timeWindow][levelKey];
        
        levelProgress.completed = Math.min(levelProgress.completed + 1, levelProgress.total);
        levelProgress.canLevelUp = levelProgress.completed === levelProgress.total;

        // Update daily points
        newState.dailyPoints += pointsEarned;

        return newState;
      });

      // In a real app, sync with backend
      await syncWithBackend(missionId, data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update progress');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [gameState]);

  const triggerLevelUp = useCallback(async (
    level: Level, 
    timeWindow: TimeWindow
  ): Promise<void> => {
    if (!gameState) throw new Error('Game state not initialized');

    try {
      setLoading(true);

      // Update game state to mark level as completed
      setGameState(prevState => {
        if (!prevState) return prevState;

        const newState = { ...prevState };
        const levelKey = `level${level}` as keyof typeof newState.levels[typeof timeWindow];
        const levelProgress = newState.levels[timeWindow][levelKey];
        
        levelProgress.leveledUpAt = new Date();
        levelProgress.canLevelUp = false;
        
        // Unlock next level if applicable
        if (level < 3) {
          const nextLevelKey = `level${level + 1}` as keyof typeof newState.levels[typeof timeWindow];
          // Next level is already initialized, just needs to be accessible
        }

        // Award level-up bonus points
        const bonusPoints = level * 100; // Level 1 = 100pts, Level 2 = 200pts, etc.
        newState.dailyPoints += bonusPoints;
        newState.totalLevelUps += 1;

        return newState;
      });

      // In a real app, sync with backend
      await syncLevelUpWithBackend(level, timeWindow);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to trigger level up');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [gameState]);

  // Helper functions
  const findMissionById = (missionId: string) => {
    if (!gameState) return null;
    
    for (const timeWindow of Object.keys(gameState.levels) as TimeWindow[]) {
      for (const levelKey of ['level1', 'level2', 'level3'] as const) {
        const mission = gameState.levels[timeWindow][levelKey].missions.find(m => m.id === missionId);
        if (mission) return mission;
      }
    }
    return null;
  };

  const calculatePointsEarned = (mission: any, data: MissionCompletionData): number => {
    let basePoints = mission.basePoints || 50;
    
    // Apply cannabis bonuses/penalties
    // This would integrate with cannabis effects system
    
    // Apply time-of-day bonuses
    const currentHour = new Date().getHours();
    const isOptimalTime = mission.timeWindow === getCurrentTimeWindow();
    if (isOptimalTime) {
      basePoints *= 1.2; // 20% bonus for optimal timing
    }

    return Math.round(basePoints);
  };

  const syncWithBackend = async (missionId: string, data: MissionCompletionData): Promise<void> => {
    // In a real implementation, this would make an API call
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Example API call:
    // await fetch('/api/nutrition-game/missions/complete', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId, missionId, data })
    // });
  };

  const syncLevelUpWithBackend = async (level: Level, timeWindow: TimeWindow): Promise<void> => {
    // In a real implementation, this would make an API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Example API call:
    // await fetch('/api/nutrition-game/level-up', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId, level, timeWindow })
    // });
  };

  return {
    gameState: gameState!,
    updateProgress,
    triggerLevelUp,
    loading,
    error
  };
};
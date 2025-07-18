import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  GameState, 
  Mission, 
  CannabisStatus, 
  CannabisConsumption, 
  MissionCompletionData,
  Level,
  TimeWindow,
  NutrientInput
} from '../types/nutrition-game';
import { apiService } from '../services/api';

interface NutritionStore {
  // Game State
  gameState: GameState;
  missions: Record<TimeWindow, Record<`level${Level}`, Mission[]>>;
  
  // Cannabis Status
  cannabisStatus: CannabisStatus;
  
  // Nutrient History (for receptor calculations)
  nutrientHistory: NutrientInput[];
  
  // Receptor Status (calculated from nutrient history)
  receptorStatus: any; // Will be typed based on backend response
  
  // Loading States
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setGameState: (state: GameState) => void;
  updateMissionProgress: (missionId: string, data: MissionCompletionData) => void;
  levelUp: (level: Level, timeWindow: TimeWindow) => void;
  
  // Cannabis Actions
  updateCannabisConsumption: (consumption: CannabisConsumption) => void;
  toggleCannabisTracking: () => void;
  
  // Nutrient Actions
  addNutrientInput: (nutrient: NutrientInput) => void;
  
  // API Actions
  fetchMissions: (timeWindow: TimeWindow, level: Level) => Promise<void>;
  fetchReceptorStatus: () => Promise<void>;
  syncGameState: () => Promise<void>;
  
  // Reset
  resetGame: () => void;
}

// Initial states
const initialGameState: GameState = {
  userId: 'demo-user', // Will be replaced with actual user ID
  currentLevel: 1,
  totalPoints: 0,
  missionProgress: {},
  requirementProgress: {},
  levelProgress: {
    level1: {
      completed: 0,
      total: 4,
      canLevelUp: false,
      leveledUpAt: null
    },
    level2: {
      locked: true,
      completed: 0,
      total: 3,
      canLevelUp: false,
      leveledUpAt: null
    },
    level3: {
      locked: true,
      completed: 0,
      total: 2,
      canLevelUp: false,
      leveledUpAt: null
    }
  },
  completedMissions: [],
  achievements: []
};

const initialCannabisStatus: CannabisStatus = {
  isActive: false,
  lastConsumption: null,
  timeSinceConsumption: null,
  activeEffects: []
};

// Create store
export const useNutritionStore = create<NutritionStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      gameState: initialGameState,
      missions: {} as any, // Will be loaded from API
      cannabisStatus: initialCannabisStatus,
      nutrientHistory: [],
      receptorStatus: null,
      isLoading: false,
      error: null,
      
      // Game State Actions
      setGameState: (state) => set({ gameState: state }),
      
      updateMissionProgress: async (missionId, data) => {
        const { gameState } = get();
        
        // Update local state optimistically
        set((state) => ({
          gameState: {
            ...state.gameState,
            requirementProgress: {
              ...state.gameState.requirementProgress,
              [missionId]: {
                ...state.gameState.requirementProgress[missionId],
                ...(data.requirementId ? { [data.requirementId]: true } : {})
              }
            },
            totalPoints: state.gameState.totalPoints + (data.pointsEarned || 0)
          }
        }));
        
        // Sync with backend
        try {
          const result = await apiService.completeMission(
            gameState.userId,
            missionId,
            data
          );
          
          // Update state with server response
          set((state) => ({
            gameState: {
              ...state.gameState,
              totalPoints: result.totalPoints || state.gameState.totalPoints
            }
          }));
        } catch (error) {
          console.error('Failed to sync mission progress:', error);
          set({ error: 'Failed to sync progress with server' });
        }
      },
      
      levelUp: async (level, timeWindow) => {
        const { gameState } = get();
        
        try {
          const result = await apiService.levelUp(
            gameState.userId,
            level,
            timeWindow
          );
          
          // Update local state
          set((state) => ({
            gameState: {
              ...state.gameState,
              currentLevel: level + 1,
              levelProgress: {
                ...state.gameState.levelProgress,
                [`level${level}`]: {
                  ...state.gameState.levelProgress[`level${level}`],
                  leveledUpAt: new Date().toISOString(),
                  canLevelUp: false
                },
                [`level${level + 1}`]: {
                  ...state.gameState.levelProgress[`level${level + 1}`],
                  locked: false
                }
              }
            }
          }));
          
          return result;
        } catch (error) {
          console.error('Failed to level up:', error);
          set({ error: 'Failed to level up' });
          throw error;
        }
      },
      
      // Cannabis Actions
      updateCannabisConsumption: (consumption) => {
        set((state) => ({
          cannabisStatus: {
            ...state.cannabisStatus,
            lastConsumption: consumption,
            timeSinceConsumption: 0,
            // TODO: Calculate effects based on consumption
            activeEffects: []
          }
        }));
        
        // Add to nutrient history for receptor calculations
        get().addNutrientInput({
          name: 'Cannabis',
          amount: consumption.amount || 0,
          unit: consumption.unit || 'g',
          timing: 'with_food', // TODO: Get actual timing
          source: 'supplement'
        });
      },
      
      toggleCannabisTracking: () => {
        set((state) => ({
          cannabisStatus: {
            ...state.cannabisStatus,
            isActive: !state.cannabisStatus.isActive
          }
        }));
      },
      
      // Nutrient Actions
      addNutrientInput: (nutrient) => {
        set((state) => ({
          nutrientHistory: [...state.nutrientHistory, nutrient]
        }));
        
        // Trigger receptor status update
        get().fetchReceptorStatus();
      },
      
      // API Actions
      fetchMissions: async (timeWindow, level) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await apiService.getMissions(timeWindow, level);
          
          set((state) => ({
            missions: {
              ...state.missions,
              [timeWindow]: {
                ...state.missions[timeWindow],
                [`level${level}`]: result.data
              }
            },
            isLoading: false,
            error: null
          }));
        } catch (error) {
          console.error('Failed to fetch missions:', error);
          
          // Provide fallback demo mission for offline mode
          const demoMission = {
            id: `demo-${timeWindow}-${level}-1`,
            title: 'Stay Hydrated',
            description: 'Drink water to support all body systems',
            icon: '💧',
            level,
            timeWindow,
            targetReceptors: ['AQP1', 'AQP2'],
            basePoints: 10,
            requirements: [
              {
                type: 'amount',
                target: 'Water',
                amount: 500,
                unit: 'ml',
                description: 'Drink 500ml of water'
              }
            ],
            category: 'hydration'
          };
          
          set((state) => ({
            missions: {
              ...state.missions,
              [timeWindow]: {
                ...state.missions[timeWindow],
                [`level${level}`]: [demoMission]
              }
            },
            isLoading: false,
            error: error instanceof Error && error.message.includes('Unable to connect')
              ? null // Don't show error for offline mode
              : 'Failed to fetch missions'
          }));
        }
      },
      
      fetchReceptorStatus: async () => {
        const { nutrientHistory } = get();
        
        try {
          const result = await apiService.getReceptorStatus(nutrientHistory);
          set({ receptorStatus: result.data });
        } catch (error) {
          console.error('Failed to fetch receptor status:', error);
        }
      },
      
      syncGameState: async () => {
        const { gameState } = get();
        
        try {
          const result = await apiService.getGameState(gameState.userId);
          set({ gameState: result.data, error: null });
        } catch (error) {
          console.error('Failed to sync game state:', error);
          // Don't overwrite existing state if backend is unavailable
          // This allows the app to work offline with local data
          set({ 
            error: error instanceof Error && error.message.includes('Unable to connect') 
              ? 'Running in offline mode. Backend connection unavailable.' 
              : 'Failed to sync with server' 
          });
        }
      },
      
      // Reset
      resetGame: () => {
        set({
          gameState: initialGameState,
          cannabisStatus: initialCannabisStatus,
          nutrientHistory: [],
          receptorStatus: null,
          error: null
        });
      }
    }),
    {
      name: 'nutrition-store'
    }
  )
);
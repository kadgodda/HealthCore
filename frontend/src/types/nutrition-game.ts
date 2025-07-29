// HealthCore Nutrition Game - Type Definitions

export type TimeWindow = 'morning' | 'midday' | 'afternoon' | 'evening';
export type Level = 1 | 2 | 3;
export type MissionStatus = 'locked' | 'active' | 'completed';
export type CannabisEffectType = 'boost' | 'penalty';
export type ConsumptionMethod = 'smoking' | 'vaping' | 'edibles' | 'tincture';
export type SuggestionType = 'food' | 'activity' | 'supplement' | 'timing';

// Core Game Types
export interface Mission {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: Level;
  timeWindow: TimeWindow;
  targetReceptors: string[];
  basePoints: number;
  requirements: MissionRequirement[];
  category: 'hydration' | 'minerals' | 'vitamins' | 'movement' | 'protein' | 'fats' | 'amino_acids' | 'special' | 'energy' | 'timing';
}

export interface MissionRequirement {
  type: 'supplement' | 'food' | 'activity' | 'timing' | 'amount';
  target: string;
  amount?: number;
  unit?: string;
  description: string;
}

export interface MissionProgress {
  missionId: string;
  completed: boolean;
  progress: number; // 0-100
  requirementsCompleted?: number;
  totalRequirements?: number;
  completedAt?: string;
  data?: MissionCompletionData;
}

export interface MissionCompletionData {
  type: 'supplement' | 'food' | 'activity' | 'custom';
  value: string | number;
  unit?: string;
  timestamp: Date;
  notes?: string;
  requirementId?: string; // Which requirement was completed
  pointsEarned?: number; // Points for this specific requirement
  completedItems?: any[]; // Legacy, to be removed
}

// Level Progress
export interface LevelProgress {
  level: Level;
  timeWindow: TimeWindow;
  completed: number;
  total: number;
  missions: Mission[];
  canLevelUp: boolean;
  leveledUpAt?: string;
}

// Game State
export interface GameState {
  id: string;
  userId: string;
  currentDate: string; // YYYY-MM-DD
  currentTimeWindow?: TimeWindow;
  levels: {
    morning: {
      level1: LevelProgress;
      level2: LevelProgress;
      level3: LevelProgress;
    };
    midday: {
      level1: LevelProgress;
      level2: LevelProgress;
      level3: LevelProgress;
    };
    afternoon: {
      level1: LevelProgress;
      level2: LevelProgress;
      level3: LevelProgress;
    };
    evening: {
      level1: LevelProgress;
      level2: LevelProgress;
      level3: LevelProgress;
    };
  };
  dailyPoints: number;
  totalPoints: number;
  streakDays: number;
  unlockedAchievements: string[];
  currentLevel: number;
  lastActiveDate: string;
  totalLevelUps?: number;
  cannabisStatus?: CannabisStatus;
  dailyProgress: Record<string, MissionProgress>;
  requirementProgress: Record<string, Record<string, boolean>>; // missionId -> requirementId -> completed
}

// Cannabis Integration
export interface CannabisConsumption {
  id: string;
  timestamp: Date;
  method: ConsumptionMethod;
  thcContent?: number; // percentage
  cbdContent?: number; // percentage
  amount?: number;
  unit?: string;
}

export interface CannabisStatus {
  lastConsumption?: CannabisConsumption;
  isActive: boolean;
  timeSinceConsumption?: number; // minutes
  activeEffects: CannabisEffect[];
}

export interface CannabisEffect {
  type: CannabisEffectType;
  percentage: number;
  targetReceptors: string[];
  description: string;
  duration: number; // minutes remaining
  source: ConsumptionMethod;
}

// Nutrient tracking types
export interface NutrientInput {
  name: string;
  amount: number;
  unit: string;
  timing: 'with_food' | 'empty_stomach' | 'before_meal' | 'after_meal';
  source: 'food' | 'supplement' | 'activity';
  timestamp?: Date;
}

// AI Suggestions
export interface Suggestion {
  id: string;
  title: string;
  description: string;
  benefit: string;
  nutrients: NutrientTag[];
  type: SuggestionType;
  timeContext: TimeWindow;
  cannabisOptimized?: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime?: number; // minutes
}

export interface NutrientTag {
  nutrient: string;
  amount: string;
  unit: string;
  color?: string;
}

// Health Insights
export interface HealthInsight {
  id: string;
  level: string;
  timeWindow: TimeWindow;
  title: string;
  subtitle: string;
  content: string;
  highlights: InsightHighlight[];
  cannabisContext?: string;
  learnMoreUrl?: string;
}

export interface InsightHighlight {
  value: string;
  label: string;
  explanation?: string;
}

// User Preferences
export interface UserPreferences {
  cannabisTracking: boolean;
  notificationTimes: TimeWindow[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  dietaryRestrictions: string[];
  healthGoals: string[];
  timeZone: string;
}

// Achievements
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'streak' | 'level' | 'points' | 'perfect_day' | 'cannabis_optimization';
  requirement: number;
  reward: Reward;
  earnedAt?: Date;
}

export interface Reward {
  type: 'points' | 'discount' | 'product' | 'badge';
  value: number | string;
  description: string;
}

// API Response Types
export interface DashboardResponse {
  gameState: GameState;
  availableMissions: Mission[];
  suggestions: Suggestion[];
  achievements: Achievement[];
  insights: HealthInsight[];
}

export interface MissionCompletionResponse {
  success: boolean;
  pointsEarned: number;
  newLevelUnlocked?: boolean;
  nextSuggestions: Suggestion[];
  updatedGameState: GameState;
}

export interface LevelUpResponse {
  success: boolean;
  insight: HealthInsight;
  achievements: Achievement[];
  bonusPoints: number;
  nextLevelMissions: Mission[];
}

// Component Props
export interface DashboardProps {
  userId: string;
  initialGameState?: GameState;
  onMissionComplete: (missionId: string, data: MissionCompletionData) => Promise<MissionCompletionResponse>;
  onLevelUp: (level: Level, timeWindow: TimeWindow) => Promise<LevelUpResponse>;
  onCannabisUpdate: (consumption: CannabisConsumption) => void;
  onReset?: () => void;
}

export interface MissionCardProps {
  mission: Mission;
  progress: MissionProgress;
  cannabisEffect?: CannabisEffect;
  onClick: () => void;
  disabled?: boolean;
}

export interface MissionModalProps {
  mission: Mission;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: MissionCompletionData) => void;
  suggestions: Suggestion[];
  cannabisStatus?: CannabisStatus;
  requirementProgress?: Record<string, boolean>; // requirementId -> completed
}

export interface LevelUpCelebrationProps {
  isOpen: boolean;
  level: Level;
  timeWindow: TimeWindow;
  insight: HealthInsight;
  achievements: Achievement[];
  onClose: () => void;
  onContinue: () => void;
}

export interface TimeWindowNavProps {
  currentWindow: TimeWindow;
  windowProgress: Record<TimeWindow, number>;
  onWindowChange: (window: TimeWindow) => void;
}

export interface ProgressOverviewProps {
  level: Level;
  timeWindow: TimeWindow;
  progress: LevelProgress;
  onLevelUp?: () => void;
}

export interface CannabisStatusCardProps {
  status: CannabisStatus;
  onUpdate: (consumption: CannabisConsumption) => void;
  onToggleTracking: () => void;
}

// Hooks

export interface UseCannabisEffectsHook {
  status: CannabisStatus | null;
  addConsumption: (consumption: CannabisConsumption) => void;
  getEffectsForMission: (mission: Mission) => CannabisEffect[];
  isEffectActive: (effectType: CannabisEffectType) => boolean;
}

export interface UseAIInsightsHook {
  generateSuggestions: (mission: Mission) => Promise<Suggestion[]>;
  generateLevelUpInsight: (level: Level, timeWindow: TimeWindow, context: any) => Promise<HealthInsight>;
  loading: boolean;
  error?: string;
}

// API Endpoints
export interface NutritionGameAPI {
  getDashboard: (userId: string, date: string) => Promise<DashboardResponse>;
  completeMission: (userId: string, missionId: string, data: MissionCompletionData) => Promise<MissionCompletionResponse>;
  triggerLevelUp: (userId: string, level: Level, timeWindow: TimeWindow) => Promise<LevelUpResponse>;
  updateCannabisStatus: (userId: string, consumption: CannabisConsumption) => Promise<void>;
  getSuggestions: (userId: string, missionId: string) => Promise<Suggestion[]>;
  getInsights: (userId: string, level: Level, timeWindow: TimeWindow) => Promise<HealthInsight>;
}

// Error Types
export interface GameError {
  code: string;
  message: string;
  details?: any;
}

export interface ValidationError extends GameError {
  field: string;
  value: any;
}

// Constants
export const TIME_WINDOWS: TimeWindow[] = ['morning', 'midday', 'afternoon', 'evening'];
export const LEVELS: Level[] = [1, 2, 3];
export const CONSUMPTION_METHODS: ConsumptionMethod[] = ['smoking', 'vaping', 'edibles', 'tincture'];

export const TIME_WINDOW_HOURS: Record<TimeWindow, { start: number; end: number }> = {
  morning: { start: 6, end: 10 },
  midday: { start: 10, end: 14 },
  afternoon: { start: 14, end: 18 },
  evening: { start: 18, end: 22 }
};

export const LEVEL_NAMES: Record<Level, string> = {
  1: 'Foundation',
  2: 'Optimization', 
  3: 'Peak Performance'
};

export const MISSION_CATEGORIES = {
  hydration: { icon: '💧', color: '#3b82f6' },
  minerals: { icon: '⚡', color: '#ef4444' },
  vitamins: { icon: '🍊', color: '#f59e0b' },
  movement: { icon: '🏃', color: '#10b981' },
  protein: { icon: '🍳', color: '#8b5cf6' },
  fats: { icon: '🥑', color: '#ec4899' },
  amino_acids: { icon: '🧬', color: '#06b6d4' },
  special: { icon: '✨', color: '#a855f7' },
  energy: { icon: '🔋', color: '#f97316' },
  timing: { icon: '⏰', color: '#6366f1' }
} as const;
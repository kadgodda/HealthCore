# HealthCore Nutrition Game Integration

## Overview

The **Daily Receptor Dashboard** is a gamified nutrition tracking system that transforms healthy eating into an engaging daily game. Users "level up" by optimizing different receptor systems through targeted nutrition, with AI-powered insights and cannabis integration.

## Core Concept

### Game Architecture
- **4 Time Windows** × **3 Levels** = **12 Daily Opportunities** to level up
- **Receptor-based missions** targeting actual biological pathways
- **Real-time cannabis effect integration** (positive/negative modifiers)
- **AI-powered suggestions** and educational celebrations
- **Points-to-rewards loyalty program** integration

### Scientific Foundation
Based on circadian receptor biology and molecular nutrient binding research:
- Morning cortisol peaks optimize mineral absorption
- Nutrient competition/synergy at receptor level
- Cannabis effects on absorption and metabolism
- Timing-dependent bioavailability

## File Structure

```
src/
├── components/
│   ├── NutritionGame/
│   │   ├── DailyReceptorDashboard.tsx
│   │   ├── MissionCard.tsx
│   │   ├── MissionModal.tsx
│   │   ├── LevelUpCelebration.tsx
│   │   ├── TimeWindowNav.tsx
│   │   ├── ProgressOverview.tsx
│   │   └── CannabisStatusCard.tsx
│   └── shared/
│       ├── Modal.tsx
│       └── Button.tsx
├── hooks/
│   ├── useMissionProgress.ts
│   ├── useCannabisEffects.ts
│   └── useAIInsights.ts
├── types/
│   └── nutrition-game.ts
├── data/
│   ├── missions.ts
│   ├── ai-insights.ts
│   └── cannabis-effects.ts
└── styles/
    └── nutrition-game.module.css
```

## Implementation Phases

### Phase 1: Core UI Components (Current)
- ✅ Dashboard layout with time windows
- ✅ Mission cards with progress tracking
- ✅ Modal system for mission interactions
- ✅ Level-up celebration with AI insights
- ✅ Cannabis integration indicators

### Phase 2: Data Integration
- [ ] Mission state management
- [ ] Progress persistence
- [ ] AI suggestion engine
- [ ] Cannabis effect calculator
- [ ] Points system integration

### Phase 3: Food Tracker Connection
- [ ] Nutrient mapping to receptors
- [ ] Real-time progress updates
- [ ] Food suggestion integration
- [ ] Stacking visualization

### Phase 4: Advanced Features
- [ ] Personalization based on genetics
- [ ] Biometric integration
- [ ] Social challenges
- [ ] Advanced analytics

## Component Specifications

### DailyReceptorDashboard
**Purpose**: Main container component managing game state and layout

**Props**:
```typescript
interface DashboardProps {
  userId: string;
  currentDate: string;
  cannabisStatus?: CannabisStatus;
  onMissionComplete: (missionId: string, data: any) => void;
  onLevelUp: (level: string, timeWindow: string) => void;
}
```

**State Management**:
- Current time window
- Mission completion status
- Level progress tracking
- Points accumulation

### MissionCard
**Purpose**: Individual mission display with progress and interaction

**Props**:
```typescript
interface MissionCardProps {
  mission: Mission;
  progress: number;
  status: 'locked' | 'active' | 'completed';
  cannabisEffect?: CannabisEffect;
  onClick: () => void;
}
```

**Features**:
- Visual progress indicators
- Cannabis effect overlays
- Hover animations
- Status badges

### MissionModal
**Purpose**: Mission interaction interface with AI suggestions

**Props**:
```typescript
interface MissionModalProps {
  mission: Mission;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: MissionCompletionData) => void;
  aiSuggestions: Suggestion[];
}
```

**Features**:
- Quick action buttons
- Custom entry fields
- AI-powered suggestions
- Progress visualization

### LevelUpCelebration
**Purpose**: Educational celebration modal with health insights

**Props**:
```typescript
interface LevelUpCelebrationProps {
  level: string;
  timeWindow: string;
  cannabisContext?: CannabisStatus;
  achievements: Achievement[];
  onContinue: () => void;
}
```

**Features**:
- Animated confetti and effects
- Personalized AI insights
- Achievement highlights
- Educational content

## Data Types

### Core Types
```typescript
interface Mission {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: 1 | 2 | 3;
  timeWindow: 'morning' | 'midday' | 'afternoon' | 'evening';
  targetReceptors: string[];
  basePoints: number;
  requirements: MissionRequirement[];
}

interface MissionRequirement {
  type: 'supplement' | 'food' | 'activity' | 'timing';
  target: string;
  amount?: number;
  unit?: string;
}

interface CannabisEffect {
  type: 'boost' | 'penalty';
  percentage: number;
  targetReceptors: string[];
  duration: number; // minutes
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  benefit: string;
  nutrients: NutrientTag[];
  type: 'food' | 'activity' | 'supplement' | 'timing';
}
```

### State Management
```typescript
interface GameState {
  currentTimeWindow: TimeWindow;
  levels: {
    level1: LevelProgress;
    level2: LevelProgress;
    level3: LevelProgress;
  };
  dailyPoints: number;
  streakDays: number;
  cannabisStatus?: CannabisStatus;
}

interface LevelProgress {
  completed: number;
  total: number;
  missions: Mission[];
  canLevelUp: boolean;
}
```

## Cannabis Integration Specifications

### Effect Types
- **Cortisol Boost**: +15% mineral absorption (morning benefit)
- **Appetite Enhancement**: +25% mission completion likelihood
- **Sleep Quality**: +20% overnight nutrient utilization
- **Circulation Impact**: -10% oxygen transport (smoking penalty)
- **Focus Impact**: -20% B-vitamin utilization (high THC)

### Calculation Logic
```typescript
function calculateCannabisEffect(
  consumption: CannabisConsumption,
  mission: Mission,
  timeWindow: string
): CannabisEffect | null {
  const timeSinceConsumption = Date.now() - consumption.timestamp;
  const isActive = timeSinceConsumption < consumption.duration;
  
  if (!isActive) return null;
  
  // Apply receptor-specific effects
  return determineReceptorImpact(consumption, mission.targetReceptors);
}
```

## AI Insights System

### Insight Categories
1. **Biological Education**: How nutrients work at cellular level
2. **Timing Optimization**: Why this window matters
3. **Synergy Explanation**: How nutrients enhance each other
4. **Health Benefits**: Real-world impact on energy, mood, longevity
5. **Cannabis Context**: How current effects amplify benefits

### Generation Logic
```typescript
function generateLevelUpInsight(
  level: string,
  timeWindow: string,
  context: GameContext
): HealthInsight {
  const baseInsight = INSIGHT_TEMPLATES[level][timeWindow];
  const cannabisModifier = context.cannabisStatus 
    ? getCannabisInsightModifier(context.cannabisStatus)
    : null;
    
  return personalizeInsight(baseInsight, context, cannabisModifier);
}
```

## Styling Guidelines

### Design System Integration
- Uses existing HealthCore/AnteaCore color tokens
- Matches current modal patterns
- Responsive grid system
- Consistent typography scale

### Color Scheme
```css
/* Level Colors */
--level-1-color: var(--theme-success);    /* Foundation */
--level-2-color: var(--theme-warning);    /* Optimization */
--level-3-color: var(--brand-accent);     /* Peak Performance */

/* Cannabis Effects */
--cannabis-boost-color: var(--brand-accent);
--cannabis-penalty-color: var(--theme-warning);

/* Celebration Theme */
--celebration-primary: var(--brand-primary);
--celebration-secondary: var(--brand-secondary);
```

### Animation Standards
- **Mission cards**: Transform on hover (translateY(-2px))
- **Progress bars**: Smooth width transitions (250ms ease)
- **Level-up effects**: Pulsing animations with glow
- **Confetti**: 3s fall animation with rotation

## Integration Points

### HealthCore App Integration
1. **Route**: `/dashboard/nutrition-game`
2. **Navigation**: Add to main sidebar
3. **State**: Connect to existing user management
4. **API**: Integrate with current backend endpoints

### Food Tracker Connection
```typescript
interface FoodTrackerIntegration {
  onFoodLogged: (food: Food) => void;      // Updates mission progress
  onNutrientAdded: (nutrient: Nutrient) => void;  // Real-time receptor impact
  getSuggestions: (mission: Mission) => Suggestion[];  // AI food recommendations
}
```

### Loyalty Program Integration
```typescript
interface LoyaltyIntegration {
  convertPointsToRewards: (points: number) => Reward[];
  trackAchievements: (achievement: Achievement) => void;
  updateMembershipTier: (totalPoints: number) => void;
}
```

## Testing Strategy

### Unit Tests
- Mission completion logic
- Cannabis effect calculations
- Progress tracking accuracy
- AI insight generation

### Integration Tests
- Modal interactions
- State persistence
- API communication
- Cross-component data flow

### User Testing
- Mission completion flow
- Level-up celebration experience
- Cannabis integration acceptance
- Educational value assessment

## Performance Considerations

### Optimization Targets
- **Initial load**: < 2 seconds
- **Mission modal open**: < 300ms
- **Progress updates**: Real-time (< 100ms)
- **AI suggestions**: < 1 second

### Caching Strategy
- Mission data: Browser cache for 24 hours
- AI insights: Session storage
- User progress: Real-time sync with backend
- Cannabis effects: Calculate client-side

## Security & Privacy

### Data Handling
- **Cannabis data**: Encrypted, user-controlled
- **Health insights**: Anonymized analytics only
- **Progress tracking**: Secure user session
- **AI suggestions**: No personal data in prompts

### Compliance
- HIPAA considerations for health data
- Cannabis legal compliance by jurisdiction
- GDPR privacy requirements
- Age verification for cannabis features

## Future Roadmap

### Q1 2025: Foundation
- Core game mechanics
- Basic AI insights
- Cannabis integration
- Food tracker connection

### Q2 2025: Enhancement
- Advanced personalization
- Social features
- Biometric integration
- Mobile app version

### Q3 2025: Expansion
- Genetic-based recommendations
- Professional health coach integration
- Advanced analytics dashboard
- White-label licensing

### Q4 2025: Innovation
- AR/VR nutrition experiences
- Voice-activated mission logging
- Predictive health modeling
- Research partnerships

## Support & Documentation

### Developer Resources
- Component Storybook documentation
- API integration guides
- Testing utilities
- Deployment instructions

### User Support
- Tutorial flow for new users
- Help documentation
- Video guides
- Customer support integration

---

*This documentation is living and should be updated as the system evolves. All team members should contribute to keeping it accurate and comprehensive.*
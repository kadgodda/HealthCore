import { useState, useCallback } from 'react';
import { 
  UseAIInsightsHook, 
  Suggestion, 
  HealthInsight, 
  Mission, 
  Level, 
  TimeWindow,
  LEVEL_NAMES 
} from '../types/nutrition-game';

/**
 * Custom hook for generating AI-powered suggestions and insights
 */
export const useAIInsights = (): UseAIInsightsHook => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const generateSuggestions = useCallback(async (mission: Mission): Promise<Suggestion[]> => {
    setLoading(true);
    setError(undefined);
    
    try {
      // In production, this would call an AI API
      // const response = await fetch('/api/ai/suggestions', {
      //   method: 'POST',
      //   body: JSON.stringify({ mission })
      // });
      // return await response.json();
      
      // For now, return mock suggestions based on mission type
      const suggestions = getMockSuggestions(mission);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return suggestions;
    } catch (err) {
      setError('Failed to generate suggestions');
      console.error('Error generating suggestions:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const generateLevelUpInsight = useCallback(async (
    level: Level, 
    timeWindow: TimeWindow, 
    context: any
  ): Promise<HealthInsight> => {
    setLoading(true);
    setError(undefined);
    
    try {
      // In production, this would call an AI API
      // const response = await fetch('/api/ai/level-up-insight', {
      //   method: 'POST',
      //   body: JSON.stringify({ level, timeWindow, context })
      // });
      // return await response.json();
      
      // For now, return mock insight
      const insight = getMockLevelUpInsight(level, timeWindow, context);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return insight;
    } catch (err) {
      setError('Failed to generate insight');
      console.error('Error generating insight:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    generateSuggestions,
    generateLevelUpInsight,
    loading,
    error
  };
};

// Mock data generators
function getMockSuggestions(mission: Mission): Suggestion[] {
  const baseSuggestions: Record<string, Suggestion[]> = {
    hydration: [
      {
        id: 'hydro-1',
        title: 'Cucumber Water Infusion',
        description: 'Add sliced cucumber, mint, and lemon to your water for enhanced hydration and electrolyte support.',
        benefit: 'Natural electrolytes + enhanced aquaporin channel activation',
        nutrients: [
          { nutrient: 'Potassium', amount: '147', unit: 'mg' },
          { nutrient: 'Magnesium', amount: '13', unit: 'mg' }
        ],
        type: 'food',
        timeContext: mission.timeWindow,
        difficulty: 'easy',
        estimatedTime: 5
      },
      {
        id: 'hydro-2',
        title: 'Morning Hydration Protocol',
        description: 'Start with 16oz room temperature water with a pinch of sea salt and lemon.',
        benefit: 'Kickstarts hydration + sodium-potassium pump activation',
        nutrients: [
          { nutrient: 'Sodium', amount: '200', unit: 'mg' },
          { nutrient: 'Vitamin C', amount: '30', unit: 'mg' }
        ],
        type: 'activity',
        timeContext: mission.timeWindow,
        difficulty: 'easy',
        estimatedTime: 2
      }
    ],
    minerals: [
      {
        id: 'mineral-1',
        title: 'Spinach & Pumpkin Seed Salad',
        description: 'Dark leafy greens with pumpkin seeds for iron and zinc synergy.',
        benefit: 'Non-heme iron + zinc without competition',
        nutrients: [
          { nutrient: 'Iron', amount: '3.2', unit: 'mg' },
          { nutrient: 'Zinc', amount: '2.5', unit: 'mg' }
        ],
        type: 'food',
        timeContext: mission.timeWindow,
        difficulty: 'easy',
        estimatedTime: 10
      },
      {
        id: 'mineral-2',
        title: 'Vitamin C Timing Strategy',
        description: 'Take vitamin C supplement 30 minutes before iron-rich meal.',
        benefit: '3-5x iron absorption enhancement',
        nutrients: [
          { nutrient: 'Vitamin C', amount: '500', unit: 'mg' }
        ],
        type: 'supplement',
        timeContext: mission.timeWindow,
        difficulty: 'easy',
        estimatedTime: 1
      }
    ],
    vitamins: [
      {
        id: 'vitamin-1',
        title: 'Rainbow Smoothie Bowl',
        description: 'Berries, mango, spinach, and chia seeds for vitamin variety.',
        benefit: 'Full spectrum vitamins + antioxidant synergy',
        nutrients: [
          { nutrient: 'Vitamin C', amount: '120', unit: 'mg' },
          { nutrient: 'Vitamin A', amount: '450', unit: 'mcg' },
          { nutrient: 'Folate', amount: '80', unit: 'mcg' }
        ],
        type: 'food',
        timeContext: mission.timeWindow,
        difficulty: 'medium',
        estimatedTime: 15
      }
    ],
    movement: [
      {
        id: 'move-1',
        title: '10-Minute Morning Yoga',
        description: 'Gentle stretching to enhance circulation and nutrient delivery.',
        benefit: 'Improved blood flow + nutrient transport',
        nutrients: [],
        type: 'activity',
        timeContext: mission.timeWindow,
        difficulty: 'easy',
        estimatedTime: 10
      }
    ],
    protein: [
      {
        id: 'protein-1',
        title: 'Greek Yogurt Parfait',
        description: 'Layer Greek yogurt with berries and granola for complete proteins.',
        benefit: 'Complete amino acids + probiotics',
        nutrients: [
          { nutrient: 'Protein', amount: '20', unit: 'g' },
          { nutrient: 'Calcium', amount: '200', unit: 'mg' }
        ],
        type: 'food',
        timeContext: mission.timeWindow,
        difficulty: 'easy',
        estimatedTime: 5
      }
    ],
    fats: [
      {
        id: 'fat-1',
        title: 'Avocado Toast with Hemp Hearts',
        description: 'Whole grain toast with avocado and hemp hearts for omega balance.',
        benefit: 'Omega-3 + fat-soluble vitamin absorption',
        nutrients: [
          { nutrient: 'Omega-3', amount: '2.5', unit: 'g' },
          { nutrient: 'Vitamin E', amount: '3', unit: 'mg' }
        ],
        type: 'food',
        timeContext: mission.timeWindow,
        difficulty: 'easy',
        estimatedTime: 8
      }
    ]
  };

  return baseSuggestions[mission.category] || [];
}

function getMockLevelUpInsight(level: Level, timeWindow: TimeWindow, context: any): HealthInsight {
  const insights: Record<string, HealthInsight> = {
    '1-morning': {
      id: 'insight-1-morning',
      level: LEVEL_NAMES[1],
      timeWindow: 'morning',
      title: 'Foundation Mastery: Morning Minerals',
      subtitle: 'You\'ve optimized your morning mineral absorption window!',
      content: 'By completing your morning Foundation missions, you\'ve synchronized with your body\'s natural cortisol peak. This timing maximizes mineral absorption through upregulated transporters like DMT1 (iron) and TRPV6 (calcium). Your consistency is literally changing how efficiently your cells receive essential nutrients.',
      highlights: [
        {
          value: '+35%',
          label: 'Iron Absorption',
          explanation: 'Morning timing + vitamin C synergy'
        },
        {
          value: '2-3x',
          label: 'Calcium Uptake',
          explanation: 'Vitamin D activation at peak'
        }
      ],
      cannabisContext: context?.cannabisStatus?.isActive 
        ? 'Your morning cannabis use is providing a 15% cortisol boost, further enhancing mineral absorption!'
        : undefined
    },
    '2-midday': {
      id: 'insight-2-midday',
      level: LEVEL_NAMES[2],
      timeWindow: 'midday',
      title: 'Optimization Achieved: Peak Performance Window',
      subtitle: 'You\'re riding the metabolic wave perfectly!',
      content: 'Level 2 completion during midday means you\'re working with your body\'s highest metabolic rate. Your cells are primed for nutrient utilization, with mitochondria operating at peak efficiency. This is when complex B-vitamins are best converted to their active forms.',
      highlights: [
        {
          value: '94%',
          label: 'Metabolic Efficiency',
          explanation: 'Optimal enzyme activity window'
        },
        {
          value: '+ATP',
          label: 'Energy Production',
          explanation: 'B-complex vitamins fully activated'
        }
      ]
    },
    '3-evening': {
      id: 'insight-3-evening',
      level: LEVEL_NAMES[3],
      timeWindow: 'evening',
      title: 'Peak Performance: Cellular Repair Mastery',
      subtitle: 'You\'ve unlocked advanced nutrient timing!',
      content: 'Achieving Level 3 in the evening optimizes your body\'s natural repair cycle. As melatonin rises, your cells shift to maintenance mode. The nutrients you\'ve consumed are now being incorporated into DNA repair, protein synthesis, and cellular regeneration processes.',
      highlights: [
        {
          value: '8hrs',
          label: 'Repair Window',
          explanation: 'Overnight cellular regeneration'
        },
        {
          value: '↑65%',
          label: 'Protein Synthesis',
          explanation: 'Growth hormone synergy'
        },
        {
          value: '✓',
          label: 'Antioxidant Network',
          explanation: 'Full glutathione recycling'
        }
      ]
    }
  };

  const key = `${level}-${timeWindow}`;
  return insights[key] || {
    id: `insight-${level}-${timeWindow}`,
    level: LEVEL_NAMES[level],
    timeWindow,
    title: `Level ${level} Complete!`,
    subtitle: 'Another step toward optimal nutrition',
    content: `You've successfully completed Level ${level} during the ${timeWindow} window. Your dedication to nutrient timing is optimizing your body's natural rhythms.`,
    highlights: [
      {
        value: '+100',
        label: 'Points Earned',
        explanation: 'Level completion bonus'
      }
    ]
  };
}
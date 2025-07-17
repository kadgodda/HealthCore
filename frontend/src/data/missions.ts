import { Mission, TimeWindow, Level } from '../types/nutrition-game';

// Mission data organized by time window and level
export const MISSIONS_DATA: Record<TimeWindow, Record<`level${Level}`, Mission[]>> = {
  morning: {
    level1: [
      {
        id: 'morning-l1-hydration',
        title: 'Hydration Activation',
        description: '16-20oz water to restart kidney filtration',
        icon: '💧',
        level: 1,
        timeWindow: 'morning',
        targetReceptors: ['aquaporin-2', 'vasopressin-receptor'],
        basePoints: 50,
        category: 'hydration',
        requirements: [
          {
            type: 'amount',
            target: 'water',
            amount: 16,
            unit: 'oz',
            description: 'Drink water upon waking'
          }
        ]
      },
      {
        id: 'morning-l1-iron',
        title: 'Iron Loading',
        description: 'Iron + Vitamin C combo when absorption is highest',
        icon: '⚡',
        level: 1,
        timeWindow: 'morning',
        targetReceptors: ['DMT1', 'ferroportin', 'transferrin-receptor'],
        basePoints: 80,
        category: 'minerals',
        requirements: [
          {
            type: 'supplement',
            target: 'iron',
            amount: 18,
            unit: 'mg',
            description: 'Iron supplement or iron-rich food'
          },
          {
            type: 'supplement',
            target: 'vitamin-c',
            amount: 75,
            unit: 'mg',
            description: 'Vitamin C to enhance absorption'
          }
        ]
      },
      {
        id: 'morning-l1-movement',
        title: 'Movement Catalyst',
        description: '10-15 min activity to boost circulation',
        icon: '🏃',
        level: 1,
        timeWindow: 'morning',
        targetReceptors: ['nitric-oxide-synthase', 'beta-adrenergic'],
        basePoints: 60,
        category: 'movement',
        requirements: [
          {
            type: 'activity',
            target: 'cardio',
            amount: 10,
            unit: 'minutes',
            description: 'Light cardio or walking'
          }
        ]
      },
      {
        id: 'morning-l1-protein',
        title: 'Protein Foundation',
        description: 'Complete amino acid profile for synthesis',
        icon: '🍳',
        level: 1,
        timeWindow: 'morning',
        targetReceptors: ['LAT1', 'CAT1', 'ASCT2'],
        basePoints: 70,
        category: 'protein',
        requirements: [
          {
            type: 'food',
            target: 'complete-protein',
            amount: 25,
            unit: 'g',
            description: 'High-quality protein source'
          }
        ]
      }
    ],
    level2: [
      {
        id: 'morning-l2-cortisol',
        title: 'Cortisol Optimization',
        description: 'Protein + healthy fats to stabilize morning cortisol',
        icon: '🧠',
        level: 2,
        timeWindow: 'morning',
        targetReceptors: ['glucocorticoid-receptor', 'HPA-axis'],
        basePoints: 90,
        category: 'fats',
        requirements: [
          {
            type: 'food',
            target: 'healthy-fats',
            amount: 15,
            unit: 'g',
            description: 'Omega-3 rich fats'
          },
          {
            type: 'timing',
            target: 'protein-fat-combo',
            description: 'Consume together for optimal effect'
          }
        ]
      },
      {
        id: 'morning-l2-minerals',
        title: 'Mineral Matrix',
        description: 'Zinc, magnesium foundations when transporters are fresh',
        icon: '💪',
        level: 2,
        timeWindow: 'morning',
        targetReceptors: ['ZIP4', 'TRPM6', 'TRPM7'],
        basePoints: 85,
        category: 'minerals',
        requirements: [
          {
            type: 'supplement',
            target: 'zinc',
            amount: 8,
            unit: 'mg',
            description: 'Zinc supplement or rich food'
          },
          {
            type: 'supplement',
            target: 'magnesium',
            amount: 200,
            unit: 'mg',
            description: 'Magnesium supplement'
          }
        ]
      },
      {
        id: 'morning-l2-gut',
        title: 'Gut Prep',
        description: 'Fiber + probiotics to prime digestive receptors',
        icon: '🌱',
        level: 2,
        timeWindow: 'morning',
        targetReceptors: ['toll-like-receptors', 'SCFA-receptors'],
        basePoints: 75,
        category: 'vitamins',
        requirements: [
          {
            type: 'food',
            target: 'fiber',
            amount: 10,
            unit: 'g',
            description: 'Soluble and insoluble fiber'
          },
          {
            type: 'supplement',
            target: 'probiotics',
            description: 'Live probiotic cultures'
          }
        ]
      }
    ],
    level3: [
      {
        id: 'morning-l3-circadian',
        title: 'Circadian Reset',
        description: 'Light exposure to sync master clock',
        icon: '🎯',
        level: 3,
        timeWindow: 'morning',
        targetReceptors: ['melanopsin', 'circadian-clock-genes'],
        basePoints: 100,
        category: 'movement',
        requirements: [
          {
            type: 'activity',
            target: 'sunlight-exposure',
            amount: 10,
            unit: 'minutes',
            description: 'Direct sunlight or bright light'
          }
        ]
      },
      {
        id: 'morning-l3-cellular',
        title: 'Cellular Priming',
        description: 'Antioxidants before daily oxidative stress',
        icon: '🧬',
        level: 3,
        timeWindow: 'morning',
        targetReceptors: ['Nrf2', 'glutathione-system'],
        basePoints: 120,
        category: 'vitamins',
        requirements: [
          {
            type: 'supplement',
            target: 'antioxidants',
            description: 'Vitamin E, C, glutathione precursors'
          }
        ]
      },
      {
        id: 'morning-l3-performance',
        title: 'Performance Stack',
        description: 'Adaptogens + B-complex for sustained energy',
        icon: '📈',
        level: 3,
        timeWindow: 'morning',
        targetReceptors: ['B-vitamin-transporters', 'adaptogen-receptors'],
        basePoints: 150,
        category: 'vitamins',
        requirements: [
          {
            type: 'supplement',
            target: 'b-complex',
            description: 'Full spectrum B vitamins'
          },
          {
            type: 'supplement',
            target: 'adaptogens',
            description: 'Ashwagandha, rhodiola, or similar'
          }
        ]
      }
    ]
  },
  midday: {
    level1: [
      {
        id: 'midday-l1-fats',
        title: 'Fat-Soluble Delivery',
        description: 'A, D, E, K with healthy fats when bile is peak',
        icon: '🥑',
        level: 1,
        timeWindow: 'midday',
        targetReceptors: ['NPC1L1', 'bile-acid-receptors'],
        basePoints: 80,
        category: 'fats',
        requirements: [
          {
            type: 'supplement',
            target: 'fat-soluble-vitamins',
            description: 'Vitamins A, D, E, K with meal'
          }
        ]
      },
      {
        id: 'midday-l1-protein-synthesis',
        title: 'Protein Synthesis Peak',
        description: 'Complete amino acid profile during peak synthesis',
        icon: '🍗',
        level: 1,
        timeWindow: 'midday',
        targetReceptors: ['mTOR', 'amino-acid-transporters'],
        basePoints: 90,
        category: 'protein',
        requirements: [
          {
            type: 'food',
            target: 'complete-protein',
            amount: 30,
            unit: 'g',
            description: 'High-quality protein source'
          }
        ]
      },
      {
        id: 'midday-l1-electrolytes',
        title: 'Electrolyte Balance',
        description: 'Sodium, potassium optimization for cellular function',
        icon: '⚖️',
        level: 1,
        timeWindow: 'midday',
        targetReceptors: ['sodium-potassium-pump', 'ENaC'],
        basePoints: 60,
        category: 'minerals',
        requirements: [
          {
            type: 'food',
            target: 'electrolytes',
            description: 'Balanced sodium and potassium'
          }
        ]
      },
      {
        id: 'midday-l1-hydration',
        title: 'Hydration Maintenance',
        description: 'Sustained water intake with electrolytes',
        icon: '💧',
        level: 1,
        timeWindow: 'midday',
        targetReceptors: ['aquaporin-channels'],
        basePoints: 50,
        category: 'hydration',
        requirements: [
          {
            type: 'amount',
            target: 'water',
            amount: 20,
            unit: 'oz',
            description: 'Water throughout midday period'
          }
        ]
      }
    ],
    level2: [
      {
        id: 'midday-l2-calcium',
        title: 'Calcium Network',
        description: 'Calcium + D3 + K2 synergy when absorption peaks',
        icon: '🦴',
        level: 2,
        timeWindow: 'midday',
        targetReceptors: ['TRPV6', 'vitamin-D-receptor'],
        basePoints: 100,
        category: 'minerals',
        requirements: [
          {
            type: 'supplement',
            target: 'calcium',
            amount: 500,
            unit: 'mg',
            description: 'Calcium with cofactors'
          }
        ]
      },
      {
        id: 'midday-l2-b-complex',
        title: 'B-Complex Loading',
        description: 'Folate, B12, thiamine when absorption peaks',
        icon: '🔋',
        level: 2,
        timeWindow: 'midday',
        targetReceptors: ['RFC1', 'PCFT', 'B12-transporters'],
        basePoints: 85,
        category: 'vitamins',
        requirements: [
          {
            type: 'supplement',
            target: 'b-complex',
            description: 'Full spectrum B vitamins'
          }
        ]
      },
      {
        id: 'midday-l2-metabolic',
        title: 'Metabolic Boost',
        description: 'Chromium, alpha-lipoic acid for glucose handling',
        icon: '🔥',
        level: 2,
        timeWindow: 'midday',
        targetReceptors: ['insulin-receptor', 'glucose-transporters'],
        basePoints: 95,
        category: 'minerals',
        requirements: [
          {
            type: 'supplement',
            target: 'chromium',
            amount: 200,
            unit: 'mcg',
            description: 'For glucose metabolism'
          }
        ]
      }
    ],
    level3: [
      {
        id: 'midday-l3-cognitive',
        title: 'Cognitive Stack',
        description: 'Omega-3s for brain power',
        icon: '🧠',
        level: 3,
        timeWindow: 'midday',
        targetReceptors: ['omega-3-receptors'],
        basePoints: 130,
        category: 'fats',
        requirements: [
          {
            type: 'supplement',
            target: 'omega-3',
            amount: 1000,
            unit: 'mg',
            description: 'EPA/DHA for brain function'
          }
        ]
      },
      {
        id: 'midday-l3-immune',
        title: 'Immune Fortress',
        description: 'Vitamin C, selenium for immune power',
        icon: '🛡️',
        level: 3,
        timeWindow: 'midday',
        targetReceptors: ['vitamin-C-transporters'],
        basePoints: 120,
        category: 'vitamins',
        requirements: [
          {
            type: 'supplement',
            target: 'vitamin-c',
            amount: 500,
            unit: 'mg',
            description: 'For immune support'
          }
        ]
      },
      {
        id: 'midday-l3-hormone',
        title: 'Hormone Harmony',
        description: 'Vitamin D for hormone production',
        icon: '⚖️',
        level: 3,
        timeWindow: 'midday',
        targetReceptors: ['vitamin-D-receptor'],
        basePoints: 140,
        category: 'vitamins',
        requirements: [
          {
            type: 'supplement',
            target: 'vitamin-d3',
            amount: 2000,
            unit: 'IU',
            description: 'For hormone synthesis'
          }
        ]
      }
    ]
  },
  afternoon: {
    level1: [
      {
        id: 'afternoon-l1-muscle-fuel',
        title: 'Muscle Fuel',
        description: 'Leucine-rich proteins + carbs for sustained performance',
        icon: '💪',
        level: 1,
        timeWindow: 'afternoon',
        targetReceptors: ['mTOR', 'leucine-sensors'],
        basePoints: 80,
        category: 'protein',
        requirements: [
          {
            type: 'food',
            target: 'leucine-rich-protein',
            amount: 25,
            unit: 'g',
            description: 'High leucine protein source'
          }
        ]
      },
      {
        id: 'afternoon-l1-hydration',
        title: 'Hydration Maintenance',
        description: 'Electrolyte replenishment for sustained performance',
        icon: '🌊',
        level: 1,
        timeWindow: 'afternoon',
        targetReceptors: ['aquaporin-channels'],
        basePoints: 50,
        category: 'hydration',
        requirements: [
          {
            type: 'amount',
            target: 'water-electrolytes',
            amount: 16,
            unit: 'oz',
            description: 'Water with electrolytes'
          }
        ]
      },
      {
        id: 'afternoon-l1-circulation',
        title: 'Circulation Support',
        description: 'Nitric oxide boosters',
        icon: '🫀',
        level: 1,
        timeWindow: 'afternoon',
        targetReceptors: ['nitric-oxide-synthase'],
        basePoints: 70,
        category: 'vitamins',
        requirements: [
          {
            type: 'food',
            target: 'nitrates',
            description: 'Beets, leafy greens, or nitrate supplement'
          }
        ]
      },
      {
        id: 'afternoon-l1-movement',
        title: 'Movement Boost',
        description: '15-20 min activity for energy and circulation',
        icon: '🏃',
        level: 1,
        timeWindow: 'afternoon',
        targetReceptors: ['beta-adrenergic'],
        basePoints: 75,
        category: 'movement',
        requirements: [
          {
            type: 'activity',
            target: 'moderate-exercise',
            amount: 15,
            unit: 'minutes',
            description: 'Moderate intensity activity'
          }
        ]
      }
    ],
    level2: [
      {
        id: 'afternoon-l2-exercise',
        title: 'Exercise Synergy',
        description: 'Pre/post workout nutrition timing',
        icon: '🏋️',
        level: 2,
        timeWindow: 'afternoon',
        targetReceptors: ['mTOR', 'insulin-receptor'],
        basePoints: 100,
        category: 'protein',
        requirements: [
          {
            type: 'timing',
            target: 'workout-nutrition',
            description: 'Protein + carbs around exercise'
          }
        ]
      },
      {
        id: 'afternoon-l2-recovery',
        title: 'Recovery Prep',
        description: 'Anti-inflammatory stack',
        icon: '🛠️',
        level: 2,
        timeWindow: 'afternoon',
        targetReceptors: ['COX-2'],
        basePoints: 90,
        category: 'vitamins',
        requirements: [
          {
            type: 'supplement',
            target: 'omega-3',
            amount: 1000,
            unit: 'mg',
            description: 'For anti-inflammatory effects'
          }
        ]
      },
      {
        id: 'afternoon-l2-focus',
        title: 'Focus Fuel',
        description: 'Tyrosine for sustained attention',
        icon: '🎯',
        level: 2,
        timeWindow: 'afternoon',
        targetReceptors: ['tyrosine-hydroxylase'],
        basePoints: 85,
        category: 'vitamins',
        requirements: [
          {
            type: 'supplement',
            target: 'l-tyrosine',
            amount: 500,
            unit: 'mg',
            description: 'For dopamine production'
          }
        ]
      }
    ],
    level3: [
      {
        id: 'afternoon-l3-oxygen',
        title: 'Oxygen Optimization',
        description: 'Iron, B12 for red blood cell function',
        icon: '💨',
        level: 3,
        timeWindow: 'afternoon',
        targetReceptors: ['hemoglobin'],
        basePoints: 120,
        category: 'vitamins',
        requirements: [
          {
            type: 'supplement',
            target: 'iron',
            amount: 18,
            unit: 'mg',
            description: 'For oxygen transport'
          }
        ]
      },
      {
        id: 'afternoon-l3-mitochondrial',
        title: 'Mitochondrial Support',
        description: 'CoQ10 for cellular energy',
        icon: '🔋',
        level: 3,
        timeWindow: 'afternoon',
        targetReceptors: ['mitochondrial-complex'],
        basePoints: 140,
        category: 'vitamins',
        requirements: [
          {
            type: 'supplement',
            target: 'coq10',
            amount: 100,
            unit: 'mg',
            description: 'For mitochondrial energy'
          }
        ]
      },
      {
        id: 'afternoon-l3-stress',
        title: 'Stress Buffer',
        description: 'Ashwagandha for cortisol management',
        icon: '🧘',
        level: 3,
        timeWindow: 'afternoon',
        targetReceptors: ['HPA-axis'],
        basePoints: 130,
        category: 'vitamins',
        requirements: [
          {
            type: 'supplement',
            target: 'ashwagandha',
            amount: 300,
            unit: 'mg',
            description: 'For stress adaptation'
          }
        ]
      }
    ]
  },
  evening: {
    level1: [
      {
        id: 'evening-l1-completion',
        title: 'Digestive Completion',
        description: 'Final nutrient gaps filled',
        icon: '🍽️',
        level: 1,
        timeWindow: 'evening',
        targetReceptors: ['digestive-enzymes'],
        basePoints: 60,
        category: 'vitamins',
        requirements: [
          {
            type: 'food',
            target: 'daily-nutrients',
            description: 'Review and fill nutrient gaps'
          }
        ]
      },
      {
        id: 'evening-l1-sleep',
        title: 'Sleep Prep',
        description: 'Magnesium, tryptophan for sleep',
        icon: '😴',
        level: 1,
        timeWindow: 'evening',
        targetReceptors: ['GABA-receptors'],
        basePoints: 80,
        category: 'vitamins',
        requirements: [
          {
            type: 'supplement',
            target: 'magnesium',
            amount: 300,
            unit: 'mg',
            description: 'For muscle relaxation'
          }
        ]
      },
      {
        id: 'evening-l1-hydration',
        title: 'Gentle Hydration',
        description: 'Herbal teas without disrupting sleep',
        icon: '☕',
        level: 1,
        timeWindow: 'evening',
        targetReceptors: ['aquaporin-channels'],
        basePoints: 40,
        category: 'hydration',
        requirements: [
          {
            type: 'amount',
            target: 'herbal-tea',
            amount: 8,
            unit: 'oz',
            description: 'Calming herbal tea'
          }
        ]
      },
      {
        id: 'evening-l1-digestive',
        title: 'Digestive Support',
        description: 'Enzymes and gut-healing nutrients',
        icon: '🌿',
        level: 1,
        timeWindow: 'evening',
        targetReceptors: ['digestive-enzyme-receptors'],
        basePoints: 70,
        category: 'vitamins',
        requirements: [
          {
            type: 'supplement',
            target: 'digestive-enzymes',
            description: 'With dinner for digestion'
          }
        ]
      }
    ],
    level2: [
      {
        id: 'evening-l2-repair',
        title: 'Repair Matrix',
        description: 'Collagen for overnight healing',
        icon: '🛠️',
        level: 2,
        timeWindow: 'evening',
        targetReceptors: ['collagen-synthesis-pathway'],
        basePoints: 100,
        category: 'protein',
        requirements: [
          {
            type: 'supplement',
            target: 'collagen-peptides',
            amount: 10,
            unit: 'g',
            description: 'For tissue repair during sleep'
          }
        ]
      },
      {
        id: 'evening-l2-brain',
        title: 'Brain Cleanup',
        description: 'Support for glymphatic system',
        icon: '🧠',
        level: 2,
        timeWindow: 'evening',
        targetReceptors: ['glymphatic-system'],
        basePoints: 90,
        category: 'vitamins',
        requirements: [
          {
            type: 'supplement',
            target: 'omega-3',
            amount: 1000,
            unit: 'mg',
            description: 'For brain health'
          }
        ]
      },
      {
        id: 'evening-l2-detox',
        title: 'Detox Support',
        description: 'Liver support for overnight processing',
        icon: '🫐',
        level: 2,
        timeWindow: 'evening',
        targetReceptors: ['cytochrome-P450'],
        basePoints: 85,
        category: 'vitamins',
        requirements: [
          {
            type: 'supplement',
            target: 'milk-thistle',
            amount: 200,
            unit: 'mg',
            description: 'For liver support'
          }
        ]
      }
    ],
    level3: [
      {
        id: 'evening-l3-circadian',
        title: 'Circadian Alignment',
        description: 'Light management for melatonin',
        icon: '🌙',
        level: 3,
        timeWindow: 'evening',
        targetReceptors: ['melanopsin'],
        basePoints: 120,
        category: 'movement',
        requirements: [
          {
            type: 'activity',
            target: 'light-management',
            description: 'Dim lights before bed'
          }
        ]
      },
      {
        id: 'evening-l3-autophagy',
        title: 'Cellular Autophagy',
        description: 'Optimize overnight cellular cleanup',
        icon: '🔄',
        level: 3,
        timeWindow: 'evening',
        targetReceptors: ['autophagy-pathways'],
        basePoints: 140,
        category: 'vitamins',
        requirements: [
          {
            type: 'timing',
            target: 'fasting-window',
            description: '12+ hour overnight fast'
          }
        ]
      },
      {
        id: 'evening-l3-sleep-quality',
        title: 'Deep Sleep Stack',
        description: 'Optimize sleep architecture',
        icon: '💤',
        level: 3,
        timeWindow: 'evening',
        targetReceptors: ['GABA-receptors', 'glycine-receptors'],
        basePoints: 150,
        category: 'vitamins',
        requirements: [
          {
            type: 'supplement',
            target: 'glycine',
            amount: 3,
            unit: 'g',
            description: 'For deep sleep promotion'
          }
        ]
      }
    ]
  }
};

// Helper function to get missions by criteria
export const getMissionsByTimeWindow = (timeWindow: TimeWindow): Mission[] => {
  const windowMissions = MISSIONS_DATA[timeWindow];
  return [
    ...windowMissions.level1,
    ...windowMissions.level2,
    ...windowMissions.level3
  ];
};

export const getMissionsByLevel = (level: Level): Mission[] => {
  const allMissions: Mission[] = [];
  Object.values(MISSIONS_DATA).forEach(timeWindow => {
    const levelKey = `level${level}` as keyof typeof timeWindow;
    allMissions.push(...timeWindow[levelKey]);
  });
  return allMissions;
};

export const getMissionById = (id: string): Mission | undefined => {
  for (const timeWindow of Object.values(MISSIONS_DATA)) {
    for (const level of Object.values(timeWindow)) {
      const mission = level.find(m => m.id === id);
      if (mission) return mission;
    }
  }
  return undefined;
};
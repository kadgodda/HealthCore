import { useState, useCallback } from 'react';
import { UseCannabisEffectsHook, CannabisStatus, CannabisConsumption, CannabisEffect, Mission } from '../types/nutrition-game';

/**
 * Custom hook for managing cannabis effects and their impact on nutrition
 */
export const useCannabisEffects = (): UseCannabisEffectsHook => {
  const [status, setStatus] = useState<CannabisStatus | null>({
    isActive: true,
    timeSinceConsumption: 45,
    activeEffects: [
      {
        type: 'boost',
        percentage: 15,
        targetReceptors: ['DMT1', 'ZIP4', 'TRPM6'],
        description: 'Cortisol boost enhances mineral absorption',
        duration: 120,
        source: 'vaping'
      },
      {
        type: 'boost',
        percentage: 25,
        targetReceptors: ['appetite-centers'],
        description: 'Enhanced appetite and motivation',
        duration: 180,
        source: 'vaping'
      },
      {
        type: 'penalty',
        percentage: 10,
        targetReceptors: ['oxygen-transport'],
        description: 'Reduced oxygen transport efficiency',
        duration: 60,
        source: 'smoking'
      }
    ],
    lastConsumption: {
      id: 'consumption-1',
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      method: 'vaping',
      thcContent: 18,
      cbdContent: 2,
      amount: 0.1,
      unit: 'g'
    }
  });

  const addConsumption = useCallback((consumption: CannabisConsumption) => {
    // Calculate effects based on consumption method and timing
    const effects = calculateEffectsFromConsumption(consumption);
    
    setStatus(prevStatus => ({
      ...prevStatus,
      lastConsumption: consumption,
      isActive: true,
      timeSinceConsumption: 0,
      activeEffects: effects
    }));
  }, []);

  const getEffectsForMission = useCallback((mission: Mission): CannabisEffect[] => {
    if (!status || !status.isActive) return [];
    
    return status.activeEffects.filter(effect => 
      effect.targetReceptors.some(receptor => 
        mission.targetReceptors.includes(receptor) || 
        mission.category === getReceptorCategory(receptor)
      )
    );
  }, [status]);

  const isEffectActive = useCallback((effectType: 'boost' | 'penalty'): boolean => {
    if (!status || !status.isActive) return false;
    
    return status.activeEffects.some(effect => effect.type === effectType);
  }, [status]);

  return {
    status,
    addConsumption,
    getEffectsForMission,
    isEffectActive
  };
};

// Helper functions
function calculateEffectsFromConsumption(consumption: CannabisConsumption): CannabisEffect[] {
  const effects: CannabisEffect[] = [];
  
  // Morning cortisol boost (beneficial for mineral absorption)
  const hour = new Date().getHours();
  if (hour >= 6 && hour <= 10) {
    effects.push({
      type: 'boost',
      percentage: 15,
      targetReceptors: ['DMT1', 'ZIP4', 'TRPM6'],
      description: 'Morning cortisol boost enhances mineral absorption',
      duration: getDurationForMethod(consumption.method),
      source: consumption.method
    });
  }
  
  // Appetite enhancement (always beneficial)
  effects.push({
    type: 'boost',
    percentage: 25,
    targetReceptors: ['appetite-centers'],
    description: 'Enhanced appetite and food motivation',
    duration: getDurationForMethod(consumption.method) + 60,
    source: consumption.method
  });
  
  // Smoking-specific penalties
  if (consumption.method === 'smoking') {
    effects.push({
      type: 'penalty',
      percentage: 10,
      targetReceptors: ['oxygen-transport', 'circulation'],
      description: 'Combustion byproducts reduce oxygen efficiency',
      duration: 60,
      source: consumption.method
    });
  }
  
  // High THC focus penalties
  if (consumption.thcContent && consumption.thcContent > 15) {
    effects.push({
      type: 'penalty',
      percentage: 20,
      targetReceptors: ['B-vitamin-transporters', 'focus-pathways'],
      description: 'High THC may impair B-vitamin utilization',
      duration: getDurationForMethod(consumption.method),
      source: consumption.method
    });
  }
  
  return effects;
}

function getDurationForMethod(method: string): number {
  switch (method) {
    case 'smoking':
    case 'vaping':
      return 120; // 2 hours
    case 'edibles':
      return 480; // 8 hours
    case 'tincture':
      return 240; // 4 hours
    default:
      return 120;
  }
}

function getReceptorCategory(receptor: string): string {
  if (['DMT1', 'ZIP4', 'TRPM6'].includes(receptor)) return 'minerals';
  if (['aquaporin-channels'].includes(receptor)) return 'hydration';
  if (['mTOR', 'LAT1'].includes(receptor)) return 'protein';
  if (['omega-3-receptors'].includes(receptor)) return 'fats';
  return 'vitamins';
}
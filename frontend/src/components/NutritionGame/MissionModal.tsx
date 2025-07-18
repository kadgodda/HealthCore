import React, { useState, useEffect } from 'react';
import { MissionModalProps, MissionCompletionData, MISSION_CATEGORIES } from '../../types/nutrition-game';
import styles from './MissionModal.module.css';

const MissionModal: React.FC<MissionModalProps> = ({
  mission,
  isOpen,
  onClose,
  onComplete,
  suggestions,
  cannabisStatus,
  requirementProgress = {}
}) => {
  const [completionType, setCompletionType] = useState<'supplement' | 'food' | 'activity' | 'custom'>('food');
  const [completionValue, setCompletionValue] = useState('');
  const [completionUnit, setCompletionUnit] = useState('');
  const [notes, setNotes] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [selectedQuickAction, setSelectedQuickAction] = useState<string | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [completingAction, setCompletingAction] = useState<string | null>(null);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const category = MISSION_CATEGORIES[mission.category];

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setCompletionType('food');
      setCompletionValue('');
      setCompletionUnit('');
      setNotes('');
      setShowSuggestions(true);
      
      // Initialize completed actions based on requirement progress
      const completed = new Set<string>();
      mission.requirements.forEach((req, idx) => {
        const requirementId = `${mission.id}-req-${idx}`;
        if (requirementProgress[requirementId]) {
          completed.add(`req-${idx}`);
        }
      });
      setCompletedActions(completed);
    }
  }, [isOpen, mission.id, requirementProgress]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: MissionCompletionData = {
      type: completionType,
      value: completionValue || 'completed',
      unit: completionUnit,
      timestamp: new Date(),
      notes: notes || undefined
    };
    
    onComplete(data);
  };

  const handleQuickComplete = (type: MissionCompletionData['type'], value: string, unit?: string, requirementId?: string, pointsPerRequirement?: number) => {
    const data: MissionCompletionData = {
      type,
      value,
      unit,
      timestamp: new Date(),
      requirementId,
      pointsEarned: pointsPerRequirement
    };
    
    onComplete(data);
  };

  const getQuickActionsForMission = () => {
    // Return all mission requirements as actionable buttons
    const actions: Array<{
      id: string;
      icon: string;
      label: string;
      type: MissionCompletionData['type'];
      value: string;
      amount?: number;
      unit?: string;
      description?: string;
      autoComplete: boolean;
      requirementId: string;
      pointsPerRequirement: number;
    }> = [];
    
    // Calculate points per requirement (keep precision)
    const pointsPerRequirement = mission.basePoints / mission.requirements.length;
    
    mission.requirements.forEach((req, idx) => {
      const icon = req.type === 'supplement' ? getSupplementIcon(req.target) :
                   req.type === 'activity' ? getActivityIcon(req.target) :
                   req.type === 'food' ? '🍎' : '⏰';
      
      actions.push({
        id: `req-${idx}`,
        icon: icon,
        label: formatRequirementName(req.target),
        type: req.type === 'timing' || req.type === 'amount' ? 'custom' : req.type,
        value: `${req.target} completed`,
        amount: req.amount,
        unit: req.unit,
        description: req.description,
        autoComplete: true,
        requirementId: `${mission.id}-req-${idx}`,
        pointsPerRequirement: pointsPerRequirement
      });
    });
    
    // If no specific requirements, add generic complete button
    if (actions.length === 0) {
      actions.push({
        id: 'complete',
        icon: '✅',
        label: 'Mark Complete',
        type: 'activity' as const,
        value: 'Mission completed',
        autoComplete: true,
        requirementId: `${mission.id}-complete`,
        pointsPerRequirement: mission.basePoints
      });
    }
    
    return actions;
  };

  const getSupplementIcon = (target: string): string => {
    const iconMap: Record<string, string> = {
      'iron': '⚡',
      'vitamin-c': '🍊',
      'vitamin-d': '☀️',
      'vitamin-d3': '☀️',
      'b-complex': '🔋',
      'omega-3': '🐟',
      'magnesium': '💎',
      'zinc': '🛡️',
      'calcium': '🦴',
      'multivitamin': '💊',
      'probiotics': '🦠',
      'coq10': '❤️',
      'ashwagandha': '🌿',
      'collagen': '💪',
      'electrolytes': '⚡'
    };
    return iconMap[target.toLowerCase()] || '💊';
  };

  const getActivityIcon = (target: string): string => {
    const iconMap: Record<string, string> = {
      'cardio': '🏃',
      'walking': '🚶',
      'exercise': '💪',
      'yoga': '🧘',
      'stretching': '🤸',
      'movement': '🏃',
      'sunlight-exposure': '☀️',
      'light-management': '💡',
      'fasting-window': '⏰'
    };
    return iconMap[target.toLowerCase()] || '🎯';
  };

  const formatRequirementName = (target: string): string => {
    return target.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getCannabisEffectDisplay = () => {
    if (!cannabisStatus || !cannabisStatus.activeEffects.length) return null;
    
    const relevantEffect = cannabisStatus.activeEffects.find(effect =>
      mission.targetReceptors.some(receptor => effect.targetReceptors.includes(receptor))
    );
    
    if (!relevantEffect) return null;
    
    return (
      <div className={`${styles.cannabisAlert} ${relevantEffect.type === 'boost' ? styles.boost : styles.penalty}`}>
        <span className={styles.cannabisIcon}>
          {relevantEffect.type === 'boost' ? '🚀' : '⚠️'}
        </span>
        <div>
          <strong>Cannabis Effect Active:</strong> {relevantEffect.description}
          <div className={styles.effectMeta}>
            {relevantEffect.percentage}% {relevantEffect.type} • {relevantEffect.duration}min remaining
          </div>
        </div>
      </div>
    );
  };

  return isOpen ? (
    <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        
        <div className={styles.modalHeader}>
          <div className={styles.missionIcon} style={{ background: category.color }}>
            {category.icon}
          </div>
          <div>
            <h2 className={styles.modalTitle}>{mission.title}</h2>
            <p className={styles.modalDescription}>{mission.description}</p>
          </div>
        </div>

        {getCannabisEffectDisplay()}

        <div className={styles.modalBody}>
          {/* Daily Missions */}
          <div className={styles.quickActionsSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Daily Missions</h3>
              <span className={styles.sectionHint}>Long press to complete</span>
            </div>
            <div className={styles.quickActionButtons}>
              {getQuickActionsForMission().map((action, idx) => {
                const isCompleted = completedActions.has(action.id);
                return (
                  <button
                    key={idx}
                    className={`${styles.quickActionButton} ${completingAction === action.id ? styles.completing : ''} ${isCompleted ? styles.completed : ''}`}
                    onClick={() => {
                      // Quick click for info (future feature)
                      console.log('Show supplement info for:', action.label);
                    }}
                    onMouseDown={() => {
                      // Start long press timer only if not already completed
                      if (!isCompleted) {
                        const timer = setTimeout(() => {
                          setCompletingAction(action.id);
                          // Trigger completion after animation
                          setTimeout(() => {
                            setCompletedActions(prev => new Set([...prev, action.id]));
                            handleQuickComplete(action.type, action.value, action.unit, action.requirementId, action.pointsPerRequirement);
                            setCompletingAction(null);
                          }, 500);
                        }, 800); // 800ms for long press
                        setLongPressTimer(timer);
                      }
                    }}
                    onMouseUp={() => {
                      // Cancel long press
                      if (longPressTimer) {
                        clearTimeout(longPressTimer);
                        setLongPressTimer(null);
                      }
                    }}
                    onMouseLeave={() => {
                      // Cancel long press if mouse leaves
                      if (longPressTimer) {
                        clearTimeout(longPressTimer);
                        setLongPressTimer(null);
                      }
                    }}
                    onTouchStart={() => {
                      // Mobile long press
                      if (!isCompleted) {
                        const timer = setTimeout(() => {
                          setCompletingAction(action.id);
                          setTimeout(() => {
                            setCompletedActions(prev => new Set([...prev, action.id]));
                            handleQuickComplete(action.type, action.value, action.unit, action.requirementId, action.pointsPerRequirement);
                            setCompletingAction(null);
                          }, 500);
                        }, 800);
                        setLongPressTimer(timer);
                      }
                    }}
                    onTouchEnd={() => {
                      if (longPressTimer) {
                        clearTimeout(longPressTimer);
                        setLongPressTimer(null);
                      }
                    }}
                    disabled={isCompleted}
                  >
                    <div className={styles.quickActionIcon}>{isCompleted ? '✅' : action.icon}</div>
                    <div className={styles.quickActionLabel}>{action.label}</div>
                    {action.amount && (
                      <div className={styles.quickActionDose}>
                        {action.amount}{action.unit}
                      </div>
                    )}
                    {isCompleted && (
                      <div className={styles.completedOverlay}>
                        <span>Completed!</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className={styles.suggestionsSection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>🤖 AI-Powered Suggestions</h3>
                <button 
                  className={styles.toggleButton}
                  onClick={() => setShowSuggestions(false)}
                >
                  Hide
                </button>
              </div>
              <div className={styles.suggestionsList}>
                {suggestions.slice(0, 3).map(suggestion => (
                  <div 
                    key={suggestion.id} 
                    className={styles.suggestionCard}
                  >
                    <div className={styles.suggestionHeader}>
                      <h4 className={styles.suggestionTitle}>{suggestion.title}</h4>
                      <span className={styles.suggestionBenefit}>{suggestion.benefit}</span>
                    </div>
                    <p className={styles.suggestionDesc}>{suggestion.description}</p>
                    {suggestion.nutrients && suggestion.nutrients.length > 0 && (
                      <div className={styles.suggestionNutrients}>
                        {suggestion.nutrients.map((nutrient, idx) => (
                          <span key={idx} className={styles.nutrientTag}>
                            {nutrient.nutrient} {nutrient.amount}{nutrient.unit}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  ) : null;
};

export default MissionModal;
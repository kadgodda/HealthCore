import React from 'react';
import { MissionCardProps, MISSION_CATEGORIES } from '../../types/nutrition-game';
import styles from './MissionCard.module.css';

const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  progress,
  cannabisEffect,
  onClick,
  disabled = false
}) => {
  const category = MISSION_CATEGORIES[mission.category];
  const isCompleted = progress.completed;
  const progressPercentage = progress.progress;
  
  const getStatusColor = () => {
    if (isCompleted) return 'var(--theme-success, #10b981)';
    if (progressPercentage > 0) return 'var(--brand-primary, #4f46e5)';
    return 'var(--theme-text-tertiary, #64748b)';
  };

  const getEffectIndicator = () => {
    if (!cannabisEffect) return null;
    
    const isBoost = cannabisEffect.type === 'boost';
    return (
      <div 
        className={`${styles.cannabisIndicator} ${isBoost ? styles.boost : styles.penalty}`}
        title={cannabisEffect.description}
      >
        {isBoost ? '🚀' : '⚠️'} {Math.abs(cannabisEffect.percentage)}%
      </div>
    );
  };

  return (
    <button
      className={`${styles.missionCard} ${isCompleted ? styles.completed : ''} ${disabled ? styles.disabled : ''}`}
      onClick={onClick}
      disabled={disabled}
      style={{ '--category-color': category.color } as React.CSSProperties}
    >
      {getEffectIndicator()}
      
      <div className={styles.missionHeader}>
        <div className={styles.missionIcon} style={{ background: category.color }}>
          {category.icon}
        </div>
        <div className={styles.missionInfo}>
          <h4 className={styles.missionTitle}>{mission.title}</h4>
          <p className={styles.missionDescription}>{mission.description}</p>
        </div>
      </div>
      
      <div className={styles.missionStats}>
        <div className={styles.pointsBadge}>
          {mission.basePoints} pts
        </div>
        <div className={styles.targetReceptors}>
          {mission.targetReceptors.slice(0, 2).map((receptor, idx) => (
            <span key={idx} className={styles.receptorTag}>
              {receptor}
            </span>
          ))}
          {mission.targetReceptors.length > 2 && (
            <span className={styles.receptorTag}>+{mission.targetReceptors.length - 2}</span>
          )}
        </div>
      </div>
      
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ 
              width: `${progressPercentage}%`,
              background: getStatusColor()
            }}
          />
        </div>
        {isCompleted && (
          <div className={styles.completedIcon} style={{ color: getStatusColor() }}>
            ✓
          </div>
        )}
      </div>
      
      {disabled && (
        <div className={styles.lockedOverlay}>
          <span className={styles.lockIcon}>🔒</span>
          <span className={styles.lockText}>Complete previous level</span>
        </div>
      )}
    </button>
  );
};

export default MissionCard;
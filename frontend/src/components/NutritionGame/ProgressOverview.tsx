import React from 'react';
import { ProgressOverviewProps, LEVEL_NAMES } from '../../types/nutrition-game';
import styles from './ProgressOverview.module.css';

const ProgressOverview: React.FC<ProgressOverviewProps> = ({
  level,
  timeWindow,
  progress,
  onLevelUp
}) => {
  const levelName = LEVEL_NAMES[level];
  const progressPercentage = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
  const isComplete = progress.completed === progress.total;
  
  const getLevelColor = () => {
    switch (level) {
      case 1: return 'var(--theme-success, #10b981)';
      case 2: return 'var(--theme-warning, #f59e0b)';
      case 3: return 'var(--brand-accent, #ec4899)';
      default: return 'var(--brand-primary, #4f46e5)';
    }
  };

  const getLevelIcon = () => {
    switch (level) {
      case 1: return '🌱';
      case 2: return '🚀';
      case 3: return '⭐';
      default: return '📊';
    }
  };

  return (
    <div className={styles.progressOverview}>
      <div className={styles.levelHeader}>
        <div className={styles.levelInfo}>
          <div className={styles.levelIcon} style={{ background: getLevelColor() }}>
            {getLevelIcon()}
          </div>
          <div>
            <h3 className={styles.levelTitle}>
              Level {level}: {levelName}
            </h3>
            <p className={styles.levelSubtitle}>
              {progress.completed}/{progress.total} missions completed
            </p>
          </div>
        </div>
        
        {progress.canLevelUp && (
          progress.leveledUpAt ? (
            <div className={styles.completedBadge} style={{ borderColor: getLevelColor() }}>
              <span>✓</span> Completed
            </div>
          ) : (
            <button 
              className={styles.levelUpButton}
              onClick={onLevelUp}
              style={{ 
                background: getLevelColor(),
                animation: 'pulse 2s infinite'
              }}
            >
              Level Up! 🎉
            </button>
          )
        )}
      </div>
      
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ 
              width: `${progressPercentage}%`,
              background: getLevelColor()
            }}
          />
        </div>
        <span className={styles.progressText}>{Math.round(progressPercentage)}%</span>
      </div>
      
      {isComplete && !progress.leveledUpAt && (
        <p className={styles.readyMessage}>
          🎯 All missions complete! Ready to level up when you are.
        </p>
      )}
    </div>
  );
};

export default ProgressOverview;
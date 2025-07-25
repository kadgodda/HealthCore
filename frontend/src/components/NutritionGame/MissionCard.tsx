import React from 'react';
import { MissionCardProps, MISSION_CATEGORIES } from '../../types/nutrition-game';
import { Card, Badge, ProgressBar, Tooltip } from '../../lib/anteacore-bridge';
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
  const progressPercentage = progress.progress || 0;
  
  const getStatusColor = () => {
    if (isCompleted) return 'var(--theme-success, #10b981)';
    if (progressPercentage > 0) return 'var(--brand-primary, #4f46e5)';
    return 'var(--theme-text-tertiary, #64748b)';
  };

  const getEffectIndicator = () => {
    if (!cannabisEffect) return null;
    
    const isBoost = cannabisEffect.type === 'boost';
    return (
      <Tooltip content={cannabisEffect.description}>
        <Badge 
          className={`${styles.cannabisIndicator} ${isBoost ? styles.boost : styles.penalty}`}
        >
          {isBoost ? '🚀' : '⚠️'} {Math.abs(cannabisEffect.percentage)}%
        </Badge>
      </Tooltip>
    );
  };

  return (
    <Card
      className={`${styles.missionCard} ${isCompleted ? styles.completed : ''} ${disabled ? styles.disabled : ''}`}
      onClick={disabled ? undefined : onClick}
      hoverable={!disabled}
      style={{ '--category-color': category.color } as React.CSSProperties}
    >
      {getEffectIndicator()}
      
      <Card.Header className={styles.missionHeader}>
        <div className={styles.missionIcon} style={{ background: category.color }}>
          {category.icon}
        </div>
        <div className={styles.missionInfo}>
          <Card.Title as="h4" className={styles.missionTitle}>
            {mission.title}
          </Card.Title>
          <Card.Subtitle className={styles.missionDescription}>
            {mission.description}
          </Card.Subtitle>
        </div>
      </Card.Header>
      
      <Card.Body className={styles.missionStats}>
        <Badge className={styles.pointsBadge} variant="primary">
          {mission.basePoints} pts
        </Badge>
        <div className={styles.targetReceptors}>
          {mission.targetReceptors.slice(0, 2).map((receptor, idx) => (
            <Badge key={idx} variant="secondary" className={styles.receptorTag}>
              {receptor}
            </Badge>
          ))}
          {mission.targetReceptors.length > 2 && (
            <Badge variant="secondary" className={styles.receptorTag}>
              +{mission.targetReceptors.length - 2}
            </Badge>
          )}
        </div>
      </Card.Body>
      
      <Card.Footer className={styles.progressContainer}>
        <ProgressBar 
          value={progressPercentage} 
          max={100}
          className={styles.progressBar}
          variant={isCompleted ? 'success' : 'primary'}
        />
        {isCompleted && (
          <div className={styles.completedIcon} style={{ color: getStatusColor() }}>
            ✓
          </div>
        )}
      </Card.Footer>
      
      {disabled && (
        <div className={styles.lockedOverlay}>
          <span className={styles.lockIcon}>🔒</span>
          <span className={styles.lockText}>Complete previous level</span>
        </div>
      )}
    </Card>
  );
};

export default MissionCard;
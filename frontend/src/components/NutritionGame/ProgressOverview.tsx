import React from 'react';
import { ProgressOverviewProps, LEVEL_NAMES } from '../../types/nutrition-game';
import { Card, Button, Badge, ProgressBar } from '../../lib/anteacore-bridge';
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

  const getLevelVariant = () => {
    switch (level) {
      case 1: return 'success';
      case 2: return 'warning';
      case 3: return 'error'; // Using error for pink/accent color
      default: return 'primary';
    }
  };

  return (
    <Card className={styles.progressOverview}>
      <Card.Header className={styles.levelHeader}>
        <div className={styles.levelInfo}>
          <Badge 
            size="lg" 
            variant={getLevelVariant() as any}
            className={styles.levelIcon}
            icon={getLevelIcon()}
          />
          <div>
            <Card.Title as="h3" className={styles.levelTitle}>
              Level {level}: {levelName}
            </Card.Title>
            <Card.Subtitle className={styles.levelSubtitle}>
              {progress.completed}/{progress.total} missions completed
            </Card.Subtitle>
          </div>
        </div>
        
        {progress.canLevelUp && (
          progress.leveledUpAt ? (
            <Badge 
              variant="success" 
              size="lg"
              className={styles.completedBadge}
              icon="✓"
            >
              Completed
            </Badge>
          ) : (
            <Button 
              className={styles.levelUpButton}
              onClick={onLevelUp}
              variant="primary"
              style={{ 
                background: getLevelColor(),
                animation: 'pulse 2s infinite'
              }}
            >
              Level Up! 🎉
            </Button>
          )
        )}
      </Card.Header>
      
      <Card.Body className={styles.progressBarContainer}>
        <ProgressBar 
          value={progressPercentage}
          max={100}
          variant={getLevelVariant() as any}
          showPercentage={true}
          className={styles.progressBar}
          animated={!isComplete}
        />
      </Card.Body>
      
      {isComplete && !progress.leveledUpAt && (
        <Card.Footer>
          <p className={styles.readyMessage}>
            🎯 All missions complete! Ready to level up when you are.
          </p>
        </Card.Footer>
      )}
    </Card>
  );
};

export default ProgressOverview;
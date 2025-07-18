import React, { useEffect } from 'react';
import { LevelUpCelebrationProps, LEVEL_NAMES } from '../../types/nutrition-game';
import styles from './LevelUpCelebration.module.css';

const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({
  isOpen,
  level,
  timeWindow,
  insight,
  achievements,
  onClose,
  onContinue
}) => {
  const levelName = LEVEL_NAMES[level];
  
  useEffect(() => {
    if (isOpen) {
      // Add confetti animation or celebration effects here
      const timer = setTimeout(() => {
        // Auto-close after 10 seconds if user doesn't interact
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const getLevelColor = () => {
    switch (level) {
      case 1: return '#10b981';
      case 2: return '#f59e0b';
      case 3: return '#ec4899';
      default: return '#4f46e5';
    }
  };

  const getLevelEmoji = () => {
    switch (level) {
      case 1: return '🌱';
      case 2: return '🚀';
      case 3: return '⭐';
      default: return '🏆';
    }
  };

  const getTimeWindowEmoji = () => {
    switch (timeWindow) {
      case 'morning': return '🌅';
      case 'midday': return '☀️';
      case 'afternoon': return '🌤️';
      case 'evening': return '🌙';
      default: return '🕐';
    }
  };

  return isOpen ? (
    <div className={styles.celebrationOverlay}>
      {/* Confetti Background */}
      <div className={styles.confettiContainer}>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className={styles.confetti}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b'][Math.floor(Math.random() * 5)]
            }}
          />
        ))}
      </div>

      <div className={styles.celebrationContent}>
        <div className={styles.celebrationHeader}>
          <div className={styles.levelBadge} style={{ background: getLevelColor() }}>
            <span className={styles.levelEmoji}>{getLevelEmoji()}</span>
            <span className={styles.levelText}>Level {level}</span>
          </div>
          
          <h1 className={styles.celebrationTitle}>
            {levelName} Achieved!
          </h1>
          
          <p className={styles.celebrationSubtitle}>
            {getTimeWindowEmoji()} {timeWindow.charAt(0).toUpperCase() + timeWindow.slice(1)} Window Complete
          </p>
        </div>

        {/* Health Insight */}
        <div className={styles.insightSection}>
          <h2 className={styles.insightTitle}>{insight.title}</h2>
          <p className={styles.insightContent}>{insight.content}</p>
          
          {insight.highlights.length > 0 && (
            <div className={styles.insightHighlights}>
              {insight.highlights.map((highlight, idx) => (
                <div key={idx} className={styles.highlightCard}>
                  <div className={styles.highlightValue}>{highlight.value}</div>
                  <div className={styles.highlightLabel}>{highlight.label}</div>
                  {highlight.explanation && (
                    <div className={styles.highlightExplanation}>{highlight.explanation}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {insight.cannabisContext && (
            <div className={styles.cannabisContext}>
              <span className={styles.cannabisIcon}>🌿</span>
              <p>{insight.cannabisContext}</p>
            </div>
          )}
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className={styles.achievementsSection}>
            <h3 className={styles.achievementsTitle}>Achievements Unlocked!</h3>
            <div className={styles.achievementsList}>
              {achievements.map(achievement => (
                <div key={achievement.id} className={styles.achievementCard}>
                  <div className={styles.achievementIcon}>{achievement.icon}</div>
                  <div className={styles.achievementInfo}>
                    <h4 className={styles.achievementName}>{achievement.title}</h4>
                    <p className={styles.achievementDesc}>{achievement.description}</p>
                    {achievement.reward && (
                      <div className={styles.achievementReward}>
                        🎁 {achievement.reward.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className={styles.celebrationActions}>
          <button className={styles.shareButton}>
            📤 Share Achievement
          </button>
          <button className={styles.continueButton} onClick={onContinue}>
            Continue Journey →
          </button>
        </div>

        {/* Close Button */}
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  ) : null;
};

export default LevelUpCelebration;
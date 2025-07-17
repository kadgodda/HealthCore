import React from 'react';
import { TimeWindow, TimeWindowNavProps, TIME_WINDOW_HOURS } from '../../types/nutrition-game';
import styles from './TimeWindowNav.module.css';

const TimeWindowNav: React.FC<TimeWindowNavProps> = ({
  currentWindow,
  windowProgress,
  onWindowChange
}) => {
  const timeWindows: TimeWindow[] = ['morning', 'midday', 'afternoon', 'evening'];
  
  const getTimeWindowInfo = (window: TimeWindow) => {
    const hours = TIME_WINDOW_HOURS[window];
    const formatHour = (hour: number) => {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}${period}`;
    };
    
    return {
      emoji: window === 'morning' ? '🌅' : window === 'midday' ? '☀️' : window === 'afternoon' ? '🌤️' : '🌙',
      label: window.charAt(0).toUpperCase() + window.slice(1),
      time: `${formatHour(hours.start)} - ${formatHour(hours.end)}`
    };
  };

  const isWindowActive = (window: TimeWindow) => {
    const now = new Date().getHours();
    const hours = TIME_WINDOW_HOURS[window];
    return now >= hours.start && now < hours.end;
  };

  return (
    <nav className={styles.timeWindowNav}>
      {timeWindows.map(window => {
        const info = getTimeWindowInfo(window);
        const progress = windowProgress[window];
        const isActive = isWindowActive(window);
        const isCurrent = currentWindow === window;
        
        return (
          <button
            key={window}
            className={`${styles.windowButton} ${isCurrent ? styles.current : ''} ${isActive ? styles.active : ''}`}
            onClick={() => onWindowChange(window)}
            aria-label={`Switch to ${info.label} window`}
          >
            <div className={styles.windowIcon}>{info.emoji}</div>
            <div className={styles.windowInfo}>
              <div className={styles.windowLabel}>{info.label}</div>
              <div className={styles.windowTime}>{info.time}</div>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progress}%` }}
              />
            </div>
            {isActive && <div className={styles.activeDot} />}
          </button>
        );
      })}
    </nav>
  );
};

export default TimeWindowNav;
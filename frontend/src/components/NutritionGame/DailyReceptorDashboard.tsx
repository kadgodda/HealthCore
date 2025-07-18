import React, { useState, useEffect } from 'react';
import { DashboardProps, GameState, TimeWindow, Level, Mission, MissionCompletionData } from '../../types/nutrition-game';

import TimeWindowNav from './TimeWindowNav';
import ProgressOverview from './ProgressOverview';
import MissionCard from './MissionCard';
import MissionModal from './MissionModal';
import LevelUpCelebration from './LevelUpCelebration';

import styles from '../../styles/nutrition-game.module.css';

export const DailyReceptorDashboard: React.FC<DashboardProps> = ({
  userId,
  initialGameState,
  onMissionComplete,
  onLevelUp,
  onCannabisUpdate,
  onReset
}) => {
  // State management
  const [currentTimeWindow, setCurrentTimeWindow] = useState<TimeWindow>('morning');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ level: Level; timeWindow: TimeWindow; insight?: any } | null>(null);
  const [missionSuggestions, setMissionSuggestions] = useState<any[]>([]);

  // Use the game state passed from parent
  const gameState = initialGameState;

  // Auto-detect current time window
  useEffect(() => {
    const detectTimeWindow = (): TimeWindow => {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 10) return 'morning';
      if (hour >= 10 && hour < 14) return 'midday';
      if (hour >= 14 && hour < 18) return 'afternoon';
      return 'evening';
    };

    setCurrentTimeWindow(detectTimeWindow());
  }, []);

  // Get current window's missions
  const getCurrentWindowMissions = () => {
    if (!gameState) return { level1: [], level2: [], level3: [] };
    
    const windowData = gameState.levels[currentTimeWindow];
    return {
      level1: windowData.level1.missions,
      level2: windowData.level2.missions,
      level3: windowData.level3.missions
    };
  };

  const getCurrentWindowProgress = () => {
    if (!gameState) return { level1: null, level2: null, level3: null };
    
    const windowData = gameState.levels[currentTimeWindow];
    return {
      level1: windowData.level1,
      level2: windowData.level2,
      level3: windowData.level3
    };
  };

  // Calculate window progress for navigation
  const getWindowProgress = () => {
    if (!gameState) return { morning: 0, midday: 0, afternoon: 0, evening: 0 };
    
    const progress: Record<TimeWindow, number> = {} as Record<TimeWindow, number>;
    
    (['morning', 'midday', 'afternoon', 'evening'] as TimeWindow[]).forEach(window => {
      const windowData = gameState.levels[window];
      const totalMissions = Object.values(windowData).reduce((sum, level) => sum + level.total, 0);
      const completedMissions = Object.values(windowData).reduce((sum, level) => sum + level.completed, 0);
      progress[window] = totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0;
    });
    
    return progress;
  };

  // Mission interaction handlers
  const handleMissionClick = async (mission: Mission) => {
    setSelectedMission(mission);
    // TODO: Load suggestions from API if needed
    setMissionSuggestions([]);
  };

  const handleMissionComplete = async (data: MissionCompletionData) => {
    if (!selectedMission) return;
    
    try {
      // Call parent handler
      const response = await onMissionComplete(selectedMission.id, data);
      
      // Close the modal to show the updated progress
      setSelectedMission(null);
    } catch (error) {
      console.error('Failed to complete mission:', error);
    }
  };

  const handleLevelUp = async (level: Level, timeWindow: TimeWindow) => {
    // Show celebration immediately
    setLevelUpData({ level, timeWindow, insight: null });
    setShowLevelUpModal(true);
    
    try {
      // Call parent handler
      const response = await onLevelUp(level, timeWindow);
    } catch (error) {
      console.error('Failed to trigger level up:', error);
    }
  };

  const handleCloseLevelUpModal = () => {
    setShowLevelUpModal(false);
    setLevelUpData(null);
  };

  // Placeholder for future suggestions
  const getMissionSuggestions = async (mission: Mission) => {
    return [];
  };

  if (!gameState) {
    return (
      <div className={styles.errorContainer}>
        <h2>No game state available</h2>
        <p>Unable to initialize nutrition game</p>
      </div>
    );
  }

  const missions = getCurrentWindowMissions();
  const progress = getCurrentWindowProgress();
  const windowProgress = getWindowProgress();

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Daily Receptor Dashboard</h1>
          <p className={styles.subtitle}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} • {currentTimeWindow.charAt(0).toUpperCase() + currentTimeWindow.slice(1)} Window Active
          </p>
        </div>
        
        <div className={styles.headerActions}>
          <div className={styles.scoreBadge}>
            <div className={styles.medal}>🥇</div>
            <div className={styles.scoreInfo}>
              <div className={styles.points}>{Math.round(gameState.dailyPoints)} pts</div>
              <div className={styles.streak}>{gameState.streakDays} day streak</div>
            </div>
          </div>
          {onReset && (
            <button 
              className={styles.resetButton}
              onClick={onReset}
              title="Reset Game Progress"
            >
              🔄 Reset
            </button>
          )}
        </div>
      </div>

      {/* Time Window Navigation */}
      <TimeWindowNav
        currentWindow={currentTimeWindow}
        windowProgress={windowProgress}
        onWindowChange={setCurrentTimeWindow}
      />

      {/* Cannabis Status - removed for simplicity */}

      {/* Level Sections */}
      <div className={styles.levelSections}>
        {/* Level 1: Foundation */}
        <div className={styles.levelSection}>
          <ProgressOverview
            level={1}
            timeWindow={currentTimeWindow}
            progress={progress.level1!}
            onLevelUp={() => handleLevelUp(1, currentTimeWindow)}
          />
          
          <div className={styles.missionGrid}>
            {missions.level1.map(mission => {
              const missionProgress = gameState.dailyProgress?.[mission.id] || { 
                missionId: mission.id, 
                completed: false, 
                progress: 0,
                requirementsCompleted: 0,
                totalRequirements: mission.requirements.length
              };
              return (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  progress={missionProgress}
                  cannabisEffect={undefined}
                  onClick={() => handleMissionClick(mission)}
                />
              );
            })}
          </div>
        </div>

        {/* Level 2: Optimization */}
        <div className={styles.levelSection}>
          <ProgressOverview
            level={2}
            timeWindow={currentTimeWindow}
            progress={progress.level2!}
            onLevelUp={() => handleLevelUp(2, currentTimeWindow)}
          />
          
          <div className={styles.missionGrid}>
            {missions.level2.map(mission => (
              <MissionCard
                key={mission.id}
                mission={mission}
                progress={gameState.dailyProgress?.[mission.id] || { missionId: mission.id, completed: false, progress: 0 }}
                cannabisEffect={undefined}
                onClick={() => handleMissionClick(mission)}
                disabled={!progress.level1?.leveledUpAt}
              />
            ))}
          </div>
        </div>

        {/* Level 3: Peak Performance */}
        <div className={styles.levelSection}>
          <ProgressOverview
            level={3}
            timeWindow={currentTimeWindow}
            progress={progress.level3!}
            onLevelUp={() => handleLevelUp(3, currentTimeWindow)}
          />
          
          <div className={styles.missionGrid}>
            {missions.level3.map(mission => (
              <MissionCard
                key={mission.id}
                mission={mission}
                progress={gameState.dailyProgress?.[mission.id] || { missionId: mission.id, completed: false, progress: 0 }}
                cannabisEffect={undefined}
                onClick={() => handleMissionClick(mission)}
                disabled={!progress.level2?.leveledUpAt}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mission Modal */}
      {selectedMission && (
        <MissionModal
          mission={selectedMission}
          isOpen={!!selectedMission}
          onClose={() => {
            setSelectedMission(null);
            setMissionSuggestions([]);
          }}
          onComplete={handleMissionComplete}
          suggestions={missionSuggestions}
          cannabisStatus={undefined}
          requirementProgress={gameState.requirementProgress?.[selectedMission.id] || {}}
        />
      )}

      {/* Level Up Celebration */}
      {showLevelUpModal && levelUpData && (
        <LevelUpCelebration
          isOpen={showLevelUpModal}
          level={levelUpData.level}
          timeWindow={levelUpData.timeWindow}
          insight={levelUpData.insight || {
            id: 'temp',
            level: `Level ${levelUpData.level}`,
            timeWindow: levelUpData.timeWindow,
            title: 'Level Up!',
            subtitle: 'Achievement unlocked',
            content: 'Congratulations on your progress!',
            highlights: []
          }}
          achievements={[]}
          onClose={handleCloseLevelUpModal}
          onContinue={handleCloseLevelUpModal}
        />
      )}
    </div>
  );
};

export default DailyReceptorDashboard;
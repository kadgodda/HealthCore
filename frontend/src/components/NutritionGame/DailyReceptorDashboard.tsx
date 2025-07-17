import React, { useState, useEffect } from 'react';
import { DashboardProps, GameState, TimeWindow, Level, Mission, MissionCompletionData } from '../../types/nutrition-game';
import { useMissionProgress } from '../../hooks/useMissionProgress';
import { useCannabisEffects } from '../../hooks/useCannabisEffects';
import { useAIInsights } from '../../hooks/useAIInsights';

import TimeWindowNav from './TimeWindowNav';
import ProgressOverview from './ProgressOverview';
import MissionCard from './MissionCard';
import MissionModal from './MissionModal';
import LevelUpCelebration from './LevelUpCelebration';
import CannabisStatusCard from './CannabisStatusCard';

import styles from '../../styles/nutrition-game.module.css';

export const DailyReceptorDashboard: React.FC<DashboardProps> = ({
  userId,
  initialGameState,
  onMissionComplete,
  onLevelUp,
  onCannabisUpdate
}) => {
  // State management
  const [currentTimeWindow, setCurrentTimeWindow] = useState<TimeWindow>('morning');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ level: Level; timeWindow: TimeWindow; insight?: any } | null>(null);
  const [missionSuggestions, setMissionSuggestions] = useState<any[]>([]);

  // Custom hooks
  const { 
    gameState, 
    updateProgress, 
    triggerLevelUp, 
    loading: progressLoading,
    error: progressError 
  } = useMissionProgress(userId, initialGameState);

  const {
    status: cannabisStatus,
    addConsumption,
    getEffectsForMission
  } = useCannabisEffects();

  const {
    generateSuggestions,
    generateLevelUpInsight,
    loading: insightsLoading
  } = useAIInsights();

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
    
    // Load suggestions for this mission
    try {
      const suggestions = await generateSuggestions(mission);
      setMissionSuggestions(suggestions);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
      setMissionSuggestions([]);
    }
  };

  const handleMissionComplete = async (data: MissionCompletionData) => {
    if (!selectedMission) return;
    
    try {
      // Update local progress
      await updateProgress(selectedMission.id, data);
      
      // Call parent handler
      const response = await onMissionComplete(selectedMission.id, data);
      
      // Check if level up is available
      const currentProgress = getCurrentWindowProgress();
      const levelKey = `level${selectedMission.level}` as keyof typeof currentProgress;
      const levelProgress = currentProgress[levelKey];
      
      if (levelProgress?.canLevelUp) {
        // Auto-trigger level up celebration
        await handleLevelUp(selectedMission.level, currentTimeWindow);
      }
      
      setSelectedMission(null);
    } catch (error) {
      console.error('Failed to complete mission:', error);
    }
  };

  const handleLevelUp = async (level: Level, timeWindow: TimeWindow) => {
    try {
      await triggerLevelUp(level, timeWindow);
      const response = await onLevelUp(level, timeWindow);
      
      // Generate level-up insight
      const insight = await generateLevelUpInsight(level, timeWindow, {
        cannabisStatus,
        gameState
      });
      
      setLevelUpData({ level, timeWindow, insight });
      setShowLevelUpModal(true);
    } catch (error) {
      console.error('Failed to trigger level up:', error);
    }
  };

  const handleCloseLevelUpModal = () => {
    setShowLevelUpModal(false);
    setLevelUpData(null);
  };

  // Get suggestions for selected mission
  const getMissionSuggestions = async (mission: Mission) => {
    try {
      return await generateSuggestions(mission);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      return [];
    }
  };

  if (progressLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading your receptor dashboard...</p>
      </div>
    );
  }

  if (progressError) {
    return (
      <div className={styles.errorContainer}>
        <h2>Unable to load dashboard</h2>
        <p>{progressError}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

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
        
        <div className={styles.scoreBadge}>
          <div className={styles.medal}>🥇</div>
          <div className={styles.scoreInfo}>
            <div className={styles.points}>{gameState.dailyPoints} pts</div>
            <div className={styles.streak}>{gameState.streakDays} day streak</div>
          </div>
        </div>
      </div>

      {/* Time Window Navigation */}
      <TimeWindowNav
        currentWindow={currentTimeWindow}
        windowProgress={windowProgress}
        onWindowChange={setCurrentTimeWindow}
      />

      {/* Cannabis Status (if applicable) */}
      {cannabisStatus && (
        <CannabisStatusCard
          status={cannabisStatus}
          onUpdate={onCannabisUpdate}
          onToggleTracking={() => {/* Handle toggle */}}
        />
      )}

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
            {missions.level1.map(mission => (
              <MissionCard
                key={mission.id}
                mission={mission}
                progress={gameState.dailyProgress?.[mission.id] || { missionId: mission.id, completed: false, progress: 0 }}
                cannabisEffect={getEffectsForMission(mission)[0]}
                onClick={() => handleMissionClick(mission)}
              />
            ))}
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
                cannabisEffect={getEffectsForMission(mission)[0]}
                onClick={() => handleMissionClick(mission)}
                disabled={!progress.level1?.canLevelUp && progress.level1?.completed !== progress.level1?.total}
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
                cannabisEffect={getEffectsForMission(mission)[0]}
                onClick={() => handleMissionClick(mission)}
                disabled={!progress.level2?.canLevelUp && progress.level2?.completed !== progress.level2?.total}
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
          cannabisStatus={cannabisStatus}
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
import React, { useState, useEffect } from 'react';
import { useNutritionStore } from '../store/nutritionStore';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  CardTitle, 
  Badge, 
  Button, 
  Modal,
  Spinner,
  Alert,
  AlertDescription,
  ProgressBar
} from '../lib/anteacore-bridge';
import styles from './BodySystemsNutrition.module.css';

// System configuration
const BODY_SYSTEMS = {
  intestinal: {
    title: "Intestinal Absorption Status",
    subtitle: "Nutrient uptake optimization at the molecular level",
    icon: '🔬',
    key: 'intestinal'
  },
  hepatic: {
    title: "Hepatic Processing Status", 
    subtitle: "Metabolic processing and detoxification systems",
    icon: '🏭',
    key: 'hepatic'
  },
  circulatory: {
    title: "Circulatory Transport Status",
    subtitle: "Nutrient delivery and distribution networks", 
    icon: '🚛',
    key: 'circulatory'
  },
  cellular: {
    title: "Cellular Utilization Status",
    subtitle: "Energy production and protein synthesis",
    icon: '⚡',
    key: 'cellular'
  }
};

interface ReceptorCluster {
  id: string;
  name: string;
  icon: string;
  description: string;
  status: 'optimal' | 'good' | 'attention' | 'concern';
  efficiency: number;
  receptors: string[];
  currentNutrients: string[];
  recommendations: string[];
}

const BodySystemsNutrition: React.FC = () => {
  const [activeSystem, setActiveSystem] = useState('intestinal');
  const [selectedCluster, setSelectedCluster] = useState<ReceptorCluster | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Get data from nutrition store
  const {
    gameState,
    receptorStatus,
    nutrientHistory,
    isLoading,
    fetchReceptorStatus
  } = useNutritionStore();

  // Fetch receptor status when nutrient history changes
  useEffect(() => {
    if (nutrientHistory.length > 0) {
      fetchReceptorStatus();
    }
  }, [nutrientHistory, fetchReceptorStatus]);

  // Calculate overall daily score based on game progress
  const calculateDailyScore = () => {
    const { totalPoints, currentLevel } = gameState;
    const baseScore = Math.min(100, Math.floor((totalPoints / 1000) * 100));
    const levelBonus = (currentLevel - 1) * 5;
    return Math.min(100, baseScore + levelBonus);
  };

  // Get receptor clusters for active system from backend data
  const getSystemClusters = (): ReceptorCluster[] => {
    if (!receptorStatus || !receptorStatus[activeSystem]) {
      return [];
    }

    return receptorStatus[activeSystem].clusters || [];
  };

  // Get expert commentary based on receptor status
  const getExpertCommentary = () => {
    if (!receptorStatus || !receptorStatus[activeSystem]) {
      return "Loading receptor analysis...";
    }

    const systemData = receptorStatus[activeSystem];
    return systemData.commentary || generateDefaultCommentary();
  };

  // Generate default commentary based on nutrient history
  const generateDefaultCommentary = () => {
    const recentNutrients = nutrientHistory.slice(-5).map(n => n.name).join(', ');
    
    switch (activeSystem) {
      case 'intestinal':
        return `Recent nutrient intake includes ${recentNutrients || 'no tracked nutrients'}. Your absorption patterns are being analyzed in real-time.`;
      case 'hepatic':
        return `Liver processing is adapting to your nutrient profile. Recent inputs are being metabolized efficiently.`;
      case 'circulatory':
        return `Nutrient transport systems are responding to your intake patterns. Delivery networks are optimizing based on demand.`;
      case 'cellular':
        return `Cellular utilization is adjusting to available nutrients. Energy production pathways are being optimized.`;
      default:
        return `System analysis in progress...`;
    }
  };

  // Get status color for badges
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'optimal': return 'success';
      case 'good': return 'primary';
      case 'attention': return 'warning';
      case 'concern': return 'error';
      default: return 'secondary';
    }
  };

  const handleClusterClick = (cluster: ReceptorCluster) => {
    setSelectedCluster(cluster);
    setShowDetailModal(true);
  };

  const handleRefreshStatus = () => {
    fetchReceptorStatus();
  };

  // Show loading state while fetching data
  if (isLoading && !receptorStatus) {
    return (
      <div className={styles.container}>
        <Card className={styles.loadingCard}>
          <Spinner size="lg" />
          <p>Analyzing receptor status...</p>
        </Card>
      </div>
    );
  }

  const dailyScore = calculateDailyScore();
  const systemClusters = getSystemClusters();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.headerSection}>
        <div className={styles.mainHeader}>
          <h1 className={styles.title}>Body Systems Nutrition Intelligence</h1>
          <p className={styles.subtitle}>Real-time feedback on your body's nutritional status</p>
        </div>

        {/* Daily Optimization Score */}
        <Card className={styles.scoreCard}>
          <CardHeader>
            <CardTitle>Daily Optimization Score</CardTitle>
          </CardHeader>
          <CardBody>
            <div className={styles.scoreContent}>
              <div className={styles.scoreCircle}>
                <span className={styles.scoreNumber}>{dailyScore}</span>
                <span className={styles.scoreLabel}>Score</span>
              </div>
              
              <div className={styles.scoreInsights}>
                <div className={styles.insightItem}>
                  <div className={styles.insightNumber}>{gameState.totalPoints}</div>
                  <div className={styles.insightLabel}>Total Points</div>
                </div>
                <div className={styles.insightItem}>
                  <div className={styles.insightNumber}>L{gameState.currentLevel}</div>
                  <div className={styles.insightLabel}>Current Level</div>
                </div>
                <div className={styles.insightItem}>
                  <div className={styles.insightNumber}>{nutrientHistory.length}</div>
                  <div className={styles.insightLabel}>Nutrients Tracked</div>
                </div>
                <div className={styles.insightItem}>
                  <div className={styles.insightNumber}>{systemClusters.length}</div>
                  <div className={styles.insightLabel}>Active Receptors</div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* System Tabs */}
        <div className={styles.systemTabs}>
          {Object.entries(BODY_SYSTEMS).map(([key, system]) => (
            <Button
              key={key}
              variant={activeSystem === key ? 'primary' : 'outline'}
              onClick={() => setActiveSystem(key)}
              className={styles.systemTab}
            >
              <span className={styles.tabIcon}>{system.icon}</span>
              {system.title.split(' ')[0]}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <Card className={styles.mainContent}>
        <CardHeader>
          <CardTitle>{BODY_SYSTEMS[activeSystem].title}</CardTitle>
          <p className={styles.systemSubtitle}>{BODY_SYSTEMS[activeSystem].subtitle}</p>
        </CardHeader>
        
        <CardBody>
          {/* Expert Insight */}
          <Card className={styles.expertCard}>
            <CardHeader>
              <div className={styles.expertHeader}>
                <div className={styles.expertAvatar}>🧬</div>
                <div className={styles.expertInfo}>
                  <h3 className={styles.expertName}>Dr. Frizzle</h3>
                  <p className={styles.expertTitle}>Nutritional Biochemistry • Real-time Body Feedback</p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <p className={styles.expertCommentary}>{getExpertCommentary()}</p>
            </CardBody>
          </Card>
          
          {/* Receptor Grid */}
          {systemClusters.length > 0 ? (
            <div className={styles.receptorGrid}>
              {systemClusters.map(cluster => (
                <Card
                  key={cluster.id}
                  hoverable
                  onClick={() => handleClusterClick(cluster)}
                  className={styles.receptorCluster}
                >
                  <CardHeader>
                    <div className={styles.clusterHeader}>
                      <span className={styles.clusterIcon}>{cluster.icon}</span>
                      <CardTitle className={styles.clusterTitle}>{cluster.name}</CardTitle>
                    </div>
                    <Badge variant={getStatusVariant(cluster.status)}>
                      {cluster.status}
                    </Badge>
                  </CardHeader>
                  
                  <CardBody>
                    <p className={styles.clusterDescription}>{cluster.description}</p>
                    
                    {/* Progress Bar */}
                    <div className={styles.efficiencySection}>
                      <div className={styles.efficiencyLabel}>
                        <span>Efficiency</span>
                        <span>{cluster.efficiency}%</span>
                      </div>
                      <ProgressBar 
                        value={cluster.efficiency} 
                        max={100}
                        variant={getStatusVariant(cluster.status)}
                      />
                    </div>
                    
                    {/* Current Nutrients */}
                    {cluster.currentNutrients && cluster.currentNutrients.length > 0 && (
                      <div className={styles.nutrientTags}>
                        {cluster.currentNutrients.slice(0, 3).map((nutrient, idx) => (
                          <Badge key={idx} variant="secondary" size="sm">
                            {nutrient}
                          </Badge>
                        ))}
                        {cluster.currentNutrients.length > 3 && (
                          <Badge variant="secondary" size="sm">
                            +{cluster.currentNutrients.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertDescription>
                No receptor data available yet. Complete missions in the Nutrition Game to see real-time receptor analysis.
              </AlertDescription>
            </Alert>
          )}
        </CardBody>
      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={selectedCluster?.name || ''}
      >
        {selectedCluster && (
          <div className={styles.modalContent}>
            <div className={styles.modalSection}>
              <h3 className={styles.sectionTitle}>🔬 Receptor Details</h3>
              <p className={styles.sectionContent}>{selectedCluster.description}</p>
              
              <div className={styles.receptorList}>
                <h4>Active Receptors:</h4>
                <ul>
                  {selectedCluster.receptors.map((receptor, idx) => (
                    <li key={idx}>{receptor}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className={styles.modalSection}>
              <h3 className={styles.sectionTitle}>📊 Current Status</h3>
              <div className={styles.statusDetails}>
                <Badge variant={getStatusVariant(selectedCluster.status)} size="lg">
                  {selectedCluster.status} - {selectedCluster.efficiency}% efficiency
                </Badge>
              </div>
              
              {selectedCluster.currentNutrients && selectedCluster.currentNutrients.length > 0 && (
                <>
                  <h4>Contributing Nutrients:</h4>
                  <div className={styles.nutrientList}>
                    {selectedCluster.currentNutrients.map((nutrient, idx) => (
                      <Badge key={idx} variant="primary">
                        {nutrient}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {selectedCluster.recommendations && selectedCluster.recommendations.length > 0 && (
              <div className={styles.modalSection}>
                <h3 className={styles.sectionTitle}>💡 Recommendations</h3>
                <ul className={styles.recommendationList}>
                  {selectedCluster.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Refresh Button */}
      <Button 
        className={styles.refreshButton}
        onClick={handleRefreshStatus}
        leftIcon="🔄"
      >
        Refresh Status
      </Button>
    </div>
  );
}

export default BodySystemsNutrition;
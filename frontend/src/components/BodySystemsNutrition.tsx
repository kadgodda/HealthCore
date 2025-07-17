import React, { useState, useEffect } from 'react';

// Mock AnteaCore components (simplified for demo)
const Card = ({ children, className = '', hoverable = false, onClick }) => (
  <div 
    className={`anteacore-card ${hoverable ? 'anteacore-card-hoverable' : ''} ${className}`}
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`anteacore-card-header ${className}`}>{children}</div>
);

const CardBody = ({ children, className = '' }) => (
  <div className={`anteacore-card-body ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`anteacore-card-title ${className}`}>{children}</h3>
);

const Badge = ({ children, variant = 'primary', size = 'md', className = '' }) => (
  <span className={`anteacore-badge anteacore-badge-${variant} anteacore-badge-${size} ${className}`}>
    {children}
  </span>
);

const SectionCard = ({ title, icon, children, variant = 'default', className = '' }) => (
  <section className={`anteacore-section-card anteacore-section-${variant} ${className}`}>
    {title && (
      <div className="anteacore-section-header">
        {icon && <span className="anteacore-section-icon">{icon}</span>}
        <h3 className="anteacore-section-title">{title}</h3>
      </div>
    )}
    <div className="anteacore-section-content">{children}</div>
  </section>
);

// System data
const systemData = {
  intestinal: {
    title: "Intestinal Absorption Status",
    subtitle: "Nutrient uptake optimization at the molecular level",
    commentary: "Your absorption patterns show excellent iron utilization today. The vitamin C from your morning smoothie created optimal conditions for iron uptake. Consider spacing your calcium supplement 2 hours from iron-rich meals for maximum efficiency."
  },
  liver: {
    title: "Hepatic Processing Status",
    subtitle: "Metabolic processing and detoxification systems",
    commentary: "Liver enzyme activity is well-supported by your recent B-vitamin intake. Phase II detoxification pathways are functioning optimally. Your omega-3 levels are supporting healthy inflammatory response."
  },
  blood: {
    title: "Circulatory Transport Status",
    subtitle: "Nutrient delivery and distribution networks",
    commentary: "Nutrient delivery systems are performing well. Your magnesium levels are supporting healthy vascular function. Consider timing your next meal to maintain steady glucose and amino acid levels."
  },
  cellular: {
    title: "Cellular Utilization Status",
    subtitle: "Energy production and protein synthesis",
    commentary: "Mitochondrial function is well-supported by your current nutrient profile. CoQ10 and B-vitamin levels are adequate for energy production. Your antioxidant network is providing good cellular protection."
  }
};

const clusterData = [
  {
    id: 'iron',
    name: 'Iron Absorption',
    icon: '⚡',
    description: 'Heme and non-heme iron uptake through DMT1 transporters',
    status: 'optimal',
    efficiency: 92,
    factors: {
      enhancers: ['Vitamin C ✓', 'Empty stomach ✓'],
      inhibitors: ['Calcium competing']
    }
  },
  {
    id: 'calcium',
    name: 'Calcium Channels',
    icon: '🦴',
    description: 'TRPV6 channel-mediated calcium transport with vitamin D regulation',
    status: 'good',
    efficiency: 76,
    factors: {
      enhancers: ['Vitamin D active', 'Magnesium present'],
      inhibitors: ['High fiber']
    }
  },
  {
    id: 'b-complex',
    name: 'B-Complex Network',
    icon: '🧠',
    description: 'B12 intrinsic factor binding and folate transport systems',
    status: 'attention',
    efficiency: 58,
    factors: {
      enhancers: ['B12-IF complex'],
      inhibitors: ['Low stomach acid', 'Alcohol interference']
    }
  },
  {
    id: 'fat-vitamins',
    name: 'Fat-Soluble Vitamins',
    icon: '🌟',
    description: 'Bile-dependent absorption of vitamins A, D, E, K',
    status: 'good',
    efficiency: 81,
    factors: {
      enhancers: ['Healthy fats ✓', 'Bile flow good'],
      inhibitors: ['Competition A,E']
    }
  },
  {
    id: 'antioxidants',
    name: 'Antioxidant Systems',
    icon: '🛡️',
    description: 'Coordinated vitamin C, E, selenium, and glutathione pathways',
    status: 'optimal',
    efficiency: 94,
    factors: {
      enhancers: ['Synergy active ✓', 'Recycling optimal', 'Selenium adequate'],
      inhibitors: []
    }
  },
  {
    id: 'minerals',
    name: 'Trace Minerals',
    icon: '💎',
    description: 'Zinc, copper, manganese transport and metallothionein binding',
    status: 'good',
    efficiency: 72,
    factors: {
      enhancers: ['Balanced ratios'],
      inhibitors: ['Phytate binding', 'Iron competition']
    }
  }
];

const detailedData = {
  iron: {
    title: "Iron Absorption System",
    subtitle: "DMT1 Transporter Complex",
    mechanism: "Iron enters through the DMT1 (Divalent Metal Transporter 1) when in ferrous (Fe²⁺) form. Duodenal cytochrome B reductase converts dietary ferric iron to the absorbable form.",
    enhancers: [
      { name: "Vitamin C", description: "Maintains iron in Fe²⁺ state, increases absorption 3-5x" },
      { name: "Heme Iron", description: "Direct uptake via heme transporter, bypasses competition" },
      { name: "Empty Stomach", description: "Acidic environment favors Fe³⁺ → Fe²⁺ conversion" }
    ],
    inhibitors: [
      { name: "Calcium", description: "Competes for DMT1 binding site" },
      { name: "Polyphenols", description: "Form insoluble complexes with iron" },
      { name: "Zinc", description: "Shared transporter pathway competition" }
    ],
    strategy: "Take iron supplements 1 hour before meals or 2 hours after. Separate from calcium by 2+ hours. Combine with vitamin C-rich foods for maximum absorption.",
    status: "Optimal (92% efficiency) - Your morning vitamin C intake has created excellent conditions for iron absorption. Recent meal timing shows good separation from calcium sources."
  }
};

export default function BodySystemsNutrition() {
  const [activeSystem, setActiveSystem] = useState('intestinal');
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [dailyScore, setDailyScore] = useState(82);

  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal': return 'success';
      case 'good': return 'info';
      case 'attention': return 'warning';
      case 'concern': return 'error';
      default: return 'secondary';
    }
  };

  const getStatusIndicator = (status) => {
    switch (status) {
      case 'optimal': return '●';
      case 'good': return '●';
      case 'attention': return '●';
      case 'concern': return '●';
      default: return '○';
    }
  };

  const handleClusterClick = (cluster) => {
    setSelectedCluster(cluster);
    setPanelOpen(true);
  };

  const refreshData = () => {
    setDailyScore(Math.max(70, Math.min(100, dailyScore + Math.floor(Math.random() * 10 - 5))));
  };

  useEffect(() => {
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, [dailyScore]);

  const styles = {
    container: {
      fontFamily: '-webkit-system-font, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '1.5rem',
      color: '#1e293b'
    },
    headerSection: {
      marginBottom: '2rem'
    },
    mainHeader: {
      textAlign: 'center',
      color: 'white',
      marginBottom: '1.5rem'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 300,
      margin: '0 0 0.5rem 0'
    },
    subtitle: {
      fontSize: '1rem',
      opacity: 0.9,
      margin: 0
    },
    systemTabs: {
      display: 'flex',
      justifyContent: 'center',
      gap: '0.5rem',
      marginBottom: '1.5rem',
      flexWrap: 'wrap'
    },
    systemTab: {
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '25px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontWeight: 500,
      fontSize: '0.875rem'
    },
    systemTabActive: {
      background: 'rgba(255, 255, 255, 0.25)',
      borderColor: 'rgba(255, 255, 255, 0.4)',
      transform: 'translateY(-2px)'
    },
    expertInsight: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '0.5rem',
      padding: '1.25rem',
      marginBottom: '1rem'
    },
    expertHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1rem'
    },
    expertAvatar: {
      width: '3rem',
      height: '3rem',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.25rem'
    },
    expertInfo: {
      flex: 1
    },
    expertName: {
      margin: 0,
      fontSize: '1rem',
      fontWeight: 600,
      color: '#1e293b'
    },
    expertTitle: {
      margin: '0.125rem 0 0 0',
      fontSize: '0.75rem',
      color: '#64748b'
    },
    nutritionLab: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '0.5rem',
      padding: '1.25rem',
      maxWidth: '1200px',
      margin: '0 auto 2rem auto'
    },
    labSubtitle: {
      textAlign: 'center',
      color: '#64748b',
      margin: '0 0 2rem 0',
      fontSize: '0.875rem'
    },
    receptorGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.25rem',
      marginBottom: '2rem'
    },
    clusterInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    clusterIcon: {
      fontSize: '1.5rem',
      width: '2.5rem',
      height: '2.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '0.5rem',
      background: '#f8fafc'
    },
    statusIndicator: {
      fontSize: '0.75rem'
    },
    statusOptimal: { color: '#10b981' },
    statusGood: { color: '#3b82f6' },
    statusAttention: { color: '#f59e0b' },
    statusConcern: { color: '#ef4444' },
    clusterDescription: {
      color: '#64748b',
      fontSize: '0.8125rem',
      margin: '0 0 1rem 0',
      lineHeight: 1.4
    },
    nutrientFactors: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.375rem',
      marginBottom: '0.75rem'
    },
    clusterMetric: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '0.75rem',
      paddingTop: '0.75rem',
      borderTop: '1px solid #e2e8f0'
    },
    metricLabel: {
      fontSize: '0.75rem',
      color: '#64748b'
    },
    metricValue: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#1e293b'
    },
    dailyOverview: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      borderRadius: '0.5rem',
      padding: '1.25rem',
      color: 'white',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    overviewContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
      flexWrap: 'wrap'
    },
    scoreCircle: {
      width: '6rem',
      height: '6rem',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      flexShrink: 0
    },
    scoreNumber: {
      fontSize: '1.75rem',
      fontWeight: 300,
      marginBottom: '0.125rem'
    },
    scoreLabel: {
      fontSize: '0.75rem',
      opacity: 0.8
    },
    overviewInsights: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '1rem',
      flex: 1
    },
    insightItem: {
      textAlign: 'center'
    },
    insightNumber: {
      fontSize: '1.25rem',
      fontWeight: 600,
      marginBottom: '0.25rem'
    },
    insightLabel: {
      fontSize: '0.75rem',
      opacity: 0.8
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    },
    panel: {
      background: 'white',
      borderRadius: '0.5rem',
      maxWidth: '500px',
      width: '100%',
      maxHeight: '80vh',
      overflowY: 'auto',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
    },
    panelHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.25rem',
      borderBottom: '1px solid #e2e8f0',
      background: '#ffffff'
    },
    panelTitle: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: '#1e293b',
      margin: 0
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#64748b',
      padding: 0,
      width: '2rem',
      height: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      transition: 'all 0.15s ease'
    },
    panelContent: {
      padding: '1.25rem'
    },
    sectionTitle: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#1e293b',
      margin: '0 0 0.75rem 0',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    controls: {
      position: 'fixed',
      bottom: '1.25rem',
      right: '1.25rem',
      zIndex: 100
    },
    controlButton: {
      background: 'white',
      border: '1px solid #e2e8f0',
      color: '#1e293b',
      padding: '0.75rem 1.25rem',
      borderRadius: '25px',
      cursor: 'pointer',
      fontWeight: 500,
      fontSize: '0.875rem',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }
  };

  // AnteaCore component styles
  const anteaCoreStyles = `
    .anteacore-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      overflow: hidden;
      transition: all 0.15s ease;
      color: #1e293b;
    }
    .anteacore-card-hoverable {
      cursor: pointer;
    }
    .anteacore-card-hoverable:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transform: translateY(-2px);
      border-color: #cbd5e1;
    }
    .anteacore-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid #e2e8f0;
      background: #ffffff;
    }
    .anteacore-card-body {
      padding: 1.25rem;
    }
    .anteacore-card-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }
    .anteacore-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      line-height: 1;
      border-radius: 0.375rem;
      background: #6366f1;
      color: white;
      text-transform: uppercase;
      letter-spacing: 0.025em;
      transition: all 0.1s ease;
      white-space: nowrap;
      min-width: fit-content;
    }
    .anteacore-badge-success { background: #10b981; color: white; }
    .anteacore-badge-error { background: #ef4444; color: white; }
    .anteacore-badge-sm { padding: 0.125rem 0.25rem; font-size: 0.65625rem; }
    .anteacore-section-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      overflow: hidden;
      margin-bottom: 1.25rem;
    }
    .anteacore-section-elevated {
      background: #ffffff;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .anteacore-section-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid #e2e8f0;
      background: #ffffff;
    }
    .anteacore-section-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }
    .anteacore-section-content {
      padding: 1.25rem;
    }
  `;

  return (
    <>
      <style>{anteaCoreStyles}</style>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.headerSection}>
          <div style={styles.mainHeader}>
            <h1 style={styles.title}>Body Systems Nutrition Intelligence</h1>
            <p style={styles.subtitle}>Real-time feedback on your body's nutritional status</p>
          </div>

          {/* Daily Optimization Score - Moved to top */}
          <div style={{...styles.dailyOverview, marginBottom: '1.5rem'}}>
            <h3 style={{margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 600}}>Daily Optimization Score</h3>
            <div style={styles.overviewContent}>
              <div style={styles.scoreCircle}>
                <span style={styles.scoreNumber}>{dailyScore}</span>
                <span style={styles.scoreLabel}>Score</span>
              </div>
              
              <div style={styles.overviewInsights}>
                <div style={styles.insightItem}>
                  <div style={styles.insightNumber}>6/6</div>
                  <div style={styles.insightLabel}>Systems Active</div>
                </div>
                <div style={styles.insightItem}>
                  <div style={styles.insightNumber}>2</div>
                  <div style={styles.insightLabel}>Need Attention</div>
                </div>
                <div style={styles.insightItem}>
                  <div style={styles.insightNumber}>4.2hrs</div>
                  <div style={styles.insightLabel}>Since Last Meal</div>
                </div>
                <div style={styles.insightItem}>
                  <div style={styles.insightNumber}>89%</div>
                  <div style={styles.insightLabel}>Weekly Average</div>
                </div>
              </div>
            </div>
          </div>

          {/* System Tabs */}
          <div style={styles.systemTabs}>
            {Object.entries(systemData).map(([key, data]) => (
              <button
                key={key}
                style={{
                  ...styles.systemTab,
                  ...(activeSystem === key ? styles.systemTabActive : {})
                }}
                onClick={() => setActiveSystem(key)}
                onMouseEnter={(e) => {
                  if (activeSystem !== key) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSystem !== key) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {key === 'intestinal' && '🔬'} 
                {key === 'liver' && '🏭'} 
                {key === 'blood' && '🚛'} 
                {key === 'cellular' && '⚡'} 
                {data.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div>
          <div style={styles.nutritionLab}>
            <h2 style={{textAlign: 'center', margin: '0 0 0.5rem 0', color: '#1e293b', fontWeight: 300, fontSize: '1.5rem'}}>{systemData[activeSystem].title}</h2>
            <p style={styles.labSubtitle}>{systemData[activeSystem].subtitle}</p>
            
            {/* Expert Insight - Dr. Frizzle moved here */}
            <div style={{...styles.expertInsight, marginBottom: '2rem'}}>
              <div style={styles.expertHeader}>
                <div style={styles.expertAvatar}>🧬</div>
                <div style={styles.expertInfo}>
                  <h3 style={styles.expertName}>Dr. Frizzle</h3>
                  <p style={styles.expertTitle}>Nutritional Biochemistry • Real-time Body Feedback</p>
                </div>
              </div>
              <p style={{fontSize: '0.875rem', lineHeight: 1.5, color: '#1e293b', margin: 0}}>
                {systemData[activeSystem].commentary}
              </p>
            </div>
            
            {/* Receptor Grid */}
            <div style={styles.receptorGrid}>
              {clusterData.map(cluster => (
                <Card
                  key={cluster.id}
                  hoverable
                  onClick={() => handleClusterClick(cluster)}
                  className="receptor-cluster"
                >
                  <CardHeader>
                    <div style={styles.clusterInfo}>
                      <span style={styles.clusterIcon}>{cluster.icon}</span>
                      <CardTitle>{cluster.name}</CardTitle>
                    </div>
                    <span style={{
                      ...styles.statusIndicator,
                      ...(cluster.status === 'optimal' ? styles.statusOptimal : 
                          cluster.status === 'good' ? styles.statusGood :
                          cluster.status === 'attention' ? styles.statusAttention : styles.statusConcern)
                    }}>
                      {getStatusIndicator(cluster.status)}
                    </span>
                  </CardHeader>
                  
                  <CardBody>
                    <p style={styles.clusterDescription}>{cluster.description}</p>
                    
                    <div style={styles.nutrientFactors}>
                      {cluster.factors.enhancers.map((enhancer, idx) => (
                        <Badge key={idx} variant="success" size="sm">
                          {enhancer}
                        </Badge>
                      ))}
                      {cluster.factors.inhibitors.map((inhibitor, idx) => (
                        <Badge key={idx} variant="error" size="sm">
                          {inhibitor}
                        </Badge>
                      ))}
                    </div>
                    
                    <div style={styles.clusterMetric}>
                      <span style={styles.metricLabel}>Today's efficiency</span>
                      <span style={styles.metricValue}>{cluster.efficiency}%</span>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Data Panel */}
        {panelOpen && selectedCluster && (
          <div style={styles.overlay} onClick={() => setPanelOpen(false)}>
            <div style={styles.panel} onClick={e => e.stopPropagation()}>
              <div style={styles.panelHeader}>
                <h2 style={styles.panelTitle}>{selectedCluster.name} System</h2>
                <button 
                  style={styles.closeButton} 
                  onClick={() => setPanelOpen(false)}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#f8fafc';
                    e.target.style.color = '#1e293b';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'none';
                    e.target.style.color = '#64748b';
                  }}
                >
                  ×
                </button>
              </div>
              
              <div style={styles.panelContent}>
                <div style={{marginBottom: '1.5rem'}}>
                  <h3 style={styles.sectionTitle}>🔬 How It Works</h3>
                  <p style={{fontSize: '0.8125rem', lineHeight: 1.5, color: '#1e293b', margin: 0}}>
                    {selectedCluster.description}
                  </p>
                </div>
                
                <div style={{marginBottom: '1.5rem'}}>
                  <h3 style={styles.sectionTitle}>✅ Enhancement Factors</h3>
                  <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                    {selectedCluster.factors.enhancers.map((enhancer, idx) => (
                      <li key={idx} style={{padding: '0.5rem 0', borderBottom: '1px solid #f8fafc', fontSize: '0.8125rem', color: '#1e293b'}}>{enhancer}</li>
                    ))}
                  </ul>
                  
                  {selectedCluster.factors.inhibitors.length > 0 && (
                    <>
                      <h3 style={{...styles.sectionTitle, marginTop: '1.5rem'}}>❌ Inhibiting Factors</h3>
                      <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                        {selectedCluster.factors.inhibitors.map((inhibitor, idx) => (
                          <li key={idx} style={{padding: '0.5rem 0', borderBottom: '1px solid #f8fafc', fontSize: '0.8125rem', color: '#1e293b'}}>{inhibitor}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
                
                <div>
                  <h3 style={styles.sectionTitle}>📊 Current Status</h3>
                  <p style={{fontSize: '0.8125rem', lineHeight: 1.5, color: '#1e293b', margin: 0}}>
                    <strong>{selectedCluster.status.charAt(0).toUpperCase() + selectedCluster.status.slice(1)} ({selectedCluster.efficiency}% efficiency)</strong><br/>
                    System is performing well with good nutrient utilization patterns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div style={styles.controls}>
          <button 
            style={styles.controlButton} 
            onClick={refreshData}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
              e.target.style.borderColor = '#6366f1';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              e.target.style.borderColor = '#e2e8f0';
            }}
          >
            🔄 Refresh Status
          </button>
        </div>
      </div>
    </>
  );
}
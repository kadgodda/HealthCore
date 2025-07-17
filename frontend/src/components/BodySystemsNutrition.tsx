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
  hepatic: {
    title: "Hepatic Processing Status",
    subtitle: "Metabolic processing and detoxification systems",
    commentary: "Liver enzyme activity is well-supported by your recent B-vitamin intake. Phase II detoxification pathways are functioning optimally. Your omega-3 levels are supporting healthy inflammatory response."
  },
  circulatory: {
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

// Receptor cluster data for each system based on complete_receptor_mapping.md
const systemClusterData = {
  intestinal: [
    {
      id: 'iron',
      name: 'Iron Absorption Complex',
      icon: '🩸',
      description: 'DMT1 transporter with Dcytb reduction system for Fe²⁺ uptake',
      status: 'optimal',
      efficiency: 92,
      factors: {
        enhancers: ['Vitamin C (3-5x ↑)', 'Empty stomach ✓', 'Heme iron bypass'],
        inhibitors: ['Calcium competition', 'Zinc at DMT1']
      }
    },
    {
      id: 'calcium',
      name: 'Calcium Channels',
      icon: '🦴',
      description: 'TRPV6 channels with vitamin D₃ regulation and calbindin transport',
      status: 'good',
      efficiency: 76,
      factors: {
        enhancers: ['Vitamin D₃ active', 'Vitamin K₂ utilization', 'Acidic pH'],
        inhibitors: ['Magnesium competition', 'Phytate chelation']
      }
    },
    {
      id: 'b-complex',
      name: 'B-Vitamin Networks',
      icon: '🧠',
      description: 'B₁₂-IF cubilin pathway, RFC1 folate transport, THTR1/2 thiamine',
      status: 'attention',
      efficiency: 58,
      factors: {
        enhancers: ['Intrinsic Factor ✓', 'Low pH for PCFT'],
        inhibitors: ['Low stomach acid', 'High glucose (B₁)']
      }
    },
    {
      id: 'fat-vitamins',
      name: 'Fat-Soluble Pathway',
      icon: '🌟',
      description: 'Bile-dependent micelle formation for vitamins A,D,E,K via NPC1L1',
      status: 'good',
      efficiency: 81,
      factors: {
        enhancers: ['Healthy fats ✓', 'Bile salts active', 'Phospholipids'],
        inhibitors: ['Limited micelle space', 'Poor bile flow']
      }
    },
    {
      id: 'amino-acids',
      name: 'Amino Acid Transport',
      icon: '🥩',
      description: 'LAT1 large amino acids, CAT cationic, EAAT acidic transporters',
      status: 'optimal',
      efficiency: 88,
      factors: {
        enhancers: ['Complete proteins', 'Optimal pH'],
        inhibitors: ['LAT1 competition', 'Energy depletion']
      }
    },
    {
      id: 'minerals',
      name: 'Trace Minerals',
      icon: '💎',
      description: 'ZIP4 zinc transport, selenoprotein P, copper CTR1 systems',
      status: 'good',
      efficiency: 72,
      factors: {
        enhancers: ['Metallothionein ready', 'Vitamin E (Se)'],
        inhibitors: ['Phytate binding', 'Iron competition']
      }
    }
  ],
  hepatic: [
    {
      id: 'phase-1',
      name: 'Phase I Metabolism',
      icon: '🔥',
      description: 'CYP450 enzymes (CYP1A2, CYP2E1, CYP3A4) for oxidation',
      status: 'optimal',
      efficiency: 91,
      factors: {
        enhancers: ['Iron adequate', 'NADPH available', 'Flavins present'],
        inhibitors: ['Grapefruit (CYP3A4)', 'Alcohol load']
      }
    },
    {
      id: 'phase-2',
      name: 'Phase II Conjugation',
      icon: '🔗',
      description: 'Sulfation, glucuronidation, glutathione conjugation pathways',
      status: 'good',
      efficiency: 83,
      factors: {
        enhancers: ['Sulfur amino acids', 'B-vitamins ✓', 'GSH synthesis'],
        inhibitors: ['Acetaminophen load', 'Toxin overload']
      }
    },
    {
      id: 'vitamin-storage',
      name: 'Vitamin Storage',
      icon: '📦',
      description: 'Stellate cells store vitamin A, 25-hydroxylation of vitamin D',
      status: 'optimal',
      efficiency: 94,
      factors: {
        enhancers: ['RBP synthesis ✓', 'α-TTP for vitamin E', 'VKORC1 active'],
        inhibitors: ['Fatty liver', 'Storage capacity']
      }
    },
    {
      id: 'protein-synthesis',
      name: 'Protein Synthesis',
      icon: '🏗️',
      description: 'Albumin, transferrin, coagulation factors production',
      status: 'good',
      efficiency: 79,
      factors: {
        enhancers: ['Complete amino acids', 'Vitamin K available'],
        inhibitors: ['Inflammation', 'Nutrient deficiency']
      }
    },
    {
      id: 'lipid-metabolism',
      name: 'Lipid Processing',
      icon: '🧈',
      description: 'VLDL synthesis, cholesterol regulation, bile acid production',
      status: 'good',
      efficiency: 85,
      factors: {
        enhancers: ['Choline adequate', 'B₃ for VLDL', 'Fiber intake'],
        inhibitors: ['Saturated fat excess', 'Alcohol']
      }
    },
    {
      id: 'detox-pathways',
      name: 'Detoxification',
      icon: '🧹',
      description: 'Ammonia to urea, bilirubin conjugation, xenobiotic processing',
      status: 'optimal',
      efficiency: 90,
      factors: {
        enhancers: ['Arginine cycle ✓', 'UDP-glucuronic acid', 'Molybdenum'],
        inhibitors: ['High protein load', 'Drug burden']
      }
    }
  ],
  circulatory: [
    {
      id: 'iron-transport',
      name: 'Iron Transport',
      icon: '🚚',
      description: 'Transferrin binding and TfR1 receptor-mediated uptake',
      status: 'optimal',
      efficiency: 93,
      factors: {
        enhancers: ['Transferrin saturation OK', 'Hepcidin balanced', 'Copper for ceruloplasmin'],
        inhibitors: ['Inflammation (↑hepcidin)', 'Iron overload']
      }
    },
    {
      id: 'vitamin-carriers',
      name: 'Vitamin Carriers',
      icon: '📬',
      description: 'RBP for vitamin A, DBP for vitamin D, lipoproteins for E',
      status: 'good',
      efficiency: 87,
      factors: {
        enhancers: ['Protein synthesis ✓', 'Zinc for RBP', 'HDL/LDL balance'],
        inhibitors: ['Low protein status', 'Liver dysfunction']
      }
    },
    {
      id: 'vascular-function',
      name: 'Vascular Health',
      icon: '💗',
      description: 'eNOS nitric oxide production, endothelial function',
      status: 'good',
      efficiency: 82,
      factors: {
        enhancers: ['L-arginine ✓', 'BH4 cofactor', 'Vitamin C recycling'],
        inhibitors: ['Oxidative stress', 'High homocysteine']
      }
    },
    {
      id: 'lipid-transport',
      name: 'Lipid Transport',
      icon: '🧪',
      description: 'Chylomicrons, VLDL, LDL, HDL lipoprotein particles',
      status: 'good',
      efficiency: 78,
      factors: {
        enhancers: ['ApoB synthesis', 'LPL activity', 'Omega-3 balance'],
        inhibitors: ['High triglycerides', 'Poor HDL function']
      }
    },
    {
      id: 'antioxidant-network',
      name: 'Antioxidant Defense',
      icon: '🛡️',
      description: 'Vitamin C/E recycling, selenium glutathione peroxidase',
      status: 'optimal',
      efficiency: 91,
      factors: {
        enhancers: ['Vitamin synergy ✓', 'GSH-Px active', 'Polyphenols'],
        inhibitors: ['Smoking', 'High oxidative load']
      }
    },
    {
      id: 'mineral-transport',
      name: 'Mineral Delivery',
      icon: '⚡',
      description: 'Ceruloplasmin copper, selenoprotein P, zinc-albumin binding',
      status: 'good',
      efficiency: 84,
      factors: {
        enhancers: ['Albumin levels OK', 'pH balance', 'Protein binding'],
        inhibitors: ['Competition', 'Low albumin']
      }
    }
  ],
  cellular: [
    {
      id: 'mitochondria',
      name: 'Energy Production',
      icon: '⚡',
      description: 'Electron transport chain complexes I-IV, ATP synthase',
      status: 'optimal',
      efficiency: 89,
      factors: {
        enhancers: ['CoQ10 adequate', 'B-vitamins ✓', 'Magnesium for ATP'],
        inhibitors: ['Oxidative damage', 'Nutrient deficiency']
      }
    },
    {
      id: 'protein-machinery',
      name: 'Protein Synthesis',
      icon: '🏭',
      description: 'Ribosome function, mTOR signaling, amino acid sensing',
      status: 'good',
      efficiency: 81,
      factors: {
        enhancers: ['Leucine signaling', 'Zinc for RNA pol', 'B₆ metabolism'],
        inhibitors: ['Energy deficit', 'Incomplete amino acids']
      }
    },
    {
      id: 'dna-repair',
      name: 'DNA Maintenance',
      icon: '🧬',
      description: 'Base excision repair, nucleotide synthesis, methylation',
      status: 'good',
      efficiency: 86,
      factors: {
        enhancers: ['Folate/B₁₂ ✓', 'Zinc fingers', 'NAD+ for PARP'],
        inhibitors: ['Oxidative stress', 'Methyl donor deficit']
      }
    },
    {
      id: 'antioxidant-systems',
      name: 'Cellular Defense',
      icon: '🛡️',
      description: 'SOD, catalase, glutathione peroxidase, Nrf2 pathway',
      status: 'optimal',
      efficiency: 92,
      factors: {
        enhancers: ['Mn/Cu/Zn-SOD', 'Selenium GPx', 'Sulforaphane Nrf2'],
        inhibitors: ['ROS overload', 'Heavy metals']
      }
    },
    {
      id: 'calcium-signaling',
      name: 'Calcium Signaling',
      icon: '📡',
      description: 'ER calcium stores, calmodulin activation, muscle contraction',
      status: 'good',
      efficiency: 83,
      factors: {
        enhancers: ['Vitamin D status', 'Magnesium balance', 'IP3 signaling'],
        inhibitors: ['ER stress', 'Calcium overload']
      }
    },
    {
      id: 'membrane-function',
      name: 'Membrane Health',
      icon: '🧱',
      description: 'Phospholipid synthesis, omega-3 incorporation, fluidity',
      status: 'good',
      efficiency: 87,
      factors: {
        enhancers: ['DHA/EPA ratio', 'Choline for PC', 'Vitamin E protection'],
        inhibitors: ['Trans fats', 'Lipid peroxidation']
      }
    }
  ]
};

const detailedData = {
  // Intestinal System Receptors
  iron: {
    title: "Iron Absorption Complex",
    subtitle: "DMT1 Transporter with Dcytb Reduction",
    mechanism: "Iron enters through DMT1 (Divalent Metal Transporter 1) when in ferrous (Fe²⁺) form. Dcytb (Duodenal cytochrome B) reduces dietary Fe³⁺ to absorbable Fe²⁺. Hephaestin oxidizes iron for ferroportin export.",
    enhancers: [
      { name: "Vitamin C", description: "Maintains Fe²⁺ state, enhances Dcytb activity (3-5x increase)" },
      { name: "Citric Acid", description: "Chelation and pH optimization for absorption" },
      { name: "Heme Iron", description: "Direct uptake via HCP1 transporter, bypasses competition" }
    ],
    inhibitors: [
      { name: "Calcium", description: "Competes for DMT1 binding site" },
      { name: "Zinc/Copper", description: "Shared DMT1 transporter competition" },
      { name: "Phytates/Tannins", description: "Form insoluble complexes with iron" }
    ],
    strategy: "Take iron on empty stomach or 2 hours after meals. Separate from calcium/zinc by 2+ hours. Combine with vitamin C source.",
    status: "Your vitamin C intake has optimized iron absorption. Maintain current supplement timing."
  },
  calcium: {
    title: "Calcium Channel Complex",
    subtitle: "TRPV6 with Vitamin D Regulation",
    mechanism: "TRPV6 channels mediate calcium entry, regulated by calcitriol (active vitamin D). Calbindin-D9k shuttles calcium intracellularly to PMCA1b for export.",
    enhancers: [
      { name: "Vitamin D₃", description: "Upregulates TRPV6 expression and calbindin synthesis" },
      { name: "Vitamin K₂", description: "Directs calcium to bones, prevents vascular deposits" },
      { name: "Magnesium", description: "Required cofactor for vitamin D activation" }
    ],
    inhibitors: [
      { name: "Phytates", description: "Bind calcium, form insoluble complexes" },
      { name: "High Fiber", description: "Physical binding reduces bioavailability" },
      { name: "Magnesium Excess", description: "Competes for TRPV6 channel" }
    ],
    strategy: "Take calcium in divided doses (500mg or less) with meals. Ensure adequate vitamin D and K₂.",
    status: "TRPV6 channels functioning well. Vitamin D status supporting optimal absorption."
  },
  // Hepatic System Receptors
  'phase-1': {
    title: "Phase I Metabolism",
    subtitle: "Cytochrome P450 Enzyme System",
    mechanism: "CYP450 enzymes oxidize compounds for phase II processing. CYP3A4 metabolizes ~50% of drugs, CYP2E1 processes alcohol, CYP1A2 handles caffeine.",
    enhancers: [
      { name: "Iron", description: "Essential for cytochrome P450 heme structure" },
      { name: "B-Vitamins", description: "NADPH generation for electron transfer" },
      { name: "Protein", description: "Provides amino acids for enzyme synthesis" }
    ],
    inhibitors: [
      { name: "Grapefruit", description: "Furanocoumarin inhibits CYP3A4" },
      { name: "Alcohol", description: "Induces CYP2E1, depletes glutathione" },
      { name: "Heavy Metals", description: "Disrupt enzyme structure and function" }
    ],
    strategy: "Support with adequate protein and B-vitamins. Avoid grapefruit with medications.",
    status: "CYP450 system functioning optimally with good nutrient support."
  },
  // Circulatory System Receptors
  'iron-transport': {
    title: "Iron Transport Network",
    subtitle: "Transferrin-Mediated Delivery",
    mechanism: "Transferrin binds 2 Fe³⁺ ions for transport. TfR1 receptors mediate cellular uptake via endocytosis. Hepcidin regulates system-wide iron homeostasis.",
    enhancers: [
      { name: "Copper", description: "Required for ceruloplasmin ferroxidase activity" },
      { name: "Vitamin A", description: "Mobilizes iron from storage" },
      { name: "Balanced pH", description: "Optimal transferrin binding" }
    ],
    inhibitors: [
      { name: "Inflammation", description: "Increases hepcidin, blocks iron release" },
      { name: "Iron Overload", description: "Saturates transferrin capacity" },
      { name: "Copper Deficiency", description: "Impairs iron oxidation" }
    ],
    strategy: "Maintain anti-inflammatory diet. Ensure adequate copper intake.",
    status: "Transferrin saturation optimal. Hepcidin levels balanced."
  },
  // Cellular System Receptors
  mitochondria: {
    title: "Mitochondrial Energy Production",
    subtitle: "Electron Transport Chain",
    mechanism: "Complexes I-IV transfer electrons to generate ATP. Complex I uses FMN/Fe-S, Complex III uses cytochrome b/c1, Complex IV uses copper/heme centers.",
    enhancers: [
      { name: "CoQ10", description: "Electron shuttle between complexes I/II and III" },
      { name: "B-Complex", description: "B₁ for PDH, B₂ for FAD, B₃ for NAD⁺" },
      { name: "Magnesium", description: "Required for ATP synthase function" }
    ],
    inhibitors: [
      { name: "Oxidative Stress", description: "Damages complex proteins and membranes" },
      { name: "Nutrient Deficiency", description: "Limits cofactor availability" },
      { name: "Heavy Metals", description: "Disrupt electron transport" }
    ],
    strategy: "Support with CoQ10, B-complex, and antioxidants. Consider timing with exercise.",
    status: "Energy production efficient. Cofactor levels supporting ATP synthesis."
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
                {key === 'hepatic' && '🏭'} 
                {key === 'circulatory' && '🚛'} 
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
              {(systemClusterData[activeSystem] || []).map(cluster => (
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
                {detailedData[selectedCluster.id] ? (
                  <>
                    <div style={{marginBottom: '1.5rem'}}>
                      <h3 style={styles.sectionTitle}>🔬 Molecular Mechanism</h3>
                      <p style={{fontSize: '0.8125rem', lineHeight: 1.5, color: '#1e293b', margin: 0}}>
                        {detailedData[selectedCluster.id].mechanism}
                      </p>
                    </div>
                    
                    <div style={{marginBottom: '1.5rem'}}>
                      <h3 style={styles.sectionTitle}>✅ Enhancement Factors</h3>
                      <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                        {detailedData[selectedCluster.id].enhancers.map((enhancer, idx) => (
                          <li key={idx} style={{padding: '0.5rem 0', borderBottom: '1px solid #f8fafc'}}>
                            <strong style={{fontSize: '0.8125rem', color: '#1e293b'}}>{enhancer.name}</strong>
                            <p style={{fontSize: '0.75rem', color: '#64748b', margin: '0.25rem 0 0 0'}}>{enhancer.description}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div style={{marginBottom: '1.5rem'}}>
                      <h3 style={styles.sectionTitle}>❌ Inhibiting Factors</h3>
                      <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                        {detailedData[selectedCluster.id].inhibitors.map((inhibitor, idx) => (
                          <li key={idx} style={{padding: '0.5rem 0', borderBottom: '1px solid #f8fafc'}}>
                            <strong style={{fontSize: '0.8125rem', color: '#1e293b'}}>{inhibitor.name}</strong>
                            <p style={{fontSize: '0.75rem', color: '#64748b', margin: '0.25rem 0 0 0'}}>{inhibitor.description}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div style={{marginBottom: '1.5rem'}}>
                      <h3 style={styles.sectionTitle}>💡 Optimization Strategy</h3>
                      <p style={{fontSize: '0.8125rem', lineHeight: 1.5, color: '#1e293b', margin: 0}}>
                        {detailedData[selectedCluster.id].strategy}
                      </p>
                    </div>
                    
                    <div>
                      <h3 style={styles.sectionTitle}>📊 Current Status</h3>
                      <p style={{fontSize: '0.8125rem', lineHeight: 1.5, color: '#1e293b', margin: 0}}>
                        <strong>{selectedCluster.status.charAt(0).toUpperCase() + selectedCluster.status.slice(1)} ({selectedCluster.efficiency}% efficiency)</strong><br/>
                        {detailedData[selectedCluster.id].status}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}
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
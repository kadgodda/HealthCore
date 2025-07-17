# HealthCore - Body Systems Nutrition Intelligence

## Project Overview

HealthCore is an innovative nutrition tracking platform that transforms healthy eating into a molecular-level optimization game. Users receive real-time feedback on their body's nutritional status through a sophisticated receptor mapping system that visualizes nutrient absorption, transport, and utilization.

## Architecture

### 4-System Approach

Our platform models nutrition through four key physiological systems:

1. **🔬 Intestinal Absorption** - Nutrient uptake optimization at the molecular level
2. **🏭 Hepatic Processing** - Metabolic processing and detoxification systems  
3. **🚛 Circulatory Transport** - Nutrient delivery and distribution networks
4. **⚡ Cellular Utilization** - Energy production and protein synthesis

### Key Innovation: Molecular Receptor Mapping

Instead of simple "eat more vitamins" advice, our system models actual molecular interactions:

- **Receptor Competition**: Iron vs Calcium for DMT1 transporters
- **Synergistic Enhancement**: Vitamin C increases iron absorption 3-5x
- **Timing Dependencies**: 2+ hour separation for competing nutrients
- **Real-time Optimization**: Live feedback on absorption efficiency

## Technology Stack

### Frontend
- **React** with TypeScript
- **AnteaCore Design System** for consistent UI components
- **Real-time Updates** for live nutritional status
- **Mobile-first** responsive design

### Backend  
- **FastAPI** Python backend
- **SQLAlchemy** ORM with async support
- **Domain-driven Design** with clear bounded contexts
- **Event-driven Architecture** for decoupled services

### Data Layer
- **Supabase** for primary database
- **Comprehensive Receptor Mapping** database
- **Real-time Sync** capabilities
- **Offline Support** for mobile usage

## Current Implementation Status

### ✅ Completed
- **UI/UX Design**: Complete Body Systems Nutrition Intelligence interface
- **Receptor Mapping Database**: Comprehensive molecular interaction mapping
- **React Components**: Built with AnteaCore design system integration
- **System Architecture**: 4-system approach validated and documented
- **Scientific Foundation**: Peer-reviewed research backing for all interactions

### 🚧 In Progress  
- **Claude Code Integration**: Moving codebase to Claude Code for development
- **Backend API Development**: FastAPI implementation of receptor calculations
- **Database Schema**: Implementation of receptor interaction models
- **Real-time Updates**: WebSocket integration for live feedback

### 📋 Next Steps
1. **Backend Implementation**: Complete FastAPI receptor calculation engine
2. **Database Integration**: Connect React frontend to Supabase backend
3. **Real-time Features**: Implement live nutritional status updates
4. **User Testing**: Beta testing with target users (health-conscious adults)
5. **Mobile App**: React Native implementation for mobile platforms

## Project Structure

```
HealthCore/
├── frontend/
│   └── src/
│       └── components/
│           └── BodySystemsNutrition.tsx    # Main UI component
├── nutrition-tracker/                       # Legacy implementation
│   ├── app/                                # FastAPI backend
│   ├── data/                              # Body systems data
│   └── templates/                         # HTML templates  
├── data/
│   └── complete_receptor_mapping.md        # Scientific foundation
└── README.md                              # This file
```

## Scientific Foundation

### Receptor Systems Modeled

**Iron Absorption Hub**:
- Primary Transporter: DMT1 (Divalent Metal Transporter 1)
- Enhancers: Vitamin C (3-5x increase), Heme iron
- Inhibitors: Calcium (competition), Tannins (chelation)
- Optimal Timing: Empty stomach, 2+ hours from calcium

**Calcium Channel Complex**:
- Primary Transporter: TRPV6 (Transient Receptor Potential Vanilloid 6)
- Enhancers: Vitamin D3 (channel activation), Magnesium
- Inhibitors: High fiber, Magnesium competition
- Optimal Timing: Smaller doses throughout day

**B-Complex Network**:
- B12 Pathway: Intrinsic Factor → Cubilin receptor → Transcobalamin
- Folate System: RFC1 and PCFT transporters
- Inhibitors: Alcohol (B12), Methotrexate (folate)

### Interaction Matrix

| Nutrient 1 | Nutrient 2 | Interaction | Mechanism | Timing |
|------------|-------------|-------------|-----------|---------|
| Iron | Vitamin C | Synergy (+350%) | Fe³⁺ → Fe²⁺ reduction | Simultaneous |
| Iron | Calcium | Competition (-60%) | DMT1 transporter | Separate 2+ hours |
| Calcium | Vitamin D | Synergy (+200%) | TRPV6 upregulation | Simultaneous |
| Calcium | Magnesium | Competition (-40%) | TRPV6 channel | Separate timing |
| B12 | Folate | Synergy | Methylation cycle | Simultaneous |
| Fat Vitamins | Dietary Fat | Synergy (+400%) | Micelle formation | With fat-rich meals |

## User Experience Philosophy

### Adult-Focused Learning
- **Professional Interface**: Clean, sophisticated design without childish elements
- **Scientific Credibility**: Real biochemical terminology with accessible explanations
- **Respect for Intelligence**: Educational without being condescending
- **Dr. Frizzle Aged Up**: Expert nutritionist providing professional insights

### Tamagotchi-Style Engagement
- **Body as Digital Pet**: Users check app to see how their body is "doing"
- **Real-time Status**: Live feedback on nutritional systems
- **Gentle Guidance**: Suggestions without judgment
- **Daily Optimization Score**: Gamified progress tracking

### Key Features

1. **Real-time Receptor Monitoring**: Live visualization of nutrient absorption efficiency
2. **Molecular Interaction Alerts**: Warnings about competing nutrients
3. **Timing Optimization**: Smart recommendations for meal spacing
4. **System Status Dashboard**: Health of all 4 body systems at a glance
5. **Dr. Frizzle Commentary**: Expert insights with encouraging tone

## Target Users

### Primary Audience
- **Health-conscious adults** who want to optimize nutrition beyond basic guidelines
- **Biohackers** interested in molecular-level optimization
- **People with absorption issues** needing precise nutrient timing
- **Supplement users** wanting to maximize bioavailability

### User Scenarios
1. **Morning Routine**: Check overnight recovery and plan breakfast timing
2. **Supplement Timing**: Optimize spacing between competing nutrients
3. **Meal Planning**: Ensure adequate receptor coverage throughout day
4. **Troubleshooting**: Identify why certain nutrients aren't being absorbed
5. **Education**: Learn about molecular nutrition through visual feedback

## Technical Implementation

### React Component Architecture
```typescript
interface ReceptorCluster {
  id: string;
  name: string;
  transporter: string;
  efficiency: number;
  enhancers: string[];
  inhibitors: string[];
  status: 'optimal' | 'good' | 'attention' | 'concern';
}

interface SystemData {
  intestinal: ReceptorCluster[];
  hepatic: ReceptorCluster[];
  circulatory: ReceptorCluster[];
  cellular: ReceptorCluster[];
}
```

### Data Flow
1. **Food Input**: User logs meals with timing
2. **Receptor Calculation**: Backend calculates absorption efficiency
3. **Real-time Updates**: WebSocket pushes status updates
4. **Visual Feedback**: UI updates receptor cluster status
5. **Optimization Suggestions**: AI-powered recommendations

## Development Roadmap

### Phase 1: Foundation (Current)
- ✅ UI/UX Design and React components
- ✅ Scientific receptor mapping database
- ✅ AnteaCore design system integration
- 🚧 Claude Code setup for development

### Phase 2: Backend Development
- FastAPI receptor calculation engine
- Supabase database schema implementation
- Real-time WebSocket connections
- User authentication and profiles

### Phase 3: Advanced Features
- AI-powered meal optimization
- Barcode scanning for food input
- Integration with fitness trackers
- Personalized absorption profiles

### Phase 4: Mobile & Scaling
- React Native mobile app
- Offline functionality
- Advanced analytics dashboard
- Healthcare provider integrations

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- Supabase account
- AnteaCore design system access

### Development Setup
```bash
# Clone repository
git clone [repository-url]
cd HealthCore

# Frontend setup
cd frontend
npm install
npm start

# Backend setup
cd ../nutrition-tracker
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Environment Variables
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
DATABASE_URL=your_database_url
```

## Contributing

### Code Standards
- TypeScript for all frontend code
- Python type hints for backend
- AnteaCore design system components
- Comprehensive unit tests
- Scientific accuracy validation

### Pull Request Process
1. Create feature branch from main
2. Implement changes with tests
3. Update documentation
4. Request scientific review for nutrition-related changes
5. Ensure AnteaCore design system compliance

## Scientific Validation

All nutrient interactions are backed by peer-reviewed research. Key sources include:

- **Iron Absorption**: Hunt & Roughead (2000), Journal of Nutrition
- **Calcium Transport**: Bronner (2009), Comprehensive Physiology  
- **B-Vitamin Metabolism**: Bailey et al. (2015), Advances in Nutrition
- **Fat-Soluble Vitamins**: Reboul (2013), Progress in Lipid Research

## License

This project is proprietary software developed for HealthCore platform.

## Contact

For questions about the molecular receptor mapping or implementation details, please reach out to the development team.

---

**Note**: This is a cutting-edge nutrition platform that combines real biochemistry with modern UX design to create the first molecular-level nutrition optimization tool for consumers.
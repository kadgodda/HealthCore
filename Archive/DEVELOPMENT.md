# HealthCore Development Guide

## Quick Start for Claude Code

This document provides everything needed to begin development on the HealthCore Body Systems Nutrition Intelligence platform using Claude Code.

## Project Summary

HealthCore transforms nutrition tracking from basic calorie counting to molecular-level optimization. Users receive real-time feedback on nutrient absorption efficiency through a sophisticated receptor mapping system that visualizes how nutrients compete, synergize, and get processed through four key body systems.

## Current Status

### ✅ Completed (Ready for Claude Code)
- **UI/UX Design**: Complete React component with AnteaCore design system
- **Scientific Foundation**: Comprehensive receptor mapping database  
- **System Architecture**: 4-system approach validated
- **Frontend Structure**: React/TypeScript setup with proper folder structure
- **Knowledge Base**: Detailed receptor interaction mappings

### 🎯 Immediate Development Priorities
1. **Backend API Development**: FastAPI receptor calculation engine
2. **Database Schema**: Supabase receptor interaction models
3. **Real-time Updates**: WebSocket integration for live feedback
4. **Data Integration**: Connect frontend to backend services

## Key Files to Focus On

### Primary Frontend Component
- `frontend/src/components/BodySystemsNutrition.tsx` - Main UI component
- Implementation complete with mock data
- Uses AnteaCore design patterns
- 4-system tabs: Intestinal → Hepatic → Circulatory → Cellular

### Scientific Foundation  
- `data/complete_receptor_mapping.md` - Comprehensive molecular interaction database
- All receptor systems mapped with transporters, enhancers, inhibitors
- Interaction matrix with timing dependencies
- Peer-reviewed research backing

### Legacy Backend (Reference)
- `nutrition-tracker/app/` - Existing FastAPI structure
- `nutrition-tracker/app/data/body_systems.py` - Body systems data
- `nutrition-tracker/app/models.py` - Database models

## Architecture Overview

### 4-System Approach (Validated)
```
🔬 Intestinal Absorption → 🏭 Hepatic Processing → 🚛 Circulatory Transport → ⚡ Cellular Utilization
```

### Key Receptor Systems
1. **Iron Absorption Hub**: DMT1 transporter, Vitamin C synergy, Calcium competition
2. **Calcium Channels**: TRPV6 channels, Vitamin D activation, Magnesium competition  
3. **B-Complex Network**: B12-Intrinsic Factor, RFC1 folate transport
4. **Fat-Soluble Pathway**: Bile-dependent A,D,E,K absorption
5. **Antioxidant Systems**: Coordinated C,E,selenium networks
6. **Trace Minerals**: ZIP4 zinc transport, metallothionein storage

### Critical Interactions Modeled
- **Competition**: Iron vs Calcium (2+ hour separation required)
- **Synergy**: Iron + Vitamin C (3-5x absorption boost)
- **Timing**: Fat-soluble vitamins with dietary fat
- **Regulation**: Hepcidin control of iron homeostasis

## Development Tasks

### Phase 1: Backend Foundation
```python
# FastAPI Receptor Calculation Engine
@app.post("/api/calculate-receptor-efficiency")
async def calculate_efficiency(meal_data: MealInput):
    """Calculate real-time receptor absorption efficiency"""
    efficiency = ReceptorCalculator.process(meal_data)
    return {"clusters": efficiency, "optimization_score": score}

# Real-time WebSocket Updates  
@app.websocket("/ws/nutrition-status")
async def nutrition_websocket(websocket: WebSocket):
    """Live updates for receptor status changes"""
    await websocket.accept()
    while True:
        status = await get_current_status()
        await websocket.send_json(status)
```

### Phase 2: Database Schema
```sql
-- Receptor Systems Table
CREATE TABLE receptor_systems (
    id UUID PRIMARY KEY,
    system_name VARCHAR NOT NULL,
    transporter VARCHAR NOT NULL,
    substrates JSONB NOT NULL,
    enhancers JSONB NOT NULL,
    inhibitors JSONB NOT NULL,
    timing_factors JSONB NOT NULL
);

-- User Meal Logs
CREATE TABLE meal_logs (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    logged_at TIMESTAMP NOT NULL,
    foods JSONB NOT NULL,
    calculated_efficiency JSONB NOT NULL
);

-- Real-time Status
CREATE TABLE current_status (
    user_id UUID PRIMARY KEY,
    receptor_efficiencies JSONB NOT NULL,
    last_updated TIMESTAMP NOT NULL
);
```

### Phase 3: Real-time Integration  
```typescript
// Frontend WebSocket Hook
const useReceptorStatus = () => {
  const [status, setStatus] = useState<ReceptorStatus>();
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/nutrition-status');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStatus(data);
    };
    return () => ws.close();
  }, []);
  
  return status;
};
```

## Scientific Accuracy Requirements

### Molecular Precision
- All receptor names must use correct scientific nomenclature (DMT1, TRPV6, etc.)
- Interaction mechanisms based on peer-reviewed research
- Quantitative effects (3-5x, 2+ hours) from published studies
- No oversimplification that loses scientific accuracy

### User Experience Balance
- Complex science made accessible through visual feedback
- Dr. Frizzle commentary bridges scientific and practical
- Real receptor names in detailed panels, friendly names in UI
- Educational without being condescending

## Current UI Implementation

The React component is fully functional with:
- **System Tabs**: Switch between 4 body systems
- **Receptor Clusters**: Visual status of 6 major receptor systems  
- **Real-time Scores**: Efficiency percentages and daily optimization score
- **Detailed Panels**: Click clusters for scientific details
- **Expert Commentary**: Dr. Frizzle provides contextual insights
- **AnteaCore Styling**: Consistent with design system

## Next Steps for Claude Code

1. **Examine Current Frontend**: Review `BodySystemsNutrition.tsx` implementation
2. **Backend Development**: Build FastAPI receptor calculation engine  
3. **Database Integration**: Implement Supabase schema for receptor data
4. **Real-time Features**: Add WebSocket support for live updates
5. **Data Connection**: Connect frontend to real backend services

## Development Environment

```bash
# Frontend (already set up)
cd frontend
npm install
npm run dev

# Backend (to be implemented)  
cd nutrition-tracker
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Database
# Supabase project with receptor mapping schema
```

## Testing Strategy

### Unit Tests
- Receptor calculation accuracy
- Interaction timing logic  
- UI component behavior
- WebSocket connection handling

### Integration Tests
- End-to-end meal logging → receptor calculation → UI update
- Real-time status synchronization
- Database consistency

### User Testing  
- Nutrition accuracy validation with experts
- UX testing with target audience (health-conscious adults)
- Performance testing with real-time updates

## Success Metrics

### Technical
- < 100ms response time for receptor calculations
- 99.9% uptime for real-time status updates
- Accurate molecular interaction modeling

### User Experience  
- Daily engagement with optimization score
- Understanding of nutrient timing concepts
- Improved bioavailability through app recommendations

This foundation provides everything needed to begin serious development with Claude Code. The scientific mapping is complete, the UI is implemented, and the architecture is validated.
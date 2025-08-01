# Priority Modules Discussion Tracker

## Executive Summary
This tracker organizes all modules for the Body Systems Nutrition Tracker according to the modular discussion workflow. Priority modules are essential for the core functionality and behavioral reinforcement patterns. Non-priority modules support the system but can be developed after core functionality is proven.

---

## 🎯 PRIORITY MODULES (Core System)

### **Module 1: Body System Module** 
*Foundation Module - Research-Backed*
- **File**: `1.Body_System.md`
- **Status**: ✅ **FINALIZED**
- **Purpose**: Scientific body system categorization and weekly rotation logic
- **Key Requirements**: Research validation, synergistic system pairings
- **Dependencies**: None (foundational)
- **Discussion Priority**: #1 - Must validate scientific foundation first

### **Module 2: Food Tracking Module**
*Core User Interaction - Science Alignment*
- **File**: `2.Food_Tracking.md` 
- **Status**: ✅ **FINALIZED**
- **Purpose**: Track food intake aligned with body systems
- **Key Requirements**: Science-backed categorization, intuitive tracking
- **Dependencies**: Body System Module (1)
- **Discussion Priority**: #2 - Primary user-facing feature

### **Module 3: Daily Record Module**
*Aggregate Root - Data Consistency*
- **File**: `3.Daily_Record.md`
- **Status**: ⏳ **NEXT FOR DESIGN**
- **Purpose**: Aggregate root managing all daily tracking data
- **Key Requirements**: Date isolation, edit permissions, data integrity
- **Dependencies**: Body System (1), Food Tracking (2), Requirements Calculator (5)
- **Discussion Priority**: #3 - Central coordination point - **READY TO START**

### **Module 4: Date Context Module**
*Security - Edit Permissions*
- **File**: `4.Date_Context.md`
- **Status**: ⏳ **NEXT FOR DESIGN**
- **Purpose**: Enforce "today-only" editing with immutable date context
- **Key Requirements**: Permission validation, date isolation
- **Dependencies**: None
- **Discussion Priority**: #4 - Critical for data integrity - **READY TO START**

### **Module 5: Requirements Calculator Module**
*Personalization Engine*
- **File**: `5.Requirements_Calculator.md`
- **Status**: ✅ **FINALIZED** 
- **Purpose**: Pure calculation service for personalized daily requirements
- **Key Decisions**: 
  - Pure calculation service (stateless)
  - Seasonal adjustments only (no cannabis, no weekly rotation)
  - Sophisticated backend (8-12 nutrients), simple frontend (3-4 groups)
  - Research-based personalization factors
- **Dependencies**: Body System (1)
- **Discussion Priority**: #5 - Personalization core - **COMPLETED**

### **Module 6: Progress Module**
*Behavioral Reinforcement*
- **File**: `6.Progress_Module.md`
- **Status**: ✅ **FINALIZED**
- **Purpose**: Track completion, provide feedback, maintain streaks
- **Key Requirements**: ADHD-friendly, immediate feedback, visual progress
- **Dependencies**: Daily Record (3), Requirements Calculator (5)
- **Discussion Priority**: #6 - Behavioral change driver

### **Module 7: Nutrient Vector Module**
*Food Science Backend + Dynamic Complexity*
- **File**: `7.Nutrient_Vector_Module.md`
- **Status**: ✅ **FINALIZED**
- **Purpose**: Map foods to body system benefits + handle all dynamic factors
- **Enhanced Responsibilities**:
  - Cannabis impact on absorption/conversion efficiency
  - Weekly rotation coordination through vector optimization
  - Temporal meta-coordination for timing and synergies
  - Comprehensive acquisition calculations
- **Dependencies**: Body System (1), Food Tracking (2), Requirements Calculator (5)
- **Discussion Priority**: #7 - Scientific accuracy foundation + complexity handler

---

## 🔧 NON-PRIORITY MODULES (Supporting System)

### **Module 8: Water Tracking Module**
*Hydration Support*
- **File**: `8.Water_Tracking.md`
- **Status**: To Create
- **Purpose**: Track water intake with cannabis adjustments
- **Dependencies**: Requirements Calculator (5), Nutrient Vector (7)

### **Module 9: Cannabis Integration Module**
*Lifestyle Factor*
- **File**: `9.Cannabis_Integration.md`
- **Status**: ✅ **LOGIC MOVED TO MODULE 7**
- **Purpose**: Cannabis impact now handled by Nutrient Vector Module
- **Dependencies**: Nutrient Vector (7)

### **Module 10: Event Bus Module**
*Decoupling Infrastructure*
- **File**: `10.Event_Bus.md`
- **Status**: To Create
- **Purpose**: Enable loose coupling between services
- **Dependencies**: None

### **Module 11: Repository Module**
*Data Access Layer*
- **File**: `11.Repository.md`
- **Status**: To Create
- **Purpose**: Abstract data persistence with read/write segregation
- **Dependencies**: Daily Record (3)

### **Module 12: Database Operations Module**
*Persistence Layer*
- **File**: `12.Database_Operations.md`
- **Status**: To Create
- **Purpose**: SQLAlchemy implementation and connection management
- **Dependencies**: Repository (11)

### **Module 13: API Endpoints Module**
*External Interface*
- **File**: `13.API_Endpoints.md`
- **Status**: To Create
- **Purpose**: FastAPI routers for frontend communication
- **Dependencies**: All service modules

### **Module 14: View Model Module**
*Presentation Layer*
- **File**: `14.View_Model.md`
- **Status**: To Create
- **Purpose**: Transform data for optimal UI presentation
- **Dependencies**: API Endpoints (13)

### **Module 15: Feedback Service Module**
*User Experience*
- **File**: `15.Feedback_Service.md`
- **Status**: To Create
- **Purpose**: Collect and manage user feedback (energy, mood, etc.)
- **Dependencies**: Daily Record (3)

### **Module 16: Calendar Service Module**
*Historical Views*
- **File**: `16.Calendar_Service.md`
- **Status**: To Create
- **Purpose**: Read-only historical data presentation
- **Dependencies**: Repository (11)

### **Module 17: Shopping List Module**
*Convenience Feature*
- **File**: `17.Shopping_List.md`
- **Status**: To Create
- **Purpose**: Generate weekly shopping lists from nutrition plans
- **Dependencies**: Requirements Calculator (5), Nutrient Vector (7)

### **Module 18: Validation Module**
*Input Safety*
- **File**: `18.Validation.md`
- **Status**: To Create
- **Purpose**: Validate user inputs and business rules
- **Dependencies**: Various

### **Module 19: Configuration Module**
*System Settings*
- **File**: `19.Configuration.md`
- **Status**: To Create
- **Purpose**: Manage application configuration and settings
- **Dependencies**: None

### **Module 20: Cache Module**
*Performance Optimization*
- **File**: `20.Cache.md`
- **Status**: To Create
- **Purpose**: Cache frequently accessed data
- **Dependencies**: Repository (11)

### **Module 21: Error Handling Module**
*Reliability*
- **File**: `21.Error_Handling.md`
- **Status**: To Create
- **Purpose**: Centralized error handling and logging
- **Dependencies**: Various

### **Module 22: Authentication Module**
*Security*
- **File**: `22.Authentication.md`
- **Status**: To Create
- **Purpose**: User authentication and session management
- **Dependencies**: None

### **Module 23: Middleware Module**
*Request Processing*
- **File**: `23.Middleware.md`
- **Status**: To Create
- **Purpose**: Request/response processing pipeline
- **Dependencies**: Various

### **Module 24: Migration Module**
*Data Evolution*
- **File**: `24.Migration.md`
- **Status**: To Create
- **Purpose**: Database schema migration management
- **Dependencies**: Database Operations (12)

### **Module 25: Testing Module**
*Quality Assurance*
- **File**: `25.Testing.md`
- **Status**: To Create
- **Purpose**: Unit, integration, and e2e testing framework
- **Dependencies**: All modules

### **Module 26: Monitoring Module**
*Observability*
- **File**: `26.Monitoring.md`
- **Status**: To Create
- **Purpose**: Application monitoring and metrics
- **Dependencies**: Various

### **Module 27: Deployment Module**
*Operations*
- **File**: `27.Deployment.md`
- **Status**: To Create
- **Purpose**: Railway deployment and environment management
- **Dependencies**: Configuration (19)

### **Module 28: External API Module**
*Third-party Integration*
- **File**: `28.External_API.md`
- **Status**: To Create
- **Purpose**: Integrate with nutrition databases and food APIs
- **Dependencies**: Food Tracking (2)

### **Module 29: Notification Module**
*User Engagement*
- **File**: `29.Notification.md`
- **Status**: To Create
- **Purpose**: Remind users about daily targets and achievements
- **Dependencies**: Progress (6)

### **Module 30: Interaction Module**
*User Interface Logic*
- **File**: `30.Interaction_Module.md`
- **Status**: ✅ **FINALIZED**
- **Purpose**: Handle complex user interactions and state management
- **Dependencies**: View Model (14)

---

## 📋 DISCUSSION WORKFLOW STATUS

### Phase 1: Priority Modules (Essential for MVP)
- [x] **Module 1**: Body System - Scientific foundation documented ✅
- [x] **Module 2**: Food Tracking - Core interaction documented ✅
- [x] **Module 6**: Progress - Behavioral reinforcement documented ✅
- [x] **Module 5**: Requirements Calculator - **FINALIZED** ✅
- [x] **Module 7**: Nutrient Vector - **FINALIZED** ✅
- [ ] **Module 3**: Daily Record - **READY TO START** - Aggregate root design
- [ ] **Module 4**: Date Context - **READY TO START** - Security model design

### Phase 2: Supporting Infrastructure
- [ ] Modules 8-30: All supporting modules await priority completion

### Phase 3: Advanced Features
- [ ] External integrations, monitoring, advanced UI features

---

## 🎯 CURRENT STATUS: 5 OF 7 PRIORITY MODULES FINALIZED

### ✅ **COMPLETED MODULES (READY FOR IMPLEMENTATION)**
1. **Module 1: Body System** - Scientific foundation
2. **Module 2: Food Tracking** - Core user interaction  
3. **Module 5: Requirements Calculator** - Pure calculation service
4. **Module 6: Progress** - Behavioral reinforcement
5. **Module 7: Nutrient Vector** - Dynamic complexity handler
6. **Module 30: Interaction** - UI logic

### 🚀 **NEXT IMMEDIATE ACTIONS**

1. **Design Module 3: Daily Record** - Aggregate root pattern
   - Uses finalized Requirements Calculator interface
   - Manages all daily tracking data
   - Enforces data integrity and business rules

2. **Design Module 4: Date Context** - Security and permissions
   - Enforces "today-only" editing rules
   - Provides immutable date context
   - Integrates with Daily Record for permissions

### 💡 **KEY ARCHITECTURAL ACHIEVEMENTS**

**Clean Separation of Concerns:**
- **Module 5**: Static, predictable requirements calculation
- **Module 7**: Dynamic complexity (cannabis, coordination, timing)
- **Module 3**: Data coordination and integrity
- **Module 4**: Security and permission enforcement

**Cannabis Integration Strategy:**
- ✅ Cannabis affects nutrient vectors (absorption efficiency), not requirements
- ✅ Vector-based approach keeps Requirements Calculator pure
- ✅ All cannabis logic consolidated in Nutrient Vector Module

**Weekly Rotation Strategy:**
- ✅ Handled through vector coordination and timing optimization
- ✅ No requirement changes, only acquisition optimization
- ✅ Temporal meta-coordination for synergies and timing

---

## 🎯 SUCCESS METRICS

### Technical Milestones
- [x] 5 of 7 priority modules finalized (71% complete)
- [ ] All 7 priority modules documented (target: next 1 week)
- [ ] MVP implementation started (target: next 2 weeks)

### Architecture Quality
- [x] Clean separation between static requirements and dynamic vectors
- [x] Cannabis logic properly isolated in vector system
- [x] Weekly coordination through optimization, not requirement changes
- [x] Pure calculation service for predictable requirements

### Ready for Implementation
- [x] Core business logic fully specified
- [x] Module interfaces clearly defined
- [x] Integration points documented
- [x] Data structures specified

**RECOMMENDATION**: Complete Modules 3 and 4 to achieve full priority module coverage, then begin implementation of the core 7 modules.
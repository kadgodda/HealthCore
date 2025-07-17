# HealthCore Module Priority & Discussion Tracker

## Module Implementation Priority

### Phase 1: Foundation (Must Have First)
These modules form the core data model and must be implemented before others can function.

| Priority | Module | Status | Why First | AnteaCore Integration |
|----------|--------|--------|-----------|----------------------|
| 1 | **Enum Registry** | 🔴 Not Started | Everything depends on standardized enums | Extend AnteaCore's enum-registry-v2.json |
| 2 | **Body System Module** | 🟡 Discussed | Defines daily targets and science foundation | Use AnteaCore knowledge base patterns |
| 3 | **Daily Record Module** | 🟡 Discussed | Aggregate root for all daily data | Leverage AnteaCore's event system |

### Phase 2: Core Functionality
These enable basic tracking and feedback.

| Priority | Module | Status | Dependencies | AnteaCore Integration |
|----------|--------|--------|--------------|----------------------|
| 4 | **Food Tracking Module** | 🟡 Discussed | Daily Record, Enums | Use AnteaCore validation |
| 5 | **Requirements Calculator** | 🟡 Discussed | Body System, User Profile | Agent-based calculations |
| 6 | **Progress Module** | 🟡 Discussed | Daily Record, Requirements | AnteaCore analytics patterns |

### Phase 3: Intelligence Layer
These add the "smart" features that differentiate HealthCore.

| Priority | Module | Status | Dependencies | AnteaCore Integration |
|----------|--------|--------|--------------|----------------------|
| 7 | **Nutrient Vector Module** | 🟡 Discussed | Food Tracking, Requirements | Complex calculations via agents |
| 8 | **Cannabis Timing Module** | 🔴 Not Started | Daily Record, Food Tracking | State machine with enums |
| 9 | **Shopping Assistant Agent** | 🔴 Not Started | All tracking modules | AnteaCore agent system |

### Phase 4: User Experience
These enhance usability and engagement.

| Priority | Module | Status | Dependencies | AnteaCore Integration |
|----------|--------|--------|--------------|----------------------|
| 10 | **Interaction Module** | 🟡 Discussed | Progress, Daily Record | Component builder |
| 11 | **Notification Agent** | 🔴 Not Started | All modules | Event-driven alerts |
| 12 | **Learning Agent** | 🔴 Not Started | User history | Personalization engine |

## Current Discussion Focus

### 🎯 Next Module to Perfect: **Enum Registry**

**Why This First:**
- Zero-tolerance enum usage is AnteaCore's foundation
- Every other module depends on standardized enums
- Prevents technical debt from accumulating
- One-time setup that benefits everything

**Key Decisions Needed:**
1. Which enums are core vs. feature-specific?
2. How to handle nutrient measurements (units, ranges)?
3. State transitions for food tracking workflow?
4. Cannabis timing states and windows?

### Module Discussion Guidelines

For each module discussion, we need to answer:

1. **Core Purpose**: What problem does this solve for users?
2. **Scientific Backing**: What research supports this approach?
3. **Data Model**: What enums and structures are needed?
4. **User Simplification**: How do we hide complexity?
5. **AnteaCore Integration**: Which existing patterns can we use?
6. **Success Metrics**: How do we measure if it's working?

## Decision Log

### Completed Decisions

| Date | Module | Decision | Rationale |
|------|--------|----------|-----------|
| 2025-01-05 | Daily Record | Two-tier feedback system | Immediate rewards for tracking, detailed analysis later |
| 2025-01-05 | All Modules | Use AnteaCore enum system | Zero-tolerance for string literals ensures stability |
| 2025-01-05 | Architecture | Agent-based intelligence | Complexity handled by agents, not users |

### Pending Decisions

| Module | Question | Options | Deadline |
|--------|----------|---------|----------|
| Enum Registry | Nutrient unit standardization | Metric only vs. dual units | Week 1 |
| Body System | Weekly rotation flexibility | Fixed vs. customizable | Week 1 |
| Food Tracking | Barcode scanning priority | MVP vs. later phase | Week 2 |
| Progress | Gamification elements | Points/levels vs. simple progress | Week 2 |

## Research Gaps to Fill

### High Priority Research
1. **Cannabis-nutrition interaction studies** - Need peer-reviewed sources
2. **ADHD and habit formation** - Behavioral psychology backing
3. **Nutrient timing windows** - Absorption and utilization research
4. **Weekly biological rhythms** - Circadian and infradian cycles

### Module-Specific Research
- **Body System**: Meta-analyses for each system's nutritional needs
- **Requirements Calculator**: Age/gender/activity RDA variations  
- **Nutrient Vector**: Nutrient interaction matrices
- **Shopping Assistant**: Food preference prediction models

## Success Criteria

### Technical Success
- ✅ 100% enum coverage (zero string literals)
- ✅ All modules follow AnteaCore DRY principles
- ✅ Agent architecture handles all complexity
- ✅ <200ms response time for all operations

### User Success  
- ✅ Setup takes <5 minutes
- ✅ Daily interaction <2 minutes
- ✅ 80% understand their daily goal immediately
- ✅ 70% complete weekly tracking consistently

## Next Steps

1. **Create HealthCore Enum Registry** (This Week)
   - Define all core enums
   - Extend AnteaCore's enum-registry-v2.json
   - Generate Python/TypeScript/SQL enums

2. **Finalize Body System Research** (This Week)
   - Compile peer-reviewed sources
   - Create simplified explanations
   - Map nutrients to foods

3. **Design Agent Architecture** (Next Week)
   - Define agent responsibilities
   - Plan task distribution
   - Create agent communication patterns

4. **Begin Daily Record Implementation** (Next Week)
   - Use finalized enums
   - Implement two-tier feedback
   - Create event handlers
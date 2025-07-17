# Body Systems Nutrition Tracker - Architecture Refactoring Plan

## Executive Summary

This document outlines a comprehensive refactoring plan to transform the current monolithic nutrition tracking application into a modular, testable, and maintainable system. The refactoring addresses critical issues including tight coupling, mixed concerns, and the lack of proper domain boundaries.

## Current State Analysis

### Problems Identified

1. **Monolithic Architecture**
   - All business logic concentrated in `main.py` (400+ lines)
   - Endpoints, data access, and business rules intertwined
   - Difficult to understand and modify

2. **Tight Coupling**
   - Cannabis sessions directly modify water requirements
   - Components depend on implementation details of other components
   - Changes cascade unpredictably through the system

3. **Date Isolation Issues**
   - No enforcement of "today-only" editing rule
   - Risk of modifying historical data
   - Cannabis changes for one day could affect another

4. **Testing Challenges**
   - Cannot unit test components in isolation
   - Business logic mixed with HTTP handling
   - No clear service boundaries

5. **Scalability Concerns**
   - Difficult to add new tracking systems
   - Third-party integrations would require significant refactoring
   - No clear extension points

## Proposed Architecture

### High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                         │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Web UI    │  │   REST API   │  │  Mobile (Future) │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  Service Layer                        │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │   │
│  │  │   Food   │ │  Water   │ │ Cannabis │ │Calendar│ │   │
│  │  │ Service  │ │ Service  │ │ Service  │ │Service │ │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   Event Bus                           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                     Domain Layer                              │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐    │
│  │  Entities   │  │ Value Objects │  │  Domain Events  │    │
│  └─────────────┘  └──────────────┘  └─────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                         │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐    │
│  │ Repository  │  │   Database   │  │     Cache       │    │
│  └─────────────┘  └──────────────┘  └─────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
nutrition-tracker/
├── app/
│   ├── core/                       # Core domain logic
│   │   ├── __init__.py
│   │   ├── entities/              # Domain entities
│   │   │   ├── __init__.py
│   │   │   ├── daily_record.py   # Aggregate root for a day's data
│   │   │   ├── food_target.py    # Food tracking entity
│   │   │   ├── water_intake.py   # Water tracking entity
│   │   │   ├── cannabis_session.py # Cannabis tracking entity
│   │   │   └── user_feedback.py  # User feedback entity
│   │   │
│   │   ├── value_objects/         # Immutable domain objects
│   │   │   ├── __init__.py
│   │   │   ├── date_context.py   # Encapsulates date + permissions
│   │   │   ├── body_system.py    # Body system definitions
│   │   │   └── nutrition_requirements.py
│   │   │
│   │   ├── events/                # Domain events
│   │   │   ├── __init__.py
│   │   │   ├── base.py
│   │   │   ├── food_events.py
│   │   │   ├── water_events.py
│   │   │   └── cannabis_events.py
│   │   │
│   │   └── exceptions.py          # Domain-specific exceptions
│   │
│   ├── services/                  # Business logic layer
│   │   ├── __init__.py
│   │   ├── base.py               # Base service class
│   │   ├── food_tracking_service.py
│   │   ├── water_tracking_service.py
│   │   ├── cannabis_tracking_service.py
│   │   ├── requirements_service.py  # Calculates daily requirements
│   │   ├── feedback_service.py     # User feedback (energy, mood, etc.)
│   │   ├── calendar_service.py     # Read-only calendar views
│   │   └── shopping_list_service.py
│   │
│   ├── repositories/              # Data access layer
│   │   ├── __init__.py
│   │   ├── base.py               # Abstract repository
│   │   ├── daily_record_repository.py
│   │   ├── user_settings_repository.py
│   │   └── implementations/
│   │       ├── __init__.py
│   │       └── sqlalchemy/       # SQLAlchemy implementations
│   │
│   ├── api/                      # API layer
│   │   ├── __init__.py
│   │   ├── dependencies.py       # Dependency injection setup
│   │   ├── middleware/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── date_validation.py
│   │   │   └── logging.py
│   │   │
│   │   └── routers/              # API endpoints
│   │       ├── __init__.py
│   │       ├── daily_mission.py  # /api/days/{date}/...
│   │       ├── food.py           # /api/food/...
│   │       ├── water.py          # /api/water/...
│   │       ├── cannabis.py       # /api/cannabis/...
│   │       ├── feedback.py       # /api/feedback/...
│   │       ├── calendar.py       # /api/calendar/...
│   │       └── shopping.py       # /api/shopping/...
│   │
│   ├── web/                      # Web presentation layer
│   │   ├── __init__.py
│   │   ├── view_models/          # View-specific data models
│   │   ├── templates/
│   │   └── static/
│   │
│   └── infrastructure/           # External concerns
│       ├── __init__.py
│       ├── database.py
│       ├── cache.py
│       ├── events.py            # Event bus implementation
│       └── config.py            # Configuration management
│
├── tests/                        # Test suite
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── migrations/                   # Database migrations
├── scripts/                      # Utility scripts
└── docs/                        # Documentation
```

## Core Design Patterns and Principles

### 1. Domain-Driven Design (DDD)

**Bounded Contexts**: Each tracking system (food, water, cannabis) represents a bounded context with clear boundaries.

**Aggregate Root**: `DailyRecord` serves as the aggregate root, ensuring consistency within a day's data.

```python
class DailyRecord:
    """Aggregate root for all daily tracking data"""
    def __init__(self, date: date, body_system: BodySystem):
        self.date = date
        self.body_system = body_system
        self.food_targets = {}
        self.water_intake = WaterIntake()
        self.cannabis_sessions = []
        self.user_feedback = UserFeedback()
        
    def can_edit(self) -> bool:
        """Only today's records can be edited"""
        return self.date == date.today()
```

### 2. Date Context and Permissions

```python
@dataclass(frozen=True)
class DateContext:
    """Immutable value object ensuring date isolation"""
    date: date
    is_today: bool = field(init=False)
    
    def __post_init__(self):
        object.__setattr__(self, 'is_today', self.date == date.today())
    
    @property
    def can_edit(self) -> bool:
        """Only today can be edited"""
        return self.is_today
    
    @property
    def can_view(self) -> bool:
        """Past and present can be viewed"""
        return self.date <= date.today()
```

### 3. Repository Pattern with Read/Write Segregation

```python
class DailyRecordRepository(ABC):
    @abstractmethod
    async def get_for_viewing(self, date: date) -> Optional[DailyRecord]:
        """Get read-only record for any viewable date"""
        pass
    
    @abstractmethod
    async def get_for_editing(self, date: date) -> Optional[DailyRecord]:
        """Get editable record - only works for today"""
        pass
    
    @abstractmethod
    async def save(self, record: DailyRecord) -> None:
        """Save changes - validates date is today"""
        pass

class SqlAlchemyDailyRecordRepository(DailyRecordRepository):
    async def get_for_editing(self, date: date) -> Optional[DailyRecord]:
        if date != date.today():
            raise PermissionError("Can only edit today's records")
        
        record = await self.get_for_viewing(date)
        if record:
            record._allow_modifications = True
        return record
```

### 4. Service Layer Architecture

```python
class FoodTrackingService:
    def __init__(self, 
                 repository: DailyRecordRepository,
                 requirements_service: RequirementsService,
                 event_bus: EventBus):
        self.repository = repository
        self.requirements = requirements_service
        self.events = event_bus
    
    async def update_food_target(self, 
                                date_context: DateContext, 
                                target_id: str, 
                                increment: int) -> FoodTargetResult:
        """Update food target with validation and events"""
        if not date_context.can_edit:
            raise ValueError("Cannot modify past dates")
        
        record = await self.repository.get_for_editing(date_context.date)
        if not record:
            record = self._create_new_record(date_context.date)
        
        # Update the target
        target = record.food_targets.get(target_id)
        if not target:
            raise ValueError(f"Unknown food target: {target_id}")
        
        old_value = target.completed
        target.update_progress(increment)
        
        # Save and emit event
        await self.repository.save(record)
        await self.events.emit(FoodTargetUpdated(
            date=date_context.date,
            target_id=target_id,
            old_value=old_value,
            new_value=target.completed
        ))
        
        return FoodTargetResult(
            target=target,
            completion_percentage=record.calculate_completion()
        )
```

### 5. Event-Driven Communication

```python
class EventBus:
    """Decouples services through event-driven architecture"""
    def __init__(self):
        self._handlers = defaultdict(list)
    
    def subscribe(self, event_type: Type[Event], handler: Callable):
        self._handlers[event_type].append(handler)
    
    async def emit(self, event: Event):
        for handler in self._handlers[type(event)]:
            try:
                await handler(event)
            except Exception as e:
                logger.error(f"Event handler failed: {e}")

# Example: Cannabis changes affect water requirements display
class WaterTrackingService:
    def __init__(self, repo: DailyRecordRepository, events: EventBus):
        self.repo = repo
        events.subscribe(CannabisSessionLogged, self.handle_cannabis_change)
    
    async def handle_cannabis_change(self, event: CannabisSessionLogged):
        """Update water requirements (not intake) when cannabis changes"""
        record = await self.repo.get_for_viewing(event.date)
        if record:
            # Recalculate requirements but don't modify intake
            new_requirement = self._calculate_requirement(
                record.body_system,
                event.session_count
            )
            # Emit event for UI update
            await self.events.emit(WaterRequirementChanged(
                date=event.date,
                new_requirement=new_requirement
            ))
```

### 6. API Layer with Clear Contracts

```python
@router.post("/api/days/{date}/food/{target_id}")
async def update_food_target(
    date: date,
    target_id: str,
    request: UpdateTargetRequest,
    service: FoodTrackingService = Depends(get_food_service),
    date_validator: DateValidator = Depends()
) -> FoodTargetResponse:
    """Update food target for a specific date"""
    date_context = date_validator.validate(date)
    
    try:
        result = await service.update_food_target(
            date_context,
            target_id,
            request.increment
        )
        return FoodTargetResponse(
            success=True,
            target=result.target.to_dict(),
            completion_percentage=result.completion_percentage
        )
    except PermissionError:
        raise HTTPException(403, "Can only edit today's records")
    except ValueError as e:
        raise HTTPException(400, str(e))
```

## Testing Strategy

### Unit Tests

```python
# Test domain logic
def test_date_context_permissions():
    today_context = DateContext(date.today())
    yesterday_context = DateContext(date.today() - timedelta(1))
    
    assert today_context.can_edit == True
    assert yesterday_context.can_edit == False
    assert yesterday_context.can_view == True

# Test service logic
async def test_food_service_prevents_past_edits():
    service = FoodTrackingService(mock_repo, mock_requirements, mock_events)
    yesterday = DateContext(date.today() - timedelta(1))
    
    with pytest.raises(ValueError, match="Cannot modify past dates"):
        await service.update_food_target(yesterday, "protein", 1)

# Test requirements calculation
def test_water_requirements_with_cannabis():
    service = RequirementsService()
    
    # Detox day base: 10 glasses
    assert service.get_water_requirement(BodySystem.DETOX, 0) == 10
    
    # Each cannabis session adds 1 glass
    assert service.get_water_requirement(BodySystem.DETOX, 3) == 13
```

### Integration Tests

```python
async def test_cannabis_updates_affect_water_requirements():
    """Test event flow between services"""
    # Setup
    event_bus = EventBus()
    cannabis_service = CannabisTrackingService(repo, event_bus)
    water_service = WaterTrackingService(repo, event_bus)
    
    # Log cannabis session
    await cannabis_service.log_session(DateContext(date.today()))
    
    # Verify water requirement updated (not intake)
    record = await repo.get_for_viewing(date.today())
    assert record.water_intake.glasses_consumed == 0  # Unchanged
    assert water_service.get_current_requirement() == 9  # Base 8 + 1
```

### End-to-End Tests

```python
async def test_daily_mission_flow():
    """Test complete user flow"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        # View today's mission
        response = await client.get("/")
        assert response.status_code == 200
        
        # Update food target
        response = await client.post(
            f"/api/days/{date.today()}/food/protein",
            json={"increment": 1}
        )
        assert response.status_code == 200
        
        # Try to update yesterday (should fail)
        yesterday = date.today() - timedelta(1)
        response = await client.post(
            f"/api/days/{yesterday}/food/protein",
            json={"increment": 1}
        )
        assert response.status_code == 403
```

## Migration Strategy

### Phase 1: Core Domain Setup (Week 1)
- [ ] Create domain entities and value objects
- [ ] Implement DateContext with permission rules
- [ ] Set up event system infrastructure
- [ ] Create comprehensive unit tests for domain logic

### Phase 2: Service Layer Extraction (Week 1-2)
- [ ] Extract food tracking logic into FoodTrackingService
- [ ] Extract water tracking logic into WaterTrackingService
- [ ] Extract cannabis tracking logic into CannabisTrackingService
- [ ] Create RequirementsService for calculations
- [ ] Implement CalendarService for read-only views

### Phase 3: Repository Implementation (Week 2)
- [ ] Define repository interfaces
- [ ] Implement SQLAlchemy repositories
- [ ] Add caching layer for performance
- [ ] Create repository tests

### Phase 4: Event-Driven Refactoring (Week 3)
- [ ] Implement EventBus
- [ ] Refactor cannabis→water to use events
- [ ] Add event handlers to services
- [ ] Create event flow tests

### Phase 5: API Restructuring (Week 3-4)
- [ ] Split main.py into focused routers
- [ ] Implement dependency injection
- [ ] Add date validation middleware
- [ ] Create OpenAPI documentation

### Phase 6: Frontend Updates (Week 4)
- [ ] Update templates to use new API structure
- [ ] Implement proper error handling
- [ ] Add loading states
- [ ] Test all user flows

## Benefits of This Architecture

### 1. **Testability**
- Each service can be unit tested in isolation
- Mock dependencies easily
- Clear test boundaries

### 2. **Maintainability**
- Clear separation of concerns
- Easy to understand code organization
- Consistent patterns throughout

### 3. **Extensibility**
- Easy to add new tracking systems
- Third-party integrations have clear interfaces
- Plugin architecture possible

### 4. **Data Integrity**
- Impossible to modify past dates
- Clear audit trail through events
- Consistent state management

### 5. **Performance**
- Efficient caching strategies
- Optimized database queries
- Async throughout

### 6. **Developer Experience**
- Type hints throughout
- Clear error messages
- Comprehensive documentation

## Risks and Mitigation

### Risk 1: Over-Engineering
**Mitigation**: Start with core services, add complexity only when needed

### Risk 2: Migration Complexity
**Mitigation**: Incremental migration with feature flags

### Risk 3: Performance Overhead
**Mitigation**: Implement caching, monitor performance metrics

### Risk 4: Team Learning Curve
**Mitigation**: Comprehensive documentation, pair programming sessions

## Success Metrics

1. **Code Quality**
   - Test coverage > 80%
   - Cyclomatic complexity < 10
   - Clear separation of concerns

2. **Performance**
   - API response time < 100ms
   - Database queries < 50ms
   - Frontend interactions feel instant

3. **Maintainability**
   - New features implementable in < 1 day
   - Bugs fixable in < 2 hours
   - Onboarding new developers < 1 week

## Conclusion

This architecture provides a solid foundation for the Body Systems Nutrition Tracker that is:
- **Modular**: Each system is independent
- **Testable**: Comprehensive test coverage possible
- **Maintainable**: Clear code organization
- **Extensible**: Easy to add new features
- **Secure**: Date isolation prevents data corruption

The investment in this refactoring will pay dividends in reduced bugs, faster feature development, and improved developer experience.

## Appendix: Code Examples

### A. Complete Service Example

```python
# services/water_tracking_service.py
from typing import Optional
from datetime import date
from core.entities import DailyRecord, WaterIntake
from core.value_objects import DateContext, BodySystem
from core.events import WaterIntakeUpdated, WaterRequirementChanged
from repositories import DailyRecordRepository
from .requirements_service import RequirementsService
from infrastructure.events import EventBus

class WaterTrackingService:
    """Manages water intake tracking and requirements"""
    
    def __init__(self,
                 repository: DailyRecordRepository,
                 requirements_service: RequirementsService,
                 event_bus: EventBus):
        self.repository = repository
        self.requirements = requirements_service
        self.events = event_bus
        
        # Subscribe to relevant events
        self.events.subscribe(CannabisSessionLogged, self._handle_cannabis_change)
    
    async def get_water_status(self, date_context: DateContext) -> WaterStatus:
        """Get current water intake and requirements"""
        record = await self.repository.get_for_viewing(date_context.date)
        if not record:
            return WaterStatus(consumed=0, required=8, can_edit=date_context.can_edit)
        
        requirement = self.requirements.get_water_requirement(
            record.body_system,
            len(record.cannabis_sessions)
        )
        
        return WaterStatus(
            consumed=record.water_intake.glasses,
            required=requirement,
            can_edit=date_context.can_edit
        )
    
    async def update_water_intake(self, 
                                 date_context: DateContext,
                                 action: str) -> WaterStatus:
        """Update water intake (increment/decrement)"""
        if not date_context.can_edit:
            raise PermissionError("Cannot modify past dates")
        
        record = await self.repository.get_for_editing(date_context.date)
        if not record:
            record = DailyRecord(date_context.date, self._get_body_system(date_context.date))
        
        # Update intake
        old_value = record.water_intake.glasses
        if action == "increment":
            record.water_intake.add_glass()
        elif action == "decrement":
            record.water_intake.remove_glass()
        
        # Save and emit event
        await self.repository.save(record)
        await self.events.emit(WaterIntakeUpdated(
            date=date_context.date,
            old_value=old_value,
            new_value=record.water_intake.glasses
        ))
        
        return await self.get_water_status(date_context)
    
    async def _handle_cannabis_change(self, event: CannabisSessionLogged):
        """React to cannabis session changes"""
        # Only emit requirement change event - don't modify intake
        record = await self.repository.get_for_viewing(event.date)
        if record:
            new_requirement = self.requirements.get_water_requirement(
                record.body_system,
                event.session_count
            )
            await self.events.emit(WaterRequirementChanged(
                date=event.date,
                new_requirement=new_requirement
            ))
```

### B. Repository Implementation

```python
# repositories/implementations/sqlalchemy/daily_record_repository.py
from typing import Optional
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from core.entities import DailyRecord
from repositories import DailyRecordRepository
from .models import DailyProgressModel

class SqlAlchemyDailyRecordRepository(DailyRecordRepository):
    """SQLAlchemy implementation of DailyRecordRepository"""
    
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def get_for_viewing(self, target_date: date) -> Optional[DailyRecord]:
        """Get read-only record"""
        stmt = select(DailyProgressModel).where(
            DailyProgressModel.date == target_date
        )
        result = await self.session.execute(stmt)
        model = result.scalar_one_or_none()
        
        if model:
            return self._to_domain(model, allow_modifications=False)
        return None
    
    async def get_for_editing(self, target_date: date) -> Optional[DailyRecord]:
        """Get editable record - today only"""
        if target_date != date.today():
            raise PermissionError("Can only edit today's records")
        
        record = await self.get_for_viewing(target_date)
        if record:
            # Return a copy that allows modifications
            return self._to_domain(model, allow_modifications=True)
        return None
    
    async def save(self, record: DailyRecord) -> None:
        """Save record - validates it's today"""
        if record.date != date.today():
            raise PermissionError("Can only save today's records")
        
        model = await self._get_or_create_model(record.date)
        self._update_model(model, record)
        
        self.session.add(model)
        await self.session.commit()
    
    def _to_domain(self, model: DailyProgressModel, 
                   allow_modifications: bool) -> DailyRecord:
        """Convert database model to domain entity"""
        record = DailyRecord(
            date=model.date,
            body_system=BodySystem(model.system_name)
        )
        
        # Restore state from JSON
        record.food_targets = self._deserialize_food_targets(model.targets_data)
        record.water_intake = WaterIntake(glasses=model.water_glasses)
        record.cannabis_sessions = self._deserialize_cannabis(model.cannabis_sessions)
        
        if not allow_modifications:
            record._freeze()  # Make immutable for viewing
        
        return record
```

### C. API Router Example

```python
# api/routers/water.py
from fastapi import APIRouter, Depends, HTTPException, Query
from datetime import date
from typing import Optional
from pydantic import BaseModel
from services import WaterTrackingService
from api.dependencies import get_water_service, get_date_validator
from core.value_objects import DateContext

router = APIRouter(prefix="/api/water", tags=["water"])

class WaterStatusResponse(BaseModel):
    consumed: int
    required: int
    percentage: float
    can_edit: bool

class UpdateWaterRequest(BaseModel):
    action: str  # "increment" or "decrement"

@router.get("/status")
async def get_water_status(
    target_date: Optional[date] = Query(None, description="Date to get status for"),
    service: WaterTrackingService = Depends(get_water_service),
    date_validator: DateValidator = Depends()
) -> WaterStatusResponse:
    """Get water intake status for a specific date"""
    if not target_date:
        target_date = date.today()
    
    date_context = date_validator.validate(target_date)
    status = await service.get_water_status(date_context)
    
    return WaterStatusResponse(
        consumed=status.consumed,
        required=status.required,
        percentage=(status.consumed / status.required * 100) if status.required > 0 else 0,
        can_edit=status.can_edit
    )

@router.post("/update")
async def update_water(
    request: UpdateWaterRequest,
    target_date: Optional[date] = Query(None),
    service: WaterTrackingService = Depends(get_water_service),
    date_validator: DateValidator = Depends()
) -> WaterStatusResponse:
    """Update water intake"""
    if not target_date:
        target_date = date.today()
    
    date_context = date_validator.validate(target_date)
    
    try:
        status = await service.update_water_intake(date_context, request.action)
        return WaterStatusResponse(
            consumed=status.consumed,
            required=status.required,
            percentage=(status.consumed / status.required * 100) if status.required > 0 else 0,
            can_edit=status.can_edit
        )
    except PermissionError as e:
        raise HTTPException(403, str(e))
    except ValueError as e:
        raise HTTPException(400, str(e))
```
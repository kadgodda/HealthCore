## Current Understanding from Project Documents

### From Project Summary:
- Each day targets specific foods for a body system
- Example: "2 servings of nitrate-rich foods" with examples (beets, spinach, arugula)
- Instant feedback on "boost level" for the day
- Cannabis integration automatically adjusts requirements

### From Architecture Refactoring Plan:
- `FoodTrackingService` handles food target updates
- Food targets are part of the `DailyRecord` aggregate
- Events emitted when food targets are updated
- Completion percentage calculations

### From Body Systems Research:
- 10 scientifically-backed body systems identified
- Bi-weekly rotation with synergistic pairings
- Each system has specific nutrient requirements
- Measurable biomarkers for validation

## Key Discussion Points

### 1. **Food Categorization & Science Alignment**
**Questions:**
- How do we categorize foods by their primary body system benefits?
- Should foods have multiple system tags (e.g., salmon benefits both Mitochondrial Energy AND Inflammatory Response)?
- How detailed should our food database be initially?
- Do we need to track preparation methods that affect nutrient bioavailability?

**Proposed Approach:**
- Primary system assignment based on dominant nutrient profile
- Secondary benefits tracked but not emphasized in UI
- Start with top 50-100 foods per system based on research
- Include preparation notes only for critical differences (raw vs cooked garlic)

### 2. **Daily Target Structure**
**Questions:**
- Fixed servings vs flexible nutrient goals?
- How to handle foods that count toward multiple targets?
- Should we track anti-nutrients or foods to avoid?
- How granular should portion sizes be?

**Proposed Structure:**
```python
class FoodTarget:
    id: str  # e.g., "nitrate-rich", "omega-3", "cruciferous"
    name: str
    body_system: BodySystem
    target_servings: int
    serving_examples: List[ServingExample]
    completed_servings: int
    
class ServingExample:
    food_name: str
    amount: str  # "1 cup", "3 oz", "1 medium"
    preparation_note: Optional[str]
    nutrient_density: float  # 0-1 scale
```

### 3. **Tracking Granularity**
**Questions:**
- Simple increment/decrement vs detailed food logging?
- Track specific foods eaten or just category completion?
- Time of consumption tracking needed?
- Photo/barcode scanning in future versions?

**ADHD-Optimized Approach:**
- Start with simple category tracking (not detailed logging)
- One-tap increment for common portions
- Optional notes field for specific foods
- Time tracking only if affects bioavailability

### 4. **Nutrient Requirements & Interaction System**

**Core Strategy:**
- Leverage existing food databases (Open Food Facts, USDA, Nutritionix)
- Integrate with Instacart API for product availability and barcodes
- Focus on building the unique interaction/synergy layer

#### Nutrient Requirements by Body System

```python
class BodySystemNutrientProfile:
    body_system: BodySystem
    primary_nutrients: List[NutrientTarget]
    secondary_nutrients: List[NutrientTarget]
    nutrient_interactions: List[NutrientInteraction]
    meal_synergy_patterns: List[MealPattern]
    
class NutrientTarget:
    nutrient_id: str  # Maps to external API nutrients
    optimal_daily_amount: float
    minimum_threshold: float  # Below this = no benefit
    maximum_benefit: float    # Plateau point
    unit: str
    timing_sensitivity: Optional[TimingRule]
    research_citations: List[str]
    
class TimingRule:
    optimal_window: str  # "morning", "pre-workout", "with meals"
    absorption_modifier: float  # 1.2 = 20% better at optimal time
```

#### Dynamic Interaction System

```python
class FoodInteraction:
    """Tracks real-time interactions between foods"""
    interaction_id: str
    foods_involved: List[str]
    interaction_type: Literal["synergy", "reduction", "timing"]
    impact_calculation: InteractionFormula
    
class InteractionFormula:
    """How interactions affect nutrient absorption"""
    base_nutrient_value: float
    interaction_modifier: float  # Never below 0.5 (50% minimum)
    result_explanation: str
    
    def calculate_impact(self, foods_consumed: List[FoodEntry]) -> NutrientImpact:
        # Complex calculation based on:
        # - Order of consumption
        # - Time between foods
        # - Preparation methods
        # - Quantities
        
        # IMPORTANT: Reductions cap at 50% to avoid discouragement
        final_modifier = max(0.5, self.interaction_modifier)
        return NutrientImpact(
            original_value=self.base_nutrient_value,
            modified_value=self.base_nutrient_value * final_modifier,
            explanation=self.result_explanation
        )
```

#### Positive Truth Design

```python
class ProgressCalculation:
    """Show complete truth with positive framing"""
    
    def calculate_meal_impact(self, meal: List[FoodEntry]) -> MealImpact:
        all_benefits = {}
        affected_nutrients = {}
        
        # Track ALL benefits, not just the affected ones
        for food in meal:
            all_benefits[food.id] = {
                'calories': self.get_nutrient_value(food, 'calories'),
                'protein': self.get_nutrient_value(food, 'protein'),
                'fiber': self.get_nutrient_value(food, 'fiber'),
                'vitamins': self.get_all_vitamins(food),
                # ... all nutrients
            }
        
        # Apply interactions (can reduce to 0 if needed)
        for interaction in self.find_interactions(meal):
            affected_nutrients[interaction.affected_nutrient] = {
                'original': interaction.original_value,
                'modified': interaction.modified_value,
                'reason': interaction.scientific_reason,
                'other_benefits': self.get_unaffected_benefits(meal)
            }
        
        return MealImpact(
            primary_message=self.create_positive_summary(all_benefits),
            interaction_details=affected_nutrients,
            optimization_tips=self.generate_tips(meal),
            total_nutritional_value=self.sum_all_benefits(all_benefits)
        )
    
    def create_positive_summary(self, benefits: Dict) -> str:
        # Lead with what they DID get
        top_nutrients = self.get_top_3_nutrients(benefits)
        return f"Great job! You got {top_nutrients[0]}, {top_nutrients[1]}, and {top_nutrients[2]}!"
```

#### UI Presentation Example

```python
class InteractionDisplay:
    """Progressive disclosure of interaction effects"""
    
    def show_meal_results(self, meal_impact: MealImpact):
        # Primary view: Big wins
        primary_card = {
            'title': 'Nutrition Gained!',
            'main_benefits': meal_impact.get_top_benefits(),
            'progress_bars': self.create_positive_progress_bars(),
            'expand_button': 'See interaction details'
        }
        
        # Expandable section: Full truth
        detail_view = {
            'interactions': [
                {
                    'title': 'Vitamin C absorption reduced by dairy',
                    'impact': '80% reduction',
                    'science': 'Casein proteins bind to vitamin C',
                    'still_gained': ['Protein: 12g', 'Calcium: 300mg', 'B12: 45%'],
                    'tip': 'Try waiting 1 hour between citrus and dairy'
                }
            ]
        }
```

#### Meal Recommendation Engine

```python
class MealSynergyRecommendation:
    """Show individual vs. combined benefits"""
    
    def recommend_enhancements(self, current_food: str) -> List[MealSuggestion]:
        suggestions = []
        
        for pattern in self.body_system.meal_patterns:
            if current_food in pattern.foods:
                suggestion = MealSuggestion(
                    base_food=current_food,
                    base_benefit=self.calculate_solo_benefit(current_food),
                    suggested_additions=pattern.complementary_foods,
                    combined_benefit=pattern.total_benefit,
                    benefit_multiplier=pattern.total_benefit / base_benefit,
                    visual_comparison=self.generate_comparison_visual()
                )
                suggestions.append(suggestion)
        
        return sorted(suggestions, key=lambda x: x.benefit_multiplier, reverse=True)

class MealSuggestion:
    base_food: str
    base_benefit: float  # "Apple alone: 15% of daily target"
    suggested_additions: List[str]
    combined_benefit: float  # "Apple + Almond Butter: 35% of daily target"
    benefit_multiplier: float  # 2.3x
    visual_comparison: ComparisonVisual  # Progress bars showing difference
```

#### Data Collection & Enhancement Strategy

```python
class DataEnhancementPipeline:
    """Continuously improve our interaction database"""
    
    external_apis: List[FoodDataAPI] = [
        "OpenFoodFacts",
        "USDA",
        "Nutritionix",
        "Instacart"  # For product availability
    ]
    
    def collect_missing_data(self, food_entry: FoodEntry):
        # Priority order:
        # 1. Check our enhanced database
        # 2. Query external APIs
        # 3. Flag for manual research if critical nutrient missing
        # 4. Crowdsource from verified users
        
        if food_entry.has_barcode:
            # Instacart API for product details
            product_info = self.instacart_api.get_product(food_entry.barcode)
            
        # Store preparation-specific variants
        if food_entry.preparation_method != "raw":
            self.store_preparation_variant(food_entry)
    
    def validate_interaction(self, interaction: FoodInteraction):
        # Research-based validation
        # User outcome tracking
        # A/B testing different modifier values
        pass
```

#### Storage Schema for Enhanced Data

```sql
-- Core nutrient requirements
body_system_nutrients:
    - body_system_id
    - nutrient_id
    - optimal_amount
    - min_threshold
    - max_benefit
    - timing_preferences
    - research_json

-- Interaction rules (our secret sauce)
nutrient_interactions:
    - id
    - trigger_foods[]  -- Array of foods that trigger this
    - affected_nutrients[]
    - modifier_formula  -- JSON with calculation rules
    - evidence_level  -- "strong", "moderate", "emerging"
    - research_citations[]

-- Meal patterns for synergy
meal_synergy_patterns:
    - body_system_id
    - pattern_name
    - core_foods[]
    - synergy_multiplier
    - total_nutrient_boost
    - user_rating  -- Track effectiveness

-- Enhanced food data (what we add to external APIs)
food_enhancements:
    - food_id  -- Links to external API
    - preparation_method
    - nutrient_retention_json
    - common_pairings[]
    - negative_pairings[]
    - optimal_timing

-- User contribution tracking
data_contributions:
    - user_id
    - contribution_type
    - data_json
    - verification_status
    - impact_score
```

## Example Implementation Flow

**User logs an apple:**
```
1. Fetch base nutrition from OpenFoodFacts API
2. Check our enhancements for:
   - Preparation impact (raw vs cooked)
   - Known synergies (apple + almond butter)
   - Timing benefits (morning vs evening)
3. Show immediate benefit: "+15% daily fiber target!"
4. Suggest enhancement: "Add 2 tbsp almond butter for 2.3x benefit!"
5. User adds almond butter
6. Show synergy animation: "Fiber + Healthy Fats = Enhanced absorption!"
7. Total progress: "35% of daily target achieved!"
```

**Negative interaction example (never discouraging):**
```
User logs: Spinach salad
Then logs: Coffee immediately after

Instead of: "Coffee blocks iron absorption -30%" ❌
We show: "Tip: Wait 1 hour between iron-rich foods and coffee for optimal absorption!" ✓
Progress bar shows: Base benefit maintained, just missing potential bonus
```

### 5. **Progress & Feedback Mechanisms**
**Questions:**
- Real-time vs end-of-day feedback?
- Visual representation of progress?
- Streak tracking at food level or system level?
- Celebration moments for completion?

**Behavioral Reinforcement Elements:**
- Immediate visual feedback on tap
- Progress bars fill with system-appropriate colors
- Daily completion celebrates with animation
- Weekly system mastery badges

### 6. **Integration with Requirements Calculator**
**Questions:**
- How do personal factors affect food targets?
- Should quantities adjust based on body weight/activity?
- Gender-specific requirements (per Dr. Stacy Sims research)?
- Age-related adjustments?

**Integration Points:**
```python
# Requirements Calculator provides:
personalized_targets = requirements_calculator.get_targets(
    body_system=current_system,
    user_profile=user,
    activity_level=today_activity,
    special_factors=["cannabis_use", "menopause", etc.]
)

# Food Tracking uses these to:
- Adjust serving quantities
- Modify target counts
- Add supplementary requirements
```

### 7. **Cannabis Integration**
**Questions:**
- Which nutrients need adjustment with cannabis use?
- Real-time updates or daily recalculation?
- Visual indication of adjusted requirements?
- Education about why requirements changed?

**Proposed Approach:**
- Predefined nutrient adjustments per cannabis session
- Automatic target updates (e.g., +antioxidants, +water)
- Subtle UI indication of adjusted targets
- Optional "learn why" expandable info

## Integration Points with Other Modules

### Body System Module
- Receives current day's system
- Gets nutrient requirements for system
- Maps foods to system benefits
- Validates scientific accuracy

### Requirements Calculator Module
- Provides personalized serving sizes
- Adjusts for individual factors
- Cannabis use modifications
- Activity level considerations

### Progress/Completion Module
- Sends completion events
- Provides data for streaks
- Triggers celebrations
- Calculates daily/weekly progress

### Database Operations
- Store user's food completions
- Cache food-nutrient mappings
- Track historical patterns
- Support offline operation

## Proposed Data Schema

```python
# Core Entities
class DailyFoodRecord:
    date: date
    body_system: BodySystem
    targets: List[FoodTarget]
    completion_percentage: float
    notes: Optional[str]
    
# Food Database Tables
foods:
    - id
    - name
    - primary_system_id
    - nutrients_json
    - serving_info_json
    - tags_array
    
food_targets:
    - id
    - name
    - body_system_id
    - required_servings
    - nutrient_category
    
user_food_progress:
    - user_id
    - date
    - target_id
    - completed_servings
    - timestamp
    - notes
```
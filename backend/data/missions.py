"""Mission data for the nutrition game."""
from typing import Dict, List, Any
from enum import Enum


class MissionCategory(str, Enum):
    HYDRATION = "hydration"
    MINERALS = "minerals"
    VITAMINS = "vitamins"
    AMINO_ACIDS = "amino_acids"
    FATS = "fats"
    SPECIAL = "special"
    ENERGY = "energy"
    TIMING = "timing"


class RequirementType(str, Enum):
    AMOUNT = "amount"
    SUPPLEMENT = "supplement"
    FOOD = "food"
    ACTIVITY = "activity"
    TIMING = "timing"
    CUSTOM = "custom"


# Mission data structure matching TypeScript interface
MISSIONS_DATA = {
    "morning": {
        "level1": [
            {
                "id": "morning-l1-hydration",
                "title": "Hydration Activation",
                "description": "16-20oz water to restart kidney filtration",
                "icon": "💧",
                "level": 1,
                "timeWindow": "morning",
                "targetReceptors": ["aquaporin-2", "vasopressin-receptor"],
                "basePoints": 50,
                "category": MissionCategory.HYDRATION,
                "requirements": [
                    {
                        "type": RequirementType.AMOUNT,
                        "target": "water",
                        "amount": 16,
                        "unit": "oz",
                        "description": "Drink water upon waking"
                    }
                ]
            },
            {
                "id": "morning-l1-iron",
                "title": "Iron Loading",
                "description": "Iron + Vitamin C combo when absorption is highest",
                "icon": "⚡",
                "level": 1,
                "timeWindow": "morning",
                "targetReceptors": ["DMT1", "ferroportin", "transferrin-receptor"],
                "basePoints": 80,
                "category": MissionCategory.MINERALS,
                "requirements": [
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "iron",
                        "amount": 18,
                        "unit": "mg",
                        "description": "Iron supplement or iron-rich food"
                    },
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "vitamin-c",
                        "amount": 75,
                        "unit": "mg",
                        "description": "Vitamin C to enhance absorption"
                    },
                    {
                        "type": RequirementType.TIMING,
                        "target": "empty-stomach",
                        "amount": 30,
                        "unit": "min",
                        "description": "30 minutes before breakfast"
                    },
                    {
                        "type": RequirementType.ACTIVITY,
                        "target": "avoid-coffee",
                        "amount": 60,
                        "unit": "min",
                        "description": "Avoid coffee for 1 hour"
                    }
                ]
            },
            {
                "id": "morning-l1-vitamin-d",
                "title": "Sunlight Synthesis",
                "description": "Morning sun exposure for natural Vitamin D",
                "icon": "☀️",
                "level": 1,
                "timeWindow": "morning",
                "targetReceptors": ["VDR", "calcium-channels"],
                "basePoints": 60,
                "category": MissionCategory.VITAMINS,
                "requirements": [
                    {
                        "type": RequirementType.ACTIVITY,
                        "target": "sunlight-exposure",
                        "amount": 15,
                        "unit": "min",
                        "description": "Direct sunlight exposure"
                    },
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "vitamin-d3",
                        "amount": 1000,
                        "unit": "IU",
                        "description": "D3 supplement if no sun"
                    }
                ]
            },
            {
                "id": "morning-l1-b-complex",
                "title": "Energy Ignition",
                "description": "B-vitamins for cellular energy production",
                "icon": "🔋",
                "level": 1,
                "timeWindow": "morning",
                "targetReceptors": ["thiamine-transporter", "riboflavin-transporter", "OCTN2"],
                "basePoints": 70,
                "category": MissionCategory.VITAMINS,
                "requirements": [
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "b-complex",
                        "amount": 1,
                        "unit": "dose",
                        "description": "Complete B-complex supplement"
                    },
                    {
                        "type": RequirementType.FOOD,
                        "target": "nutritional-yeast",
                        "amount": 1,
                        "unit": "tbsp",
                        "description": "Or nutritional yeast alternative"
                    }
                ]
            }
        ],
        "level2": [
            {
                "id": "morning-l2-omega-3",
                "title": "Inflammation Shield",
                "description": "Omega-3 fatty acids for anti-inflammatory response",
                "icon": "🐟",
                "level": 2,
                "timeWindow": "morning",
                "targetReceptors": ["PPAR-alpha", "GPR120", "CD36"],
                "basePoints": 100,
                "category": MissionCategory.FATS,
                "requirements": [
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "omega-3",
                        "amount": 1000,
                        "unit": "mg",
                        "description": "EPA/DHA supplement"
                    },
                    {
                        "type": RequirementType.FOOD,
                        "target": "fatty-fish",
                        "amount": 4,
                        "unit": "oz",
                        "description": "Or fatty fish alternative"
                    }
                ]
            },
            {
                "id": "morning-l2-magnesium",
                "title": "Metabolic Activator",
                "description": "Magnesium for 300+ enzyme reactions",
                "icon": "💎",
                "level": 2,
                "timeWindow": "morning",
                "targetReceptors": ["TRPM6", "TRPM7", "CNNM2"],
                "basePoints": 90,
                "category": MissionCategory.MINERALS,
                "requirements": [
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "magnesium-glycinate",
                        "amount": 200,
                        "unit": "mg",
                        "description": "Highly absorbable form"
                    },
                    {
                        "type": RequirementType.TIMING,
                        "target": "with-food",
                        "amount": 0,
                        "unit": "min",
                        "description": "Take with breakfast"
                    }
                ]
            },
            {
                "id": "morning-l2-zinc",
                "title": "Immune Fortification",
                "description": "Zinc for immune system and healing",
                "icon": "🛡️",
                "level": 2,
                "timeWindow": "morning",
                "targetReceptors": ["ZIP4", "ZIP14", "ZnT1"],
                "basePoints": 85,
                "category": MissionCategory.MINERALS,
                "requirements": [
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "zinc",
                        "amount": 15,
                        "unit": "mg",
                        "description": "Zinc picolinate or citrate"
                    },
                    {
                        "type": RequirementType.ACTIVITY,
                        "target": "separate-from-iron",
                        "amount": 2,
                        "unit": "hours",
                        "description": "Take 2 hours apart from iron"
                    }
                ]
            }
        ],
        "level3": [
            {
                "id": "morning-l3-coq10",
                "title": "Mitochondrial Boost",
                "description": "CoQ10 for cellular energy production",
                "icon": "⚡",
                "level": 3,
                "timeWindow": "morning",
                "targetReceptors": ["complex-I", "complex-III", "ATP-synthase"],
                "basePoints": 120,
                "category": MissionCategory.SPECIAL,
                "requirements": [
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "coq10",
                        "amount": 100,
                        "unit": "mg",
                        "description": "Ubiquinol form preferred"
                    },
                    {
                        "type": RequirementType.FOOD,
                        "target": "healthy-fat",
                        "amount": 1,
                        "unit": "tbsp",
                        "description": "Take with fat for absorption"
                    }
                ]
            },
            {
                "id": "morning-l3-NAD-boost",
                "title": "Cellular Renewal",
                "description": "NAD+ precursors for DNA repair and energy",
                "icon": "🧬",
                "level": 3,
                "timeWindow": "morning",
                "targetReceptors": ["NAMPT", "SIRT1", "PARP1"],
                "basePoints": 150,
                "category": MissionCategory.SPECIAL,
                "requirements": [
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "NMN",
                        "amount": 250,
                        "unit": "mg",
                        "description": "NMN or NR supplement"
                    },
                    {
                        "type": RequirementType.ACTIVITY,
                        "target": "fasting-window",
                        "amount": 12,
                        "unit": "hours",
                        "description": "12+ hour overnight fast"
                    }
                ]
            }
        ]
    },
    "midday": {
        "level1": [
            {
                "id": "midday-l1-protein",
                "title": "Amino Acid Assembly",
                "description": "Complete protein for muscle synthesis",
                "icon": "💪",
                "level": 1,
                "timeWindow": "midday",
                "targetReceptors": ["LAT1", "ASCT2", "mTOR"],
                "basePoints": 70,
                "category": MissionCategory.AMINO_ACIDS,
                "requirements": [
                    {
                        "type": RequirementType.FOOD,
                        "target": "complete-protein",
                        "amount": 20,
                        "unit": "g",
                        "description": "Quality protein source"
                    },
                    {
                        "type": RequirementType.ACTIVITY,
                        "target": "movement",
                        "amount": 10,
                        "unit": "min",
                        "description": "Light movement after eating"
                    }
                ]
            }
        ],
        "level2": [],
        "level3": []
    },
    "afternoon": {
        "level1": [],
        "level2": [],
        "level3": []
    },
    "evening": {
        "level1": [],
        "level2": [],
        "level3": []
    }
}
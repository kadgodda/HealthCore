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
            },
            {
                "id": "midday-l1-fiber",
                "title": "Digestive Support",
                "description": "Soluble fiber for gut health",
                "icon": "🥦",
                "level": 1,
                "timeWindow": "midday",
                "targetReceptors": ["SCFA-receptors", "GLP-1"],
                "basePoints": 60,
                "category": MissionCategory.HYDRATION,
                "requirements": [
                    {
                        "type": RequirementType.FOOD,
                        "target": "vegetables",
                        "amount": 2,
                        "unit": "cups",
                        "description": "Mixed vegetables with lunch"
                    }
                ]
            },
            {
                "id": "midday-l1-potassium",
                "title": "Electrolyte Balance",
                "description": "Potassium for cellular function",
                "icon": "🍌",
                "level": 1,
                "timeWindow": "midday",
                "targetReceptors": ["Na-K-ATPase", "KCNJ2"],
                "basePoints": 65,
                "category": MissionCategory.MINERALS,
                "requirements": [
                    {
                        "type": RequirementType.FOOD,
                        "target": "banana",
                        "amount": 1,
                        "unit": "medium",
                        "description": "Banana or avocado"
                    }
                ]
            },
            {
                "id": "midday-l1-chromium",
                "title": "Blood Sugar Support",
                "description": "Chromium for glucose metabolism",
                "icon": "🍭",
                "level": 1,
                "timeWindow": "midday",
                "targetReceptors": ["insulin-receptor", "GLUT4"],
                "basePoints": 55,
                "category": MissionCategory.MINERALS,
                "requirements": [
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "chromium",
                        "amount": 200,
                        "unit": "mcg",
                        "description": "Chromium picolinate with meal"
                    }
                ]
            }
        ],
        "level2": [
            {
                "id": "midday-l2-probiotics",
                "title": "Microbiome Boost",
                "description": "Probiotics for gut diversity",
                "icon": "🧫",
                "level": 2,
                "timeWindow": "midday",
                "targetReceptors": ["TLR2", "TLR4", "NOD2"],
                "basePoints": 85,
                "category": MissionCategory.SPECIAL,
                "requirements": [
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "probiotics",
                        "amount": 10,
                        "unit": "billion CFU",
                        "description": "Multi-strain probiotic"
                    }
                ]
            },
            {
                "id": "midday-l2-vitamin-k2",
                "title": "Calcium Director",
                "description": "K2 for proper calcium utilization",
                "icon": "🦜",
                "level": 2,
                "timeWindow": "midday",
                "targetReceptors": ["VKORC1", "osteocalcin"],
                "basePoints": 80,
                "category": MissionCategory.VITAMINS,
                "requirements": [
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "vitamin-k2",
                        "amount": 100,
                        "unit": "mcg",
                        "description": "MK-7 form preferred"
                    }
                ]
            },
            {
                "id": "midday-l2-selenium",
                "title": "Thyroid Support",
                "description": "Selenium for thyroid function",
                "icon": "🦚",
                "level": 2,
                "timeWindow": "midday",
                "targetReceptors": ["selenoprotein-P", "DIO1"],
                "basePoints": 75,
                "category": MissionCategory.MINERALS,
                "requirements": [
                    {
                        "type": RequirementType.FOOD,
                        "target": "brazil-nuts",
                        "amount": 2,
                        "unit": "nuts",
                        "description": "Brazil nuts for selenium"
                    }
                ]
            }
        ],
        "level3": [
            {
                "id": "midday-l3-pqq",
                "title": "Mitochondrial Genesis",
                "description": "PQQ for new mitochondria creation",
                "icon": "⚡",
                "level": 3,
                "timeWindow": "midday",
                "targetReceptors": ["PGC-1alpha", "CREB"],
                "basePoints": 130,
                "category": MissionCategory.SPECIAL,
                "requirements": [
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "PQQ",
                        "amount": 20,
                        "unit": "mg",
                        "description": "PQQ supplement"
                    }
                ]
            },
            {
                "id": "midday-l3-peptides",
                "title": "Collagen Synthesis",
                "description": "Peptides for tissue repair",
                "icon": "🧬",
                "level": 3,
                "timeWindow": "midday",
                "targetReceptors": ["collagen-receptors", "TGF-beta"],
                "basePoints": 140,
                "category": MissionCategory.SPECIAL,
                "requirements": [
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "collagen-peptides",
                        "amount": 10,
                        "unit": "g",
                        "description": "Hydrolyzed collagen"
                    },
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "vitamin-c",
                        "amount": 500,
                        "unit": "mg",
                        "description": "Vitamin C for synthesis"
                    }
                ]
            }
        ]
    },
    "afternoon": {
        "level1": [
            {
                "id": "afternoon-l1-green-tea",
                "title": "Antioxidant Boost",
                "description": "EGCG for cellular protection",
                "icon": "🍵",
                "level": 1,
                "timeWindow": "afternoon",
                "targetReceptors": ["AMPK", "Nrf2"],
                "basePoints": 55,
                "category": MissionCategory.SPECIAL,
                "requirements": [
                    {
                        "type": RequirementType.FOOD,
                        "target": "green-tea",
                        "amount": 1,
                        "unit": "cup",
                        "description": "Green tea or matcha"
                    }
                ]
            },
            {
                "id": "afternoon-l1-vitamin-e",
                "title": "Cell Membrane Shield",
                "description": "Vitamin E for lipid protection",
                "icon": "🌰",
                "level": 1,
                "timeWindow": "afternoon",
                "targetReceptors": ["alpha-TTP", "SEC14L2"],
                "basePoints": 60,
                "category": MissionCategory.VITAMINS,
                "requirements": [
                    {
                        "type": RequirementType.FOOD,
                        "target": "almonds",
                        "amount": 1,
                        "unit": "oz",
                        "description": "Almonds or sunflower seeds"
                    }
                ]
            },
            {
                "id": "afternoon-l1-copper",
                "title": "Iron's Partner",
                "description": "Copper for iron metabolism",
                "icon": "🥔",
                "level": 1,
                "timeWindow": "afternoon",
                "targetReceptors": ["CTR1", "ATP7A"],
                "basePoints": 50,
                "category": MissionCategory.MINERALS,
                "requirements": [
                    {
                        "type": RequirementType.FOOD,
                        "target": "dark-chocolate",
                        "amount": 1,
                        "unit": "oz",
                        "description": "Dark chocolate 70%+"
                    }
                ]
            },
            {
                "id": "afternoon-l1-hydration-boost",
                "title": "Afternoon Hydration",
                "description": "Combat afternoon dehydration",
                "icon": "💦",
                "level": 1,
                "timeWindow": "afternoon",
                "targetReceptors": ["aquaporin-3"],
                "basePoints": 45,
                "category": MissionCategory.HYDRATION,
                "requirements": [
                    {
                        "type": RequirementType.AMOUNT,
                        "target": "water",
                        "amount": 12,
                        "unit": "oz",
                        "description": "Water with electrolytes"
                    }
                ]
            }
        ],
        "level2": [
            {
                "id": "afternoon-l2-quercetin",
                "title": "Senolytic Support",
                "description": "Quercetin for cellular cleanup",
                "icon": "🍎",
                "level": 2,
                "timeWindow": "afternoon",
                "targetReceptors": ["PI3K", "mTOR"],
                "basePoints": 90,
                "category": MissionCategory.SPECIAL,
                "requirements": [
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "quercetin",
                        "amount": 500,
                        "unit": "mg",
                        "description": "Quercetin phytosome"
                    }
                ]
            },
            {
                "id": "afternoon-l2-lutein",
                "title": "Eye Protection",
                "description": "Lutein for macular health",
                "icon": "👁️",
                "level": 2,
                "timeWindow": "afternoon",
                "targetReceptors": ["StARD3", "GSTP1"],
                "basePoints": 85,
                "category": MissionCategory.SPECIAL,
                "requirements": [
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "lutein",
                        "amount": 10,
                        "unit": "mg",
                        "description": "Lutein with zeaxanthin"
                    }
                ]
            },
            {
                "id": "afternoon-l2-taurine",
                "title": "Cellular Stability",
                "description": "Taurine for cell volume regulation",
                "icon": "🐂",
                "level": 2,
                "timeWindow": "afternoon",
                "targetReceptors": ["TauT", "GABA-A"],
                "basePoints": 80,
                "category": MissionCategory.AMINO_ACIDS,
                "requirements": [
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "taurine",
                        "amount": 1000,
                        "unit": "mg",
                        "description": "Taurine supplement"
                    }
                ]
            }
        ],
        "level3": [
            {
                "id": "afternoon-l3-resveratrol",
                "title": "Longevity Activator",
                "description": "Resveratrol for SIRT1 activation",
                "icon": "🍇",
                "level": 3,
                "timeWindow": "afternoon",
                "targetReceptors": ["SIRT1", "AMPK"],
                "basePoints": 125,
                "category": MissionCategory.SPECIAL,
                "requirements": [
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "resveratrol",
                        "amount": 250,
                        "unit": "mg",
                        "description": "Trans-resveratrol"
                    }
                ]
            },
            {
                "id": "afternoon-l3-nootropic-stack",
                "title": "Cognitive Enhancement",
                "description": "Afternoon brain boost protocol",
                "icon": "🧠",
                "level": 3,
                "timeWindow": "afternoon",
                "targetReceptors": ["NMDA", "AMPA", "nicotinic"],
                "basePoints": 145,
                "category": MissionCategory.SPECIAL,
                "requirements": [
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "alpha-GPC",
                        "amount": 300,
                        "unit": "mg",
                        "description": "Choline source"
                    },
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "lions-mane",
                        "amount": 1000,
                        "unit": "mg",
                        "description": "Lion's Mane extract"
                    },
                    {
                        "type": RequirementType.ACTIVITY,
                        "target": "focus-work",
                        "amount": 25,
                        "unit": "min",
                        "description": "Deep focus work session"
                    }
                ]
            }
        ]
    },
    "evening": {
        "level1": [
            {
                "id": "evening-l1-magnesium",
                "title": "Sleep Preparation",
                "description": "Magnesium for relaxation and sleep quality",
                "icon": "😴",
                "level": 1,
                "timeWindow": "evening",
                "targetReceptors": ["NMDA", "GABA-A", "TRPM6"],
                "basePoints": 60,
                "category": MissionCategory.MINERALS,
                "requirements": [
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "magnesium-glycinate",
                        "amount": 400,
                        "unit": "mg",
                        "description": "Calming form of magnesium"
                    },
                    {
                        "type": RequirementType.TIMING,
                        "target": "before-bed",
                        "amount": 30,
                        "unit": "min",
                        "description": "30-60 minutes before sleep"
                    }
                ]
            },
            {
                "id": "evening-l1-glycine",
                "title": "Deep Sleep Support",
                "description": "Glycine for sleep quality and recovery",
                "icon": "🌙",
                "level": 1,
                "timeWindow": "evening",
                "targetReceptors": ["glycine-receptor", "NMDA"],
                "basePoints": 50,
                "category": MissionCategory.AMINO_ACIDS,
                "requirements": [
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "glycine",
                        "amount": 3,
                        "unit": "g",
                        "description": "Glycine powder or capsules"
                    }
                ]
            },
            {
                "id": "evening-l1-tryptophan",
                "title": "Serotonin Boost",
                "description": "Tryptophan for mood and melatonin production",
                "icon": "🦃",
                "level": 1,
                "timeWindow": "evening",
                "targetReceptors": ["LAT1", "5-HT-receptor"],
                "basePoints": 65,
                "category": MissionCategory.AMINO_ACIDS,
                "requirements": [
                    {
                        "type": RequirementType.FOOD,
                        "target": "turkey",
                        "amount": 4,
                        "unit": "oz",
                        "description": "Turkey, chicken, or eggs"
                    },
                    {
                        "type": RequirementType.FOOD,
                        "target": "complex-carbs",
                        "amount": 30,
                        "unit": "g",
                        "description": "Complex carbs to help absorption"
                    }
                ]
            },
            {
                "id": "evening-l1-hydration-taper",
                "title": "Hydration Taper",
                "description": "Reduce fluids to prevent night interruptions",
                "icon": "💤",
                "level": 1,
                "timeWindow": "evening",
                "targetReceptors": ["vasopressin-receptor"],
                "basePoints": 40,
                "category": MissionCategory.HYDRATION,
                "requirements": [
                    {
                        "type": RequirementType.ACTIVITY,
                        "target": "stop-fluids",
                        "amount": 2,
                        "unit": "hours",
                        "description": "Stop large fluid intake 2 hours before bed"
                    }
                ]
            }
        ],
        "level2": [
            {
                "id": "evening-l2-melatonin",
                "title": "Circadian Reset",
                "description": "Support natural melatonin production",
                "icon": "🌃",
                "level": 2,
                "timeWindow": "evening",
                "targetReceptors": ["MT1", "MT2"],
                "basePoints": 80,
                "category": MissionCategory.SPECIAL,
                "requirements": [
                    {
                        "type": RequirementType.ACTIVITY,
                        "target": "dim-lights",
                        "amount": 60,
                        "unit": "min",
                        "description": "Dim lights 1 hour before bed"
                    },
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "melatonin",
                        "amount": 0.5,
                        "unit": "mg",
                        "description": "Low-dose melatonin if needed"
                    }
                ]
            },
            {
                "id": "evening-l2-ashwagandha",
                "title": "Stress Recovery",
                "description": "Adaptogen for cortisol regulation",
                "icon": "🌿",
                "level": 2,
                "timeWindow": "evening",
                "targetReceptors": ["GABA-A", "cortisol-receptor"],
                "basePoints": 90,
                "category": MissionCategory.SPECIAL,
                "requirements": [
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "ashwagandha",
                        "amount": 600,
                        "unit": "mg",
                        "description": "KSM-66 or Sensoril extract"
                    }
                ]
            },
            {
                "id": "evening-l2-casein",
                "title": "Overnight Recovery",
                "description": "Slow-release protein for muscle repair",
                "icon": "🥛",
                "level": 2,
                "timeWindow": "evening",
                "targetReceptors": ["PEPT1", "mTOR"],
                "basePoints": 85,
                "category": MissionCategory.AMINO_ACIDS,
                "requirements": [
                    {
                        "type": RequirementType.FOOD,
                        "target": "casein-protein",
                        "amount": 20,
                        "unit": "g",
                        "description": "Cottage cheese or casein powder"
                    }
                ]
            }
        ],
        "level3": [
            {
                "id": "evening-l3-phosphatidylserine",
                "title": "Cortisol Control",
                "description": "Lower cortisol for better sleep",
                "icon": "🧠",
                "level": 3,
                "timeWindow": "evening",
                "targetReceptors": ["cortisol-receptor", "ACTH-receptor"],
                "basePoints": 110,
                "category": MissionCategory.SPECIAL,
                "requirements": [
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "phosphatidylserine",
                        "amount": 100,
                        "unit": "mg",
                        "description": "PS supplement for cortisol regulation"
                    }
                ]
            },
            {
                "id": "evening-l3-recovery-stack",
                "title": "Elite Recovery Protocol",
                "description": "Complete nighttime recovery stack",
                "icon": "💎",
                "level": 3,
                "timeWindow": "evening",
                "targetReceptors": ["multiple"],
                "basePoints": 150,
                "category": MissionCategory.SPECIAL,
                "requirements": [
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "ZMA",
                        "amount": 1,
                        "unit": "dose",
                        "description": "Zinc, Magnesium, B6 combo"
                    },
                    {
                        "type": RequirementType.SUPPLEMENT,
                        "target": "L-theanine",
                        "amount": 200,
                        "unit": "mg",
                        "description": "For calm focus and relaxation"
                    },
                    {
                        "type": RequirementType.ACTIVITY,
                        "target": "meditation",
                        "amount": 10,
                        "unit": "min",
                        "description": "Evening meditation or breathing"
                    }
                ]
            }
        ]
    }
}
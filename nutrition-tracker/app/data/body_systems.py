from datetime import datetime

BODY_SYSTEMS = {
    "monday": {
        "system": "cardiovascular",
        "title": "Cardiovascular Power Day",
        "goal": "Boost circulation, strengthen heart, improve blood flow",
        "benefit": "Enhanced energy, better workout performance, improved focus",
        "color": "red",
        "emoji": "🫀",
        "targets": [
            {
                "id": "nitrates",
                "name": "Nitrate-rich foods",
                "amount": 2,
                "unit": "servings",
                "examples": ["beets", "spinach", "arugula"],
                "shopping_items": ["organic spinach (2 bags)", "fresh beets (6 medium)", "arugula (1 container)"]
            },
            {
                "id": "omega3",
                "name": "Omega-3 powerhouse",
                "amount": 1,
                "unit": "serving",
                "examples": ["salmon", "walnuts", "chia seeds"],
                "shopping_items": ["wild salmon (2 lbs)", "raw walnuts (1 bag)", "chia seeds (1 bag)"]
            },
            {
                "id": "potassium",
                "name": "Potassium heroes",
                "amount": 2,
                "unit": "servings",
                "examples": ["bananas", "avocados", "sweet potatoes"],
                "shopping_items": ["bananas (1 bunch)", "avocados (6 count)", "sweet potatoes (3 lbs)"]
            }
        ],
        "cannabis_buffers": [
            {
                "id": "dark_berries",
                "name": "Dark berries",
                "amount": 1,
                "unit": "serving",
                "examples": ["blueberries", "pomegranate"],
                "per_session": True,
                "shopping_items": ["blueberries (2 containers)", "pomegranate juice (1 bottle)"]
            },
            {
                "id": "extra_water",
                "name": "Extra water",
                "amount": 1,
                "unit": "glass",
                "per_session": True
            }
        ]
    },
    "tuesday": {
        "system": "detox",
        "title": "Detox & Liver Optimization",
        "goal": "Supercharge your body's filtration and cleansing systems",
        "benefit": "Clearer skin, better digestion, toxin elimination",
        "color": "green",
        "emoji": "🌿",
        "targets": [
            {
                "id": "cruciferous",
                "name": "Cruciferous champions",
                "amount": 2,
                "unit": "servings",
                "examples": ["broccoli", "Brussels sprouts", "kale"],
                "shopping_items": ["broccoli (3 heads)", "Brussels sprouts (2 lbs)", "kale (2 bunches)"]
            },
            {
                "id": "sulfur",
                "name": "Sulfur supporters",
                "amount": 3,
                "unit": "servings",
                "examples": ["garlic", "onions", "eggs"],
                "shopping_items": ["garlic (2 heads)", "yellow onions (3 lbs)", "pasture-raised eggs (18 count)"]
            },
            {
                "id": "bitter",
                "name": "Bitter activators",
                "amount": 1,
                "unit": "serving",
                "examples": ["dandelion greens", "artichokes", "grapefruit"],
                "shopping_items": ["dandelion greens (1 bunch)", "artichokes (4 count)", "grapefruit (4 count)"]
            }
        ],
        "cannabis_buffers": [
            {
                "id": "turmeric",
                "name": "Turmeric",
                "amount": 1,
                "unit": "serving",
                "examples": ["golden milk", "curry"],
                "per_session": True,
                "shopping_items": ["turmeric powder (1 container)", "coconut milk (2 cans)"]
            },
            {
                "id": "extra_water_detox",
                "name": "Extra water",
                "amount": 2,
                "unit": "glasses",
                "per_session": True
            }
        ]
    },
    "wednesday": {
        "system": "immune",
        "title": "Immune Defense Day",
        "goal": "Fortify your body's natural defense systems",
        "benefit": "Stronger immunity, faster recovery, disease prevention",
        "color": "orange",
        "emoji": "🛡️",
        "targets": [
            {
                "id": "vitamin_c",
                "name": "Vitamin C superstars",
                "amount": 3,
                "unit": "servings",
                "examples": ["citrus fruits", "bell peppers", "strawberries"],
                "shopping_items": ["oranges (6 count)", "bell peppers (6 mixed)", "strawberries (2 containers)"]
            },
            {
                "id": "zinc_foods",
                "name": "Zinc warriors",
                "amount": 2,
                "unit": "servings",
                "examples": ["pumpkin seeds", "beef", "chickpeas"],
                "shopping_items": ["pumpkin seeds (1 bag)", "grass-fed beef (2 lbs)", "chickpeas (2 cans)"]
            },
            {
                "id": "probiotics",
                "name": "Probiotic defenders",
                "amount": 1,
                "unit": "serving",
                "examples": ["yogurt", "kefir", "sauerkraut"],
                "shopping_items": ["Greek yogurt (32 oz)", "kefir (1 bottle)", "sauerkraut (1 jar)"]
            }
        ],
        "cannabis_buffers": [
            {
                "id": "ginger",
                "name": "Fresh ginger",
                "amount": 1,
                "unit": "inch",
                "examples": ["ginger tea", "fresh ginger"],
                "per_session": True,
                "shopping_items": ["fresh ginger root (1 large)"]
            }
        ]
    },
    "thursday": {
        "system": "brain",
        "title": "Brain & Cognitive Power",
        "goal": "Optimize mental clarity, memory, and focus",
        "benefit": "Sharper thinking, better memory, enhanced creativity",
        "color": "purple",
        "emoji": "🧠",
        "targets": [
            {
                "id": "dha_foods",
                "name": "DHA brain fuel",
                "amount": 1,
                "unit": "serving",
                "examples": ["fatty fish", "algae", "fish oil"],
                "shopping_items": ["sardines (4 cans)", "mackerel (1 lb)", "algae oil supplement"]
            },
            {
                "id": "antioxidants",
                "name": "Antioxidant protectors",
                "amount": 2,
                "unit": "servings",
                "examples": ["dark chocolate", "green tea", "blueberries"],
                "shopping_items": ["dark chocolate 70%+ (3 bars)", "green tea (1 box)", "blueberries (2 containers)"]
            },
            {
                "id": "choline",
                "name": "Choline boosters",
                "amount": 2,
                "unit": "servings",
                "examples": ["eggs", "liver", "soybeans"],
                "shopping_items": ["pasture-raised eggs (1 dozen)", "chicken liver (1 lb)", "edamame (2 bags)"]
            }
        ],
        "cannabis_buffers": [
            {
                "id": "lions_mane",
                "name": "Lion's mane or adaptogenic mushrooms",
                "amount": 1,
                "unit": "serving",
                "per_session": True,
                "shopping_items": ["lion's mane powder (1 container)"]
            }
        ]
    },
    "friday": {
        "system": "gut",
        "title": "Gut Health & Microbiome Day",
        "goal": "Nourish beneficial bacteria and optimize digestion",
        "benefit": "Better digestion, mood improvement, nutrient absorption",
        "color": "yellow",
        "emoji": "🦠",
        "targets": [
            {
                "id": "fermented",
                "name": "Fermented treasures",
                "amount": 2,
                "unit": "servings",
                "examples": ["kimchi", "kombucha", "tempeh"],
                "shopping_items": ["kimchi (2 jars)", "kombucha (6 bottles)", "tempeh (3 packages)"]
            },
            {
                "id": "prebiotic",
                "name": "Prebiotic feeders",
                "amount": 3,
                "unit": "servings",
                "examples": ["jerusalem artichokes", "leeks", "asparagus"],
                "shopping_items": ["jerusalem artichokes (2 lbs)", "leeks (4 large)", "asparagus (2 bunches)"]
            },
            {
                "id": "bone_broth",
                "name": "Gut healing foods",
                "amount": 1,
                "unit": "serving",
                "examples": ["bone broth", "collagen", "gelatin"],
                "shopping_items": ["bone broth (2 containers)", "collagen powder (1 container)"]
            }
        ],
        "cannabis_buffers": [
            {
                "id": "slippery_elm",
                "name": "Gut soothers",
                "amount": 1,
                "unit": "serving",
                "examples": ["slippery elm tea", "marshmallow root"],
                "per_session": True,
                "shopping_items": ["slippery elm tea (1 box)"]
            }
        ]
    },
    "saturday": {
        "system": "energy",
        "title": "Cellular Energy & Mitochondria",
        "goal": "Boost cellular energy production and vitality",
        "benefit": "Sustained energy, athletic performance, anti-aging",
        "color": "gold",
        "emoji": "⚡",
        "targets": [
            {
                "id": "coq10_foods",
                "name": "CoQ10 sources",
                "amount": 1,
                "unit": "serving",
                "examples": ["organ meats", "sardines", "spinach"],
                "shopping_items": ["grass-fed liver (1 lb)", "sardines (3 cans)", "spinach (2 bags)"]
            },
            {
                "id": "b_complex",
                "name": "B-vitamin complex",
                "amount": 3,
                "unit": "servings",
                "examples": ["nutritional yeast", "whole grains", "legumes"],
                "shopping_items": ["nutritional yeast (1 container)", "quinoa (2 lbs)", "lentils (2 bags)"]
            },
            {
                "id": "magnesium",
                "name": "Magnesium power",
                "amount": 2,
                "unit": "servings",
                "examples": ["dark leafy greens", "pumpkin seeds", "dark chocolate"],
                "shopping_items": ["Swiss chard (2 bunches)", "pumpkin seeds (1 bag)", "dark chocolate (2 bars)"]
            }
        ],
        "cannabis_buffers": [
            {
                "id": "mct_oil",
                "name": "Quick energy",
                "amount": 1,
                "unit": "tablespoon",
                "examples": ["MCT oil", "coconut oil"],
                "per_session": True,
                "shopping_items": ["MCT oil (1 bottle)"]
            }
        ]
    },
    "sunday": {
        "system": "hormone",
        "title": "Hormone Balance & Recovery",
        "goal": "Support healthy hormone production and balance",
        "benefit": "Better mood, improved sleep, balanced energy",
        "color": "pink",
        "emoji": "🌸",
        "targets": [
            {
                "id": "healthy_fats",
                "name": "Hormone-building fats",
                "amount": 3,
                "unit": "servings",
                "examples": ["avocado", "olive oil", "nuts"],
                "shopping_items": ["avocados (6 count)", "extra virgin olive oil (1 bottle)", "mixed nuts (2 bags)"]
            },
            {
                "id": "adaptogenic",
                "name": "Adaptogenic herbs",
                "amount": 1,
                "unit": "serving",
                "examples": ["ashwagandha", "rhodiola", "holy basil"],
                "shopping_items": ["ashwagandha tea (1 box)", "holy basil supplement"]
            },
            {
                "id": "selenium",
                "name": "Selenium sources",
                "amount": 2,
                "unit": "servings",
                "examples": ["Brazil nuts", "mushrooms", "seafood"],
                "shopping_items": ["Brazil nuts (1 bag)", "shiitake mushrooms (1 lb)", "shrimp (1 lb)"]
            }
        ],
        "cannabis_buffers": [
            {
                "id": "chamomile",
                "name": "Calming herbs",
                "amount": 1,
                "unit": "cup",
                "examples": ["chamomile tea", "passionflower"],
                "per_session": True,
                "shopping_items": ["chamomile tea (1 box)"]
            }
        ]
    }
}

def get_today_system():
    """Get today's body system based on day of week"""
    days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    today = datetime.now().weekday()  # 0 = Monday
    return BODY_SYSTEMS[days[today]]

def get_day_system(day_name: str):
    """Get body system for a specific day"""
    return BODY_SYSTEMS.get(day_name.lower())

def get_weekly_shopping_items():
    """Generate complete weekly shopping list from all systems"""
    shopping_items = {
        "produce": set(),
        "proteins": set(),
        "pantry": set(),
        "supplements": set(),
        "beverages": set()
    }
    
    category_keywords = {
        "produce": ["spinach", "beets", "arugula", "bananas", "avocados", "sweet potatoes", 
                   "broccoli", "brussels sprouts", "kale", "garlic", "onions", "berries",
                   "citrus", "peppers", "strawberries", "artichokes", "leeks", "asparagus"],
        "proteins": ["salmon", "beef", "eggs", "chicken", "liver", "sardines", "shrimp", 
                    "tempeh", "chickpeas", "lentils"],
        "pantry": ["walnuts", "chia seeds", "nuts", "seeds", "chocolate", "quinoa", 
                  "nutritional yeast", "oil", "bone broth"],
        "supplements": ["supplement", "powder", "collagen", "ashwagandha"],
        "beverages": ["juice", "kombucha", "tea", "kefir", "milk"]
    }
    
    for day_data in BODY_SYSTEMS.values():
        # Add target items
        for target in day_data["targets"]:
            if "shopping_items" in target:
                for item in target["shopping_items"]:
                    # Categorize item
                    added = False
                    item_lower = item.lower()
                    for category, keywords in category_keywords.items():
                        if any(keyword in item_lower for keyword in keywords):
                            shopping_items[category].add(item)
                            added = True
                            break
                    if not added:
                        shopping_items["pantry"].add(item)
        
        # Add buffer items
        for buffer in day_data["cannabis_buffers"]:
            if "shopping_items" in buffer:
                for item in buffer["shopping_items"]:
                    # Categorize item
                    added = False
                    item_lower = item.lower()
                    for category, keywords in category_keywords.items():
                        if any(keyword in item_lower for keyword in keywords):
                            shopping_items[category].add(item)
                            added = True
                            break
                    if not added:
                        shopping_items["pantry"].add(item)
    
    # Convert sets to sorted lists
    return {category: sorted(list(items)) for category, items in shopping_items.items()}
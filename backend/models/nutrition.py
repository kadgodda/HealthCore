"""Nutrition models for HealthCore."""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum


class BodySystem(str, Enum):
    """Body systems in the nutrition pathway."""
    INTESTINAL = "intestinal"
    HEPATIC = "hepatic"
    CIRCULATORY = "circulatory"
    CELLULAR = "cellular"


class ReceptorType(str, Enum):
    """Types of receptor systems."""
    IRON_ABSORPTION = "iron_absorption"
    CALCIUM_CHANNELS = "calcium_channels"
    B_COMPLEX_NETWORK = "b_complex_network"
    FAT_SOLUBLE_PATHWAY = "fat_soluble_pathway"
    ANTIOXIDANT_SYSTEMS = "antioxidant_systems"
    TRACE_MINERALS = "trace_minerals"


class NutrientInput(BaseModel):
    """Individual nutrient input."""
    name: str
    amount: float
    unit: str
    timing: Optional[datetime] = None


class MealInput(BaseModel):
    """Meal input data."""
    nutrients: List[NutrientInput]
    meal_time: datetime = Field(default_factory=datetime.now)
    meal_type: Optional[str] = None


class ReceptorEfficiency(BaseModel):
    """Receptor efficiency calculation result."""
    receptor_type: ReceptorType
    efficiency_percentage: float
    active_transporters: List[str]
    enhancers: List[str]
    inhibitors: List[str]
    recommendations: List[str]


class SystemStatus(BaseModel):
    """Status of a body system."""
    system: BodySystem
    receptor_clusters: List[ReceptorEfficiency]
    overall_efficiency: float
    bottlenecks: List[str]


class NutritionStatus(BaseModel):
    """Complete nutrition status."""
    timestamp: datetime = Field(default_factory=datetime.now)
    systems: List[SystemStatus]
    optimization_score: float
    daily_insights: List[str]
    meal_recommendations: List[str]
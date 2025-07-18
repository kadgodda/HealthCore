"""Receptor service for managing nutrient receptor data and calculations."""
from typing import Dict, List, Any, Optional
from datetime import datetime
from utils.data_parser import load_receptor_data
from models.nutrition import (
    NutrientInput, 
    ReceptorEfficiency, 
    SystemStatus,
    BodySystem,
    ReceptorType
)


class ReceptorService:
    """Service for managing receptor data and calculating efficiencies."""
    
    def __init__(self):
        self.receptor_data = load_receptor_data()
        
    def get_receptor_status(
        self, 
        nutrients: List[NutrientInput],
        user_id: Optional[str] = None
    ) -> Dict[str, SystemStatus]:
        """Calculate receptor status based on current nutrient inputs."""
        status = {}
        
        # Calculate status for each body system
        for system_key, system_data in self.receptor_data.items():
            receptor_efficiencies = []
            
            # Calculate efficiency for each receptor in the system
            for receptor_key, receptor_info in system_data.get('receptors', {}).items():
                efficiency = self._calculate_receptor_efficiency(
                    receptor_info, 
                    nutrients
                )
                receptor_efficiencies.append(efficiency)
            
            # Create system status
            status[system_key] = SystemStatus(
                system=BodySystem(system_key),
                efficiency=self._calculate_average_efficiency(receptor_efficiencies),
                active_receptors=len(receptor_efficiencies),
                receptor_details=receptor_efficiencies,
                last_updated=datetime.now(),
                notes=self._generate_system_notes(system_key, receptor_efficiencies)
            )
            
        return status
    
    def _calculate_receptor_efficiency(
        self, 
        receptor_info: Dict[str, Any],
        nutrients: List[NutrientInput]
    ) -> ReceptorEfficiency:
        """Calculate efficiency for a single receptor."""
        base_efficiency = 100.0
        enhancer_boost = 0.0
        inhibitor_penalty = 0.0
        
        # Check for enhancers
        enhancers = receptor_info.get('enhancers', [])
        for enhancer in enhancers:
            for nutrient in nutrients:
                if self._matches_nutrient(enhancer['name'], nutrient.name):
                    enhancer_boost += 15.0  # 15% boost per enhancer
                    
        # Check for inhibitors
        inhibitors = receptor_info.get('inhibitors', [])
        for inhibitor in inhibitors:
            for nutrient in nutrients:
                if self._matches_nutrient(inhibitor['name'], nutrient.name):
                    inhibitor_penalty += 20.0  # 20% penalty per inhibitor
                    
        # Calculate final efficiency
        efficiency_percentage = min(
            base_efficiency + enhancer_boost - inhibitor_penalty,
            150.0  # Max 150% efficiency
        )
        efficiency_percentage = max(efficiency_percentage, 20.0)  # Min 20% efficiency
        
        return ReceptorEfficiency(
            receptor_type=ReceptorType.IRON_ABSORPTION 
            if 'iron' in receptor_info.get('primary_receptor', '').lower() 
            else ReceptorType.VITAMIN_D,
            efficiency_percentage=efficiency_percentage,
            limiting_factors=[
                inhibitor['name'] for inhibitor in inhibitors
                if any(self._matches_nutrient(inhibitor['name'], n.name) for n in nutrients)
            ],
            enhancement_factors=[
                enhancer['name'] for enhancer in enhancers
                if any(self._matches_nutrient(enhancer['name'], n.name) for n in nutrients)
            ]
        )
    
    def _matches_nutrient(self, factor_name: str, nutrient_name: str) -> bool:
        """Check if a factor name matches a nutrient name."""
        factor_lower = factor_name.lower()
        nutrient_lower = nutrient_name.lower()
        
        # Direct match
        if factor_lower == nutrient_lower:
            return True
            
        # Common variations
        variations = {
            'vitamin c': ['vitamin-c', 'ascorbic acid', 'ascorbate'],
            'vitamin d': ['vitamin-d', 'vitamin d3', 'd3', 'cholecalciferol'],
            'calcium': ['ca', 'calcium carbonate', 'calcium citrate'],
            'iron': ['fe', 'ferrous', 'ferric'],
            'magnesium': ['mg', 'magnesium glycinate', 'magnesium citrate'],
            'zinc': ['zn', 'zinc picolinate', 'zinc citrate']
        }
        
        for key, values in variations.items():
            if factor_lower in values or nutrient_lower in values:
                if key in factor_lower or key in nutrient_lower:
                    return True
                    
        return False
    
    def _calculate_average_efficiency(
        self, 
        efficiencies: List[ReceptorEfficiency]
    ) -> float:
        """Calculate average efficiency for a system."""
        if not efficiencies:
            return 100.0
            
        total = sum(e.efficiency_percentage for e in efficiencies)
        return total / len(efficiencies)
    
    def _generate_system_notes(
        self, 
        system_key: str,
        efficiencies: List[ReceptorEfficiency]
    ) -> str:
        """Generate notes about system status."""
        avg_efficiency = self._calculate_average_efficiency(efficiencies)
        
        if avg_efficiency >= 120:
            return "System operating at enhanced efficiency"
        elif avg_efficiency >= 90:
            return "System functioning optimally"
        elif avg_efficiency >= 70:
            return "System functioning adequately with room for improvement"
        else:
            return "System efficiency compromised - check limiting factors"
    
    def get_receptor_info(self, receptor_name: str) -> Optional[Dict[str, Any]]:
        """Get detailed information about a specific receptor."""
        for system_data in self.receptor_data.values():
            for receptor_key, receptor_info in system_data.get('receptors', {}).items():
                if receptor_info.get('primary_receptor', '').lower() == receptor_name.lower():
                    return receptor_info
        return None
    
    def get_system_receptors(self, system: str) -> Dict[str, Any]:
        """Get all receptors for a specific body system."""
        if system in self.receptor_data:
            return self.receptor_data[system].get('receptors', {})
        return {}


# Singleton instance
receptor_service = ReceptorService()
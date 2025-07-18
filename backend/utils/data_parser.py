"""Parser for converting receptor mapping markdown to structured data."""
import re
from typing import Dict, List, Any
from pathlib import Path
import json


class ReceptorMappingParser:
    """Parse the complete_receptor_mapping.md file into structured data."""
    
    def __init__(self, markdown_path: Path):
        self.markdown_path = markdown_path
        self.receptor_data = {}
        
    def parse(self) -> Dict[str, Any]:
        """Parse the markdown file and return structured receptor data."""
        with open(self.markdown_path, 'r') as f:
            content = f.read()
            
        # Parse each body system section
        self.receptor_data = {
            'intestinal': self._parse_intestinal_system(content),
            'hepatic': self._parse_hepatic_system(content),
            'circulatory': self._parse_circulatory_system(content),
            'cellular': self._parse_cellular_system(content)
        }
        
        return self.receptor_data
    
    def _parse_intestinal_system(self, content: str) -> Dict[str, Any]:
        """Parse intestinal absorption system data."""
        intestinal_data = {
            'name': 'Intestinal Absorption',
            'icon': '=,',
            'description': 'Nutrient uptake from food through specialized transporters',
            'receptors': {}
        }
        
        # Extract Iron Absorption Complex
        iron_section = self._extract_section(content, 'Iron Absorption Complex', 'Calcium Channel Complex')
        if iron_section:
            intestinal_data['receptors']['iron'] = {
                'primary_receptor': 'DMT1',
                'gene': 'SLC11A2',
                'location': 'Duodenal enterocytes, brush border membrane',
                'substrate': 'Fe2+ (ferrous iron only)',
                'mechanism': 'H+-coupled symport',
                'supporting_proteins': [
                    {'name': 'Dcytb', 'function': 'Reduces Fe3+ to Fe2+'},
                    {'name': 'Hephaestin', 'function': 'Copper-dependent ferroxidase'},
                    {'name': 'Ferroportin', 'function': 'Only iron export protein'},
                    {'name': 'HCP1', 'function': 'Direct heme iron uptake'}
                ],
                'inhibitors': [
                    {'name': 'Calcium', 'mechanism': 'Competes for DMT1 binding'},
                    {'name': 'Zinc', 'mechanism': 'Uses same transporter'},
                    {'name': 'Copper', 'mechanism': 'Shared pathway competition'},
                    {'name': 'Manganese', 'mechanism': 'DMT1 substrate competition'}
                ],
                'enhancers': [
                    {'name': 'Vitamin C', 'mechanism': 'Maintains Fe�z state, enhances Dcytb activity'},
                    {'name': 'Citric acid', 'mechanism': 'Chelation and pH optimization'},
                    {'name': 'Empty stomach', 'mechanism': 'Acidic environment favors Fe�z reduction'},
                    {'name': 'Heme iron', 'mechanism': 'Bypasses competition via HCP1'}
                ]
            }
        
        # Extract Calcium Channel Complex
        calcium_section = self._extract_section(content, 'Calcium Channel Complex', 'B-Vitamin Transport Networks')
        if calcium_section:
            intestinal_data['receptors']['calcium'] = {
                'primary_receptor': 'TRPV6',
                'gene': 'TRPV6',
                'location': 'Small intestine epithelial cells',
                'mechanism': 'Voltage-independent Ca2+ channel',
                'regulation': 'Vitamin D3 (calcitriol) dependent',
                'supporting_proteins': [
                    {'name': 'Calbindin-D9k', 'function': 'Intracellular calcium binding protein'},
                    {'name': 'PMCA1b', 'function': 'Calcium ATPase for extrusion'},
                    {'name': 'NCX1', 'function': 'Na+/Ca2+ exchanger'}
                ],
                'inhibitors': [
                    {'name': 'Magnesium', 'mechanism': 'Competes for TRPV6 binding'},
                    {'name': 'Lead', 'mechanism': 'Toxic metal competition'},
                    {'name': 'Phytates', 'mechanism': 'Chelation and precipitation'},
                    {'name': 'High fiber', 'mechanism': 'Physical binding and reduced bioavailability'}
                ],
                'enhancers': [
                    {'name': 'Vitamin D3', 'mechanism': 'Upregulates TRPV6 expression'},
                    {'name': 'Vitamin K2', 'mechanism': 'Optimizes calcium utilization'},
                    {'name': 'Magnesium', 'mechanism': 'Required for vitamin D activation'},
                    {'name': 'Optimal pH', 'mechanism': 'Acidic environment improves solubility'}
                ]
            }
        
        return intestinal_data
    
    def _parse_hepatic_system(self, content: str) -> Dict[str, Any]:
        """Parse hepatic processing system data."""
        return {
            'name': 'Hepatic Processing',
            'icon': '<�',
            'description': 'Metabolic conversion, storage, and detoxification',
            'receptors': {}
        }
    
    def _parse_circulatory_system(self, content: str) -> Dict[str, Any]:
        """Parse circulatory transport system data."""
        return {
            'name': 'Circulatory Transport',
            'icon': '=�',
            'description': 'Nutrient delivery to tissues via blood and lymphatic systems',
            'receptors': {}
        }
    
    def _parse_cellular_system(self, content: str) -> Dict[str, Any]:
        """Parse cellular utilization system data."""
        return {
            'name': 'Cellular Utilization',
            'icon': '�',
            'description': 'Intracellular nutrient utilization for energy and synthesis',
            'receptors': {}
        }
    
    def _extract_section(self, content: str, start_marker: str, end_marker: str) -> str:
        """Extract a section of text between two markers."""
        start_idx = content.find(start_marker)
        if start_idx == -1:
            return ""
        
        end_idx = content.find(end_marker, start_idx)
        if end_idx == -1:
            return content[start_idx:]
        
        return content[start_idx:end_idx]
    
    def save_to_json(self, output_path: Path):
        """Save parsed data to JSON file."""
        with open(output_path, 'w') as f:
            json.dump(self.receptor_data, f, indent=2)


# Utility function to load receptor data
def load_receptor_data() -> Dict[str, Any]:
    """Load and return parsed receptor data."""
    parser = ReceptorMappingParser(
        Path(__file__).parent.parent.parent / 'data' / 'complete_receptor_mapping.md'
    )
    return parser.parse()
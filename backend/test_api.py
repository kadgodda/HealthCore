"""Test script for the HealthCore API."""
import requests
import json


def test_api():
    """Test the API endpoints."""
    base_url = "http://localhost:8000"
    
    # Test root endpoint
    print("Testing root endpoint...")
    try:
        response = requests.get(f"{base_url}/")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # Test missions endpoint
    print("Testing missions endpoint...")
    try:
        response = requests.get(f"{base_url}/api/missions/morning/1")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # Test game state endpoint
    print("Testing game state endpoint...")
    try:
        response = requests.get(f"{base_url}/api/game/state/test-user")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    test_api()
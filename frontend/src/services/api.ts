/**
 * API Service Layer for HealthCore
 * Handles all communication with the Python backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  private baseUrl: string;
  
  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }
  
  // Generic request handler with retry logic
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {},
    retries: number = 3
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    for (let i = 0; i <= retries; i++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        return response.json();
      } catch (error) {
        // If it's the last retry, throw the error
        if (i === retries) {
          // Check if it's a network error
          if (error instanceof TypeError && error.message === 'Failed to fetch') {
            throw new Error('Unable to connect to backend. Please ensure the API server is running.');
          }
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
    
    throw new Error('Request failed after all retries');
  }
  
  // Mission endpoints
  async getMissions(timeWindow: string, level: number) {
    return this.request(`/api/missions/${timeWindow}/${level}`);
  }
  
  async getAllMissions() {
    return this.request('/api/missions/');
  }
  
  async getMissionById(missionId: string) {
    return this.request(`/api/missions/by-id/${missionId}`);
  }
  
  // Game state endpoints
  async getGameState(userId: string) {
    return this.request(`/api/game/state/${userId}`);
  }
  
  async completeMission(userId: string, missionId: string, completionData: any) {
    return this.request('/api/game/mission-complete', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        mission_id: missionId,
        completion_data: completionData
      })
    });
  }
  
  async levelUp(userId: string, level: number, timeWindow: string) {
    return this.request('/api/game/level-up', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        level,
        time_window: timeWindow
      })
    });
  }
  
  async resetGame(userId: string) {
    return this.request(`/api/game/reset/${userId}`, {
      method: 'POST'
    });
  }
  
  // Receptor endpoints
  async getReceptorStatus(nutrients: any[]) {
    return this.request('/api/receptors/status', {
      method: 'POST',
      body: JSON.stringify({ nutrients })
    });
  }
  
  async getReceptorInfo(receptorName: string) {
    return this.request(`/api/receptors/info/${receptorName}`);
  }
  
  async getSystemReceptors(system: string) {
    return this.request(`/api/receptors/system/${system}`);
  }
  
  async getAllSystems() {
    return this.request('/api/receptors/systems');
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export for testing or custom instances
export { ApiService };
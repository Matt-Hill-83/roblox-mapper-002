interface Team {
  id: string;
  name: string;
  city: string;
  country: string;
  league: string;
  founded: number;
  stadium: string;
  capacity: number;
  coach: string;
  active: boolean;
  created_at: string;
  recordType: string;
}

interface TeamsResponse {
  success: boolean;
  data: Team[];
  count: number;
  error?: string;
}

export const teamService = {
  async getTeams(): Promise<TeamsResponse> {
    try {
      const response = await fetch('/api/teams');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: TeamsResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      return {
        success: false,
        data: [],
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};

export type { Team, TeamsResponse }; 
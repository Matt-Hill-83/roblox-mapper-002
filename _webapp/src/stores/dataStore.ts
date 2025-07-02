import { Person } from '../services/personService';
import { Team } from '../services/teamService';
import { create } from 'zustand';

interface DataState {
  persons: Person[];
  teams: Team[];
  isLoading: boolean;
  error: string | null;
  fetchPersons: () => Promise<void>;
  fetchTeams: () => Promise<void>;
  fetchAllData: () => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  persons: [],
  teams: [],
  isLoading: false,
  error: null,

  fetchPersons: async () => {
    try {
      console.log('DataStore: Starting fetchPersons...');
      set({ isLoading: true, error: null });
      const response = await fetch('/api/persons');
      console.log('DataStore: Response status:', response.status, response.ok);
      if (!response.ok) throw new Error('Failed to fetch persons');
      const responseData = await response.json();
      console.log('DataStore: Response data:', responseData);
      
      // Extract the data array from the API response
      const persons = responseData.success ? responseData.data : [];
      console.log('DataStore: Extracted persons:', persons.length, 'records');
      set({ persons });
    } catch (error) {
      console.error('DataStore: Error in fetchPersons:', error);
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTeams: async () => {
    try {
      console.log('DataStore: Starting fetchTeams...');
      set({ isLoading: true, error: null });
      const response = await fetch('/api/teams');
      console.log('DataStore: Teams response status:', response.status, response.ok);
      if (!response.ok) throw new Error('Failed to fetch teams');
      const responseData = await response.json();
      console.log('DataStore: Teams response data:', responseData);
      
      // Extract the data array from the API response
      const teams = responseData.success ? responseData.data : [];
      console.log('DataStore: Extracted teams:', teams.length, 'records');
      set({ teams });
    } catch (error) {
      console.error('DataStore: Error in fetchTeams:', error);
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAllData: async () => {
    console.log('DataStore: Starting fetchAllData...');
    const { fetchPersons, fetchTeams } = get();
    await Promise.all([fetchPersons(), fetchTeams()]);
    console.log('DataStore: fetchAllData completed');
  },
})); 
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
      set({ isLoading: true, error: null });
      const response = await fetch('/api/persons');
      if (!response.ok) throw new Error('Failed to fetch persons');
      const persons = await response.json();
      set({ persons });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTeams: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/teams');
      if (!response.ok) throw new Error('Failed to fetch teams');
      const teams = await response.json();
      set({ teams });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAllData: async () => {
    const { fetchPersons, fetchTeams } = get();
    await Promise.all([fetchPersons(), fetchTeams()]);
  },
})); 
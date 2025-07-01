interface Person {
  id: string;
  name: string;
  email: string;
  age: number;
  department: string;
  salary: number;
  active: boolean;
  created_at: string;
}

interface PersonsResponse {
  success: boolean;
  data: Person[];
  count: number;
  error?: string;
}

export const personService = {
  async getPersons(): Promise<PersonsResponse> {
    try {
      const response = await fetch('/api/persons');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: PersonsResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch persons:', error);
      return {
        success: false,
        data: [],
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};

export type { Person, PersonsResponse }; 
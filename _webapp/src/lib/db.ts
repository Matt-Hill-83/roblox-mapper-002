import Database from 'better-sqlite3';
import path from 'path';

// Path to the existing SQLite database
const dbPath = path.join(process.cwd(), '..', 'sports-data.db');

let db: Database.Database | null = null;

function getDatabase() {
  if (!db) {
    try {
      db = new Database(dbPath);
      console.log('Connected to SQLite database:', dbPath);
    } catch (error) {
      console.error('Failed to connect to database:', error);
      throw error;
    }
  }
  return db;
}

export interface DatabasePerson {
  guid: string;
  type: string;
  name: string;
  data: string; // JSON string
  created_at?: string;
}

export interface ParsedPersonData {
  gender?: string;
  age?: number;
  hairColor?: string;
  hat?: boolean;
  brandSponsor?: string | null;
  birthCountry?: string;
  residenceCountry?: string;
  nickname?: string | null;
  position?: string;
  skill_level?: number;
  salary?: number;
  jersey_number?: number;
}

export interface Person {
  id: string;
  name: string;
  email: string;
  age: number;
  department: string;
  salary: number;
  active: boolean;
  created_at: string;
  recordType: string;
  // Additional fields from database
  gender?: string;
  position?: string;
  skill_level?: number;
  jersey_number?: number;
  birthCountry?: string;
  residenceCountry?: string;
}

export function getPersons(): Person[] {
  try {
    const database = getDatabase();
    
    // Query persons from the entities table
    const stmt = database.prepare("SELECT * FROM entities WHERE type = 'person' LIMIT 50");
    const results = stmt.all() as DatabasePerson[];
    
    console.log(`Found ${results.length} persons in database`);
    
    // Transform database records to Person format
    const persons: Person[] = results.map((row) => {
      let parsedData: ParsedPersonData = {};
      
      try {
        parsedData = JSON.parse(row.data);
      } catch (error) {
        console.warn(`Failed to parse data for person ${row.name}:`, error);
      }
      
      return {
        id: row.guid,
        name: row.name,
        email: `${row.name.toLowerCase().replace(/\s+/g, '.')}@company.com`,
        age: parsedData.age || 25,
        department: parsedData.position || 'Sports',
        salary: parsedData.salary || 50000,
        active: true,
        created_at: row.created_at || new Date().toISOString(),
        recordType: 'person',
        // Additional fields
        gender: parsedData.gender,
        position: parsedData.position,
        skill_level: parsedData.skill_level,
        jersey_number: parsedData.jersey_number,
        birthCountry: parsedData.birthCountry,
        residenceCountry: parsedData.residenceCountry
      };
    });
    
    return persons;
  } catch (error) {
    console.error('Error querying persons from database:', error);
    return [];
  }
}

// Clean up database connection on process exit
process.on('exit', () => {
  if (db) {
    db.close();
  }
}); 
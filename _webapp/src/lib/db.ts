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

export interface GraphConfig {
  uuid: string;
  name: string;
  description: string;
  config_data: string; // JSON string of TestDataConfig
  is_favorite: boolean;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface TestDataConfig {
  numberOfNodes: number;
  numberOfConnectedChains: number;
  depthOfLongestChain: number;
  totalNodes: number;
  maxDepth: number;
  branchingMin: number;
  branchingMax: number;
  crossTreeConnections: number;
  entityTypes: number;
  clusteringCoeff: number;
  hubNodes: number;
  networkDensity: 'sparse' | 'medium' | 'dense';
}

// Initialize graph_configs table if it doesn't exist
function initializeGraphConfigsTable() {
  const database = getDatabase();
  
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS graph_configs (
      uuid TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      config_data TEXT NOT NULL,
      is_favorite BOOLEAN DEFAULT FALSE,
      is_system BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  try {
    database.exec(createTableSQL);
    console.log('Graph configs table initialized');
  } catch (error) {
    console.error('Error creating graph_configs table:', error);
    throw error;
  }
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

// Graph configuration functions
export function getGraphConfigs(): GraphConfig[] {
  try {
    const database = getDatabase();
    initializeGraphConfigsTable();
    
    const stmt = database.prepare(`
      SELECT * FROM graph_configs 
      ORDER BY is_favorite DESC, is_system ASC, created_at DESC
    `);
    const results = stmt.all() as GraphConfig[];
    
    console.log(`Found ${results.length} graph configurations`);
    return results;
  } catch (error) {
    console.error('Error querying graph configurations:', error);
    return [];
  }
}

export function saveGraphConfig(config: Omit<GraphConfig, 'created_at' | 'updated_at'>): GraphConfig {
  try {
    const database = getDatabase();
    initializeGraphConfigsTable();
    
    const now = new Date().toISOString();
    const stmt = database.prepare(`
      INSERT OR REPLACE INTO graph_configs 
      (uuid, name, description, config_data, is_favorite, is_system, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      config.uuid,
      config.name,
      config.description,
      config.config_data,
      config.is_favorite ? 1 : 0,
      config.is_system ? 1 : 0,
      now,
      now
    );
    
    console.log(`Saved graph configuration: ${config.name}`);
    
    return {
      ...config,
      created_at: now,
      updated_at: now
    };
  } catch (error) {
    console.error('Error saving graph configuration:', error);
    throw error;
  }
}

export function toggleFavoriteGraphConfig(uuid: string): boolean {
  try {
    const database = getDatabase();
    initializeGraphConfigsTable();
    
    const stmt = database.prepare(`
      UPDATE graph_configs 
      SET is_favorite = NOT is_favorite, updated_at = ? 
      WHERE uuid = ?
    `);
    
    const result = stmt.run(new Date().toISOString(), uuid);
    
    if (result.changes === 0) {
      throw new Error(`Graph configuration with UUID ${uuid} not found`);
    }
    
    // Return the new favorite status
    const getStmt = database.prepare('SELECT is_favorite FROM graph_configs WHERE uuid = ?');
    const row = getStmt.get(uuid) as { is_favorite: number };
    
    console.log(`Toggled favorite status for configuration: ${uuid}`);
    return Boolean(row.is_favorite);
  } catch (error) {
    console.error('Error toggling favorite status:', error);
    throw error;
  }
}

export function deleteGraphConfig(uuid: string): boolean {
  try {
    const database = getDatabase();
    
    const stmt = database.prepare('DELETE FROM graph_configs WHERE uuid = ?');
    const result = stmt.run(uuid);
    
    console.log(`Deleted graph configuration: ${uuid}`);
    return result.changes > 0;
  } catch (error) {
    console.error('Error deleting graph configuration:', error);
    throw error;
  }
}

// Clean up database connection on process exit
process.on('exit', () => {
  if (db) {
    db.close();
  }
}); 
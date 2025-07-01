// Base entity interface that all entities extend
export interface BaseEntity {
  guid: string;
  name: string;
  creation_timestamp?: string;
  creation_source?: string;
}

// Person entity schema
export interface PersonEntity extends BaseEntity {
  type: 'person';
  gender: 'male' | 'female' | 'other';
  age: number;
  hairColor: 'black' | 'brown' | 'blonde' | 'red' | 'gray' | 'bald';
  hat: boolean;
  brandSponsor: string | null;
  birthCountry: string;
  residenceCountry: string;
  nickname: string | null;
  position: 'forward' | 'midfielder' | 'defender' | 'goalkeeper';
  skill_level: number;
  salary: number;
  jersey_number: number;
}

// Team entity schema
export interface TeamEntity extends BaseEntity {
  type: 'team';
  city: string;
  owner: string | null;
  stadium: string;
  color: 'red' | 'blue' | 'green' | 'yellow' | 'black' | 'white' | 'purple' | 'orange';
  founded_year: number;
  league: string;
  budget: number;
}

// City entity schema
export interface CityEntity extends BaseEntity {
  type: 'city';
  province: string;
  country: string;
  continent: string;
  population: number;
  timezone: string;
}

// Relationship entity schema
export interface RelationshipEntity {
  id?: number;
  guid: string;
  type: string;
  source_guid: string;
  target_guid: string;
  properties: Record<string, any>;
  created_at?: string;
}

// Union type for all entity types
export type AnyEntity = PersonEntity | TeamEntity | CityEntity;

// Database record structure (how entities are stored in SQLite)
export interface EntityRecord {
  guid: string;
  type: string;
  name: string;
  data: string; // JSON string of entity-specific data
  created_at?: string;
}

// Constants for validation
export const HAIR_COLORS = ['black', 'brown', 'blonde', 'red', 'gray', 'bald'] as const;
export const GENDERS = ['male', 'female', 'other'] as const;
export const POSITIONS = ['forward', 'midfielder', 'defender', 'goalkeeper'] as const;
export const TEAM_COLORS = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'purple', 'orange'] as const;

// Validation functions
export function isValidPersonEntity(obj: any): obj is PersonEntity {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.guid === 'string' &&
    typeof obj.name === 'string' &&
    obj.type === 'person' &&
    GENDERS.includes(obj.gender) &&
    typeof obj.age === 'number' &&
    obj.age >= 18 && obj.age <= 45 &&
    HAIR_COLORS.includes(obj.hairColor) &&
    typeof obj.hat === 'boolean' &&
    (obj.brandSponsor === null || typeof obj.brandSponsor === 'string') &&
    typeof obj.birthCountry === 'string' &&
    typeof obj.residenceCountry === 'string' &&
    (obj.nickname === null || typeof obj.nickname === 'string') &&
    POSITIONS.includes(obj.position) &&
    typeof obj.skill_level === 'number' &&
    obj.skill_level >= 60 && obj.skill_level <= 95 &&
    typeof obj.salary === 'number' &&
    obj.salary >= 50000 && obj.salary <= 5000000 &&
    typeof obj.jersey_number === 'number' &&
    obj.jersey_number >= 1 && obj.jersey_number <= 99
  );
}

export function isValidTeamEntity(obj: any): obj is TeamEntity {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.guid === 'string' &&
    typeof obj.name === 'string' &&
    obj.type === 'team' &&
    typeof obj.city === 'string' &&
    (obj.owner === null || typeof obj.owner === 'string') &&
    typeof obj.stadium === 'string' &&
    TEAM_COLORS.includes(obj.color) &&
    typeof obj.founded_year === 'number' &&
    obj.founded_year >= 1900 && obj.founded_year <= 2020 &&
    typeof obj.league === 'string' &&
    typeof obj.budget === 'number' &&
    obj.budget >= 10000000 && obj.budget <= 500000000
  );
}

export function isValidCityEntity(obj: any): obj is CityEntity {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.guid === 'string' &&
    typeof obj.name === 'string' &&
    obj.type === 'city' &&
    typeof obj.province === 'string' &&
    typeof obj.country === 'string' &&
    typeof obj.continent === 'string' &&
    typeof obj.population === 'number' &&
    obj.population >= 100000 && obj.population <= 10000000 &&
    typeof obj.timezone === 'string'
  );
} 
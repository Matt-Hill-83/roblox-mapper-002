import { Person } from "./types/person.interface";
import { Country } from "./types/country.interface";
import { PersonGenerator } from "./generators/personGenerator";
import { CountryGenerator } from "./generators/countryGenerator";

export class DataGeneratorService {
  private personGenerator: PersonGenerator;
  private countryGenerator: CountryGenerator;
  
  constructor() {
    this.personGenerator = new PersonGenerator();
    this.countryGenerator = new CountryGenerator();
  }
  
  generateData(personCount: number, countryCount: number): { persons: Person[], countries: Country[] } {
    print(`Generating ${countryCount} countries...`);
    const countries = this.countryGenerator.generateMultipleCountries(countryCount);
    
    print(`Generating ${personCount} people...`);
    const countryNames = countries.map(c => c.name);
    const persons: Person[] = [];
    
    for (let i = 0; i < personCount; i++) {
      // Pass country names to ensure people reference existing countries
      persons.push(this.personGenerator.generatePerson(undefined, countryNames));
    }
    
    return {
      persons,
      countries
    };
  }
  
  generateRelationships(persons: Person[]): { person1: string; person2: string; type: string }[] {
    const relationships: { person1: string; person2: string; type: string }[] = [];
    const relationshipTypes = ["friend", "colleague", "family", "neighbor", "mentor"];
    
    // Generate some random relationships
    const numRelationships = math.floor(persons.size() * 1.5); // Average 1.5 relationships per person
    
    for (let i = 0; i < numRelationships; i++) {
      const person1Idx = math.floor(math.random() * persons.size());
      let person2Idx = math.floor(math.random() * persons.size());
      
      // Ensure different people
      while (person2Idx === person1Idx) {
        person2Idx = math.floor(math.random() * persons.size());
      }
      
      relationships.push({
        person1: persons[person1Idx].guid,
        person2: persons[person2Idx].guid,
        type: relationshipTypes[math.floor(math.random() * relationshipTypes.size())]
      });
    }
    
    return relationships;
  }

  writeDataFile(data: { persons: Person[], countries: Country[] }): void {
    // This will be implemented in T2.3
    print("Writing data to file...");
    print(`- ${data.persons.size()} persons`);
    print(`- ${data.countries.size()} countries`);
  }
  
  // Generate sample data with relationships
  generateSampleData(): { 
    persons: Person[]; 
    countries: Country[]; 
    relationships: { person1: string; person2: string; type: string }[] 
  } {
    const data = this.generateData(50, 20); // 50 people, 20 countries
    const relationships = this.generateRelationships(data.persons);
    
    return {
      ...data,
      relationships
    };
  }
}
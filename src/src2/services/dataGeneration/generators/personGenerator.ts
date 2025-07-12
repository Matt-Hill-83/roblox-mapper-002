import { Person } from "../types/person.interface";
import { DATA_POOLS, getRandomItem, generateGuid } from "../data/dataPools";

export class PersonGenerator {
  generatePerson(guid?: string, countryNames?: string[]): Person {
    // Use provided GUID or generate a new one
    const personGuid = guid || generateGuid();
    
    // Use provided countries or use from data pool
    const availableCountries = countryNames && countryNames.size() > 0 
      ? countryNames 
      : DATA_POOLS.COUNTRIES;
    
    // Generate random person data
    return {
      guid: personGuid,
      firstName: getRandomItem(DATA_POOLS.FIRST_NAMES),
      lastName: getRandomItem(DATA_POOLS.LAST_NAMES),
      country: getRandomItem(availableCountries),
      petType: getRandomItem(DATA_POOLS.PET_TYPES),
      countryLivesIn: getRandomItem(availableCountries),
      countryBornIn: getRandomItem(availableCountries),
      countryWorksIn: getRandomItem(availableCountries)
    };
  }
  
  generateMultiplePeople(count: number): Person[] {
    const people: Person[] = [];
    for (let i = 0; i < count; i++) {
      people.push(this.generatePerson());
    }
    return people;
  }
}
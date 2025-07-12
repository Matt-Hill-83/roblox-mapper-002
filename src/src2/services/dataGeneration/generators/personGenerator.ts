import { Person } from "../types/person.interface";

export class PersonGenerator {
  generatePerson(guid: string, countryNames: string[]): Person {
    // Placeholder implementation
    return {
      guid,
      firstName: "John",
      lastName: "Doe",
      country: "USA",
      petType: "Dog",
      countryLivesIn: countryNames[0] || "USA",
      countryBornIn: countryNames[0] || "USA", 
      countryWorksIn: countryNames[0] || "USA"
    };
  }
}
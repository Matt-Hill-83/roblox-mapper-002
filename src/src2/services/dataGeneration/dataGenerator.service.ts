import { Person } from "./types/person.interface";
import { Country } from "./types/country.interface";

export class DataGeneratorService {
  generateData(personCount: number, countryCount: number): { persons: Person[], countries: Country[] } {
    // Placeholder implementation
    return {
      persons: [],
      countries: []
    };
  }

  writeDataFile(data: { persons: Person[], countries: Country[] }): void {
    // Placeholder implementation
    print("Writing data to file...");
  }
}
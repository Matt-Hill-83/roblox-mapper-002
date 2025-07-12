import { Country } from "../types/country.interface";

export class CountryGenerator {
  generateCountry(guid: string, name: string): Country {
    // Placeholder implementation
    return {
      guid,
      name,
      isSunny: math.random() > 0.5,
      isWarm: math.random() > 0.5,
      happiness: math.floor(math.random() * 10) + 1,
      expensive: math.floor(math.random() * 10) + 1
    };
  }
}
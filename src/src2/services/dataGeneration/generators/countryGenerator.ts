import { Country } from "../types/country.interface";
import { DATA_POOLS, getRandomItem, generateGuid } from "../data/dataPools";

export class CountryGenerator {
  // Weather patterns for different regions/climates
  private readonly COUNTRY_PROFILES: { [key: string]: { sunny: boolean; warm: boolean; happiness: [number, number]; expensive: [number, number] } } = {
    // Tropical countries
    tropical: { sunny: true, warm: true, happiness: [6, 9], expensive: [3, 7] },
    // Mediterranean countries
    mediterranean: { sunny: true, warm: true, happiness: [7, 9], expensive: [5, 8] },
    // Northern European countries
    northern: { sunny: false, warm: false, happiness: [8, 10], expensive: [7, 10] },
    // Temperate countries
    temperate: { sunny: true, warm: false, happiness: [6, 8], expensive: [5, 8] },
    // Desert countries
    desert: { sunny: true, warm: true, happiness: [5, 7], expensive: [4, 9] },
  };
  
  private getCountryProfile(name: string): { sunny: boolean; warm: boolean; happiness: [number, number]; expensive: [number, number] } {
    // Simple mapping based on real country characteristics
    const profileMap: { [key: string]: string } = {
      // Tropical
      "Brazil": "tropical", "Thailand": "tropical", "Indonesia": "tropical",
      "Philippines": "tropical", "Malaysia": "tropical", "Singapore": "tropical",
      "Costa Rica": "tropical", "Ecuador": "tropical", "Colombia": "tropical",
      
      // Mediterranean
      "Spain": "mediterranean", "Italy": "mediterranean", "Greece": "mediterranean",
      "Portugal": "mediterranean", "Croatia": "mediterranean", "Morocco": "mediterranean",
      
      // Northern
      "Norway": "northern", "Sweden": "northern", "Denmark": "northern",
      "Finland": "northern", "Iceland": "northern", "Estonia": "northern",
      
      // Desert
      "United Arab Emirates": "desert", "Saudi Arabia": "desert", "Egypt": "desert",
      "Israel": "desert",
      
      // Default to temperate
    };
    
    const profileType = profileMap[name] || "temperate";
    return this.COUNTRY_PROFILES[profileType];
  }
  
  private randomInRange(min: number, max: number): number {
    return math.floor(math.random() * (max - min + 1)) + min;
  }
  
  generateCountry(guid?: string, name?: string): Country {
    const countryGuid = guid || generateGuid();
    const countryName = name || getRandomItem(DATA_POOLS.COUNTRIES);
    const profile = this.getCountryProfile(countryName);
    
    return {
      guid: countryGuid,
      name: countryName,
      isSunny: profile.sunny,
      isWarm: profile.warm,
      happiness: this.randomInRange(profile.happiness[0], profile.happiness[1]),
      expensive: this.randomInRange(profile.expensive[0], profile.expensive[1])
    };
  }
  
  generateMultipleCountries(count: number): Country[] {
    const countries: Country[] = [];
    const usedNames = new Set<string>();
    
    for (let i = 0; i < count && i < DATA_POOLS.COUNTRIES.size(); i++) {
      let countryName: string;
      do {
        countryName = getRandomItem(DATA_POOLS.COUNTRIES);
      } while (usedNames.has(countryName));
      
      usedNames.add(countryName);
      countries.push(this.generateCountry(undefined, countryName));
    }
    
    return countries;
  }
}
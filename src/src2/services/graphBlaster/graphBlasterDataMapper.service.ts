import { Person } from "../dataGeneration/types/person.interface";

export interface PropertyMapping {
  property: string;
  values: string[]; // Top 5 values + "Other"
  valueToIndex: Map<string, number>;
}

export interface GraphBlasterConfig {
  xAxis: PropertyMapping;
  yAxis: PropertyMapping;
  zAxis: PropertyMapping;
  uniqueCounts: {
    x: number;
    y: number;
    z: number;
  };
}

export class GraphBlasterDataMapperService {
  private config?: GraphBlasterConfig;

  /**
   * Analyzes person data to find the top 5 most common values for each property
   */
  public analyzeData(persons: Person[]): GraphBlasterConfig {
    // Count occurrences of each property value
    const petTypeCounts = new Map<string, number>();
    const countryLivesInCounts = new Map<string, number>();
    const countryCounts = new Map<string, number>();

    persons.forEach((person) => {
      // Count pet types
      const petCount = petTypeCounts.get(person.petType) || 0;
      petTypeCounts.set(person.petType, petCount + 1);

      // Count countries lived in
      const livesCount = countryLivesInCounts.get(person.countryLivesIn) || 0;
      countryLivesInCounts.set(person.countryLivesIn, livesCount + 1);

      // Count countries
      const countryCount = countryCounts.get(person.country) || 0;
      countryCounts.set(person.country, countryCount + 1);
    });

    // Get all unique values (not just top 5)
    const allPetTypes = this.getAllValues(petTypeCounts);
    const allCountriesLivesIn = this.getAllValues(countryLivesInCounts);
    const allCountries = this.getAllValues(countryCounts);

    // Create mappings with all values
    this.config = {
      xAxis: this.createPropertyMapping("petType", allPetTypes),
      yAxis: this.createPropertyMapping("countryLivesIn", allCountriesLivesIn),
      zAxis: this.createPropertyMapping("country", allCountries),
      uniqueCounts: {
        x: allPetTypes.size(),
        y: allCountriesLivesIn.size(),
        z: allCountries.size(),
      },
    };

    // Print analysis results
    print("=== GraphBlaster Data Analysis ===");
    print(`Unique Pet Types: ${allPetTypes.size()} - ${allPetTypes.join(", ")}`);
    print(`Unique Countries (Lives In): ${allCountriesLivesIn.size()} - ${allCountriesLivesIn.join(", ")}`);
    print(`Unique Countries: ${allCountries.size()} - ${allCountries.join(", ")}`);

    return this.config;
  }

  /**
   * Gets all unique values from a count map, sorted by frequency
   */
  private getAllValues(counts: Map<string, number>): string[] {
    const entries: [string, number][] = [];
    counts.forEach((count, value) => {
      entries.push([value, count]);
    });

    // Sort by count descending
    table.sort(entries, (a, b) => b[1] > a[1]);

    // Return all values
    const allValues: string[] = [];
    entries.forEach(entry => {
      allValues.push(entry[0]);
    });

    return allValues;
  }


  /**
   * Creates a property mapping with value-to-index lookup
   */
  private createPropertyMapping(property: string, allValues: string[]): PropertyMapping {
    const valueToIndex = new Map<string, number>();

    // Map all values to indices
    allValues.forEach((value, index) => {
      valueToIndex.set(value, index);
    });

    return {
      property,
      values: allValues,
      valueToIndex,
    };
  }

  /**
   * Maps a person to their 3D grid position
   */
  public getPersonPosition(person: Person): Vector3 {
    if (!this.config) {
      error("GraphBlasterDataMapperService not initialized. Call analyzeData first.");
    }

    const x = this.getAxisIndex(person.petType, this.config.xAxis);
    const y = this.getAxisIndex(person.countryLivesIn, this.config.yAxis);
    const z = this.getAxisIndex(person.country, this.config.zAxis);

    return new Vector3(x, y, z);
  }

  /**
   * Gets the grid index for a value on a specific axis
   */
  private getAxisIndex(value: string, axis: PropertyMapping): number {
    const index = axis.valueToIndex.get(value);
    if (index !== undefined) {
      return index;
    }
    // This shouldn't happen since we're mapping all values now
    error(`Value "${value}" not found in axis mapping`);
  }

  /**
   * Gets the current configuration
   */
  public getConfig(): GraphBlasterConfig | undefined {
    return this.config;
  }
}
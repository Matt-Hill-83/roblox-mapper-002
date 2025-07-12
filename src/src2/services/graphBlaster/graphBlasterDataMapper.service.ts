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

    // Get top 5 for each property
    const topPetTypes = this.getTopValues(petTypeCounts, 5);
    const topCountriesLivesIn = this.getTopValues(countryLivesInCounts, 5);
    const topCountries = this.getTopValues(countryCounts, 5);

    // Create mappings
    this.config = {
      xAxis: this.createPropertyMapping("petType", topPetTypes),
      yAxis: this.createPropertyMapping("countryLivesIn", topCountriesLivesIn),
      zAxis: this.createPropertyMapping("country", topCountries),
    };

    // Print analysis results
    print("=== GraphBlaster Data Analysis ===");
    print(`Top 5 Pet Types: ${topPetTypes.join(", ")}`);
    print(`Top 5 Countries (Lives In): ${topCountriesLivesIn.join(", ")}`);
    print(`Top 5 Countries: ${topCountries.join(", ")}`);

    return this.config;
  }

  /**
   * Gets the top N values from a count map
   */
  private getTopValues(counts: Map<string, number>, topN: number): string[] {
    const entries: [string, number][] = [];
    counts.forEach((count, value) => {
      entries.push([value, count]);
    });

    // Sort by count descending
    table.sort(entries, (a, b) => b[1] > a[1]);

    // Get top N values
    const topValues: string[] = [];
    for (let i = 0; i < math.min(topN, entries.size()); i++) {
      topValues.push(entries[i][0]);
    }

    return topValues;
  }

  /**
   * Creates a property mapping with value-to-index lookup
   */
  private createPropertyMapping(property: string, topValues: string[]): PropertyMapping {
    const valueToIndex = new Map<string, number>();
    const values = [...topValues, "Other"];

    // Map top values to indices 0-4
    topValues.forEach((value, index) => {
      valueToIndex.set(value, index);
    });

    return {
      property,
      values,
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
    // If not in top 5, return index for "Other" (last position)
    return axis.values.size() - 1;
  }

  /**
   * Gets the current configuration
   */
  public getConfig(): GraphBlasterConfig | undefined {
    return this.config;
  }
}
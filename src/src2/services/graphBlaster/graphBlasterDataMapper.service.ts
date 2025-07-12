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
  private xProperty = "petType";
  private yProperty = "countryLivesIn";
  private zProperty = "country";
  private personsData?: Person[];

  /**
   * Set property mapping for axes
   */
  public setPropertyMapping(xProp: string, yProp: string, zProp: string): void {
    this.xProperty = xProp;
    this.yProperty = yProp;
    this.zProperty = zProp;
    
    // Re-analyze data with new properties if we have persons data
    if (this.personsData) {
      this.analyzeData(this.personsData);
    }
  }

  /**
   * Analyzes person data to find the top 5 most common values for each property
   */
  public analyzeData(persons: Person[]): GraphBlasterConfig {
    // Store persons data for re-analysis
    this.personsData = persons;
    
    // Count occurrences of each property value based on current axis mapping
    const xCounts = new Map<string, number>();
    const yCounts = new Map<string, number>();
    const zCounts = new Map<string, number>();

    persons.forEach((person) => {
      // Get values based on current property mapping
      const xValue = this.getPropertyValue(person, this.xProperty);
      const yValue = this.getPropertyValue(person, this.yProperty);
      const zValue = this.getPropertyValue(person, this.zProperty);

      // Count X axis property
      const xCount = xCounts.get(xValue) || 0;
      xCounts.set(xValue, xCount + 1);

      // Count Y axis property
      const yCount = yCounts.get(yValue) || 0;
      yCounts.set(yValue, yCount + 1);

      // Count Z axis property
      const zCount = zCounts.get(zValue) || 0;
      zCounts.set(zValue, zCount + 1);
    });

    // Get all unique values (not just top 5)
    const allXValues = this.getAllValues(xCounts);
    const allYValues = this.getAllValues(yCounts);
    const allZValues = this.getAllValues(zCounts);

    // Create mappings with all values
    this.config = {
      xAxis: this.createPropertyMapping(this.xProperty, allXValues),
      yAxis: this.createPropertyMapping(this.yProperty, allYValues),
      zAxis: this.createPropertyMapping(this.zProperty, allZValues),
      uniqueCounts: {
        x: allXValues.size(),
        y: allYValues.size(),
        z: allZValues.size(),
      },
    };

    // Print analysis results
    print("=== GraphBlaster Data Analysis ===");
    print(`X Axis (${this.xProperty}): ${allXValues.size()} unique values`);
    print(`Y Axis (${this.yProperty}): ${allYValues.size()} unique values`);
    print(`Z Axis (${this.zProperty}): ${allZValues.size()} unique values`);

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
   * Gets property value from person based on property name
   */
  private getPropertyValue(person: Person, property: string): string {
    // Handle known properties explicitly
    let value: unknown;
    
    switch (property) {
      case "petType":
        value = person.petType;
        break;
      case "countryLivesIn":
        value = person.countryLivesIn;
        break;
      case "country":
        value = person.country;
        break;
      case "firstName":
        value = person.firstName;
        break;
      case "lastName":
        value = person.lastName;
        break;
      case "guid":
        value = person.guid;
        break;
      case "countryBornIn":
        value = person.countryBornIn;
        break;
      case "countryWorksIn":
        value = person.countryWorksIn;
        break;
      default:
        warn(`Unknown property "${property}" requested`);
        return "Unknown";
    }
    
    if (value === undefined) {
      warn(`Property "${property}" is undefined on person object`);
      return "Unknown";
    }
    
    return tostring(value);
  }

  /**
   * Maps a person to their 3D grid position
   */
  public getPersonPosition(person: Person): Vector3 {
    if (!this.config) {
      error("GraphBlasterDataMapperService not initialized. Call analyzeData first.");
    }

    const xValue = this.getPropertyValue(person, this.xProperty);
    const yValue = this.getPropertyValue(person, this.yProperty);
    const zValue = this.getPropertyValue(person, this.zProperty);

    const x = this.getAxisIndex(xValue, this.config.xAxis);
    const y = this.getAxisIndex(yValue, this.config.yAxis);
    const z = this.getAxisIndex(zValue, this.config.zAxis);

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
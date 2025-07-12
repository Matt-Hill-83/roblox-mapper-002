import { DataGeneratorService } from "../dataGeneration/dataGenerator.service";
import { Person } from "../dataGeneration/types/person.interface";
import { TEMP_HARNESS_TEST_DATA } from "../../../shared/data/tempHarnessTestData";
import { TEMP_HARNESS_LINKS } from "../../../shared/data/tempHarnessLinks";

export type DataSourceType = "fake" | "harness";

interface Relationship {
  person1: string;
  person2: string;
  type: string;
}

interface GraphBlasterData {
  persons: Person[];
  relationships: Relationship[];
}

/**
 * Service to manage different data sources for GraphBlaster
 */
export class GraphBlasterDataSourceService {
  private dataGenerator: DataGeneratorService;
  private currentSource: DataSourceType = "fake";
  
  constructor() {
    this.dataGenerator = new DataGeneratorService();
  }
  
  /**
   * Get current data source type
   */
  public getCurrentSource(): DataSourceType {
    return this.currentSource;
  }
  
  /**
   * Set data source type
   */
  public setDataSource(source: DataSourceType): void {
    this.currentSource = source;
    print(`GraphBlaster data source changed to: ${source}`);
  }
  
  /**
   * Get data based on current source
   */
  public getData(): GraphBlasterData {
    switch (this.currentSource) {
      case "fake":
        return this.dataGenerator.generateSampleData();
      case "harness":
        return this.convertHarnessData();
      default:
        error(`Unknown data source: ${this.currentSource}`);
    }
  }
  
  /**
   * Convert harness data to GraphBlaster format
   */
  private convertHarnessData(): GraphBlasterData {
    const persons: Person[] = [];
    const relationships: Relationship[] = [];
    
    // Convert harness files to persons
    // Use only first 100 files to match the fake data size
    const filesToUse = math.min(100, TEMP_HARNESS_TEST_DATA.size());
    
    for (let i = 0; i < filesToUse; i++) {
      const file = TEMP_HARNESS_TEST_DATA[i];
      
      // Create person from harness file data
      const person: Person = {
        guid: `harness_node_${i + 1}`, // Match the node IDs used in links
        firstName: file.component,
        lastName: file.service,
        country: file.language, // Map language to country for visualization
        petType: file.type, // Map file type to petType
        countryLivesIn: file.service, // Map service to countryLivesIn
        countryBornIn: file.resourceDomain,
        countryWorksIn: file.operationType
      };
      
      persons.push(person);
    }
    
    // Convert harness links to relationships
    // Filter links to only include those between our persons
    const validNodeIds = new Set(persons.map(p => p.guid));
    
    TEMP_HARNESS_LINKS.forEach(link => {
      if (validNodeIds.has(link.sourceNodeUuid) && validNodeIds.has(link.targetNodeUuid)) {
        relationships.push({
          person1: link.sourceNodeUuid,
          person2: link.targetNodeUuid,
          type: link.type.lower() // Convert to lowercase to match fake data format
        });
      }
    });
    
    print(`=== Harness Data Conversion ===`);
    print(`Converted ${persons.size()} files to persons`);
    print(`Converted ${relationships.size()} links to relationships`);
    
    // Log unique values for each mapped property
    const uniqueTypes = new Set(persons.map(p => p.petType));
    const uniqueServices = new Set(persons.map(p => p.countryLivesIn));
    const uniqueLanguages = new Set(persons.map(p => p.country));
    
    print(`Unique types (petType): ${uniqueTypes.size()}`);
    print(`Unique services (countryLivesIn): ${uniqueServices.size()}`);
    print(`Unique languages (country): ${uniqueLanguages.size()}`);
    
    return { persons, relationships };
  }
  
  /**
   * Get available properties for the current data source
   */
  public getAvailableProperties(): string[] {
    if (this.currentSource === "fake") {
      return ["petType", "countryLivesIn", "country", "countryBornIn", "countryWorksIn"];
    } else {
      // For harness data, return more meaningful property names
      return [
        "petType", // Actually file type
        "countryLivesIn", // Actually service
        "country", // Actually language
        "countryBornIn", // Actually resourceDomain
        "countryWorksIn" // Actually operationType
      ];
    }
  }
  
  /**
   * Get property display name for UI
   */
  public getPropertyDisplayName(property: string): string {
    if (this.currentSource === "fake") {
      return property;
    }
    
    // Map property names to harness data meanings
    const harnessMapping: Record<string, string> = {
      "petType": "type",
      "countryLivesIn": "service",
      "country": "language",
      "countryBornIn": "resourceDomain",
      "countryWorksIn": "operationType"
    };
    
    return harnessMapping[property] || property;
  }
}
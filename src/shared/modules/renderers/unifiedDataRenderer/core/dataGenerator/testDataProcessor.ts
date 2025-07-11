/**
 * Test Data Processor for Unified Data Renderer
 * 
 * Handles processing and conversion of test data into cluster format
 */

import {
  discoverNodeProperties,
  filterValidAxisProperties,
} from "../../../../../utils/propertyDiscovery";
import {
  Cluster,
  Group,
  Link,
  Node,
} from "../../../../../interfaces/simpleDataGenerator.interface";
import { EnhancedGeneratorConfig } from "../../../../../interfaces/enhancedGenerator.interface";
import { TEMP_HARNESS_LINKS } from "../../../../../data/tempHarnessLinks";
import { TEMP_HARNESS_TEST_DATA } from "../../../../../data/tempHarnessTestData";
import { ITestDataProcessor } from "./interfaces";

// Default maximum number of items to use from test data
const DEFAULT_MAX_DATA_ITEMS = 100;

export class TestDataProcessor implements ITestDataProcessor {
  private useTestData = true;

  /**
   * Generate cluster from harness test data
   */
  public generateClusterFromTestData(config?: EnhancedGeneratorConfig): Cluster {
    const maxItems = config?.maxDataItems || DEFAULT_MAX_DATA_ITEMS;
    print(`[TestDataProcessor] Using maxItems: ${maxItems} (config.maxDataItems: ${config?.maxDataItems || "undefined"})`);
    print(`[TestDataProcessor] Available test data items: ${TEMP_HARNESS_TEST_DATA.size()}`);
    
    // Convert Harness data to Node format - using only first maxItems items
    const harnessNodes: Node[] = [];
    let itemCount = 0;
    
    TEMP_HARNESS_TEST_DATA.forEach((file, index) => {
      if (itemCount >= maxItems) return; // Only process first maxItems items
      itemCount++;
      
      const node: Node = {
        uuid: `harness_node_${index}`,
        name: this.getFileName(file.path),
        type: file.component as any, // Use component as node type
        color: this.getServiceColor(file.service),
        position: { x: 0, y: 0, z: 0 }, // Will be calculated by swim lanes
        attachmentNames: [],
        properties: {
          service: file.service,
          component: file.component,
          language: file.language,
          size: file.size,
          type: file.type,
          resourceDomain: file.resourceDomain,
          operationType: file.operationType,
          apiPattern: file.apiPattern,
          apiComplexity: file.apiComplexity,
          httpMethod: file.httpMethod,
          path: file.path,
        },
      };
      harnessNodes.push(node);
    });

    // Use real harness links from the link detection analysis
    // Filter to only include links between nodes we actually have
    const nodeUuids = new Set(harnessNodes.map((node) => node.uuid));
    const validHarnessLinks = TEMP_HARNESS_LINKS.filter(
      (link) =>
        nodeUuids.has(link.sourceNodeUuid) && nodeUuids.has(link.targetNodeUuid)
    );

    print(`[TestDataProcessor] Found ${TEMP_HARNESS_LINKS.size()} total links, ${validHarnessLinks.size()} valid links for ${nodeUuids.size()} nodes`);
    
    // Convert to Link[] format (remove extra properties)
    const harnessLinks: Link[] = validHarnessLinks.map((link) => ({
      uuid: link.uuid,
      type: link.type,
      sourceNodeUuid: link.sourceNodeUuid,
      targetNodeUuid: link.targetNodeUuid,
      color: link.color,
    }));

    // Discover properties from the harness nodes
    const discoveredProps = discoverNodeProperties(harnessNodes);
    const validProps = filterValidAxisProperties(harnessNodes, discoveredProps);

    // Create a single group containing all harness nodes
    const mainGroup: Group = {
      id: "harness-group",
      name: "Harness Data Group",
      nodes: harnessNodes,
    };

    return {
      groups: [mainGroup],
      relations: harnessLinks,
      discoveredProperties: validProps,
    };
  }

  /**
   * Set whether to use test data mode
   */
  public setUseTestData(enabled: boolean): void {
    this.useTestData = enabled;
  }

  /**
   * Check if currently using test data
   */
  public isUsingTestData(): boolean {
    return this.useTestData;
  }

  /**
   * Extract filename from full path
   */
  private getFileName(path: string): string {
    if (false) {
      // This prevents lint errors while keeping the code available
      return "";
    }
    const parts = path.split("/");
    return parts[parts.size() - 1] || path;
  }

  /**
   * Get color based on service type
   */
  private getServiceColor(service: string): [number, number, number] {
    if (false) {
      // This prevents lint errors while keeping the code available
      return [0, 0, 0];
    }
    const serviceColors: { [key: string]: [number, number, number] } = {
      platform: [0.2, 0.4, 0.8],
      ci: [0.8, 0.4, 0.2],
      cd: [0.2, 0.8, 0.2],
      ce: [0.8, 0.2, 0.8],
      core: [0.8, 0.8, 0.2],
    };
    return serviceColors[service] || [0.5, 0.5, 0.5];
  }

  /**
   * Get test data statistics
   */
  public getTestDataStatistics(): TestDataStatistics {
    return {
      totalNodes: TEMP_HARNESS_TEST_DATA.size(),
      totalLinks: TEMP_HARNESS_LINKS.size(),
      services: this.getUniqueServices(),
      components: this.getUniqueComponents(),
      languages: this.getUniqueLanguages()
    };
  }

  /**
   * Get unique services from test data
   */
  private getUniqueServices(): string[] {
    const services = new Set<string>();
    TEMP_HARNESS_TEST_DATA.forEach((file) => {
      services.add(file.service);
    });
    const servicesArray: string[] = [];
    services.forEach((service) => servicesArray.push(service));
    return servicesArray;
  }

  /**
   * Get unique components from test data
   */
  private getUniqueComponents(): string[] {
    const components = new Set<string>();
    TEMP_HARNESS_TEST_DATA.forEach((file) => {
      components.add(file.component);
    });
    const componentsArray: string[] = [];
    components.forEach((component) => componentsArray.push(component));
    return componentsArray;
  }

  /**
   * Get unique languages from test data
   */
  private getUniqueLanguages(): string[] {
    const languages = new Set<string>();
    TEMP_HARNESS_TEST_DATA.forEach((file) => {
      languages.add(file.language);
    });
    const languagesArray: string[] = [];
    languages.forEach((language) => languagesArray.push(language));
    return languagesArray;
  }
}

/**
 * Test data statistics interface
 */
interface TestDataStatistics {
  totalNodes: number;
  totalLinks: number;
  services: string[];
  components: string[];
  languages: string[];
}
/**
 * Property Manager - Handles property discovery and validation
 */

import { Node } from "../../../../interfaces/simpleDataGenerator.interface";
import {
  discoverNodeProperties,
  filterValidAxisProperties,
} from "../../../../utils/propertyDiscovery";

export class PropertyManager {
  public discoverAndValidateProperties(nodes: Node[]): any[] {
    const discoveredProps = discoverNodeProperties(nodes);
    const validProps = filterValidAxisProperties(nodes, discoveredProps);
    return validProps;
  }
}
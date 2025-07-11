/**
 * Node Generator - Handles node creation and property assignment
 */

import {
  ANIMAL_TYPES,
  COLOR_PALETTES,
  COUNTRIES_OF_BIRTH,
  COUNTRIES_OF_RESIDENCE,
  DEFAULT_ATTACHMENTS,
  FIRST_NAMES,
  LAST_NAMES,
  NODE_TYPE_NAMES,
  PET_COLORS,
  PET_TYPES,
} from "../constants";
import { Node } from "../../../../interfaces/simpleDataGenerator.interface";
import {
  EnhancedGeneratorConfig,
  LayerConfig,
} from "../../../../interfaces/enhancedGenerator.interface";

export class NodeGenerator {
  /**
   * Generate nodes for a single layer
   */
  public generateLayerNodes(
    layer: LayerConfig,
    config: EnhancedGeneratorConfig
  ): Node[] {
    const layerNodes: Node[] = [];

    for (let i = 0; i < layer.numNodes; i++) {
      const node = this.createNode(i, layer.layerNumber, config);
      layerNodes.push(node);
    }

    return layerNodes;
  }

  /**
   * Create a single node
   */
  public createNode(
    index: number,
    layerNumber: number,
    config: EnhancedGeneratorConfig
  ): Node {
    // Cycle through node types based on config
    const nodeTypeIndex = index % config.numNodeTypes;
    const nodeTypeName =
      NODE_TYPE_NAMES[math.min(nodeTypeIndex, NODE_TYPE_NAMES.size() - 1)];
    const color =
      COLOR_PALETTES.NODE_COLORS[
        nodeTypeIndex % COLOR_PALETTES.NODE_COLORS.size()
      ];

    const node: Node = {
      uuid: `node_${layerNumber}_${index}`,
      name: `${nodeTypeName} ${layerNumber}-${index + 1}`,
      type: nodeTypeName as any,
      color,
      position: { x: 0, y: 0, z: 0 },
      attachmentNames: DEFAULT_ATTACHMENTS,
    };

    // Add level property for swim lane algorithm
    const nodeWithLevel = node as Node & { level: number };
    nodeWithLevel.level = layerNumber;

    // Add type-specific properties
    this.addTypeSpecificProperties(node, nodeTypeName, config);

    return node;
  }

  /**
   * Add type-specific properties to node
   */
  private addTypeSpecificProperties(
    node: Node,
    nodeTypeName: string,
    config: EnhancedGeneratorConfig
  ): void {
    if (nodeTypeName === "man" || nodeTypeName === "woman") {
      this.addPersonProperties(node, config);
    } else if (nodeTypeName === "child") {
      this.addChildProperties(node, config);
    } else if (nodeTypeName === "grandparent") {
      this.addGrandparentProperties(node, config);
    } else if (nodeTypeName === "Animals") {
      this.addAnimalProperties(node);
    }
  }

  private addPersonProperties(
    node: Node,
    config: EnhancedGeneratorConfig
  ): void {
    const numPetTypes = config.numPetTypes || 5;
    const maxPetTypeIndex = math.min(numPetTypes - 1, PET_TYPES.size() - 1);

    node.properties = {
      age: math.random(18, 80),
      petType: PET_TYPES[math.random(0, maxPetTypeIndex)],
      petColor: PET_COLORS[math.random(0, PET_COLORS.size() - 1)],
      firstName: FIRST_NAMES[math.random(0, FIRST_NAMES.size() - 1)],
      lastName: LAST_NAMES[math.random(0, LAST_NAMES.size() - 1)],
      countryOfBirth:
        COUNTRIES_OF_BIRTH[math.random(0, COUNTRIES_OF_BIRTH.size() - 1)],
      countryOfResidence:
        COUNTRIES_OF_RESIDENCE[
          math.random(0, COUNTRIES_OF_RESIDENCE.size() - 1)
        ],
    };
  }

  private addChildProperties(
    node: Node,
    config: EnhancedGeneratorConfig
  ): void {
    const numPetTypes = config.numPetTypes || 5;
    const maxPetTypeIndex = math.min(numPetTypes - 1, PET_TYPES.size() - 1);

    node.properties = {
      age: math.random(5, 17),
      petType: PET_TYPES[math.random(0, maxPetTypeIndex)],
      petColor: PET_COLORS[math.random(0, PET_COLORS.size() - 1)],
      firstName: FIRST_NAMES[math.random(0, FIRST_NAMES.size() - 1)],
      lastName: LAST_NAMES[math.random(0, LAST_NAMES.size() - 1)],
      countryOfBirth:
        COUNTRIES_OF_BIRTH[math.random(0, COUNTRIES_OF_BIRTH.size() - 1)],
      countryOfResidence:
        COUNTRIES_OF_RESIDENCE[
          math.random(0, COUNTRIES_OF_RESIDENCE.size() - 1)
        ],
    };
  }

  private addGrandparentProperties(
    node: Node,
    config: EnhancedGeneratorConfig
  ): void {
    const numPetTypes = config.numPetTypes || 5;
    const maxPetTypeIndex = math.min(numPetTypes - 1, PET_TYPES.size() - 1);

    node.properties = {
      age: math.random(65, 95),
      petType: PET_TYPES[math.random(0, maxPetTypeIndex)],
      petColor: PET_COLORS[math.random(0, PET_COLORS.size() - 1)],
      firstName: FIRST_NAMES[math.random(0, FIRST_NAMES.size() - 1)],
      lastName: LAST_NAMES[math.random(0, LAST_NAMES.size() - 1)],
      countryOfBirth:
        COUNTRIES_OF_BIRTH[math.random(0, COUNTRIES_OF_BIRTH.size() - 1)],
      countryOfResidence:
        COUNTRIES_OF_RESIDENCE[
          math.random(0, COUNTRIES_OF_RESIDENCE.size() - 1)
        ],
    };
  }

  private addAnimalProperties(node: Node): void {
    node.properties = {
      animalType: ANIMAL_TYPES[math.random(0, ANIMAL_TYPES.size() - 1)],
    };
  }
}
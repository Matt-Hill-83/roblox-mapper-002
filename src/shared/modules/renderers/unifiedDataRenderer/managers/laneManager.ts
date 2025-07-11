/**
 * Lane Manager
 * Handles creation and management of X-parallel and Z-parallel lanes
 */

import {
  Cluster,
  Node,
} from "../../../../interfaces/simpleDataGenerator.interface";
import { EnhancedGeneratorConfig } from "../../../../interfaces/enhancedGenerator.interface";
import {
  LaneBounds,
  PropertyBounds,
  LaneDimensions,
  LaneManagerResult,
} from "../types";
import { PropertyValueResolver } from "../../propertyValueResolver";
import { EndcapBlockCreator } from "../../blocks/endcapBlockCreator";
import { SwimLaneBlockCreator } from "../../blocks/swimlaneBlockCreator";
import { ShadowBlockCreator } from "../../blocks/shadowBlockCreator";
import { BLOCK_CONSTANTS } from "../../constants/blockConstants";
import {
  getDefaultXAxis,
  getDefaultZAxis,
} from "../../../../constants/axisDefaults";

export class LaneManager {
  private propertyResolver: PropertyValueResolver;
  private endcapCreator: EndcapBlockCreator;
  private swimlaneCreator: SwimLaneBlockCreator;
  private shadowCreator: ShadowBlockCreator;

  constructor() {
    this.propertyResolver = new PropertyValueResolver();
    this.endcapCreator = new EndcapBlockCreator();
    this.swimlaneCreator = new SwimLaneBlockCreator();
    this.shadowCreator = new ShadowBlockCreator();
  }

  /**
   * Creates all lanes (both X-parallel and Z-parallel) and returns the result
   */
  public createAllLanes(
    cluster: Cluster,
    targetOrigin: Vector3,
    config: EnhancedGeneratorConfig,
    lanesParent: Instance
  ): LaneManagerResult {
    // Create Z-parallel lanes first (lanes that run along Z axis)
    const zParallelModel = new Instance("Model");
    zParallelModel.Name = `ZParallel_Lanes_Group`;
    zParallelModel.Parent = lanesParent;

    const zParallelLanes = this.createZParallelLaneBlocks(
      cluster,
      zParallelModel,
      targetOrigin,
      config
    );

    // Now create X-parallel lanes (lanes that run along X axis)
    const xParallelModel = new Instance("Model");
    xParallelModel.Name = `XParallel_Lanes_Group`;
    xParallelModel.Parent = lanesParent;

    // Pass the Z-parallel lanes so we can calculate proper bounds
    const xParallelLanes = this.createXParallelLaneBlocks(
      cluster,
      xParallelModel,
      targetOrigin,
      config,
      zParallelLanes
    );

    // Calculate bounds for all lanes
    const allLaneBounds = this.calculateLaneBounds(
      xParallelLanes,
      zParallelLanes
    );

    return {
      xParallelLanes,
      zParallelLanes,
      allLaneBounds,
    };
  }

  /**
   * Creates Z-parallel lane blocks (lanes that run along Z axis, grouped by X position)
   */
  public createZParallelLaneBlocks(
    cluster: Cluster,
    parent: Instance,
    _origin: Vector3,
    config: EnhancedGeneratorConfig
  ): Map<string, Part> {
    const swimlaneBlocks = new Map<string, Part>();
    // Use axis mapping if available - X axis sorts on service for Harness data
    const xAxisProperty =
      config.axisMapping?.xAxis ||
      getDefaultXAxis(cluster.discoveredProperties);

    // Organize nodes by X grouping property to determine lane placement
    const nodesByType = new Map<string, Node[]>();
    const typeBounds = new Map<string, PropertyBounds>();

    // Get node radius from spacing config
    const nodeRadius = config?.spacing?.nodeRadius || 0.5;

    // Group nodes by X grouping property and calculate bounds
    cluster.groups[0].nodes.forEach((node: Node) => {
      const propertyValue = this.propertyResolver.getPropertyValue(
        node,
        xAxisProperty
      );

      if (!nodesByType.has(propertyValue)) {
        nodesByType.set(propertyValue, []);
        typeBounds.set(propertyValue, {
          minX: math.huge,
          maxX: -math.huge,
          minZ: math.huge,
          maxZ: -math.huge,
        });
      }

      nodesByType.get(propertyValue)!.push(node);

      const bounds = typeBounds.get(propertyValue)!;

      // Account for node radius when calculating bounds
      bounds.minX = math.min(bounds.minX, node.position.x - nodeRadius);
      bounds.maxX = math.max(bounds.maxX, node.position.x + nodeRadius);
      bounds.minZ = math.min(bounds.minZ, node.position.z - nodeRadius);
      bounds.maxZ = math.max(bounds.maxZ, node.position.z + nodeRadius);

      // Debug first few nodes of each type
      if (nodesByType.get(propertyValue)!.size() <= 3) {
      }
    });

    // Create a block for each swimlane based on actual node positions
    let swimlaneIndex = 0;

    // Find the overall Z bounds across all lanes
    let overallMinZ = math.huge;
    let overallMaxZ = -math.huge;

    nodesByType.forEach((_nodes: Node[], typeName: string) => {
      const bounds = typeBounds.get(typeName)!;
      overallMinZ = math.min(overallMinZ, bounds.minZ);
      overallMaxZ = math.max(overallMaxZ, bounds.maxZ);
    });

    // Calculate the common center Z position for all lanes
    const commonCenterZ = (overallMinZ + overallMaxZ) / 2;

    nodesByType.forEach((nodes: Node[], typeName: string) => {
      const bounds = typeBounds.get(typeName)!;

      // Use actual node bounds to determine X position
      const centerX = (bounds.minX + bounds.maxX) / 2;
      // Use the common center Z for all lanes to ensure alignment
      const centerZ = commonCenterZ;

      // Calculate actual swimlane dimensions based on node bounds

      // Apply buffer to dimensions
      const zBuffer = BLOCK_CONSTANTS.DIMENSIONS.Z_PARALLEL_LANE_BUFFER;

      // Calculate this lane's specific width based on its actual node bounds - NO BUFFER!
      const laneWidth = bounds.maxX - bounds.minX;
      const blockWidth = laneWidth; // No buffer on X-axis to prevent overlap
      // Use the overall Z extent for all lanes to ensure uniform Z-length
      const blockDepth = overallMaxZ - overallMinZ + zBuffer * 2;

      // Debug: Print width of Z-parallel swimlane with node count

      // Fixed Y position for Z-parallel lane blocks - use SHADOW_LAYER_DISPLACEMENT above shadow block
      // Shadow block is at Y = 1.6 (top at 2.1)
      // X-axis blocks should have their tops at 2.1 + SHADOW_LAYER_DISPLACEMENT
      const shadowBlockTop =
        BLOCK_CONSTANTS.DIMENSIONS.UNIFORM_SHADOW_THICKNESS +
        BLOCK_CONSTANTS.DIMENSIONS.Z_FIGHTING_OFFSET +
        BLOCK_CONSTANTS.DIMENSIONS.UNIFORM_SHADOW_THICKNESS / 2;
      const blockYPosition =
        shadowBlockTop +
        BLOCK_CONSTANTS.DIMENSIONS.SHADOW_LAYER_DISPLACEMENT +
        BLOCK_CONSTANTS.DIMENSIONS.Z_TO_X_SHADOW_LANE_SPACING; // Above X shadow lanes to avoid z-fighting

      // Get color from Z_AXIS_COLORS array using swimlane index
      const colors = BLOCK_CONSTANTS.COLORS.Z_AXIS_COLORS;
      const color = colors[swimlaneIndex % colors.size()];

      // Create swimlane block
      const swimlaneBlock = this.swimlaneCreator.createSwimLaneBlock({
        position: new Vector3(centerX, blockYPosition, centerZ),
        width: blockWidth,
        depth: blockDepth,
        height: BLOCK_CONSTANTS.DIMENSIONS.UNIFORM_SHADOW_THICKNESS,
        color: color,
        typeName: typeName,
        parent: parent,
        propertyName: xAxisProperty,
      });

      // Create swimlane model with endcaps
      this.endcapCreator.createSwimlaneWithEndcaps({
        swimlaneBlock: swimlaneBlock,
        swimlaneName: typeName,
        parent: parent,
        gap: 2, // Increased gap for person endcaps
        isZAxis: false,
      });

      // Store the block in the map (still store the block, not the model)
      swimlaneBlocks.set(typeName, swimlaneBlock);

      swimlaneIndex++;
    });

    return swimlaneBlocks;
  }

  /**
   * Creates X-parallel lane blocks (lanes that run along X axis, grouped by Z position)
   */
  public createXParallelLaneBlocks(
    cluster: Cluster,
    parent: Instance,
    targetOrigin: Vector3,
    config: EnhancedGeneratorConfig | undefined,
    zParallelLanes: Map<string, Part>
  ): Map<string, Part> {
    const swimlaneBlocks = new Map<string, Part>();
    // Use axis mapping if available - Z axis sorts on type for Harness data
    const zAxisProperty =
      config?.axisMapping?.zAxis ||
      getDefaultZAxis(cluster.discoveredProperties);

    // Organize nodes by z-axis property
    const nodesByProperty = new Map<string, Node[]>();

    cluster.groups[0].nodes.forEach((node: Node) => {
      const propertyValue = this.propertyResolver.getPropertyValue(
        node,
        zAxisProperty
      );
      if (!nodesByProperty.has(propertyValue)) {
        nodesByProperty.set(propertyValue, []);
      }
      nodesByProperty.get(propertyValue)!.push(node);
    });

    // Calculate dimensions based on content
    const { lanePositions } =
      this.calculateXParallelLaneDimensions(nodesByProperty);

    // Create property bounds - X-parallel lanes should span full width of Z-parallel lanes
    const propertyBounds = new Map<string, PropertyBounds>();

    // Calculate the actual X extent from the Z-parallel lanes
    let fullMinX = math.huge;
    let fullMaxX = -math.huge;

    zParallelLanes.forEach((lane: Part) => {
      const halfWidth = lane.Size.X / 2;
      fullMinX = math.min(fullMinX, lane.Position.X - halfWidth);
      fullMaxX = math.max(fullMaxX, lane.Position.X + halfWidth);
    });

    // Set same X bounds for all X-parallel lanes
    lanePositions.forEach(
      (
        position: { z: number; minZ: number; maxZ: number },
        propertyValue: string
      ) => {
        propertyBounds.set(propertyValue, {
          minX: fullMinX,
          maxX: fullMaxX,
          minZ: position.minZ,
          maxZ: position.maxZ,
        });
      }
    );

    // Create X-parallel shadow blocks with fixed dimensions
    const shadowBlockTop =
      BLOCK_CONSTANTS.DIMENSIONS.UNIFORM_SHADOW_THICKNESS +
      BLOCK_CONSTANTS.DIMENSIONS.Z_FIGHTING_OFFSET +
      BLOCK_CONSTANTS.DIMENSIONS.UNIFORM_SHADOW_THICKNESS / 2;
    const yPosition =
      shadowBlockTop + BLOCK_CONSTANTS.DIMENSIONS.SHADOW_LAYER_DISPLACEMENT;

    this.shadowCreator.createXParallelShadowBlocks(
      nodesByProperty,
      propertyBounds,
      parent,
      yPosition,
      swimlaneBlocks,
      zAxisProperty,
      targetOrigin
    );
    return swimlaneBlocks;
  }

  /**
   * Calculate the required dimensions for X-parallel lanes based on content
   */
  public calculateXParallelLaneDimensions(
    nodesByProperty: Map<string, Node[]>
  ): LaneDimensions {
    // Calculate Z positions for each lane
    const lanePositions = new Map<
      string,
      { z: number; minZ: number; maxZ: number }
    >();

    // Collect actual Z bounds for each property group and store with property names
    const boundsArray: Array<
      [string, { minZ: number; maxZ: number; centerZ: number }]
    > = [];

    nodesByProperty.forEach((nodes: Node[], propertyValue: string) => {
      let minZ = math.huge;
      let maxZ = -math.huge;
      nodes.forEach((node: Node) => {
        minZ = math.min(minZ, node.position.z);
        maxZ = math.max(maxZ, node.position.z);
      });
      const centerZ = (minZ + maxZ) / 2;
      boundsArray.push([propertyValue, { minZ, maxZ, centerZ }]);
    });

    // Sort by center Z position to maintain proper ordering
    boundsArray.sort(
      (
        a: [string, { minZ: number; maxZ: number; centerZ: number }],
        b: [string, { minZ: number; maxZ: number; centerZ: number }]
      ) => a[1].centerZ < b[1].centerZ
    );

    // Assign lane positions based on actual positions
    boundsArray.forEach(
      ([propertyValue, bounds]: [
        string,
        { minZ: number; maxZ: number; centerZ: number }
      ]) => {
        lanePositions.set(propertyValue, {
          z: bounds.centerZ, // Use actual center position
          minZ: bounds.minZ,
          maxZ: bounds.maxZ,
        });
      }
    );

    return { lanePositions };
  }

  /**
   * Calculate bounds for all lanes to determine shadow size
   */
  public calculateLaneBounds(
    xParallelLanes: Map<string, Part>,
    zParallelLanes: Map<string, Part>
  ): LaneBounds {
    let minX = math.huge;
    let maxX = -math.huge;
    let minZ = math.huge;
    let maxZ = -math.huge;

    // Check X-parallel lanes
    xParallelLanes.forEach((block: Part) => {
      const halfWidth = block.Size.X / 2;
      const halfDepth = block.Size.Z / 2;
      minX = math.min(minX, block.Position.X - halfWidth);
      maxX = math.max(maxX, block.Position.X + halfWidth);
      minZ = math.min(minZ, block.Position.Z - halfDepth);
      maxZ = math.max(maxZ, block.Position.Z + halfDepth);
    });

    // Check Z-parallel lanes
    zParallelLanes.forEach((block: Part) => {
      const halfWidth = block.Size.X / 2;
      const halfDepth = block.Size.Z / 2;
      minX = math.min(minX, block.Position.X - halfWidth);
      maxX = math.max(maxX, block.Position.X + halfWidth);
      minZ = math.min(minZ, block.Position.Z - halfDepth);
      maxZ = math.max(maxZ, block.Position.Z + halfDepth);
    });

    return {
      width: maxX - minX,
      depth: maxZ - minZ,
    };
  }

  /**
   * Calculate the Z-axis offset needed to center lanes
   */
  public calculateZAxisOffset(cluster: Cluster, zAxisProperty: string): number {
    // Organize nodes by z-axis property and find bounds
    const propertyBounds = new Map<string, { minZ: number; maxZ: number }>();

    cluster.groups[0].nodes.forEach((node: Node) => {
      const propertyValue = this.propertyResolver.getPropertyValue(
        node,
        zAxisProperty
      );
      if (!propertyBounds.has(propertyValue)) {
        propertyBounds.set(propertyValue, {
          minZ: math.huge,
          maxZ: -math.huge,
        });
      }

      const bounds = propertyBounds.get(propertyValue)!;
      bounds.minZ = math.min(bounds.minZ, node.position.z);
      bounds.maxZ = math.max(bounds.maxZ, node.position.z);
    });

    // Calculate collective bounds of all Z-axis lanes
    let collectiveMinZ = math.huge;
    let collectiveMaxZ = -math.huge;

    propertyBounds.forEach((bounds: { minZ: number; maxZ: number }) => {
      collectiveMinZ = math.min(collectiveMinZ, bounds.minZ);
      collectiveMaxZ = math.max(collectiveMaxZ, bounds.maxZ);
    });

    // Calculate the center of the collective Z-axis lanes
    const collectiveCenter = (collectiveMinZ + collectiveMaxZ) / 2;

    // The group shadow block is centered at Z=0, so we need to offset the lanes
    const offsetZ = 0 - collectiveCenter;

    return offsetZ;
  }
}

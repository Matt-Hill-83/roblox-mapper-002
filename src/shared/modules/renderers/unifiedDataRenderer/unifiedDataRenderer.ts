/**
 * Unified Data Renderer - Refactored Version
 *
 * Main orchestrator that delegates to specialized modules
 */

import { EnhancedGeneratorConfig } from "../../../interfaces/enhancedGenerator.interface";
import {
  Cluster,
  Node,
} from "../../../interfaces/simpleDataGenerator.interface";
import { DataGenerator } from "./core/dataGenerator";
import { PositionCalculator } from "./core/positionCalculator";
import { NodeRenderer } from "./rendering/nodeRenderer";
import { UpdateManager } from "./rendering/updateManager";
// import { LabelRenderer } from "./rendering/labelRenderer"; // Disabled per T17
import { PropertyValueResolver } from "../propertyValueResolver";
import { LAYOUT_CONSTANTS } from "../constants/layoutConstants";
import { getDefaultXAxis, getDefaultZAxis } from "../../../constants/axisDefaults";
import { LaneManager } from "./managers/laneManager";
import { PlatformShadowManager } from "./managers/platformShadowManager";
import { WallManager } from "./managers/wallManager";
import { YParallelShadowManager } from "./managers/yParallelShadowManager";

export class UnifiedDataRenderer {
  private dataGenerator: DataGenerator;
  private positionCalculator: PositionCalculator;
  private nodeRenderer: NodeRenderer;
  private updateManager: UpdateManager;
  // private labelRenderer: LabelRenderer; // Disabled per T17
  private propertyResolver: PropertyValueResolver;
  private laneManager: LaneManager;
  private platformShadowManager: PlatformShadowManager;
  private wallManager: WallManager;
  private yParallelShadowManager: YParallelShadowManager;
  private currentConfig?: EnhancedGeneratorConfig;

  constructor() {
    this.dataGenerator = new DataGenerator();
    this.positionCalculator = new PositionCalculator();
    this.nodeRenderer = new NodeRenderer();
    this.updateManager = new UpdateManager();
    // this.labelRenderer = new LabelRenderer(); // Disabled per T17
    this.propertyResolver = new PropertyValueResolver();
    this.laneManager = new LaneManager();
    this.platformShadowManager = new PlatformShadowManager();
    this.wallManager = new WallManager();
    this.yParallelShadowManager = new YParallelShadowManager();
  }

  /**
   * Main entry point - renders data based on enhanced configuration
   */
  public renderEnhancedData(
    parentFolder: Folder,
    config: EnhancedGeneratorConfig,
    origin?: Vector3
  ): Cluster {
    // Delete any existing platform and shadow blocks
    const existingPlatform = parentFolder.FindFirstChild("PlatformBlock");
    if (existingPlatform) {
      existingPlatform.Destroy();
    }

    // Also check for legacy flat block
    const existingBlock = parentFolder.FindFirstChild("FlatBlockFoundation");
    if (existingBlock) {
      existingBlock.Destroy();
    }

    // Generate the cluster data
    const cluster = this.dataGenerator.generateClusterFromLayers(config);

    // Calculate swim lane positions
    this.positionCalculator.calculateLayerSwimLanePositions(cluster, config);

    // Adjust positions to center bottom at origin
    const targetOrigin = origin || new Vector3(0, 0, 0);
    this.positionCalculator.centerBottomAtOrigin(cluster, targetOrigin, config);

    // Calculate Z-axis centering offset for type lanes
    const zAxisProperty = config?.axisMapping?.zAxis || getDefaultZAxis(cluster.discoveredProperties);
    const zAxisOffset = this.laneManager.calculateZAxisOffset(cluster, zAxisProperty);

    // Apply the Z-axis centering offset to all nodes
    if (zAxisOffset !== 0) {
      cluster.groups[0].nodes.forEach((node: Node) => {
        node.position.z += zAxisOffset;
      });
    }

    // Create temporary parent for lanes during construction
    const lanesParent = new Instance("Model");
    lanesParent.Name = "TemporaryLanesParent";
    lanesParent.Parent = parentFolder;

    // Use LaneManager to create all lanes
    const laneResult = this.laneManager.createAllLanes(
      cluster,
      targetOrigin,
      config,
      lanesParent
    );

    const { zParallelLanes, allLaneBounds } = laneResult;

    // Create platform and shadow blocks last, sized to encompass all lanes
    const { platform, shadow } = this.platformShadowManager.createPlatformAndShadow(
      targetOrigin,
      parentFolder,
      allLaneBounds
    );

    // Re-parent lanes to shadow block
    const xParallelModel = lanesParent.FindFirstChild("XParallel_Lanes_Group");
    const zParallelModel = lanesParent.FindFirstChild("ZParallel_Lanes_Group");
    if (xParallelModel) xParallelModel.Parent = shadow;
    if (zParallelModel) zParallelModel.Parent = shadow;
    lanesParent.Destroy();

    // Create vertical walls if Y-axis property is configured
    const shadowWidth =
      allLaneBounds.width + LAYOUT_CONSTANTS.SHADOW_PADDING.X_PADDING * 2;
    const shadowDepth =
      allLaneBounds.depth + LAYOUT_CONSTANTS.SHADOW_PADDING.Z_PADDING * 2;
    
    this.wallManager.createWalls(
      cluster,
      config,
      targetOrigin,
      shadowWidth,
      shadowDepth,
      platform
    );

    // Render the cluster first
    this.nodeRenderer.renderCluster(cluster, parentFolder, config);

    // Create Y-parallel shadows if Y-axis property is configured
    this.yParallelShadowManager.createYParallelShadows(
      cluster,
      parentFolder,
      config,
      allLaneBounds
    );

    // Log alignment check between nodes and swimlanes
    const nodesByType = new Map<string, Node[]>();

    
    zParallelLanes.forEach((_lane: Part, _laneName: string) => {
    });

    cluster.groups[0].nodes.forEach((node: Node) => {
      const xAxisProperty = config.axisMapping?.xAxis || getDefaultXAxis(cluster.discoveredProperties);
      const propertyValue = this.propertyResolver.getPropertyValue(
        node,
        xAxisProperty
      );
      
      if (!nodesByType.has(propertyValue)) {
        nodesByType.set(propertyValue, []);
      }
      nodesByType.get(propertyValue)!.push(node);
    });

    nodesByType.forEach((nodes: Node[], typeName: string) => {
      const swimlane = zParallelLanes.get(typeName);
      if (swimlane) {
        nodes.forEach((_node: Node) => {
        });
      } else {
      }
    });

    // Swimlane labels disabled per T17
    // Labels are now provided by endcaps on the swimlanes

    // Store current configuration for update comparison
    this.currentConfig = config;
    
    // Return the cluster with discovered properties
    return cluster;
  }

  /**
   * Updates existing data incrementally based on configuration changes
   */
  public updateEnhancedData(
    parentFolder: Folder,
    config: EnhancedGeneratorConfig,
    origin?: Vector3
  ): Cluster | void {
    // Find GraphMaker folder
    const graphMakerFolder = parentFolder.FindFirstChild("GraphMaker");
    if (!graphMakerFolder || !this.currentConfig) {
      const cluster = this.renderEnhancedData(parentFolder, config, origin);
      return cluster;
    }

    // Find nodes and links folders
    const clusterFolder = graphMakerFolder.FindFirstChild("UnifiedDataCluster");
    if (!clusterFolder) {
      const cluster = this.renderEnhancedData(parentFolder, config, origin);
      return cluster;
    }

    const nodesFolder = clusterFolder.FindFirstChild("Nodes") as Folder;
    const linksFolder = clusterFolder.FindFirstChild("Links") as Folder;

    if (!nodesFolder || !linksFolder) {
      const cluster = this.renderEnhancedData(parentFolder, config, origin);
      return cluster;
    }

    // Delegate to update manager
    this.updateManager.performIncrementalUpdate(
      config,
      nodesFolder,
      linksFolder,
      origin || new Vector3(0, 0, 0)
    );

    // Update stored configuration
    this.currentConfig = config;
  }

  /**
   * Creates labels for X and Z axis swimlanes
   * DISABLED: Per T17 - swimlane labels removed, using endcaps instead
   */
  /*
  private createSwimLaneLabels(
    cluster: Cluster,
    parentFolder: Folder,
    config?: EnhancedGeneratorConfig,
    xAxisBlocks?: Map<string, Part>,
    zAxisBlocks?: Map<string, Part>,
    platformBounds?: { minX: number; maxX: number; minZ: number; maxZ: number }
  ): void {
    // Use axis mapping if available
    const xAxisProperty = config?.axisMapping?.xAxis || getDefaultXAxis(cluster.discoveredProperties);
    const zAxisProperty = config?.axisMapping?.zAxis || getDefaultZAxis(cluster.discoveredProperties);
    
    // Organize nodes by x-axis property for X-axis labels
    const nodesByXProperty = new Map<string, Node[]>();
    const xPropertyBounds = new Map<string, { minX: number; maxX: number; minZ: number; maxZ: number }>();
    
    // Organize nodes by z-axis property for Z-axis labels
    const nodesByZProperty = new Map<string, Node[]>();
    const zPropertyBounds = new Map<string, { minX: number; maxX: number; minZ: number; maxZ: number }>();
    
    // Group nodes by x and z properties
    cluster.groups[0].nodes.forEach(node => {
      // Group by x-axis property
      const xValue = this.propertyResolver.getPropertyValue(node, xAxisProperty);
      if (!nodesByXProperty.has(xValue)) {
        nodesByXProperty.set(xValue, []);
        xPropertyBounds.set(xValue, {
          minX: math.huge,
          maxX: -math.huge,
          minZ: math.huge,
          maxZ: -math.huge
        });
      }
      nodesByXProperty.get(xValue)!.push(node);
      const xBounds = xPropertyBounds.get(xValue)!;
      xBounds.minX = math.min(xBounds.minX, node.position.x);
      xBounds.maxX = math.max(xBounds.maxX, node.position.x);
      xBounds.minZ = math.min(xBounds.minZ, node.position.z);
      xBounds.maxZ = math.max(xBounds.maxZ, node.position.z);
      
      // Group by z-axis property
      const zValue = this.propertyResolver.getPropertyValue(node, zAxisProperty);
      if (!nodesByZProperty.has(zValue)) {
        nodesByZProperty.set(zValue, []);
        zPropertyBounds.set(zValue, {
          minX: math.huge,
          maxX: -math.huge,
          minZ: math.huge,
          maxZ: -math.huge
        });
      }
      nodesByZProperty.get(zValue)!.push(node);
      const zBounds = zPropertyBounds.get(zValue)!;
      zBounds.minX = math.min(zBounds.minX, node.position.x);
      zBounds.maxX = math.max(zBounds.maxX, node.position.x);
      zBounds.minZ = math.min(zBounds.minZ, node.position.z);
      zBounds.maxZ = math.max(zBounds.maxZ, node.position.z);
    });
    
    // Create labels with swimlane blocks if available
    this.labelRenderer.createXAxisLabels(nodesByXProperty, xPropertyBounds, parentFolder, 0, xAxisBlocks, platformBounds);
    this.labelRenderer.createZAxisLabels(zPropertyBounds, parentFolder, 0, zAxisBlocks, platformBounds);
  }
  */
}

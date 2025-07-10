/**
 * Unified Data Renderer - Refactored Version
 * 
 * Main orchestrator that delegates to specialized modules
 */

import { EnhancedGeneratorConfig } from "../../../interfaces/enhancedGenerator.interface";
import { Cluster, Node } from "../../../interfaces/simpleDataGenerator.interface";
import { DataGenerator } from "./core/dataGenerator";
import { PositionCalculator } from "./core/positionCalculator";
import { NodeRenderer } from "./rendering/nodeRenderer";
import { UpdateManager } from "./rendering/updateManager";
// import { LabelRenderer } from "./rendering/labelRenderer"; // Disabled per T17
import { 
  createFlatBlocksAdapter as createFlatBlocks, 
  createSwimLaneBlockAdapter as createSwimLaneBlock, 
  createXParallelShadowBlocksAdapter as createXParallelShadowBlocks
} from "../blockCreatorAdapter";
import { createVerticalWalls, createWallSwimlanes } from "../verticalWallCreator";
import { PropertyValueResolver } from "../propertyValueResolver";
import { BLOCK_CONSTANTS } from "../constants/blockConstants";
import { LAYOUT_CONSTANTS } from "../constants/layoutConstants";
import { EndcapBlockCreator } from "../blocks/endcapBlockCreator";

export class UnifiedDataRenderer {
  private dataGenerator: DataGenerator;
  private positionCalculator: PositionCalculator;
  private nodeRenderer: NodeRenderer;
  private updateManager: UpdateManager;
  // private labelRenderer: LabelRenderer; // Disabled per T17
  private propertyResolver: PropertyValueResolver;
  private endcapCreator: EndcapBlockCreator;
  private currentConfig?: EnhancedGeneratorConfig;

  constructor() {
    this.dataGenerator = new DataGenerator();
    this.positionCalculator = new PositionCalculator();
    this.nodeRenderer = new NodeRenderer();
    this.updateManager = new UpdateManager();
    // this.labelRenderer = new LabelRenderer(); // Disabled per T17
    this.propertyResolver = new PropertyValueResolver();
    this.endcapCreator = new EndcapBlockCreator();
  }

  /**
   * Main entry point - renders data based on enhanced configuration
   */
  public renderEnhancedData(parentFolder: Folder, config: EnhancedGeneratorConfig, origin?: Vector3): void {
    print("[UnifiedDataRenderer] renderEnhancedData() called");
    print("[DEBUG] Starting layout with F006 changes");
    
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
    
    // Calculate Z-axis centering offset for pet lanes
    const zAxisProperty = config?.axisMapping?.zAxis || "petType";
    const petLaneOffset = this.calculatePetLaneZOffset(cluster, zAxisProperty);
    
    print(`[UnifiedDataRenderer] Pet lane offset: ${petLaneOffset}`);
    
    // Apply the pet lane centering offset to all nodes
    if (petLaneOffset !== 0) {
      print(`[UnifiedDataRenderer] Applying offset ${petLaneOffset} to all nodes`);
      cluster.groups[0].nodes.forEach(node => {
        const oldZ = node.position.z;
        node.position.z += petLaneOffset;
        print(`  Node: Z ${oldZ} -> ${node.position.z}`);
      });
    }
    
    // Create temporary parent for lanes during construction
    const lanesParent = new Instance("Model");
    lanesParent.Name = "TemporaryLanesParent";
    lanesParent.Parent = parentFolder;
    
    // Create Z-parallel lanes first (lanes that run along Z axis)
    // These lanes are grouped by X position values
    const zParallelModel = new Instance("Model");
    zParallelModel.Name = `ZParallel_Lanes_Group`;
    zParallelModel.Parent = lanesParent;
    
    const zParallelLanes = this.createZParallelLaneBlocks(cluster, zParallelModel, targetOrigin, config);
    
    // Now create X-parallel lanes (lanes that run along X axis)
    // These lanes are grouped by Z position values
    const xParallelModel = new Instance("Model");
    xParallelModel.Name = `XParallel_Lanes_Group`;
    xParallelModel.Parent = lanesParent;
    
    // Pass the Z-parallel lanes so we can calculate proper bounds
    const xParallelLanes = this.createXParallelLaneBlocks(cluster, xParallelModel, targetOrigin, config, zParallelLanes);
    
    // Calculate bounds for all lanes to determine shadow size
    const allLaneBounds = this.calculateLaneBounds(xParallelLanes, zParallelLanes);
    
    // Create platform and shadow blocks last, sized to encompass all lanes
    const blocks = createFlatBlocks({
      origin: targetOrigin,
      parent: parentFolder,
      width: allLaneBounds.width + LAYOUT_CONSTANTS.SHADOW_PADDING.X_PADDING * 2,
      depth: allLaneBounds.depth + LAYOUT_CONSTANTS.SHADOW_PADDING.Z_PADDING * 2,
    });
    
    // Re-parent lanes to shadow block
    xParallelModel.Parent = blocks.shadow;
    zParallelModel.Parent = blocks.shadow;
    lanesParent.Destroy();
    
    // Create vertical walls if Y-axis is property-based
    if (config.yAxisConfig && !config.yAxisConfig.useLayer) {
      const wallHeight = this.calculateWallHeight(cluster);
      const shadowWidth = allLaneBounds.width + LAYOUT_CONSTANTS.SHADOW_PADDING.X_PADDING * 2;
      const shadowDepth = allLaneBounds.depth + LAYOUT_CONSTANTS.SHADOW_PADDING.Z_PADDING * 2;
      const walls = createVerticalWalls({
        platformBounds: {
          minX: targetOrigin.X - shadowWidth / 2,
          maxX: targetOrigin.X + shadowWidth / 2,
          minZ: targetOrigin.Z - shadowDepth / 2,
          maxZ: targetOrigin.Z + shadowDepth / 2
        },
        height: wallHeight,
        parent: blocks.platform
      });
      
      // Add swimlane shadows on walls
      this.createYAxisWallSwimlanes(cluster, walls, config);
    }
    
    // Render the cluster first
    this.nodeRenderer.renderCluster(cluster, parentFolder, config);
    
    // Log alignment check between nodes and swimlanes
    print("\n=== ALIGNMENT CHECK: Nodes vs Swimlanes ===");
    const xAxisProperty = config.axisMapping?.xAxis || "type";
    const nodesByType = new Map<string, Node[]>();
    
    cluster.groups[0].nodes.forEach(node => {
      const propertyValue = this.propertyResolver.getPropertyValue(node, xAxisProperty);
      if (!nodesByType.has(propertyValue)) {
        nodesByType.set(propertyValue, []);
      }
      nodesByType.get(propertyValue)!.push(node);
    });
    
    nodesByType.forEach((nodes, typeName) => {
      const swimlane = zParallelLanes.get(typeName);
      if (swimlane) {
        print(`\n${typeName} swimlane:`);
        print(`  Swimlane position: X=${swimlane.Position.X}, Z=${swimlane.Position.Z}`);
        print(`  Swimlane size: X=${swimlane.Size.X}, Z=${swimlane.Size.Z}`);
        print(`  Node positions:`);
        nodes.forEach(node => {
          print(`    ${node.name}: X=${node.position.x}, Z=${node.position.z}`);
        });
      }
    });
    
    // Swimlane labels disabled per T17
    // Labels are now provided by endcaps on the swimlanes
    
    
    // Store current configuration for update comparison
    this.currentConfig = config;
  }

  /**
   * Updates existing data incrementally based on configuration changes
   */
  public updateEnhancedData(parentFolder: Folder, config: EnhancedGeneratorConfig, origin?: Vector3): void {
    
    // Find GraphMaker folder
    const graphMakerFolder = parentFolder.FindFirstChild("GraphMaker");
    if (!graphMakerFolder || !this.currentConfig) {
      this.renderEnhancedData(parentFolder, config, origin);
      return;
    }
    
    // Find nodes and links folders
    const clusterFolder = graphMakerFolder.FindFirstChild("UnifiedDataCluster");
    if (!clusterFolder) {
      this.renderEnhancedData(parentFolder, config, origin);
      return;
    }
    
    const nodesFolder = clusterFolder.FindFirstChild("Nodes") as Folder;
    const linksFolder = clusterFolder.FindFirstChild("Links") as Folder;
    
    if (!nodesFolder || !linksFolder) {
      this.renderEnhancedData(parentFolder, config, origin);
      return;
    }
    
    // Delegate to update manager
    this.updateManager.performIncrementalUpdate(config, nodesFolder, linksFolder, origin || new Vector3(0, 0, 0));
    
    // Update stored configuration
    this.currentConfig = config;
    
  }

  /**
   * Creates Z-parallel lane blocks (lanes that run along Z axis, grouped by X position)
   */
  private createZParallelLaneBlocks(cluster: Cluster, parent: Instance, origin: Vector3, config: EnhancedGeneratorConfig): Map<string, Part> {
    print("[UnifiedDataRenderer] createZParallelLaneBlocks() called for X grouping property:", config.axisMapping?.xAxis || "type");
    const swimlaneBlocks = new Map<string, Part>();
    // Use axis mapping if available
    const xAxisProperty = config.axisMapping?.xAxis || "type";
    
    // Organize nodes by X grouping property to determine lane placement
    const nodesByType = new Map<string, Node[]>();
    const typeBounds = new Map<string, { minX: number; maxX: number; minZ: number; maxZ: number }>();
    
    // Group nodes by X grouping property and calculate bounds
    cluster.groups[0].nodes.forEach(node => {
      const propertyValue = this.propertyResolver.getPropertyValue(node, xAxisProperty);
      if (!nodesByType.has(propertyValue)) {
        nodesByType.set(propertyValue, []);
        typeBounds.set(propertyValue, {
          minX: math.huge,
          maxX: -math.huge,
          minZ: math.huge,
          maxZ: -math.huge
        });
      }
      
      nodesByType.get(propertyValue)!.push(node);
      
      const bounds = typeBounds.get(propertyValue)!;
      bounds.minX = math.min(bounds.minX, node.position.x);
      bounds.maxX = math.max(bounds.maxX, node.position.x);
      bounds.minZ = math.min(bounds.minZ, node.position.z);
      bounds.maxZ = math.max(bounds.maxZ, node.position.z);
    });
    
    // Create a block for each swimlane based on actual node positions
    let swimlaneIndex = 0;
    
    // Find the maximum width across all swimlanes
    let maxWidth = 0;
    print("\n[DEBUG] Z-Parallel Lane Width Calculation:");
    nodesByType.forEach((nodes, typeName) => {
      const bounds = typeBounds.get(typeName)!;
      const width = bounds.maxX - bounds.minX;
      print(`  ${typeName}: minX=${bounds.minX}, maxX=${bounds.maxX}, width=${width}, nodeCount=${nodes.size()}`);
      maxWidth = math.max(maxWidth, width);
    });
    print(`  Maximum width to be used: ${maxWidth}`);
    
    nodesByType.forEach((nodes, typeName) => {
      const bounds = typeBounds.get(typeName)!;
      
      // Use actual node bounds to determine X position
      const centerX = (bounds.minX + bounds.maxX) / 2;
      // Use the actual node bounds to determine Z position
      const centerZ = (bounds.minZ + bounds.maxZ) / 2;
      
      
      // Calculate actual swimlane dimensions based on node bounds
      
      // Apply uniform buffer to dimensions
      const zBuffer = BLOCK_CONSTANTS.DIMENSIONS.Z_PARALLEL_LANE_BUFFER;
      
      // Use the maximum width for all lanes to ensure uniform length
      const blockWidth = maxWidth;
      const blockDepth = bounds.maxZ - bounds.minZ + zBuffer * 2;
      
      print(`[Z-Parallel Lane WIDTH] ${typeName}:`);
      print(`  Node group width: ${bounds.maxX - bounds.minX} (from X[${bounds.minX}, ${bounds.maxX}])`);
      print(`  Using max width: ${maxWidth} (all lanes same width)`);
      print(`  Final shadow block width: ${blockWidth}`);
      
      // Fixed Y position for Z-parallel lane blocks - use SHADOW_LAYER_DISPLACEMENT above shadow block
      // Shadow block is at Y = 1.6 (top at 2.1)
      // X-axis blocks should have their tops at 2.1 + SHADOW_LAYER_DISPLACEMENT
      const shadowBlockTop = BLOCK_CONSTANTS.DIMENSIONS.UNIFORM_SHADOW_THICKNESS + BLOCK_CONSTANTS.DIMENSIONS.Z_FIGHTING_OFFSET + BLOCK_CONSTANTS.DIMENSIONS.UNIFORM_SHADOW_THICKNESS / 2;
      const blockYPosition = shadowBlockTop + BLOCK_CONSTANTS.DIMENSIONS.SHADOW_LAYER_DISPLACEMENT + 0.1; // Above shadow block + 0.1 to avoid z-fighting
      
      // Get color from Z_AXIS_COLORS array using swimlane index
      const colors = BLOCK_CONSTANTS.COLORS.Z_AXIS_COLORS;
      const color = colors[swimlaneIndex % colors.size()];
      
      
      // Create swimlane block
      const swimlaneBlock = createSwimLaneBlock({
        position: new Vector3(centerX, blockYPosition, centerZ),
        width: blockWidth,
        depth: blockDepth,
        height: BLOCK_CONSTANTS.DIMENSIONS.UNIFORM_SHADOW_THICKNESS,
        color: color,
        typeName: typeName,
        parent: parent,
        propertyName: xAxisProperty
      });
      
      print(`[Z-Parallel Lane] ${typeName}:`);
      print(`  Node bounds: Z[${bounds.minZ}, ${bounds.maxZ}]`);
      print(`  Lane center position: X=${centerX}, Z=${centerZ}`);
      print(`  Lane size: width=${blockWidth}, depth=${blockDepth}`);
      
      // Create swimlane model with endcaps
      this.endcapCreator.createSwimlaneWithEndcaps({
        swimlaneBlock: swimlaneBlock,
        swimlaneName: typeName,
        parent: parent,
        gap: 2, // Increased gap for person endcaps
        isZAxis: false
      });
      
      // Store the block in the map (still store the block, not the model)
      swimlaneBlocks.set(typeName, swimlaneBlock);
      
      swimlaneIndex++;
    });
    
    
    return swimlaneBlocks;
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
    const xAxisProperty = config?.axisMapping?.xAxis || "type";
    const zAxisProperty = config?.axisMapping?.zAxis || "petType";
    
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
  
  /**
   * Calculate bounds for all lanes to determine shadow size
   */
  private calculateLaneBounds(
    xParallelLanes: Map<string, Part>,
    zParallelLanes: Map<string, Part>
  ): { width: number; depth: number } {
    let minX = math.huge;
    let maxX = -math.huge;
    let minZ = math.huge;
    let maxZ = -math.huge;
    
    // Check X-parallel lanes
    xParallelLanes.forEach(block => {
      const halfWidth = block.Size.X / 2;
      const halfDepth = block.Size.Z / 2;
      minX = math.min(minX, block.Position.X - halfWidth);
      maxX = math.max(maxX, block.Position.X + halfWidth);
      minZ = math.min(minZ, block.Position.Z - halfDepth);
      maxZ = math.max(maxZ, block.Position.Z + halfDepth);
    });
    
    // Check Z-parallel lanes
    zParallelLanes.forEach(block => {
      const halfWidth = block.Size.X / 2;
      const halfDepth = block.Size.Z / 2;
      minX = math.min(minX, block.Position.X - halfWidth);
      maxX = math.max(maxX, block.Position.X + halfWidth);
      minZ = math.min(minZ, block.Position.Z - halfDepth);
      maxZ = math.max(maxZ, block.Position.Z + halfDepth);
    });
    
    return {
      width: maxX - minX,
      depth: maxZ - minZ
    };
  }

  /**
   * Calculate the required dimensions for X-parallel lanes based on content
   */
  private calculateXParallelLaneDimensions(
    nodesByProperty: Map<string, Node[]>
  ): { lanePositions: Map<string, { z: number; minZ: number; maxZ: number }> } {
    
    // Calculate Z positions for each lane
    const lanePositions = new Map<string, { z: number; minZ: number; maxZ: number }>();
    
    // Collect actual Z bounds for each property group and store with property names
    const boundsArray: Array<[string, { minZ: number; maxZ: number; centerZ: number }]> = [];
    
    print("[X-Parallel Lanes] Calculating Z positions for lanes:");
    nodesByProperty.forEach((nodes, propertyValue) => {
      let minZ = math.huge;
      let maxZ = -math.huge;
      nodes.forEach(node => {
        minZ = math.min(minZ, node.position.z);
        maxZ = math.max(maxZ, node.position.z);
      });
      const centerZ = (minZ + maxZ) / 2;
      print(`  ${propertyValue}: Z bounds [${minZ}, ${maxZ}], center = ${centerZ}`);
      boundsArray.push([propertyValue, { minZ, maxZ, centerZ }]);
    });
    
    // Sort by center Z position to maintain proper ordering
    boundsArray.sort((a, b) => a[1].centerZ < b[1].centerZ);
    
    // Assign lane positions based on actual positions
    boundsArray.forEach(([propertyValue, bounds]) => {
      lanePositions.set(propertyValue, { 
        z: bounds.centerZ,  // Use actual center position
        minZ: bounds.minZ,
        maxZ: bounds.maxZ
      });
    });
    
    return { lanePositions };
  }

  /**
   * Creates X-parallel lane blocks (lanes that run along X axis, grouped by Z position)
   */
  private createXParallelLaneBlocks(cluster: Cluster, parent: Instance, targetOrigin: Vector3, config: EnhancedGeneratorConfig | undefined, zParallelLanes: Map<string, Part>): Map<string, Part> {
    const swimlaneBlocks = new Map<string, Part>();
    // Use axis mapping if available
    const zAxisProperty = config?.axisMapping?.zAxis || "petType";
    print(`[DEBUG] createXParallelLaneBlocks using zAxisProperty: ${zAxisProperty}`);
    
    // Organize nodes by z-axis property
    const nodesByProperty = new Map<string, Node[]>();
    
    cluster.groups[0].nodes.forEach(node => {
      const propertyValue = this.propertyResolver.getPropertyValue(node, zAxisProperty);
      if (!nodesByProperty.has(propertyValue)) {
        nodesByProperty.set(propertyValue, []);
      }
      nodesByProperty.get(propertyValue)!.push(node);
    });
    
    // Calculate dimensions based on content
    const { lanePositions } = this.calculateXParallelLaneDimensions(nodesByProperty);
    
    
    // Create property bounds - X-parallel lanes should span full width of Z-parallel lanes
    const propertyBounds = new Map<string, { minX: number; maxX: number; minZ: number; maxZ: number }>();
    
    // Calculate the actual X extent from the Z-parallel lanes
    let fullMinX = math.huge;
    let fullMaxX = -math.huge;
    
    zParallelLanes.forEach(lane => {
      const halfWidth = lane.Size.X / 2;
      fullMinX = math.min(fullMinX, lane.Position.X - halfWidth);
      fullMaxX = math.max(fullMaxX, lane.Position.X + halfWidth);
    });
    
    print(`[X-Parallel Lanes] Actual Z-parallel lanes X extent: [${fullMinX}, ${fullMaxX}]`);
    
    // Set same X bounds for all X-parallel lanes
    lanePositions.forEach((position, propertyValue) => {
      propertyBounds.set(propertyValue, {
        minX: fullMinX,
        maxX: fullMaxX,
        minZ: position.minZ,
        maxZ: position.maxZ
      });
    });
    
    // Create X-parallel shadow blocks with fixed dimensions
    const shadowBlockTop = BLOCK_CONSTANTS.DIMENSIONS.UNIFORM_SHADOW_THICKNESS + BLOCK_CONSTANTS.DIMENSIONS.Z_FIGHTING_OFFSET + BLOCK_CONSTANTS.DIMENSIONS.UNIFORM_SHADOW_THICKNESS / 2;
    const yPosition = shadowBlockTop + BLOCK_CONSTANTS.DIMENSIONS.SHADOW_LAYER_DISPLACEMENT;
    
    createXParallelShadowBlocks(nodesByProperty, propertyBounds, parent, yPosition, swimlaneBlocks, zAxisProperty, targetOrigin);
    return swimlaneBlocks;
  }
  
  /**
   * Calculate the Z-axis offset needed to center pet lanes
   */
  private calculatePetLaneZOffset(cluster: Cluster, zAxisProperty: string): number {
    // Organize nodes by z-axis property and find bounds
    const propertyBounds = new Map<string, { minZ: number; maxZ: number }>();
    
    cluster.groups[0].nodes.forEach(node => {
      const propertyValue = this.propertyResolver.getPropertyValue(node, zAxisProperty);
      if (!propertyBounds.has(propertyValue)) {
        propertyBounds.set(propertyValue, {
          minZ: math.huge,
          maxZ: -math.huge
        });
      }
      
      const bounds = propertyBounds.get(propertyValue)!;
      bounds.minZ = math.min(bounds.minZ, node.position.z);
      bounds.maxZ = math.max(bounds.maxZ, node.position.z);
    });
    
    // Calculate collective bounds of all pet lanes
    let collectiveMinZ = math.huge;
    let collectiveMaxZ = -math.huge;
    
    propertyBounds.forEach((bounds) => {
      collectiveMinZ = math.min(collectiveMinZ, bounds.minZ);
      collectiveMaxZ = math.max(collectiveMaxZ, bounds.maxZ);
    });
    
    // Calculate the center of the collective pet lanes
    const collectiveCenter = (collectiveMinZ + collectiveMaxZ) / 2;
    
    // The group shadow block is centered at Z=0, so we need to offset the pet lanes
    const offsetZ = 0 - collectiveCenter;
    
    return offsetZ;
  }
  
  /**
   * Calculate wall height based on cluster bounds
   */
  private calculateWallHeight(cluster: Cluster): number {
    let maxY = 0;
    cluster.groups[0].nodes.forEach(node => {
      maxY = math.max(maxY, node.position.y);
    });
    return maxY + 10; // Add some padding
  }
  
  /**
   * Create Y-axis swimlane shadows on walls
   */
  private createYAxisWallSwimlanes(cluster: Cluster, walls: Part[], config: EnhancedGeneratorConfig): void {
    if (!config.yAxisConfig || config.yAxisConfig.useLayer) return;
    
    const yAxisProperty = config.yAxisConfig.property || "type";
    const propertyGroups = new Map<string, { minY: number; maxY: number }>();
    const propertyColors = new Map<string, Color3>();
    
    // Group nodes by Y-axis property and find bounds
    cluster.groups[0].nodes.forEach(node => {
      const propertyValue = this.propertyResolver.getPropertyValue(node, yAxisProperty);
      
      if (!propertyGroups.has(propertyValue)) {
        propertyGroups.set(propertyValue, {
          minY: math.huge,
          maxY: -math.huge
        });
        // Use node color for the property
        propertyColors.set(propertyValue, new Color3(node.color[0], node.color[1], node.color[2]));
      }
      
      const bounds = propertyGroups.get(propertyValue)!;
      bounds.minY = math.min(bounds.minY, node.position.y);
      bounds.maxY = math.max(bounds.maxY, node.position.y);
    });
    
    // Create swimlane shadows on walls
    createWallSwimlanes(walls, propertyGroups, propertyColors);
  }
}
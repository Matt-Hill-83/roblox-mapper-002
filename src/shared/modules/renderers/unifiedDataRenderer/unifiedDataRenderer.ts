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
import { LabelRenderer } from "./rendering/labelRenderer";
import { createFlatBlocks, calculateBlockDimensions, createSwimLaneBlock, createZAxisShadowBlocks, FLAT_BLOCK_DEFAULTS } from "../flatBlockCreator";

export class UnifiedDataRenderer {
  private dataGenerator: DataGenerator;
  private positionCalculator: PositionCalculator;
  private nodeRenderer: NodeRenderer;
  private updateManager: UpdateManager;
  private labelRenderer: LabelRenderer;
  private currentConfig?: EnhancedGeneratorConfig;

  constructor() {
    this.dataGenerator = new DataGenerator();
    this.positionCalculator = new PositionCalculator();
    this.nodeRenderer = new NodeRenderer();
    this.updateManager = new UpdateManager();
    this.labelRenderer = new LabelRenderer();
  }

  /**
   * Main entry point - renders data based on enhanced configuration
   */
  public renderEnhancedData(parentFolder: Folder, config: EnhancedGeneratorConfig, origin?: Vector3): void {
    print("🎯 Unified renderer: Starting enhanced data generation...");
    
    // Delete any existing platform and shadow blocks
    const existingPlatform = parentFolder.FindFirstChild("PlatformBlock");
    if (existingPlatform) {
      existingPlatform.Destroy();
      print("🗑️ Deleted existing platform block");
    }
    
    // Also check for legacy flat block
    const existingBlock = parentFolder.FindFirstChild("FlatBlockFoundation");
    if (existingBlock) {
      existingBlock.Destroy();
      print("🗑️ Deleted existing flat block foundation");
    }
    
    // Generate the cluster data
    const cluster = this.dataGenerator.generateClusterFromLayers(config);
    
    // Calculate swim lane positions
    this.positionCalculator.calculateLayerSwimLanePositions(cluster, config);
    
    // Adjust positions to center bottom at origin
    const targetOrigin = origin || new Vector3(0, 0, 0);
    this.positionCalculator.centerBottomAtOrigin(cluster, targetOrigin, config);
    
    // Get bounds after positioning
    const bounds = this.positionCalculator.getClusterBounds(cluster);
    
    // Calculate block dimensions based on actual node tree bounds
    const blockDimensions = calculateBlockDimensions(bounds, 0); // No padding
    
    // Create platform and shadow blocks with calculated dimensions
    const blocks = createFlatBlocks({
      origin: targetOrigin,
      parent: parentFolder,
      width: blockDimensions.width,
      depth: blockDimensions.depth,
    });
    
    // Create swimlane blocks
    const xAxisSwimlaneBlocks = this.createSwimLaneBlocks(cluster, blocks.shadow, targetOrigin, blockDimensions, config);
    
    // Create Z-axis shadow blocks and collect them
    const zAxisSwimlaneBlocks = this.createZAxisSwimLaneBlocks(cluster, blocks.platform, config);
    
    // Render the cluster first
    this.nodeRenderer.renderCluster(cluster, parentFolder, config);
    
    // Create labels for swimlanes after rendering (so GraphMaker folder exists)
    const graphMakerFolder = parentFolder.FindFirstChild("GraphMaker") as Folder;
    if (graphMakerFolder) {
      this.createSwimLaneLabels(cluster, graphMakerFolder, config, xAxisSwimlaneBlocks, zAxisSwimlaneBlocks);
    } else {
      print("⚠️ GraphMaker folder not found for labels");
    }
    
    print(`✅ Unified renderer: Complete! Created ${cluster.groups[0].nodes.size()} nodes with swim lanes`);
    
    // Store current configuration for update comparison
    this.currentConfig = config;
  }

  /**
   * Updates existing data incrementally based on configuration changes
   */
  public updateEnhancedData(parentFolder: Folder, config: EnhancedGeneratorConfig, origin?: Vector3): void {
    print("🔄 Unified renderer: Starting incremental update...");
    
    // Find GraphMaker folder
    const graphMakerFolder = parentFolder.FindFirstChild("GraphMaker");
    if (!graphMakerFolder || !this.currentConfig) {
      print("⚠️ No existing graph found, performing full render");
      this.renderEnhancedData(parentFolder, config, origin);
      return;
    }
    
    // Find nodes and links folders
    const clusterFolder = graphMakerFolder.FindFirstChild("UnifiedDataCluster");
    if (!clusterFolder) {
      print("⚠️ No cluster folder found, performing full render");
      this.renderEnhancedData(parentFolder, config, origin);
      return;
    }
    
    const nodesFolder = clusterFolder.FindFirstChild("Nodes") as Folder;
    const linksFolder = clusterFolder.FindFirstChild("Links") as Folder;
    
    if (!nodesFolder || !linksFolder) {
      print("⚠️ Missing folders, performing full render");
      this.renderEnhancedData(parentFolder, config, origin);
      return;
    }
    
    // Delegate to update manager
    this.updateManager.performIncrementalUpdate(config, nodesFolder, linksFolder, origin || new Vector3(0, 0, 0));
    
    // Update stored configuration
    this.currentConfig = config;
    
    print("✅ Incremental update complete!");
  }

  /**
   * Creates blocks under each swimlane
   */
  private createSwimLaneBlocks(cluster: Cluster, shadowBlock: Part, origin: Vector3, shadowDimensions: { width: number; depth: number }, config: EnhancedGeneratorConfig): Map<string, Part> {
    const swimlaneBlocks = new Map<string, Part>();
    // Use axis mapping if available
    const xAxisProperty = config.axisMapping?.xAxis || "type";
    
    // Organize nodes by x-axis property to determine swimlanes
    const nodesByType = new Map<string, Node[]>();
    const typeBounds = new Map<string, { minX: number; maxX: number; minZ: number; maxZ: number }>();
    
    // Group nodes by x-axis property and calculate bounds
    cluster.groups[0].nodes.forEach(node => {
      const propertyValue = this.getNodePropertyValue(node, xAxisProperty);
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
    
    // Create a block for each swimlane with progressive sizing
    let swimlaneIndex = 0;
    nodesByType.forEach((nodes, typeName) => {
      const bounds = typeBounds.get(typeName)!;
      
      // Calculate swimlane center position
      const centerX = (bounds.minX + bounds.maxX) / 2;
      const centerZ = (bounds.minZ + bounds.maxZ) / 2;
      
      // Calculate actual swimlane dimensions based on node bounds
      // Get hexagon width from config (nodeRadius * 2)
      const hexagonWidth = (config.spacing?.nodeRadius || 0.25) * 2;
      const nodeSpacing = bounds.maxX - bounds.minX;
      const swimlaneWidth = nodeSpacing === 0 ? hexagonWidth : nodeSpacing + hexagonWidth;
      const swimlaneDepth = (bounds.maxZ - bounds.minZ) + hexagonWidth;
      
      // Use actual swimlane dimensions without progressive sizing
      const blockWidth = swimlaneWidth;
      const blockDepth = swimlaneDepth;
      
      // Fixed Y position for all swimlane blocks
      const blockYPosition = 1.5 + FLAT_BLOCK_DEFAULTS.zFightingFix;
      
      // Get the color from the first node of this type
      const nodeColor = nodes[0].color;
      const color = new Color3(nodeColor[0], nodeColor[1], nodeColor[2]);
      
      // Create swimlane block
      const swimlaneBlock = createSwimLaneBlock({
        position: new Vector3(centerX, blockYPosition, centerZ),
        width: blockWidth,
        depth: blockDepth,
        height: 3,
        color: color,
        typeName: typeName,
        parent: shadowBlock
      });
      
      // Store the block in the map
      swimlaneBlocks.set(typeName, swimlaneBlock);
      
      swimlaneIndex++;
    });
    
    print(`✅ Created ${nodesByType.size()} swimlane blocks`);
    return swimlaneBlocks;
  }
  
  /**
   * Get property value from node
   */
  private getNodePropertyValue(node: Node, propertyName: string): string {
    if (propertyName === "type") {
      return node.type;
    } else if (propertyName === "age") {
      const age = node.properties?.age;
      if (age !== undefined) {
        // Group ages into ranges
        if (age < 20) return "0-19";
        if (age < 40) return "20-39";
        if (age < 60) return "40-59";
        if (age < 80) return "60-79";
        return "80+";
      }
      return "Unknown";
    } else if (node.properties && propertyName in node.properties) {
      // Type-safe property access
      if (propertyName === "petType") {
        return node.properties.petType || "None";
      } else if (propertyName === "petColor") {
        return node.properties.petColor || "None";
      }
      return "None";
    }
    return "Unknown";
  }
  
  /**
   * Creates labels for X and Z axis swimlanes
   */
  private createSwimLaneLabels(
    cluster: Cluster,
    parentFolder: Folder,
    config?: EnhancedGeneratorConfig,
    xAxisBlocks?: Map<string, Part>,
    zAxisBlocks?: Map<string, Part>
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
      const xValue = this.getNodePropertyValue(node, xAxisProperty);
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
      const zValue = this.getNodePropertyValue(node, zAxisProperty);
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
    this.labelRenderer.createXAxisLabels(nodesByXProperty, xPropertyBounds, parentFolder, 0, xAxisBlocks);
    this.labelRenderer.createZAxisLabels(zPropertyBounds, parentFolder, 0, zAxisBlocks);
  }
  
  /**
   * Creates Z-axis shadow blocks for property swimlanes
   */
  private createZAxisSwimLaneBlocks(cluster: Cluster, parent: Part, config?: EnhancedGeneratorConfig): Map<string, Part> {
    const swimlaneBlocks = new Map<string, Part>();
    // Use axis mapping if available
    const zAxisProperty = config?.axisMapping?.zAxis || "petType";
    
    // Organize nodes by z-axis property
    const nodesByProperty = new Map<string, Node[]>();
    const propertyBounds = new Map<string, { minX: number; maxX: number; minZ: number; maxZ: number }>();
    
    cluster.groups[0].nodes.forEach(node => {
      const propertyValue = this.getNodePropertyValue(node, zAxisProperty);
      if (!nodesByProperty.has(propertyValue)) {
        nodesByProperty.set(propertyValue, []);
        propertyBounds.set(propertyValue, {
          minX: math.huge,
          maxX: -math.huge,
          minZ: math.huge,
          maxZ: -math.huge
        });
      }
      
      nodesByProperty.get(propertyValue)!.push(node);
      
      const bounds = propertyBounds.get(propertyValue)!;
      bounds.minX = math.min(bounds.minX, node.position.x);
      bounds.maxX = math.max(bounds.maxX, node.position.x);
      bounds.minZ = math.min(bounds.minZ, node.position.z);
      bounds.maxZ = math.max(bounds.maxZ, node.position.z);
    });
    
    // Create Z-axis shadow blocks (raised by 0.1 for visibility)
    createZAxisShadowBlocks(nodesByProperty, propertyBounds, parent, 0.6, swimlaneBlocks);
    return swimlaneBlocks;
  }
}
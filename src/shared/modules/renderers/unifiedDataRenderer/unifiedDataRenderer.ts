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
import { createFlatBlocks, calculateBlockDimensions, createSwimLaneBlock, FLAT_BLOCK_DEFAULTS } from "../flatBlockCreator";

export class UnifiedDataRenderer {
  private dataGenerator: DataGenerator;
  private positionCalculator: PositionCalculator;
  private nodeRenderer: NodeRenderer;
  private updateManager: UpdateManager;
  private currentConfig?: EnhancedGeneratorConfig;

  constructor() {
    this.dataGenerator = new DataGenerator();
    this.positionCalculator = new PositionCalculator();
    this.nodeRenderer = new NodeRenderer();
    this.updateManager = new UpdateManager();
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
    this.createSwimLaneBlocks(cluster, blocks.shadow, targetOrigin, blockDimensions, config);
    
    // Render the cluster
    this.nodeRenderer.renderCluster(cluster, parentFolder, config);
    
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
  private createSwimLaneBlocks(cluster: Cluster, shadowBlock: Part, origin: Vector3, shadowDimensions: { width: number; depth: number }, config: EnhancedGeneratorConfig): void {
    // Organize nodes by type to determine swimlanes
    const nodesByType = new Map<string, Node[]>();
    const typeBounds = new Map<string, { minX: number; maxX: number; minZ: number; maxZ: number }>();
    
    // Group nodes by type and calculate bounds for each type
    cluster.groups[0].nodes.forEach(node => {
      if (!nodesByType.has(node.type)) {
        nodesByType.set(node.type, []);
        typeBounds.set(node.type, {
          minX: math.huge,
          maxX: -math.huge,
          minZ: math.huge,
          maxZ: -math.huge
        });
      }
      
      nodesByType.get(node.type)!.push(node);
      
      const bounds = typeBounds.get(node.type)!;
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
      createSwimLaneBlock({
        position: new Vector3(centerX, blockYPosition, centerZ),
        width: blockWidth,
        depth: blockDepth,
        height: 3,
        color: color,
        typeName: typeName,
        parent: shadowBlock
      });
      
      swimlaneIndex++;
    });
    
    print(`✅ Created ${nodesByType.size()} swimlane blocks`);
  }
}
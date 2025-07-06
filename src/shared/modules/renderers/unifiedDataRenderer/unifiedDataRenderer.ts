/**
 * Unified Data Renderer - Refactored Version
 * 
 * Main orchestrator that delegates to specialized modules
 */

import { EnhancedGeneratorConfig } from "../../../interfaces/enhancedGenerator.interface";
import { DataGenerator } from "./core/dataGenerator";
import { PositionCalculator } from "./core/positionCalculator";
import { NodeRenderer } from "./rendering/nodeRenderer";
import { UpdateManager } from "./rendering/updateManager";

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
    
    // Generate the cluster data
    const cluster = this.dataGenerator.generateClusterFromLayers(config);
    
    // Calculate swim lane positions
    this.positionCalculator.calculateLayerSwimLanePositions(cluster, config);
    
    // Adjust positions to center bottom at origin
    const targetOrigin = origin || new Vector3(0, 0, 0);
    this.positionCalculator.centerBottomAtOrigin(cluster, targetOrigin);
    
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
}
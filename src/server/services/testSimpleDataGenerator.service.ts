import { SimpleDataGeneratorService } from "./simpleDataGenerator.service";
import { SimpleDataLayoutService } from "./simpleDataLayout.service";
import { SimpleDataRendererService } from "./simpleDataRenderer.service";
import { GeneratorConfig } from "../../shared/interfaces/simpleDataGenerator.interface";
import { config001 } from "../configs/simpleDataGeneratorConfigs";

export class TestSimpleDataGeneratorService {
  
  private generator = new SimpleDataGeneratorService();
  private layout = new SimpleDataLayoutService();
  private renderer = new SimpleDataRendererService();
  
  /**
   * Runs a test of the simple data generator with default settings
   */
  public runDefaultTest(parentFolder: Folder): void {
    print("🧪 Running Simple Data Generator Test...");
    
    // Generate a cluster with default configuration
    const cluster = this.generator.generateCluster();
    
    // Print summary
    this.generator.printClusterSummary(cluster);
    
    // Calculate layout
    print("📐 Calculating layout...");
    this.layout.calculateLayout(cluster);
    
    // Render the cluster
    print("🎨 Rendering cluster...");
    this.renderer.renderCluster(cluster, parentFolder);
    
    print("✅ Test complete!");
  }
  
  /**
   * Runs a test with custom configuration
   */
  public runCustomTest(parentFolder: Folder, config: Partial<GeneratorConfig>): void {
    print("🧪 Running Custom Simple Data Generator Test...");
    print(`  Config: ${config}`);
    
    // Generate cluster
    const cluster = this.generator.generateCluster(config);
    
    // Print summary
    this.generator.printClusterSummary(cluster);
    
    // Calculate layout
    print("📐 Calculating layout...");
    this.layout.calculateLayout(cluster);
    
    // Render the cluster
    print("🎨 Rendering cluster...");
    this.renderer.renderCluster(cluster, parentFolder);
    
    print("✅ Custom test complete!");
  }
  
  /**
   * Runs a small People & Animals demo
   */
  public runPeopleAnimalsDemo(parentFolder: Folder): void {
    print("🐾 Running People & Animals Demo...");
    
    // Generate and render using config001
    const cluster = this.generator.generateCluster(config001);
    this.generator.printClusterSummary(cluster);
    this.layout.calculateLayout(cluster);
    this.renderer.renderCluster(cluster, parentFolder);
    
    // Print some example relationships
    print("\n📋 Sample Relationships:");
    const sampleCount = math.min(5, cluster.relations.size());
    for (let i = 0; i < sampleCount; i++) {
      const relation = cluster.relations[i];
      
      // Find source and target nodes
      let sourceName = "Unknown";
      let targetName = "Unknown";
      
      cluster.groups.forEach(group => {
        group.nodes.forEach(node => {
          if (node.uuid === relation.sourceNodeUuid) {
            sourceName = `${node.name} (${node.type})`;
          }
          if (node.uuid === relation.targetNodeUuid) {
            targetName = `${node.name} (${node.type})`;
          }
        });
      });
      
      print(`  - ${sourceName} ${relation.type} ${targetName}`);
    }
    
    print("\n✅ People & Animals demo complete!");
  }
}
import { ReplicatedStorage } from "@rbxts/services";
import { GraphBlasterDataMapperService } from "./graphBlasterDataMapper.service";
import { GraphBlasterNodePlacerService } from "./graphBlasterNodePlacer.service";
import { GraphBlasterConnectionRendererService } from "./graphBlasterConnectionRenderer.service";
import { DataGeneratorService } from "../dataGeneration/dataGenerator.service";
import { graphBlasterLayoutMaker } from "../../graphBlasterLayoutMaker";
import { Person } from "../dataGeneration/types/person.interface";

interface AxisMapping {
  xAxis: string;
  yAxis: string;
  zAxis: string;
}

interface Relationship {
  person1: string;
  person2: string;
  type: string;
}

/**
 * Manages the entire GraphBlaster visualization including GUI
 */
export class GraphBlasterManagerService {
  private dataMapper: GraphBlasterDataMapperService;
  private nodePlacer: GraphBlasterNodePlacerService;
  private connectionRenderer: GraphBlasterConnectionRendererService;
  private dataGenerator: DataGeneratorService;
  private remoteEvent: RemoteEvent;
  
  private currentLayout?: {
    layoutModel: Model;
    rubixCubeService: any;
  };
  
  private currentData?: {
    persons: Person[];
    relationships: Relationship[];
  };
  
  private parent: Instance;
  private origin: Vector3;

  constructor(parent: Instance, origin: Vector3) {
    this.parent = parent;
    this.origin = origin;
    
    // Initialize services
    this.dataGenerator = new DataGeneratorService();
    this.dataMapper = new GraphBlasterDataMapperService();
    this.nodePlacer = new GraphBlasterNodePlacerService(this.dataMapper);
    this.connectionRenderer = new GraphBlasterConnectionRendererService(this.dataMapper);
    
    // Create remote event for client-server communication
    this.remoteEvent = new Instance("RemoteEvent");
    this.remoteEvent.Name = "GraphBlasterRemoteEvent";
    this.remoteEvent.Parent = ReplicatedStorage;
    
    // Setup remote event listener
    this.setupRemoteEventListener();
  }

  /**
   * Setup remote event listener for client commands
   */
  private setupRemoteEventListener(): void {
    this.remoteEvent.OnServerEvent.Connect((player: Player, ...args: unknown[]) => {
      const command = args[0];
      const data = args[1];
      
      if (command === "UpdateAxisMapping" && typeIs(data, "table")) {
        const mapping = data as AxisMapping;
        this.onMappingChanged(mapping);
      }
    });
  }

  /**
   * Initialize GraphBlaster with data and GUI
   */
  public initialize(): void {
    // Generate initial data
    this.currentData = this.dataGenerator.generateSampleData();
    
    // Analyze data and create initial visualization
    this.createVisualization();
    
    // Tell clients to create GUI
    this.remoteEvent.FireAllClients("CreateGui");
    
    print("GraphBlaster initialized - GUI will be created on client");
  }

  /**
   * Create or recreate the visualization
   */
  private createVisualization(): void {
    if (!this.currentData) return;
    
    // Clear existing visualization
    if (this.currentLayout) {
      this.currentLayout.layoutModel.Destroy();
      this.currentLayout = undefined;
    }
    
    // Clear existing nodes and connections
    this.nodePlacer.clear();
    this.connectionRenderer.clear();
    
    // Analyze the data
    const config = this.dataMapper.analyzeData(this.currentData.persons);
    
    // Create GraphBlaster layout with dynamic sizing
    const gbLayout = graphBlasterLayoutMaker({
      origin: this.origin,
      rubixCubeProps: {
        numBlocks: {
          x: config.uniqueCounts.x,
          y: config.uniqueCounts.y,
          z: config.uniqueCounts.z,
        },
        blockSize: {
          x: 10,
          y: 4,
          z: 10,
        },
      },
      parent: this.parent,
    });
    
    this.currentLayout = gbLayout;
    
    print("Created GraphBlaster layout with dimensions: " + 
      config.uniqueCounts.x + "x" + config.uniqueCounts.y + "x" + config.uniqueCounts.z);
    
    // Place person nodes
    this.nodePlacer.placeNodes(
      this.currentData.persons, 
      gbLayout.rubixCubeService, 
      gbLayout.layoutModel
    );
    
    // Render connections
    this.connectionRenderer.renderConnections(
      this.currentData.persons,
      this.currentData.relationships,
      gbLayout.rubixCubeService,
      gbLayout.layoutModel
    );
  }

  /**
   * Handle axis mapping change from GUI
   */
  private onMappingChanged(mapping: AxisMapping): void {
    print("GraphBlaster axis mapping changed, recreating visualization...");
    print(`  X Axis: ${mapping.xAxis}`);
    print(`  Y Axis: ${mapping.yAxis}`);
    print(`  Z Axis: ${mapping.zAxis}`);
    
    // Update the data mapper with new mapping
    this.dataMapper.setPropertyMapping(mapping.xAxis, mapping.yAxis, mapping.zAxis);
    
    // Recreate the visualization
    this.createVisualization();
  }

  /**
   * Update with new data
   */
  public updateData(persons: Person[], relationships: Relationship[]): void {
    this.currentData = { persons, relationships };
    this.createVisualization();
  }

  /**
   * Destroy the manager and cleanup
   */
  public destroy(): void {
    this.nodePlacer.clear();
    this.connectionRenderer.clear();
    
    if (this.currentLayout) {
      this.currentLayout.layoutModel.Destroy();
      this.currentLayout = undefined;
    }
    
    // Tell clients to destroy GUI
    this.remoteEvent.FireAllClients("DestroyGui");
    
    // Destroy remote event
    this.remoteEvent.Destroy();
  }
}
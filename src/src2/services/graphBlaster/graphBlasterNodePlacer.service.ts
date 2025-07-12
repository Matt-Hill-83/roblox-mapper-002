import { Person } from "../dataGeneration/types/person.interface";
import { GraphBlasterDataMapperService } from "./graphBlasterDataMapper.service";
import { makeBlock } from "../../validation/blockMaker";
import { RubixCubeService, RubixConfig } from "../../validation/rubixCubeService";

interface NodeData {
  persons: Person[];
  position: Vector3;
}

/**
 * Places person nodes within an existing GraphBlaster rubix cube layout
 */
export class GraphBlasterNodePlacerService {
  private nodes = new Map<string, NodeData>();
  private nodeModels = new Map<string, Model>();

  constructor(private dataMapper: GraphBlasterDataMapperService) {}

  /**
   * Places person nodes within the existing rubix cube
   */
  public placeNodes(
    persons: Person[],
    rubixCubeService: RubixCubeService,
    container: Model
  ): void {
    // Clear any existing nodes
    this.clear();

    // Get the rubix cube model and config
    const rubixCubeModel = rubixCubeService.getModel();
    const rubixConfig = rubixCubeService.getConfig();
    
    if (!rubixCubeModel || !rubixConfig) {
      error("RubixCubeService not initialized");
    }

    // Group persons by their grid position
    this.groupPersonsByPosition(persons);

    // Get the rubix cube origin from the service
    const rubixOrigin = rubixCubeService.getOrigin();
    if (!rubixOrigin) {
      error("RubixCube origin not set");
    }

    // Create nodes inside the rubix cube structure
    this.createNodesInRubixCube(rubixOrigin, rubixConfig, rubixCubeModel);

    print(`=== GraphBlaster Nodes Placed ===`);
    print(`Total positions with data: ${this.nodes.size()}`);
  }

  /**
   * Groups persons by their 3D grid position
   */
  private groupPersonsByPosition(persons: Person[]): void {
    this.nodes.clear();

    persons.forEach((person) => {
      const position = this.dataMapper.getPersonPosition(person);
      const key = `${position.X},${position.Y},${position.Z}`;

      let nodeData = this.nodes.get(key);
      if (!nodeData) {
        nodeData = {
          persons: [],
          position: position,
        };
        this.nodes.set(key, nodeData);
      }

      nodeData.persons.push(person);
    });
  }

  /**
   * Creates visual nodes inside the existing rubix cube blocks
   */
  private createNodesInRubixCube(
    origin: Vector3,
    rubixConfig: RubixConfig,
    rubixCubeModel: Model
  ): void {
    const blockSize = rubixConfig.blockSize || { x: 3, y: 3, z: 3 };
    const numBlocks = rubixConfig.numBlocks;
    const spacing = new Vector3(blockSize.x + 0.5, blockSize.y + 0.5, blockSize.z + 0.5);

    this.nodes.forEach((nodeData, key) => {
      const gridPos = nodeData.position;
      const personCount = nodeData.persons.size();

      // Calculate world position based on grid position
      const worldPos = origin.add(
        new Vector3(
          (gridPos.X - (numBlocks.x - 1) / 2) * spacing.X,
          (gridPos.Y - (numBlocks.y - 1) / 2) * spacing.Y,
          (gridPos.Z - (numBlocks.z - 1) / 2) * spacing.Z
        )
      );

      // Create node model as child of the rubix cube
      const nodeModel = new Instance("Model");
      nodeModel.Name = `Node_${key}_Count${personCount}`;
      nodeModel.Parent = rubixCubeModel;

      // Standard node size for all nodes
      const standardNodeSize = 1; // 1x1x1 as requested
      
      if (personCount === 1) {
        // Single person - place in center
        const nodeBlock = makeBlock({
          position: worldPos,
          size: new Vector3(standardNodeSize, standardNodeSize, standardNodeSize),
          parent: nodeModel,
          nameStub: "PersonNode",
          color: this.getNodeColor(personCount),
          transparency: 0,
          material: Enum.Material.Concrete,
          labels: {
            front: tostring(personCount),
          },
        });

        // Store node data as attributes for interaction
        nodeBlock.SetAttribute("personCount", personCount);
        nodeBlock.SetAttribute("gridPosition", key);

        // Store person's data for display
        const person = nodeData.persons[0];
        nodeBlock.SetAttribute("personName", `${person.firstName} ${person.lastName}`);
        nodeBlock.SetAttribute("petType", person.petType);
        nodeBlock.SetAttribute("countryLivesIn", person.countryLivesIn);
        nodeBlock.SetAttribute("country", person.country);
      } else {
        // Multiple persons - place in grid pattern on floor
        const gridSize = math.ceil(math.sqrt(personCount));
        const floorY = worldPos.Y - blockSize.y / 2 + standardNodeSize / 2 + 0.1; // Place on floor with small offset
        
        // Calculate grid spacing
        const gridSpacing = blockSize.x / (gridSize + 1);
        const startX = worldPos.X - (gridSize - 1) * gridSpacing / 2;
        const startZ = worldPos.Z - (gridSize - 1) * gridSpacing / 2;
        
        // Create individual nodes in grid pattern
        nodeData.persons.forEach((person, index) => {
          const row = math.floor(index / gridSize);
          const col = index % gridSize;
          
          // Skip if we've exceeded our grid (shouldn't happen with ceil(sqrt))
          if (row >= gridSize) return;
          
          const nodePos = new Vector3(
            startX + col * gridSpacing,
            floorY,
            startZ + row * gridSpacing
          );
          
          const personNode = makeBlock({
            position: nodePos,
            size: new Vector3(standardNodeSize, standardNodeSize, standardNodeSize),
            parent: nodeModel,
            nameStub: `PersonNode_${index}`,
            color: this.getNodeColor(1), // Use single person color
            transparency: 0,
            material: Enum.Material.Concrete,
            labels: {
              front: person.firstName.sub(1, 3), // First 3 letters of name
            },
          });
          
          // Store individual person data
          personNode.SetAttribute("personName", `${person.firstName} ${person.lastName}`);
          personNode.SetAttribute("petType", person.petType);
          personNode.SetAttribute("countryLivesIn", person.countryLivesIn);
          personNode.SetAttribute("country", person.country);
          personNode.SetAttribute("gridPosition", key);
        });
      }

      this.nodeModels.set(key, nodeModel);
    });
  }

  /**
   * Gets node color based on person count
   */
  private getNodeColor(count: number): Color3 {
    if (count === 1) {
      return new Color3(0.3, 0.6, 1); // Blue for single person
    } else if (count <= 3) {
      return new Color3(0.3, 1, 0.6); // Green for 2-3 persons
    } else if (count <= 5) {
      return new Color3(1, 1, 0.3); // Yellow for 4-5 persons
    } else {
      return new Color3(1, 0.3, 0.3); // Red for 6+ persons
    }
  }

  /**
   * Clears existing nodes
   */
  public clear(): void {
    this.nodeModels.forEach((model) => {
      model.Destroy();
    });
    this.nodes.clear();
    this.nodeModels.clear();
  }
}
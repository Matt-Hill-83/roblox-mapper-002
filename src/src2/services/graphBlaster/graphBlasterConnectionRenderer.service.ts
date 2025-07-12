import { Person } from "../dataGeneration/types/person.interface";
import { GraphBlasterDataMapperService } from "./graphBlasterDataMapper.service";
import { RubixCubeService, RubixConfig } from "../../validation/rubixCubeService";

interface Relationship {
  person1: string;
  person2: string;
  type: string;
}

/**
 * Renders connections (rods) between related person nodes
 */
export class GraphBlasterConnectionRendererService {
  private connections: Model[] = [];
  private personPositions = new Map<string, Vector3>();

  constructor(
    private dataMapper: GraphBlasterDataMapperService
  ) {}

  /**
   * Renders connections between related persons
   */
  public renderConnections(
    persons: Person[],
    relationships: Relationship[],
    rubixCubeService: RubixCubeService,
    container: Model
  ): void {
    // Clear any existing connections
    this.clear();

    // Get rubix cube configuration
    const rubixConfig = rubixCubeService.getConfig();
    const rubixOrigin = rubixCubeService.getOrigin();
    
    if (!rubixConfig || !rubixOrigin) {
      error("RubixCubeService not initialized");
    }

    // Calculate person positions
    this.calculatePersonPositions(persons, rubixOrigin, rubixConfig);

    // Create connections model
    const connectionsModel = new Instance("Model");
    connectionsModel.Name = "Connections";
    connectionsModel.Parent = container;

    // Render each relationship as a rod
    relationships.forEach((relationship, index) => {
      this.renderConnection(relationship, connectionsModel, index);
    });

    print(`=== GraphBlaster Connections Rendered ===`);
    print(`Total connections: ${relationships.size()}`);
  }

  /**
   * Calculate world positions for all persons
   */
  private calculatePersonPositions(
    persons: Person[],
    origin: Vector3,
    rubixConfig: RubixConfig
  ): void {
    const blockSize = rubixConfig.blockSize || { x: 10, y: 5, z: 10 };
    const numBlocks = rubixConfig.numBlocks;
    const spacing = new Vector3(blockSize.x + 0.5, blockSize.y + 0.5, blockSize.z + 0.5);

    // First, group persons by their grid position to determine count per position
    const positionGroups = new Map<string, Person[]>();
    persons.forEach((person) => {
      const gridPos = this.dataMapper.getPersonPosition(person);
      const key = `${gridPos.X},${gridPos.Y},${gridPos.Z}`;
      
      let group = positionGroups.get(key);
      if (!group) {
        group = [];
        positionGroups.set(key, group);
      }
      group.push(person);
    });

    // Now calculate positions for each person
    persons.forEach((person) => {
      const gridPos = this.dataMapper.getPersonPosition(person);
      const key = `${gridPos.X},${gridPos.Y},${gridPos.Z}`;
      const group = positionGroups.get(key)!;
      const personCount = group.size();
      
      // Calculate base world position for the rubix cube block
      const baseWorldPos = origin.add(
        new Vector3(
          (gridPos.X - (numBlocks.x - 1) / 2) * spacing.X,
          (gridPos.Y - (numBlocks.y - 1) / 2) * spacing.Y,
          (gridPos.Z - (numBlocks.z - 1) / 2) * spacing.Z
        )
      );

      if (personCount === 1) {
        // Single person - use center position
        this.personPositions.set(person.guid, baseWorldPos);
      } else {
        // Multiple persons - calculate grid position
        const personIndex = group.indexOf(person);
        const gridSize = math.ceil(math.sqrt(personCount));
        const standardNodeSize = 0.5; // 50% smaller (was 1x1x1)
        const floorY = baseWorldPos.Y - blockSize.y / 2 + standardNodeSize / 2 + 0.1;
        
        // Calculate grid spacing and position
        const gridSpacing = blockSize.x / (gridSize + 1);
        const startX = baseWorldPos.X - (gridSize - 1) * gridSpacing / 2;
        const startZ = baseWorldPos.Z - (gridSize - 1) * gridSpacing / 2;
        
        const row = math.floor(personIndex / gridSize);
        const col = personIndex % gridSize;
        
        const nodePos = new Vector3(
          startX + col * gridSpacing,
          floorY,
          startZ + row * gridSpacing
        );
        
        this.personPositions.set(person.guid, nodePos);
      }
    });
  }

  /**
   * Render a single connection between two persons
   */
  private renderConnection(
    relationship: Relationship,
    parent: Model,
    index: number
  ): void {
    const pos1 = this.personPositions.get(relationship.person1);
    const pos2 = this.personPositions.get(relationship.person2);

    if (!pos1 || !pos2) {
      // One or both persons not found
      return;
    }

    // Skip if same position (people at same location)
    if (pos1.X === pos2.X && pos1.Y === pos2.Y && pos1.Z === pos2.Z) {
      return;
    }

    // Calculate rod properties
    const midpoint = pos1.add(pos2).div(2);
    const direction = pos2.sub(pos1);
    const length = direction.Magnitude;
    const directionUnit = direction.Unit;

    // Create cylinder rod
    const rod = new Instance("Part");
    rod.Name = `Connection_${index}_${relationship.type}`;
    rod.Shape = Enum.PartType.Cylinder;
    rod.Material = Enum.Material.Concrete;
    rod.TopSurface = Enum.SurfaceType.Smooth;
    rod.BottomSurface = Enum.SurfaceType.Smooth;
    rod.CastShadow = false;
    
    // Set size - for cylinders, first dimension is length
    const diameter = 0.2;
    rod.Size = new Vector3(length, diameter, diameter);
    
    // Set color
    rod.Color = this.getConnectionColor(relationship.type);
    rod.Transparency = 0; // No transparency
    
    // Position and orient the cylinder
    rod.CFrame = CFrame.lookAt(midpoint, midpoint.add(directionUnit))
      .mul(CFrame.Angles(0, math.rad(90), 0));
    
    // Make it non-collidable
    rod.CanCollide = false;
    rod.CanQuery = false;
    rod.CanTouch = false;
    rod.Anchored = true;
    
    rod.Parent = parent;

    // Store connection
    this.connections.push(parent);
  }

  /**
   * Get color based on relationship type
   */
  private getConnectionColor(relationshipType: string): Color3 {
    switch (relationshipType) {
      case "friend":
        return new Color3(0.3, 0.8, 0.3); // Green
      case "colleague":
        return new Color3(0.3, 0.3, 0.8); // Blue
      case "family":
        return new Color3(0.8, 0.3, 0.3); // Red
      case "neighbor":
        return new Color3(0.8, 0.8, 0.3); // Yellow
      case "mentor":
        return new Color3(0.8, 0.3, 0.8); // Purple
      default:
        return new Color3(0.5, 0.5, 0.5); // Gray
    }
  }

  /**
   * Clear existing connections
   */
  public clear(): void {
    this.connections.forEach((connection) => {
      connection.Destroy();
    });
    this.connections = [];
    this.personPositions.clear();
  }
}
import { Person } from "../dataGeneration/types/person.interface";
import { GraphBlasterDataMapperService } from "./graphBlasterDataMapper.service";
import { makeBlock } from "../../validation/blockMaker";
import { RubixCubeService } from "../../validation/rubixCubeService";

interface NodeData {
  persons: Person[];
  position: Vector3;
}

export class GraphBlasterVisualizerService {
  private nodes = new Map<string, NodeData>();
  private nodeModels = new Map<string, Model>();
  private rubixCubeService?: RubixCubeService;
  private container?: Model;

  constructor(private dataMapper: GraphBlasterDataMapperService) {}

  /**
   * Visualizes persons data in a 3D grid
   */
  public visualize(persons: Person[], parent: Instance, origin: Vector3): Model {
    // Clear any existing visualization
    this.clear();

    // Create container
    this.container = new Instance("Model");
    this.container.Name = "GraphBlasterVisualization";
    this.container.Parent = parent;

    // Analyze data and create mappings
    const config = this.dataMapper.analyzeData(persons);

    // Create rubix cube grid (6x6x6 to accommodate 5 values + "Other")
    this.rubixCubeService = new RubixCubeService();
    const rubixConfig = {
      numBlocks: { x: 6, y: 6, z: 6 },
      blockSize: { x: 3, y: 3, z: 3 },
    };

    // Generate the rubix cube structure
    this.rubixCubeService.generateData(origin, rubixConfig);
    const rubixCube = this.rubixCubeService.render(this.container);

    // Make rubix cube blocks more transparent
    rubixCube.GetDescendants().forEach((desc) => {
      if (desc.IsA("BasePart")) {
        desc.Transparency = 0.95; // Very transparent
      }
    });

    // Group persons by their grid position
    this.groupPersonsByPosition(persons);

    // Create visualization nodes
    this.createNodes(origin, rubixConfig);

    // Add axis labels
    this.createAxisLabels(origin, rubixConfig, config);

    return this.container;
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

    print(`=== GraphBlaster Node Distribution ===`);
    print(`Total positions with data: ${this.nodes.size()}`);
  }

  /**
   * Creates visual nodes for each position with persons
   */
  private createNodes(origin: Vector3, rubixConfig: { blockSize: { x: number; y: number; z: number }; numBlocks: { x: number; y: number; z: number } }): void {
    const blockSize = rubixConfig.blockSize;
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

      // Create node model
      const nodeModel = new Instance("Model");
      nodeModel.Name = `Node_${key}_Count${personCount}`;
      nodeModel.Parent = this.container;

      // Create visual representation based on person count
      const nodeSize = math.min(1 + personCount * 0.1, 2.5); // Scale based on count
      const nodeBlock = makeBlock({
        position: worldPos,
        size: new Vector3(nodeSize, nodeSize, nodeSize),
        parent: nodeModel,
        nameStub: "PersonNode",
        color: this.getNodeColor(personCount),
        transparency: 0.2,
        material: Enum.Material.Neon,
        labels: {
          front: tostring(personCount),
        },
      });

      // Store node data as attributes for interaction
      nodeBlock.SetAttribute("personCount", personCount);
      nodeBlock.SetAttribute("gridPosition", key);

      // Store first person's data for display
      const firstPerson = nodeData.persons[0];
      nodeBlock.SetAttribute("samplePerson", `${firstPerson.firstName} ${firstPerson.lastName}`);
      nodeBlock.SetAttribute("petType", firstPerson.petType);
      nodeBlock.SetAttribute("countryLivesIn", firstPerson.countryLivesIn);
      nodeBlock.SetAttribute("country", firstPerson.country);

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
   * Creates axis labels for the visualization
   */
  private createAxisLabels(origin: Vector3, rubixConfig: { blockSize: { x: number; y: number; z: number }; numBlocks: { x: number; y: number; z: number } }, config: any): void {
    const blockSize = rubixConfig.blockSize;
    const numBlocks = rubixConfig.numBlocks;
    const spacing = new Vector3(blockSize.x + 0.5, blockSize.y + 0.5, blockSize.z + 0.5);

    // X-axis label (petType)
    const xLabelPos = origin.add(new Vector3(0, -(numBlocks.y / 2 + 2) * spacing.Y, -(numBlocks.z / 2 + 2) * spacing.Z));
    makeBlock({
      position: xLabelPos,
      size: new Vector3(20, 1, 4),
      parent: this.container,
      nameStub: "XAxisLabel",
      transparency: 0.5,
      color: new Color3(1, 0.5, 0.5),
      labels: {
        top: "X: Pet Type",
      },
    });

    // Y-axis label (countryLivesIn)
    const yLabelPos = origin.add(new Vector3(-(numBlocks.x / 2 + 2) * spacing.X, 0, -(numBlocks.z / 2 + 2) * spacing.Z));
    makeBlock({
      position: yLabelPos,
      size: new Vector3(4, 20, 1),
      parent: this.container,
      nameStub: "YAxisLabel",
      transparency: 0.5,
      color: new Color3(0.5, 1, 0.5),
      labels: {
        right: "Y: Country Lives In",
      },
    });

    // Z-axis label (country)
    const zLabelPos = origin.add(new Vector3(-(numBlocks.x / 2 + 2) * spacing.X, -(numBlocks.y / 2 + 2) * spacing.Y, 0));
    makeBlock({
      position: zLabelPos,
      size: new Vector3(4, 1, 20),
      parent: this.container,
      nameStub: "ZAxisLabel",
      transparency: 0.5,
      color: new Color3(0.5, 0.5, 1),
      labels: {
        right: "Z: Country",
      },
    });
  }

  /**
   * Clears the current visualization
   */
  public clear(): void {
    if (this.container) {
      this.container.Destroy();
    }
    this.nodes.clear();
    this.nodeModels.clear();
  }
}
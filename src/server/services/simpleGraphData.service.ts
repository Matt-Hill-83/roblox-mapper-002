// Simple graph data for testing - 3 blocks with parent-child relationships

export interface SimpleEntity {
  guid: string;
  name: string;
  creation_timestamp: string;
  creation_source: string;
  spec_description: string;
  spec_type: string;
}

export interface SimpleRelation {
  guid: string;
  name: string;
  source_guid: string;
  source_type: string;
  target_guid: string;
  target_type: string;
  creation_timestamp: string;
  creation_source: string;
}

// Export data in the same format as the existing data files
export const simpleEntityData = [
  {
    guid: "parent-001",
    name: "ParentBlock",
    creation_timestamp: "2024-01-01T00:00:00.000Z",
    creation_source: "simple-graph-test",
    spec_description: "Parent block that owns two child blocks",
    spec_type: "system"
  },
  {
    guid: "child-001",
    name: "ChildBlock1",
    creation_timestamp: "2024-01-01T00:00:00.000Z",
    creation_source: "simple-graph-test",
    spec_description: "First child block owned by parent",
    spec_type: "component"
  },
  {
    guid: "child-002",
    name: "ChildBlock2",
    creation_timestamp: "2024-01-01T00:00:00.000Z",
    creation_source: "simple-graph-test",
    spec_description: "Second child block owned by parent",
    spec_type: "component"
  }
];

export const simpleRelationOwnsData = [
  {
    guid: "relation-001",
    name: "parent_owns_child1",
    source_guid: "parent-001",
    source_type: "system",
    target_guid: "child-001",
    target_type: "component",
    creation_timestamp: "2024-01-01T00:00:00.000Z",
    creation_source: "simple-graph-test"
  },
  {
    guid: "relation-002",
    name: "parent_owns_child2",
    source_guid: "parent-001",
    source_type: "system",
    target_guid: "child-002",
    target_type: "component",
    creation_timestamp: "2024-01-01T00:00:00.000Z",
    creation_source: "simple-graph-test"
  }
];

export class SimpleGraphDataService {
  // Create 3 simple entities: 1 parent and 2 children
  public getSimpleEntities(): SimpleEntity[] {
    return [
      {
        guid: "parent-001",
        name: "ParentBlock",
        creation_timestamp: "2024-01-01T00:00:00.000Z",
        creation_source: "simple-graph-test",
        spec_description: "Parent block that owns two child blocks",
        spec_type: "system"
      },
      {
        guid: "child-001",
        name: "ChildBlock1",
        creation_timestamp: "2024-01-01T00:00:00.000Z",
        creation_source: "simple-graph-test",
        spec_description: "First child block owned by parent",
        spec_type: "component"
      },
      {
        guid: "child-002",
        name: "ChildBlock2",
        creation_timestamp: "2024-01-01T00:00:00.000Z",
        creation_source: "simple-graph-test",
        spec_description: "Second child block owned by parent",
        spec_type: "component"
      }
    ];
  }

  // Create 2 relations linking parent to each child
  public getSimpleRelations(): SimpleRelation[] {
    return [
      {
        guid: "relation-001",
        name: "parent_owns_child1",
        source_guid: "parent-001",
        source_type: "system",
        target_guid: "child-001",
        target_type: "component",
        creation_timestamp: "2024-01-01T00:00:00.000Z",
        creation_source: "simple-graph-test"
      },
      {
        guid: "relation-002",
        name: "parent_owns_child2",
        source_guid: "parent-001",
        source_type: "system",
        target_guid: "child-002",
        target_type: "component",
        creation_timestamp: "2024-01-01T00:00:00.000Z",
        creation_source: "simple-graph-test"
      }
    ];
  }

  // Get all data in format similar to existing data structure
  public getAllSimpleData() {
    return {
      entities: this.getSimpleEntities(),
      relations: this.getSimpleRelations()
    };
  }
}
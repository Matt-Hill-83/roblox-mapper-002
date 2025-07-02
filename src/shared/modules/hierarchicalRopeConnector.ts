import { ConnectionData, LayoutResult } from './hierarchicalLayoutCalculator';

import { createRopeLabel } from './ropeLabelMaker';

// Hierarchical rope connection system
export class HierarchicalRopeConnector {
    
    constructor() {
        // No initialization needed for function-based rope creation
    }

    /**
     * Create all hierarchical rope connections from layout result
     */
    public createHierarchicalConnections(
        layoutResult: LayoutResult,
        positionedEntities: Map<string, Instance>,
        parentFolder: Folder
    ): Instance[] {
        print("[HierarchicalRopeConnector] Creating hierarchical rope connections");
        
        const allConnections: Instance[] = [];
        
        for (const tree of layoutResult.trees) {
            const treeConnections = this.createTreeConnections(
                tree.connections,
                positionedEntities,
                parentFolder,
                tree.treeId
            );
            
            for (const connection of treeConnections) {
                allConnections.push(connection);
            }
        }
        
        print(`[HierarchicalRopeConnector] Created ${allConnections.size()} hierarchical connections`);
        return allConnections;
    }

    /**
     * Create connections for a specific hierarchy tree
     */
    public createTreeConnections(
        connections: ConnectionData[],
        positionedEntities: Map<string, Instance>,
        parentFolder: Folder,
        treeId: string
    ): Instance[] {
        const treeConnections: Instance[] = [];
        
        // Create a folder for this tree's connections
        const treeConnectionsFolder = new Instance("Folder");
        treeConnectionsFolder.Name = `${treeId}_Connections`;
        treeConnectionsFolder.Parent = parentFolder;
        
        for (const connection of connections) {
            const rope = this.createHierarchicalRope(
                connection,
                positionedEntities,
                treeConnectionsFolder
            );
            
            if (rope) {
                treeConnections.push(rope);
            }
        }
        
        return treeConnections;
    }

    /**
     * Create a single hierarchical rope connection
     */
    public createHierarchicalRope(
        connection: ConnectionData,
        positionedEntities: Map<string, Instance>,
        parentFolder: Folder
    ): Instance | undefined {
        const fromEntity = positionedEntities.get(connection.fromGuid);
        const toEntity = positionedEntities.get(connection.toGuid);
        
        if (!fromEntity || !toEntity) {
            print(`⚠️ Cannot create rope: missing entities ${connection.fromGuid} -> ${connection.toGuid}`);
            return undefined;
        }
        
        if (!fromEntity.IsA("Model") || !toEntity.IsA("Model")) {
            print(`⚠️ Cannot create rope: entities are not Models`);
            return undefined;
        }
        
        // Get attachment points
        const fromAttachment = this.getEntityAttachmentPoint(fromEntity);
        const toAttachment = this.getEntityAttachmentPoint(toEntity);
        
        if (!fromAttachment || !toAttachment) {
            print(`⚠️ Cannot create rope: missing attachment points`);
            return undefined;
        }
        
        // Create the rope with hierarchical styling
        try {
            const ropeInstance = createRopeLabel({
                ropeIndex: 0,
                relationTypeName: connection.relationshipType,
                sourceAttachment: fromAttachment,
                targetAttachment: toAttachment,
                parent: parentFolder,
                props: { relationName: `${connection.fromGuid}_${connection.relationshipType}_${connection.toGuid}` }
            });
            
            if (ropeInstance) {
                ropeInstance.Parent = parentFolder;
                print(`✅ Created hierarchical rope: ${connection.fromGuid} -> ${connection.toGuid}`);
            }
            
            return ropeInstance;
            
        } catch (error) {
            print(`❌ Error creating hierarchical rope: ${error}`);
            return undefined;
        }
    }

    /**
     * Create parent-child rope connections with specific styling
     */
    public createParentChildConnections(
        layoutResult: LayoutResult,
        positionedEntities: Map<string, Instance>,
        parentFolder: Folder
    ): Instance[] {
        const parentChildConnections: Instance[] = [];
        
        for (const tree of layoutResult.trees) {
            for (const connection of tree.connections) {
                if (connection.relationshipType === "parent-child") {
                    const rope = this.createParentChildRope(
                        connection,
                        positionedEntities,
                        parentFolder
                    );
                    
                    if (rope) {
                        parentChildConnections.push(rope);
                    }
                }
            }
        }
        
        return parentChildConnections;
    }

    /**
     * Create sibling connections at the same hierarchy level
     */
    public createSiblingConnections(
        layoutResult: LayoutResult,
        positionedEntities: Map<string, Instance>,
        parentFolder: Folder
    ): Instance[] {
        const siblingConnections: Instance[] = [];
        
        // Group entities by level and create sibling connections
        for (const tree of layoutResult.trees) {
            const entitiesByLevel = this.groupEntitiesByLevel(tree.entityPositions);
            
            for (const [level, entities] of entitiesByLevel) {
                const entityArray = entities as unknown[];
                if (entityArray.size() > 1) {
                    const levelConnections = this.createLevelConnections(
                        entityArray,
                        positionedEntities,
                        parentFolder,
                        level
                    );
                    
                    for (const connection of levelConnections) {
                        siblingConnections.push(connection);
                    }
                }
            }
        }
        
        return siblingConnections;
    }

    // Private helper methods



    private createParentChildRope(
        connection: ConnectionData,
        positionedEntities: Map<string, Instance>,
        parentFolder: Folder
    ): Instance | undefined {
        // Special styling for parent-child relationships
        const fromEntity = positionedEntities.get(connection.fromGuid);
        const toEntity = positionedEntities.get(connection.toGuid);
        
        if (!fromEntity || !toEntity || !fromEntity.IsA("Model") || !toEntity.IsA("Model")) {
            return undefined;
        }
        
        const fromAttachment = this.getEntityAttachmentPoint(fromEntity);
        const toAttachment = this.getEntityAttachmentPoint(toEntity);
        
        if (!fromAttachment || !toAttachment) {
            return undefined;
        }
        
        try {
            const ropeInstance = createRopeLabel({
                ropeIndex: 0,
                relationTypeName: "parent-child",
                sourceAttachment: fromAttachment,
                targetAttachment: toAttachment,
                parent: parentFolder,
                props: { relationName: `${connection.fromGuid}_owns_${connection.toGuid}` }
            });
            if (ropeInstance) {
                ropeInstance.Parent = parentFolder;
            }
            return ropeInstance;
        } catch (error) {
            print(`❌ Error creating parent-child rope: ${error}`);
            return undefined;
        }
    }

    private createLevelConnections(
        entities: unknown[],
        positionedEntities: Map<string, Instance>,
        parentFolder: Folder,
        level: number
    ): Instance[] {
        const connections: Instance[] = [];
        
        // Create connections between adjacent entities at the same level
        for (let i = 0; i < entities.size() - 1; i++) {
            const entity1 = entities[i] as { guid: string };
            const entity2 = entities[i + 1] as { guid: string };
            
            const instance1 = positionedEntities.get(entity1.guid);
            const instance2 = positionedEntities.get(entity2.guid);
            
            if (instance1 && instance2 && instance1.IsA("Model") && instance2.IsA("Model")) {
                const attachment1 = this.getEntityAttachmentPoint(instance1);
                const attachment2 = this.getEntityAttachmentPoint(instance2);
                
                if (attachment1 && attachment2) {
                    try {
                        const ropeInstance = createRopeLabel({
                            ropeIndex: i,
                            relationTypeName: "sibling",
                            sourceAttachment: attachment1,
                            targetAttachment: attachment2,
                            parent: parentFolder,
                            props: { relationName: `${entity1.guid}_level${level}_${entity2.guid}` }
                        });
                        if (ropeInstance) {
                            ropeInstance.Parent = parentFolder;
                            connections.push(ropeInstance);
                        }
                    } catch (error) {
                        print(`❌ Error creating level connection: ${error}`);
                    }
                }
            }
        }
        
        return connections;
    }

    private getEntityAttachmentPoint(entity: Model): Attachment | undefined {
        // Look for the primary part first
        if (entity.PrimaryPart && entity.PrimaryPart.IsA("Part")) {
            return this.createOrGetAttachment(entity.PrimaryPart as Part);
        }
        
        // Fall back to first Part
        const firstPart = entity.FindFirstChildOfClass("Part");
        if (firstPart) {
            return this.createOrGetAttachment(firstPart);
        }
        
        return undefined;
    }

    private createOrGetAttachment(part: Part): Attachment {
        // Look for existing attachment
        let attachment = part.FindFirstChild("RopeAttachment") as Attachment;
        
        if (!attachment) {
            attachment = new Instance("Attachment");
            attachment.Name = "RopeAttachment";
            attachment.Parent = part;
        }
        
        return attachment;
    }



    private groupEntitiesByLevel(entityPositions: unknown[]): Map<number, unknown[]> {
        const levelMap = new Map<number, unknown[]>();
        
        for (const entityData of entityPositions) {
            const entity = entityData as { level: number };
            const levelEntities = levelMap.get(entity.level) || [];
            const newEntities = [...levelEntities, entity];
            levelMap.set(entity.level, newEntities);
        }
        
        return levelMap;
    }
}

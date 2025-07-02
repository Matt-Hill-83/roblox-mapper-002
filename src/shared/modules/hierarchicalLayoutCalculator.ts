import {
    CLUSTER_RADIUS,
    CLUSTER_VARIATION,
    COLLISION_BUFFER,
    ENTITY_SPACING,
    LEVEL_HEIGHT,
    TREE_SPACING
} from './layoutConstants';

// Type definitions for hierarchical layout
export interface EntityPosition {
    guid: string;
    position: [number, number, number];
    level: number;
    treeIndex: number;
    clusterGroup: string;
    visualProps: {
        color: [number, number, number];
        scale: number;
        highlighted: boolean;
    };
}

export interface TreeLayout {
    treeId: string;
    rootEntity: string;
    totalEntities: number;
    boundingBox: {
        min: [number, number, number];
        max: [number, number, number];
    };
    entityPositions: EntityPosition[];
    connections: ConnectionData[];
}

export interface ConnectionData {
    fromGuid: string;
    toGuid: string;
    relationshipType: string;
}

export interface LayoutResult {
    trees: TreeLayout[];
    totalBounds: {
        min: [number, number, number];
        max: [number, number, number];
    };
    orphanedEntities: string[];
}

export interface HierarchyNode {
    guid: string;
    entityType: string;
    children: string[];
    parent?: string;
}

export interface HierarchyTree {
    rootGuid: string;
    nodes: Map<string, HierarchyNode>;
    depth: number;
    totalNodes: number;
}

export interface HierarchyAnalysisResult {
    trees: HierarchyTree[];
    orphans: string[];
    roots: string[];
}

// Main hierarchical layout calculator
export class HierarchicalLayoutCalculator {
    
    /**
     * Calculate complete hierarchical layout from hierarchy analysis results
     */
    public calculateHierarchicalLayout(hierarchyResult: HierarchyAnalysisResult): LayoutResult {
        const layoutResult: LayoutResult = {
            trees: [],
            totalBounds: { min: [0, 0, 0], max: [0, 0, 0] },
            orphanedEntities: hierarchyResult.orphans,
        };

        // Position each hierarchy tree
        for (let i = 0; i < hierarchyResult.trees.size(); i++) {
            const tree = hierarchyResult.trees[i];
            const treeLayout = this.calculateTreeLayout(tree, i);
            const clusteredLayout = this.clusterEntityTypes(treeLayout);
            const finalLayout = this.adjustForCollisions(clusteredLayout);

            layoutResult.trees.push(finalLayout);
        }

        // Calculate overall bounds
        layoutResult.totalBounds = this.calculateOverallBounds(layoutResult.trees);

        return layoutResult;
    }

    /**
     * Calculate layout for a single hierarchy tree
     */
    public calculateTreeLayout(tree: HierarchyTree, treeIndex: number): TreeLayout {
        print(`[HierarchicalLayoutCalculator] Calculating layout for tree ${treeIndex}, root: ${tree.rootGuid}`);
        print(`[HierarchicalLayoutCalculator] Tree has ${tree.totalNodes} total nodes, ${tree.nodes.size()} in nodes map`);
        
        const basePosition = this.calculateTreeBasePosition(treeIndex);
        const entityPositions: EntityPosition[] = [];
        const connections: ConnectionData[] = [];

        // Get root node
        const rootNode = tree.nodes.get(tree.rootGuid);
        if (!rootNode) {
            warn(`Root node ${tree.rootGuid} not found in tree`);
            return {
                treeId: tree.rootGuid,
                rootEntity: tree.rootGuid,
                totalEntities: 0,
                boundingBox: { min: [0, 0, 0], max: [0, 0, 0] },
                entityPositions: [],
                connections: [],
            };
        }

        print(`[HierarchicalLayoutCalculator] Found root node: ${rootNode.guid}, type: ${rootNode.entityType}, children: ${rootNode.children.size()}`);

        // Traverse tree and assign positions
        this.traverseTreeForPositioning(
            tree.rootGuid,
            tree.nodes,
            basePosition,
            0,
            0,
            entityPositions,
            connections,
            treeIndex
        );

        print(`[HierarchicalLayoutCalculator] After traversal: ${entityPositions.size()} entity positions, ${connections.size()} connections`);

        // Calculate bounding box
        const boundingBox = this.calculateTreeBounds(entityPositions);

        return {
            treeId: tree.rootGuid,
            rootEntity: tree.rootGuid,
            totalEntities: tree.totalNodes,
            boundingBox,
            entityPositions,
            connections,
        };
    }

    /**
     * Calculate position for individual entity within tree structure
     */
    public calculateEntityPosition(
        guid: string,
        level: number,
        branchIndex: number,
        basePosition: [number, number, number],
        treeIndex: number,
        entityType: string
    ): EntityPosition {
        const position = this.positionEntityInTree(guid, level, branchIndex, basePosition);
        
        return {
            guid,
            position,
            level,
            treeIndex,
            clusterGroup: entityType,
            visualProps: {
                color: this.getEntityTypeColor(entityType),
                scale: 1.0,
                highlighted: false,
            },
        };
    }

    /**
     * Apply entity type clustering to layout
     */
    public clusterEntityTypes(treeLayout: TreeLayout): TreeLayout {
        // Group entities by type
        const entityGroups = new Map<string, EntityPosition[]>();
        
        for (const entity of treeLayout.entityPositions) {
            const group = entityGroups.get(entity.clusterGroup) || [];
            group.push(entity);
            entityGroups.set(entity.clusterGroup, group);
        }

        // Apply clustering adjustments
        const clusteredPositions: EntityPosition[] = [];
        
        entityGroups.forEach((entities, entityType) => {
            for (let i = 0; i < entities.size(); i++) {
                const entity = entities[i];
                const clusteredPosition = this.applyClusteringOffset(entity, i, entities.size());
                clusteredPositions.push(clusteredPosition);
            }
        });

        return {
            ...treeLayout,
            entityPositions: clusteredPositions,
        };
    }

    /**
     * Detect and resolve collisions between entities
     */
    public detectCollisions(entityPositions: EntityPosition[]): boolean[] {
        const collisions: boolean[] = [];
        
        for (let i = 0; i < entityPositions.size(); i++) {
            collisions[i] = false;
        }
        
        for (let i = 0; i < entityPositions.size(); i++) {
            for (let j = i + 1; j < entityPositions.size(); j++) {
                const distance = this.calculateDistance(
                    entityPositions[i].position,
                    entityPositions[j].position
                );
                
                if (distance < ENTITY_SPACING + COLLISION_BUFFER) {
                    collisions[i] = true;
                    collisions[j] = true;
                }
            }
        }
        
        return collisions;
    }

    // Private helper methods

    private calculateTreeBasePosition(treeIndex: number): [number, number, number] {
        const x = treeIndex * TREE_SPACING;
        const y = 0;
        const z = 0;
        return [x, y, z];
    }

    private traverseTreeForPositioning(
        currentGuid: string,
        nodes: Map<string, HierarchyNode>,
        basePosition: [number, number, number],
        level: number,
        branchIndex: number,
        entityPositions: EntityPosition[],
        connections: ConnectionData[],
        treeIndex: number
    ): void {
        const node = nodes.get(currentGuid);
        if (!node) return;

        // Position current entity
        const entityPosition = this.calculateEntityPosition(
            currentGuid,
            level,
            branchIndex,
            basePosition,
            treeIndex,
            node.entityType
        );
        entityPositions.push(entityPosition);

        // Process children
        for (let i = 0; i < node.children.size(); i++) {
            const childGuid = node.children[i];
            const childNode = nodes.get(childGuid);
            if (childNode) {
                // Add connection
                connections.push({
                    fromGuid: currentGuid,
                    toGuid: childGuid,
                    relationshipType: 'parent-child',
                });

                // Recursively position child
                this.traverseTreeForPositioning(
                    childGuid,
                    nodes,
                    basePosition,
                    level + 1,
                    i,
                    entityPositions,
                    connections,
                    treeIndex
                );
            }
        }
    }

    private positionEntityInTree(
        guid: string,
        level: number,
        branchIndex: number,
        basePosition: [number, number, number]
    ): [number, number, number] {
        const x = basePosition[0] + (branchIndex - 0.5) * ENTITY_SPACING;
        const y = basePosition[1] - level * LEVEL_HEIGHT;
        const z = basePosition[2] + (math.random() - 0.5) * CLUSTER_VARIATION;

        return [x, y, z];
    }

    private applyClusteringOffset(
        entity: EntityPosition,
        index: number,
        totalInGroup: number
    ): EntityPosition {
        // Apply small circular clustering offset
        const angle = (index / totalInGroup) * 2 * math.pi;
        const clusterOffset = CLUSTER_RADIUS * 0.3; // Smaller offset to maintain hierarchy
        
        const offsetX = math.cos(angle) * clusterOffset;
        const offsetZ = math.sin(angle) * clusterOffset;

        return {
            ...entity,
            position: [
                entity.position[0] + offsetX,
                entity.position[1],
                entity.position[2] + offsetZ,
            ],
        };
    }

    private adjustForCollisions(treeLayout: TreeLayout): TreeLayout {
        const adjustedPositions = [...treeLayout.entityPositions];
        const collisions = this.detectCollisions(adjustedPositions);
        
        // Simple collision resolution: move colliding entities slightly
        for (let i = 0; i < collisions.size(); i++) {
            if (collisions[i]) {
                const entity = adjustedPositions[i];
                adjustedPositions[i] = {
                    ...entity,
                    position: [
                        entity.position[0] + (math.random() - 0.5) * COLLISION_BUFFER,
                        entity.position[1],
                        entity.position[2] + (math.random() - 0.5) * COLLISION_BUFFER,
                    ],
                };
            }
        }

        return {
            ...treeLayout,
            entityPositions: adjustedPositions,
        };
    }

    private calculateTreeBounds(entityPositions: EntityPosition[]): {
        min: [number, number, number];
        max: [number, number, number];
    } {
        if (entityPositions.size() === 0) {
            return { min: [0, 0, 0], max: [0, 0, 0] };
        }

        const positions = entityPositions.map(e => e.position);
        const minX = math.min(...positions.map(p => p[0]));
        const minY = math.min(...positions.map(p => p[1]));
        const minZ = math.min(...positions.map(p => p[2]));
        const maxX = math.max(...positions.map(p => p[0]));
        const maxY = math.max(...positions.map(p => p[1]));
        const maxZ = math.max(...positions.map(p => p[2]));

        return { 
            min: [minX, minY, minZ], 
            max: [maxX, maxY, maxZ] 
        };
    }

    private calculateOverallBounds(trees: TreeLayout[]): {
        min: [number, number, number];
        max: [number, number, number];
    } {
        if (trees.size() === 0) {
            return { min: [0, 0, 0], max: [0, 0, 0] };
        }

        const allBounds = trees.map(t => t.boundingBox);
        const minX = math.min(...allBounds.map(b => b.min[0]));
        const minY = math.min(...allBounds.map(b => b.min[1]));
        const minZ = math.min(...allBounds.map(b => b.min[2]));
        const maxX = math.max(...allBounds.map(b => b.max[0]));
        const maxY = math.max(...allBounds.map(b => b.max[1]));
        const maxZ = math.max(...allBounds.map(b => b.max[2]));

        return { 
            min: [minX, minY, minZ], 
            max: [maxX, maxY, maxZ] 
        };
    }

    private calculateDistance(pos1: [number, number, number], pos2: [number, number, number]): number {
        const dx = pos1[0] - pos2[0];
        const dy = pos1[1] - pos2[1];
        const dz = pos1[2] - pos2[2];
        return math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    private getEntityTypeColor(entityType: string): [number, number, number] {
        // Simple color mapping based on entity type
        const lowerType = string.lower(entityType);
        
        if (lowerType === "component") return [0.2, 0.7, 0.9];
        if (lowerType === "service") return [0.9, 0.2, 0.2];
        if (lowerType === "module") return [0.2, 0.9, 0.2];
        if (lowerType === "domain") return [0.9, 0.9, 0.2];
        if (lowerType === "environment") return [0.7, 0.2, 0.9];
        
        return [0.5, 0.5, 0.5]; // default color
    }
}

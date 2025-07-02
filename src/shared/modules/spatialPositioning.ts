import { 
    TREE_SPACING, 
    LEVEL_HEIGHT, 
    ENTITY_SPACING
} from './layoutConstants';
import { EntityPosition, HierarchyTree, HierarchyNode } from './hierarchicalLayoutCalculator';

// Tree-based positioning algorithm implementation
export class TreePositioningAlgorithm {

    /**
     * Position a hierarchy tree using specialized tree layout algorithm
     */
    public positionHierarchyTree(
        tree: HierarchyTree, 
        treeIndex: number, 
        basePosition: [number, number, number]
    ): EntityPosition[] {
        const entityPositions: EntityPosition[] = [];
        
        // Calculate tree-specific base position
        const treeBasePosition: [number, number, number] = [
            basePosition[0] + treeIndex * TREE_SPACING,
            basePosition[1],
            basePosition[2]
        ];

        // Build the tree layout using breadth-first positioning
        const rootNode = tree.nodes.get(tree.rootGuid);
        if (rootNode) {
            this.positionTreeNodeRecursive(
                tree.rootGuid,
                tree.nodes,
                treeBasePosition,
                0,
                0,
                0,
                entityPositions,
                treeIndex
            );
        }

        return entityPositions;
    }

    /**
     * Calculate tree bounds for the positioned entities
     */
    public calculateTreeBounds(entityPositions: EntityPosition[]): {
        min: [number, number, number];
        max: [number, number, number];
    } {
        if (entityPositions.size() === 0) {
            return { min: [0, 0, 0], max: [0, 0, 0] };
        }

        let minX = entityPositions[0].position[0];
        let maxX = entityPositions[0].position[0];
        let minY = entityPositions[0].position[1];
        let maxY = entityPositions[0].position[1];
        let minZ = entityPositions[0].position[2];
        let maxZ = entityPositions[0].position[2];

        for (const entity of entityPositions) {
            const pos = entity.position;
            if (pos[0] < minX) minX = pos[0];
            if (pos[0] > maxX) maxX = pos[0];
            if (pos[1] < minY) minY = pos[1];
            if (pos[1] > maxY) maxY = pos[1];
            if (pos[2] < minZ) minZ = pos[2];
            if (pos[2] > maxZ) maxZ = pos[2];
        }

        return {
            min: [minX, minY, minZ],
            max: [maxX, maxY, maxZ]
        };
    }

    /**
     * Adjust positions to prevent overlapping entities
     */
    public adjustForCollisions(
        entityPositions: EntityPosition[], 
        minimumDistance: number = ENTITY_SPACING
    ): EntityPosition[] {
        const adjustedPositions = [...entityPositions];
        
        // Multiple passes to resolve all collisions
        for (let pass = 0; pass < 3; pass++) {
            let hasCollisions = false;
            
            for (let i = 0; i < adjustedPositions.size(); i++) {
                for (let j = i + 1; j < adjustedPositions.size(); j++) {
                    const distance = this.calculateDistance(
                        adjustedPositions[i].position,
                        adjustedPositions[j].position
                    );
                    
                    if (distance < minimumDistance && distance > 0) {
                        hasCollisions = true;
                        
                        // Calculate separation vector
                        const separation = this.calculateSeparationVector(
                            adjustedPositions[i].position,
                            adjustedPositions[j].position,
                            minimumDistance
                        );
                        
                        // Move entities apart
                        adjustedPositions[i] = {
                            ...adjustedPositions[i],
                            position: [
                                adjustedPositions[i].position[0] - separation[0] / 2,
                                adjustedPositions[i].position[1],
                                adjustedPositions[i].position[2] - separation[2] / 2
                            ]
                        };
                        
                        adjustedPositions[j] = {
                            ...adjustedPositions[j],
                            position: [
                                adjustedPositions[j].position[0] + separation[0] / 2,
                                adjustedPositions[j].position[1],
                                adjustedPositions[j].position[2] + separation[2] / 2
                            ]
                        };
                    }
                }
            }
            
            if (!hasCollisions) break;
        }
        
        return adjustedPositions;
    }

    // Private helper methods

    private positionTreeNodeRecursive(
        nodeGuid: string,
        nodes: Map<string, HierarchyNode>,
        basePosition: [number, number, number],
        level: number,
        siblingIndex: number,
        totalSiblings: number,
        entityPositions: EntityPosition[],
        treeIndex: number
    ): void {
        const node = nodes.get(nodeGuid);
        if (!node) return;

        // Calculate position for this node
        const position = this.calculateNodePosition(
            basePosition,
            level,
            siblingIndex,
            totalSiblings
        );

        // Create entity position
        const entityPosition: EntityPosition = {
            guid: nodeGuid,
            position,
            level,
            treeIndex,
            clusterGroup: node.entityType,
            visualProps: {
                color: this.getEntityTypeColor(node.entityType),
                scale: 1.0,
                highlighted: false
            }
        };

        entityPositions.push(entityPosition);

        // Position children
        const childCount = node.children.size();
        for (let i = 0; i < childCount; i++) {
            const childGuid = node.children[i];
            this.positionTreeNodeRecursive(
                childGuid,
                nodes,
                basePosition,
                level + 1,
                i,
                childCount,
                entityPositions,
                treeIndex
            );
        }
    }

    private calculateNodePosition(
        basePosition: [number, number, number],
        level: number,
        siblingIndex: number,
        totalSiblings: number
    ): [number, number, number] {
        // Calculate horizontal spread for this level
        const levelWidth = math.max(1, totalSiblings) * ENTITY_SPACING;
        const startX = basePosition[0] - levelWidth / 2;
        
        // Position within level
        const x = startX + (siblingIndex + 0.5) * (levelWidth / math.max(1, totalSiblings));
        const y = basePosition[1] - level * LEVEL_HEIGHT;
        const z = basePosition[2];

        return [x, y, z];
    }

    private calculateDistance(
        pos1: [number, number, number], 
        pos2: [number, number, number]
    ): number {
        const dx = pos1[0] - pos2[0];
        const dy = pos1[1] - pos2[1];
        const dz = pos1[2] - pos2[2];
        return math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    private calculateSeparationVector(
        pos1: [number, number, number],
        pos2: [number, number, number],
        targetDistance: number
    ): [number, number, number] {
        const dx = pos2[0] - pos1[0];
        const dy = pos2[1] - pos1[1];
        const dz = pos2[2] - pos1[2];
        
        const currentDistance = math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (currentDistance === 0) {
            // Handle case where positions are identical
            return [targetDistance, 0, 0];
        }
        
        const scaleFactor = targetDistance / currentDistance;
        
        return [
            dx * scaleFactor,
            dy * scaleFactor,
            dz * scaleFactor
        ];
    }

    private getEntityTypeColor(entityType: string): [number, number, number] {
        const lowerType = string.lower(entityType);
        
        if (lowerType === "component") return [0.2, 0.7, 0.9];
        if (lowerType === "service") return [0.9, 0.2, 0.2];
        if (lowerType === "module") return [0.2, 0.9, 0.2];
        if (lowerType === "domain") return [0.9, 0.9, 0.2];
        if (lowerType === "environment") return [0.7, 0.2, 0.9];
        if (lowerType === "flag") return [0.9, 0.5, 0.1];
        if (lowerType === "group") return [0.5, 0.9, 0.7];
        
        return [0.5, 0.5, 0.5]; // default color
    }
}

import { BASE_HEIGHT, TREE_SPACING } from '../../shared/modules/layoutConstants';
import { EntityPosition, HierarchicalLayoutCalculator, HierarchyAnalysisResult, LayoutResult } from '../../shared/modules/hierarchicalLayoutCalculator';

import { CollisionAvoidanceSystem } from '../../shared/modules/collisionAvoidance';
import { HierarchicalRopeConnector } from '../../shared/modules/hierarchicalRopeConnector';
import { SpatialClustering } from '../../shared/modules/spatialClustering';
import { TreePositioningAlgorithm } from '../../shared/modules/spatialPositioning';

// Layout service for managing hierarchical entity positioning
export class HierarchicalLayoutService {
    private layoutCalculator: HierarchicalLayoutCalculator;
    private positioningAlgorithm: TreePositioningAlgorithm;
    private spatialClustering: SpatialClustering;
    private collisionAvoidance: CollisionAvoidanceSystem;
    
    constructor() {
        this.layoutCalculator = new HierarchicalLayoutCalculator();
        this.positioningAlgorithm = new TreePositioningAlgorithm();
        this.spatialClustering = new SpatialClustering();
        this.collisionAvoidance = new CollisionAvoidanceSystem();
    }

    /**
     * Create complete hierarchical layout from hierarchy analysis
     */
    public createHierarchicalLayout(hierarchyResult: HierarchyAnalysisResult): LayoutResult {
        print("[HierarchicalLayoutService] Creating hierarchical layout for", hierarchyResult.trees.size(), "trees");
        
        // Step 1: Calculate initial layout
        const initialLayout = this.layoutCalculator.calculateHierarchicalLayout(hierarchyResult);
        
        // Step 2: Apply advanced positioning for each tree
        for (let i = 0; i < initialLayout.trees.size(); i++) {
            const tree = initialLayout.trees[i];
            const hierarchyTree = hierarchyResult.trees[i];
            
            // Enhanced tree positioning
            const basePosition: [number, number, number] = [i * TREE_SPACING, BASE_HEIGHT, 0];
            const enhancedPositions = this.positioningAlgorithm.positionHierarchyTree(
                hierarchyTree, 
                i, 
                basePosition
            );
            
            // Apply spatial clustering
            const clusteredPositions = this.spatialClustering.applyClustering(enhancedPositions);
            
            // Resolve collisions
            const finalPositions = this.collisionAvoidance.resolveCollisions(clusteredPositions);
            
            // Update tree layout
            initialLayout.trees[i] = {
                ...tree,
                entityPositions: finalPositions,
                boundingBox: this.positioningAlgorithm.calculateTreeBounds(finalPositions)
            };
        }
        
        // Step 3: Final layout optimization (temporarily disabled for build)
        const optimizedLayout = initialLayout;
        
        print("[HierarchicalLayoutService] Layout created with", optimizedLayout.trees.size(), "trees");
        return optimizedLayout;
    }

    /**
     * Position entities in 3D space using calculated layout
     */
    public positionEntitiesInSpace(
        layoutResult: LayoutResult,
        entityMap: Map<string, Instance>
    ): Map<string, Instance> {
        print("[HierarchicalLayoutService] Positioning", entityMap.size(), "entities in 3D space");
        
        const positionedEntities = new Map<string, Instance>();
        
        for (const tree of layoutResult.trees) {
            for (const entityPosition of tree.entityPositions) {
                const entity = entityMap.get(entityPosition.guid);
                if (entity && entity.IsA("Model")) {
                    // Position the entity
                    this.positionEntity(entity, entityPosition);
                    positionedEntities.set(entityPosition.guid, entity);
                }
            }
        }
        
        print("[HierarchicalLayoutService] Positioned", positionedEntities.size(), "entities");
        return positionedEntities;
    }

    /**
     * Create hierarchical connectors between related entities
     */
    public createHierarchicalConnectors(
        layoutResult: LayoutResult,
        positionedEntities: Map<string, Instance>
    ): Instance[] {
        print("[HierarchicalLayoutService] Creating hierarchical connectors");
        
        // Create a parent folder for all connections
        const connectionsFolder = new Instance("Folder");
        connectionsFolder.Name = "HierarchicalConnections";
        connectionsFolder.Parent = game.Workspace;

        // Create the rope connector
        const ropeConnector = new HierarchicalRopeConnector();
        
        // Create all hierarchical connections
        const connections = ropeConnector.createHierarchicalConnections(
            layoutResult,
            positionedEntities,
            connectionsFolder
        );
        
        // Add special parent-child connections
        const parentChildConnections = ropeConnector.createParentChildConnections(
            layoutResult,
            positionedEntities,
            connectionsFolder
        );
        
        // Add sibling connections at same level (optional)
        const siblingConnections = ropeConnector.createSiblingConnections(
            layoutResult,
            positionedEntities,
            connectionsFolder
        );
        
        // Combine all connections
        const allConnections = [
            ...connections,
            ...parentChildConnections,
            ...siblingConnections
        ];
        
        print("[HierarchicalLayoutService] Created", allConnections.size(), "connectors");
        return allConnections;
    }

    /**
     * Update existing layout with new hierarchy data
     */
    public updateLayout(
        currentLayout: LayoutResult,
        newHierarchyResult: HierarchyAnalysisResult
    ): LayoutResult {
        print("[HierarchicalLayoutService] Updating layout");
        
        // For now, recreate the entire layout
        // In the future, this could be optimized to only update changed parts
        return this.createHierarchicalLayout(newHierarchyResult);
    }

    /**
     * Get entities at specific hierarchy level
     */
    public getEntitiesAtLevel(layoutResult: LayoutResult, level: number): EntityPosition[] {
        const entitiesAtLevel: EntityPosition[] = [];
        
        for (const tree of layoutResult.trees) {
            for (const entity of tree.entityPositions) {
                if (entity.level === level) {
                    entitiesAtLevel.push(entity);
                }
            }
        }
        
        return entitiesAtLevel;
    }

    /**
     * Get entities of specific type
     */
    public getEntitiesByType(layoutResult: LayoutResult, entityType: string): EntityPosition[] {
        const entitiesByType: EntityPosition[] = [];
        
        for (const tree of layoutResult.trees) {
            for (const entity of tree.entityPositions) {
                if (entity.clusterGroup === entityType) {
                    entitiesByType.push(entity);
                }
            }
        }
        
        return entitiesByType;
    }

    // Private helper methods

    // private optimizeLayout(layout: LayoutResult): LayoutResult {
    //     // Simplified optimization to avoid type errors
    //     print("Layout optimization simplified for Roblox-TS compatibility");
    //     return layout;
    // }

    private positionEntity(entity: Model, entityPosition: EntityPosition): void {
        // Position the entity at the calculated location
        const position = entityPosition.position;
        
        if (entity.PrimaryPart) {
            entity.SetPrimaryPartCFrame(new CFrame(position[0], position[1], position[2]));
        } else {
            // If no primary part, try to position the first part
            const firstPart = entity.FindFirstChildOfClass("Part");
            if (firstPart) {
                firstPart.Position = new Vector3(position[0], position[1], position[2]);
            }
        }
        
        // Apply visual properties
        this.applyVisualProperties(entity, entityPosition.visualProps);
    }

    private applyVisualProperties(
        entity: Model, 
        visualProps: { color: [number, number, number]; scale: number; highlighted: boolean }
    ): void {
        // Apply color to all parts in the model
        const parts = entity.GetDescendants().filter(desc => desc.IsA("Part"));
        for (const part of parts) {
            if (part.IsA("Part")) {
                part.Color = new Color3(visualProps.color[0], visualProps.color[1], visualProps.color[2]);
                
                if (visualProps.highlighted) {
                    part.Material = Enum.Material.Neon;
                }
            }
        }
    }


}

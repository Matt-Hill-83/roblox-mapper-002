import { ENTITY_SPACING, COLLISION_BUFFER } from './layoutConstants';
import { EntityPosition } from './hierarchicalLayoutCalculator';

// Collision detection and avoidance system
export class CollisionAvoidanceSystem {
    
    /**
     * Detect all collisions between entities
     */
    public detectAllCollisions(entityPositions: EntityPosition[]): CollisionInfo[] {
        const collisions: CollisionInfo[] = [];
        
        for (let i = 0; i < entityPositions.size(); i++) {
            for (let j = i + 1; j < entityPositions.size(); j++) {
                const entity1 = entityPositions[i];
                const entity2 = entityPositions[j];
                
                const distance = this.calculateDistance(entity1.position, entity2.position);
                const requiredDistance = ENTITY_SPACING + COLLISION_BUFFER;
                
                if (distance < requiredDistance) {
                    collisions.push({
                        entity1Index: i,
                        entity2Index: j,
                        entity1: entity1,
                        entity2: entity2,
                        currentDistance: distance,
                        requiredDistance: requiredDistance,
                        overlapAmount: requiredDistance - distance
                    });
                }
            }
        }
        
        return collisions;
    }

    /**
     * Resolve all detected collisions by adjusting positions
     */
    public resolveCollisions(
        entityPositions: EntityPosition[], 
        maxIterations: number = 5
    ): EntityPosition[] {
        let adjustedPositions = [...entityPositions];
        
        for (let iteration = 0; iteration < maxIterations; iteration++) {
            const collisions = this.detectAllCollisions(adjustedPositions);
            
            if (collisions.size() === 0) {
                break; // No more collisions
            }
            
            // Resolve each collision
            for (const collision of collisions) {
                adjustedPositions = this.resolveCollision(adjustedPositions, collision);
            }
        }
        
        return adjustedPositions;
    }

    /**
     * Prevent entities from overlapping while maintaining hierarchy
     */
    public preventOverlap(
        entityPositions: EntityPosition[],
        preserveHierarchy: boolean = true
    ): EntityPosition[] {
        const adjustedPositions = [...entityPositions];
        
        // Group entities by hierarchy level for better resolution
        if (preserveHierarchy) {
            const levelGroups = this.groupByLevel(adjustedPositions);
            
            levelGroups.forEach((entities, level) => {
                const levelAdjusted = this.resolveCollisionsInLevel(entities);
                
                // Update positions in main array
                for (const adjustedEntity of levelAdjusted) {
                    const index = adjustedPositions.findIndex(e => e.guid === adjustedEntity.guid);
                    if (index !== -1) {
                        adjustedPositions[index] = adjustedEntity;
                    }
                }
            });
        } else {
            return this.resolveCollisions(adjustedPositions);
        }
        
        return adjustedPositions;
    }

    /**
     * Create collision-free zones around important entities
     */
    public createCollisionFreeZones(
        entityPositions: EntityPosition[],
        importantEntityGuids: string[],
        zoneRadius: number = ENTITY_SPACING * 2
    ): EntityPosition[] {
        const adjustedPositions = [...entityPositions];
        
        for (const importantGuid of importantEntityGuids) {
            const importantEntity = adjustedPositions.find(e => e.guid === importantGuid);
            if (!importantEntity) continue;
            
            // Move other entities away from this important entity
            for (let i = 0; i < adjustedPositions.size(); i++) {
                const entity = adjustedPositions[i];
                if (entity.guid === importantGuid) continue;
                
                const distance = this.calculateDistance(importantEntity.position, entity.position);
                if (distance < zoneRadius) {
                    const separationVector = this.calculateSeparationVector(
                        importantEntity.position,
                        entity.position,
                        zoneRadius
                    );
                    
                    adjustedPositions[i] = {
                        ...entity,
                        position: [
                            importantEntity.position[0] + separationVector[0],
                            entity.position[1], // Preserve Y for hierarchy
                            importantEntity.position[2] + separationVector[2]
                        ]
                    };
                }
            }
        }
        
        return adjustedPositions;
    }

    // Private helper methods

    private resolveCollision(
        entityPositions: EntityPosition[], 
        collision: CollisionInfo
    ): EntityPosition[] {
        const adjustedPositions = [...entityPositions];
        
        // Calculate how much to move each entity
        const separationVector = this.calculateSeparationVector(
            collision.entity1.position,
            collision.entity2.position,
            collision.requiredDistance
        );
        
        // Move entities apart (each moves half the required distance)
        const moveDistance = collision.overlapAmount / 2;
        const normalizedSeparation = this.normalizeVector(separationVector);
        
        adjustedPositions[collision.entity1Index] = {
            ...collision.entity1,
            position: [
                collision.entity1.position[0] - normalizedSeparation[0] * moveDistance,
                collision.entity1.position[1], // Preserve Y hierarchy
                collision.entity1.position[2] - normalizedSeparation[2] * moveDistance
            ]
        };
        
        adjustedPositions[collision.entity2Index] = {
            ...collision.entity2,
            position: [
                collision.entity2.position[0] + normalizedSeparation[0] * moveDistance,
                collision.entity2.position[1], // Preserve Y hierarchy
                collision.entity2.position[2] + normalizedSeparation[2] * moveDistance
            ]
        };
        
        return adjustedPositions;
    }

    private resolveCollisionsInLevel(entities: EntityPosition[]): EntityPosition[] {
        if (entities.size() <= 1) return entities;
        
        let adjustedEntities = [...entities];
        const maxIterations = 3;
        
        for (let iteration = 0; iteration < maxIterations; iteration++) {
            let hasCollisions = false;
            
            for (let i = 0; i < adjustedEntities.size(); i++) {
                for (let j = i + 1; j < adjustedEntities.size(); j++) {
                    const entity1 = adjustedEntities[i];
                    const entity2 = adjustedEntities[j];
                    
                    const distance = this.calculateDistance(entity1.position, entity2.position);
                    const requiredDistance = ENTITY_SPACING + COLLISION_BUFFER;
                    
                    if (distance < requiredDistance) {
                        hasCollisions = true;
                        
                        // Apply force-based separation
                        const repulsionForce = this.calculateRepulsionForce(
                            entity1.position,
                            entity2.position,
                            requiredDistance - distance
                        );
                        
                        adjustedEntities[i] = {
                            ...entity1,
                            position: [
                                entity1.position[0] - repulsionForce[0],
                                entity1.position[1],
                                entity1.position[2] - repulsionForce[2]
                            ]
                        };
                        
                        adjustedEntities[j] = {
                            ...entity2,
                            position: [
                                entity2.position[0] + repulsionForce[0],
                                entity2.position[1],
                                entity2.position[2] + repulsionForce[2]
                            ]
                        };
                    }
                }
            }
            
            if (!hasCollisions) break;
        }
        
        return adjustedEntities;
    }

    private groupByLevel(entityPositions: EntityPosition[]): Map<number, EntityPosition[]> {
        const levelGroups = new Map<number, EntityPosition[]>();
        
        for (const entity of entityPositions) {
            const levelEntities = levelGroups.get(entity.level) || [];
            levelEntities.push(entity);
            levelGroups.set(entity.level, levelEntities);
        }
        
        return levelGroups;
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
            // Handle identical positions
            return [targetDistance, 0, 0];
        }
        
        const scaleFactor = targetDistance / currentDistance;
        
        return [dx * scaleFactor, dy * scaleFactor, dz * scaleFactor];
    }

    private normalizeVector(vector: [number, number, number]): [number, number, number] {
        const magnitude = math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2]);
        
        if (magnitude === 0) {
            return [1, 0, 0]; // Default direction
        }
        
        return [
            vector[0] / magnitude,
            vector[1] / magnitude,
            vector[2] / magnitude
        ];
    }

    private calculateRepulsionForce(
        pos1: [number, number, number],
        pos2: [number, number, number],
        overlapAmount: number
    ): [number, number, number] {
        const direction = this.normalizeVector([
            pos1[0] - pos2[0],
            0, // Don't apply Y force to preserve hierarchy
            pos1[2] - pos2[2]
        ]);
        
        const forceMultiplier = overlapAmount * 0.5;
        
        return [
            direction[0] * forceMultiplier,
            0,
            direction[2] * forceMultiplier
        ];
    }
}

// Type definitions for collision system
export interface CollisionInfo {
    entity1Index: number;
    entity2Index: number;
    entity1: EntityPosition;
    entity2: EntityPosition;
    currentDistance: number;
    requiredDistance: number;
    overlapAmount: number;
}

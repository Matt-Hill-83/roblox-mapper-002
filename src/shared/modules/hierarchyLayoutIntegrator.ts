import { analyzeEntityHierarchy } from './hierarchyAnalyzer';
import { HierarchyAnalysisResult, HierarchyTree, HierarchyNode } from './hierarchicalLayoutCalculator';

// Integration adapter to convert hierarchy analysis to layout system format
export class HierarchyLayoutIntegrator {
    
    /**
     * Convert hierarchy analysis results to layout system format
     */
    public convertToLayoutFormat(): HierarchyAnalysisResult {
        print("[HierarchyLayoutIntegrator] Converting hierarchy analysis to layout format");
        
        // Get analysis from existing hierarchy analyzer
        const analysisResult = analyzeEntityHierarchy();
        
        // Convert to new format
        const convertedTrees: HierarchyTree[] = [];
        
        for (const tree of analysisResult.trees) {
            const convertedTree = this.convertTree(tree);
            convertedTrees.push(convertedTree);
        }
        
        const result: HierarchyAnalysisResult = {
            trees: convertedTrees,
            orphans: analysisResult.orphanedEntities,
            roots: analysisResult.trees.map(tree => tree.rootGuid)
        };
        
        print("[HierarchyLayoutIntegrator] Converted", result.trees.size(), "trees for layout");
        return result;
    }

    /**
     * Get integrated hierarchy analysis with enhanced metadata
     */
    public getEnhancedHierarchyAnalysis(): HierarchyAnalysisResult {
        const baseAnalysis = this.convertToLayoutFormat();
        
        // Enhance with additional metadata for layout
        const enhancedTrees = baseAnalysis.trees.map(tree => this.enhanceTreeMetadata(tree));
        
        return {
            ...baseAnalysis,
            trees: enhancedTrees
        };
    }

    /**
     * Filter hierarchy for layout purposes (exclude certain entity types)
     */
    public getFilteredHierarchyForLayout(excludeTypes: string[] = []): HierarchyAnalysisResult {
        const fullAnalysis = this.convertToLayoutFormat();
        
        // Filter out unwanted entity types
        const filteredTrees = fullAnalysis.trees.map(tree => this.filterTree(tree, excludeTypes));
        
        // Remove empty trees
        const nonEmptyTrees = filteredTrees.filter(tree => tree.totalNodes > 0);
        
        return {
            ...fullAnalysis,
            trees: nonEmptyTrees
        };
    }

    // Private helper methods

    private convertTree(originalTree: unknown): HierarchyTree {
        const tree = originalTree as {
            nodes: Map<string, unknown>;
            rootGuid: string;
            depth: number;
            totalNodes: number;
        };
        const convertedNodes = new Map<string, HierarchyNode>();
        
        // Convert all nodes in the tree
        for (const [guid, nodeData] of tree.nodes) {
            const node = nodeData as {
                guid: string;
                type: string;
                children: Set<string>;
            };
            const convertedNode: HierarchyNode = {
                guid: node.guid,
                entityType: node.type,
                children: this.convertSetToArray(node.children),
                parent: this.findParent(node, tree.nodes)
            };
            
            convertedNodes.set(guid, convertedNode);
        }
        
        return {
            rootGuid: tree.rootGuid,
            nodes: convertedNodes,
            depth: tree.depth,
            totalNodes: tree.totalNodes
        };
    }

    private enhanceTreeMetadata(tree: HierarchyTree): HierarchyTree {
        // Add layout-specific metadata
        const enhancedNodes = new Map<string, HierarchyNode>();
        
        tree.nodes.forEach((node, guid) => {
            const enhancedNode: HierarchyNode = {
                ...node,
                // Add any layout-specific properties here
            };
            
            enhancedNodes.set(guid, enhancedNode);
        });
        
        return {
            ...tree,
            nodes: enhancedNodes
        };
    }

    private filterTree(tree: HierarchyTree, excludeTypes: string[]): HierarchyTree {
        const filteredNodes = new Map<string, HierarchyNode>();
        
        // Filter out excluded entity types
        tree.nodes.forEach((node, guid) => {
            if (!excludeTypes.includes(node.entityType)) {
                // Update children list to only include non-excluded entities
                const filteredChildren = node.children.filter(childGuid => {
                    const childNode = tree.nodes.get(childGuid);
                    return childNode && !excludeTypes.includes(childNode.entityType);
                });
                
                filteredNodes.set(guid, {
                    ...node,
                    children: filteredChildren
                });
            }
        });
        
        return {
            ...tree,
            nodes: filteredNodes,
            totalNodes: filteredNodes.size()
        };
    }

    private convertSetToArray(nodeSet: unknown): string[] {
        const result: string[] = [];
        
        // Convert the Set to an array
        if (nodeSet && typeIs(nodeSet, "table")) {
            const set = nodeSet as Set<string>;
            for (const item of set) {
                result.push(item);
            }
        }
        
        return result;
    }

    private findParent(node: { guid: string }, allNodes: Map<string, unknown>): string | undefined {
        // Find the parent by looking for nodes that have this node as a child
        for (const [guid, potentialParentData] of allNodes) {
            const potentialParent = potentialParentData as { children?: Set<string> };
            if (potentialParent.children && potentialParent.children.has(node.guid)) {
                return guid;
            }
        }
        
        return undefined;
    }
}

// Convenience function for easy integration
export function getHierarchyForLayout(): HierarchyAnalysisResult {
    const integrator = new HierarchyLayoutIntegrator();
    return integrator.getEnhancedHierarchyAnalysis();
}

// Function to get filtered hierarchy excluding certain types
export function getFilteredHierarchyForLayout(excludeTypes: string[] = ["artifact", "flag"]): HierarchyAnalysisResult {
    const integrator = new HierarchyLayoutIntegrator();
    return integrator.getFilteredHierarchyForLayout(excludeTypes);
}

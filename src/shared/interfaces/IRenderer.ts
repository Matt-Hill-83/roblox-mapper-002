/**
 * IRenderer - Interface for all renderer classes
 * 
 * Renderers are responsible for creating visual representations of data
 */

import { BaseService } from "../services/base/BaseService";

/**
 * Base configuration for renderers
 */
export interface IRendererConfig {
  /** Parent folder/instance to render into */
  parent: Instance;
  
  /** Origin position for rendering */
  origin?: Vector3;
  
  /** Enable debug mode */
  debug?: boolean;
}

/**
 * Render result information
 */
export interface IRenderResult {
  /** Number of objects rendered */
  objectCount: number;
  
  /** Time taken to render in seconds */
  renderTime: number;
  
  /** Root instance of rendered content */
  rootInstance?: Instance;
  
  /** Any errors encountered */
  errors?: string[];
}

/**
 * Base interface for all renderers
 */
export interface IRenderer<TData = unknown, TConfig extends IRendererConfig = IRendererConfig> {
  /**
   * Renders the data with the given configuration
   */
  render(data: TData, config: TConfig): IRenderResult;
  
  /**
   * Updates existing rendered content with new data
   */
  update?(data: TData, config: TConfig): IRenderResult;
  
  /**
   * Clears all rendered content
   */
  clear(): void;
  
  /**
   * Validates data before rendering
   */
  validate?(data: TData): boolean;
}

/**
 * Abstract base class for renderers that need service features
 */
export abstract class BaseRenderer<TData = unknown, TConfig extends IRendererConfig = IRendererConfig> 
  extends BaseService 
  implements IRenderer<TData, TConfig> {
  
  protected renderedInstances: Instance[] = [];
  
  constructor(name: string) {
    super(name);
  }
  
  /**
   * Abstract render method to be implemented by subclasses
   */
  abstract render(data: TData, config: TConfig): IRenderResult;
  
  /**
   * Default update implementation - clears and re-renders
   */
  update(data: TData, config: TConfig): IRenderResult {
    this.clear();
    return this.render(data, config);
  }
  
  /**
   * Clears all rendered content
   */
  clear(): void {
    this.renderedInstances.forEach(instance => {
      if (instance && instance.Parent) {
        instance.Destroy();
      }
    });
    this.renderedInstances = [];
  }
  
  /**
   * Tracks a rendered instance
   */
  protected trackRenderedInstance(instance: Instance): void {
    this.renderedInstances.push(instance);
    this.addInstance(instance);
  }
  
  /**
   * Custom cleanup for renderers
   */
  protected onDestroy(): void {
    this.clear();
  }
}

/**
 * Interface for graph renderers specifically
 */
export interface IGraphRenderer extends IRenderer {
  /**
   * Renders nodes in the graph
   */
  renderNodes?(nodes: unknown[], config: IRendererConfig): void;
  
  /**
   * Renders edges/connections in the graph
   */
  renderEdges?(edges: unknown[], config: IRendererConfig): void;
  
  /**
   * Renders labels for the graph
   */
  renderLabels?(labels: unknown[], config: IRendererConfig): void;
}

/**
 * Interface for incremental renderers
 */
export interface IIncrementalRenderer<TData = unknown> extends IRenderer<TData> {
  /**
   * Adds new items to the existing render
   */
  addItems(items: TData[], config: IRendererConfig): IRenderResult;
  
  /**
   * Removes specific items from the render
   */
  removeItems(itemIds: string[], config: IRendererConfig): IRenderResult;
  
  /**
   * Updates specific items in the render
   */
  updateItems(items: TData[], config: IRendererConfig): IRenderResult;
}
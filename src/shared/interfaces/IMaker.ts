/**
 * IMaker - Interface for all maker functions/classes
 * 
 * Defines the contract that all makers should follow for consistent API
 */

/**
 * Base configuration for all makers
 */
export interface IMakerConfig {
  /** Optional unique identifier */
  id?: string | number;
  
  /** Parent instance to attach the created object to */
  parent?: Instance;
  
  /** Position in 3D space */
  position?: Vector3;
  
  /** Optional name for the created instance */
  name?: string;
}

/**
 * Standard result from a maker function
 */
export interface IMakerResult<T extends Instance = Instance> {
  /** The primary instance created */
  instance: T;
  
  /** Any child instances that should be tracked */
  children?: Instance[];
  
  /** Cleanup function to destroy all created instances */
  cleanup?: () => void;
}

/**
 * Interface for maker functions
 * Makers are functions that create Roblox instances
 */
export interface IMakerFunction<TConfig extends IMakerConfig = IMakerConfig, TResult extends Instance = Instance> {
  (config: TConfig): TResult;
}

/**
 * Interface for maker classes
 * More complex makers may be implemented as classes
 */
export interface IMakerClass<TConfig extends IMakerConfig = IMakerConfig, TResult extends Instance = Instance> {
  /**
   * Creates an instance based on the configuration
   */
  make(config: TConfig): TResult;
  
  /**
   * Optional method to validate configuration before creating
   */
  validate?(config: TConfig): boolean;
  
  /**
   * Optional method to get default configuration
   */
  getDefaults?(): Partial<TConfig>;
}

/**
 * Extended maker configuration with visual properties
 */
export interface IVisualMakerConfig extends IMakerConfig {
  /** Size of the object */
  size?: Vector3 | number[];
  
  /** Color of the object */
  color?: Color3 | number[];
  
  /** Material of the object */
  material?: Enum.Material;
  
  /** Transparency (0-1) */
  transparency?: number;
  
  /** Whether the object casts shadows */
  castShadow?: boolean;
}

/**
 * Configuration for label makers
 */
export interface ILabelMakerConfig extends IMakerConfig {
  /** Text content */
  text: string;
  
  /** Font to use */
  font?: Enum.Font;
  
  /** Text color */
  textColor?: Color3;
  
  /** Text size */
  textSize?: number;
  
  /** Background color */
  backgroundColor?: Color3;
  
  /** Background transparency */
  backgroundTransparency?: number;
}

/**
 * Configuration for connector/rope makers
 */
export interface IConnectorMakerConfig extends IMakerConfig {
  /** Start position or attachment */
  startPoint: Vector3 | Attachment;
  
  /** End position or attachment */
  endPoint: Vector3 | Attachment;
  
  /** Thickness of the connector */
  thickness?: number;
  
  /** Color of the connector */
  color?: Color3;
  
  /** Material of the connector */
  material?: Enum.Material;
}
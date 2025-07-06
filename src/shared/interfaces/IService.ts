/**
 * IService - Interface for all services
 * 
 * Defines the contract that all services must implement
 */

export interface IService {
  /**
   * Destroys the service and cleans up resources
   */
  destroy(): void;
  
  /**
   * Checks if the service has been destroyed
   */
  isServiceDestroyed(): boolean;
}

/**
 * IServiceWithInit - Interface for services that require initialization
 */
export interface IServiceWithInit extends IService {
  /**
   * Initializes the service
   * @returns Promise that resolves when initialization is complete
   */
  initialize(): Promise<void>;
}

/**
 * IServiceOptions - Base options for service configuration
 */
export interface IServiceOptions {
  /** Optional name for the service instance */
  name?: string;
  
  /** Optional debug mode flag */
  debug?: boolean;
}
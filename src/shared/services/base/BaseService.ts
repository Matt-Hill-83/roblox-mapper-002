/**
 * BaseService - Foundation class for all services with connection management
 * 
 * Provides automatic cleanup of RBXScriptConnections to prevent memory leaks.
 * All services should extend this class and use addConnection() for event subscriptions.
 */

import { IService } from "../../interfaces/IService";

export abstract class BaseService implements IService {
  /** Array to store all active connections for cleanup */
  protected connections: RBXScriptConnection[] = [];
  
  /** Array to store all created instances for cleanup */
  protected instances: Instance[] = [];
  
  /** Flag to check if service has been destroyed */
  protected isDestroyed = false;
  
  /** Service name for logging */
  protected serviceName: string;
  
  constructor(serviceName?: string) {
    this.serviceName = serviceName || "BaseService";
  }

  /**
   * Adds a connection to be managed by the service
   * The connection will be automatically disconnected when destroy() is called
   * 
   * @param connection - The RBXScriptConnection to manage
   * @returns The same connection for chaining
   */
  protected addConnection(connection: RBXScriptConnection): RBXScriptConnection {
    if (this.isDestroyed) {
      warn(`[${this.serviceName}] Attempted to add connection after service was destroyed`);
      connection.Disconnect();
      return connection;
    }
    
    this.connections.push(connection);
    return connection;
  }

  /**
   * Adds multiple connections to be managed by the service
   * 
   * @param connections - Array of connections to manage
   */
  protected addConnections(...connections: RBXScriptConnection[]): void {
    connections.forEach(conn => this.addConnection(conn));
  }

  /**
   * Adds an instance to be managed by the service
   * The instance will be automatically destroyed when destroy() is called
   * 
   * @param instance - The Instance to manage
   * @returns The same instance for chaining
   */
  protected addInstance<T extends Instance>(instance: T): T {
    if (this.isDestroyed) {
      warn(`[${this.serviceName}] Attempted to add instance after service was destroyed`);
      instance.Destroy();
      return instance;
    }
    
    this.instances.push(instance);
    return instance;
  }

  /**
   * Removes a connection from management (useful if disconnecting early)
   * 
   * @param connection - The connection to remove
   */
  protected removeConnection(connection: RBXScriptConnection): void {
    const index = this.connections.indexOf(connection);
    if (index >= 0) {
      const newConnections: RBXScriptConnection[] = [];
      for (let i = 0; i < this.connections.size(); i++) {
        if (i !== index) {
          newConnections.push(this.connections[i]);
        }
      }
      this.connections = newConnections;
    }
  }

  /**
   * Disconnects all managed connections
   */
  protected disconnectAll(): void {
    this.connections.forEach(conn => {
      try {
        conn.Disconnect();
      } catch (e) {
        warn(`[${this.serviceName}] Error disconnecting connection:`, e);
      }
    });
    this.connections = [];
  }

  /**
   * Destroys all managed instances
   */
  protected destroyAllInstances(): void {
    this.instances.forEach(instance => {
      try {
        if (instance && instance.Parent) {
          instance.Destroy();
        }
      } catch (e) {
        warn(`[${this.serviceName}] Error destroying instance:`, e);
      }
    });
    this.instances = [];
  }

  /**
   * Gets the number of active connections
   */
  protected getConnectionCount(): number {
    return this.connections.size();
  }

  /**
   * Gets the number of managed instances
   */
  protected getInstanceCount(): number {
    return this.instances.size();
  }

  /**
   * Called before destroy to allow subclasses to perform cleanup
   * Override this method in subclasses for custom cleanup logic
   */
  protected onDestroy(): void {
    // Override in subclasses
  }

  /**
   * Destroys the service and cleans up all connections and instances
   * This method should be called when the service is no longer needed
   */
  public destroy(): void {
    if (this.isDestroyed) {
      warn(`[${this.serviceName}] Service already destroyed`);
      return;
    }

    // Call subclass cleanup first
    this.onDestroy();

    // Disconnect all connections
    this.disconnectAll();
    
    // Destroy all instances
    this.destroyAllInstances();
    
    // Mark as destroyed
    this.isDestroyed = true;
    
  }

  /**
   * Checks if the service has been destroyed
   */
  public isServiceDestroyed(): boolean {
    return this.isDestroyed;
  }
}
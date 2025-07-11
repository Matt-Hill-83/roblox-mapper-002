/**
 * Link Type Counter Server Service
 * Provides link type counts to clients
 */

import { ReplicatedStorage } from "@rbxts/services";
import { BaseService } from "../../shared/services/base/BaseService";
import { Link } from "../../shared/interfaces/simpleDataGenerator.interface";
import { LinkTypeCount } from "../../client/services/configGui/components/linkTypesDisplay";

export class LinkTypeCounterServerService extends BaseService {
  private remoteFunction: RemoteFunction;
  private currentLinks: Link[] = [];

  constructor() {
    super("LinkTypeCounterServerService");

    // Create or get RemoteFunction
    let remoteFunction = ReplicatedStorage.FindFirstChild("GetLinkTypeCounts") as RemoteFunction;
    if (!remoteFunction) {
      remoteFunction = new Instance("RemoteFunction");
      remoteFunction.Name = "GetLinkTypeCounts";
      remoteFunction.Parent = ReplicatedStorage;
      this.addInstance(remoteFunction);
    }
    this.remoteFunction = remoteFunction;

    // Set up the callback
    this.setupRemoteCallback();
  }

  /**
   * Sets up the remote function callback
   */
  private setupRemoteCallback(): void {
    this.remoteFunction.OnServerInvoke = (player: Player) => {
      return this.getLinkTypeCounts();
    };
  }

  /**
   * Updates the current links data
   */
  public updateLinks(links: Link[]): void {
    this.currentLinks = links;
    print(`[LinkTypeCounterServer] Updated links data with ${links.size()} links`);
    
    // Count and log link types
    const counts = this.countLinkTypes(links);
    print("[LinkTypeCounterServer] Link type counts:");
    counts.forEach((item) => {
      print(`  ${item.type}: ${item.count}`);
    });
  }

  /**
   * Gets the current link type counts
   */
  private getLinkTypeCounts(): LinkTypeCount[] {
    return this.countLinkTypes(this.currentLinks);
  }

  /**
   * Counts link types from an array of links
   */
  private countLinkTypes(links: Link[]): LinkTypeCount[] {
    const linkTypeCounts = new Map<string, number>();

    // Count each link type
    links.forEach((link) => {
      const currentCount = linkTypeCounts.get(link.type) || 0;
      linkTypeCounts.set(link.type, currentCount + 1);
    });

    // Convert to array format
    const result: LinkTypeCount[] = [];
    linkTypeCounts.forEach((count, linkType) => {
      result.push({ type: linkType, count });
    });

    return result;
  }

  protected onDestroy(): void {
    // Cleanup handled by BaseService
  }
}
/**
 * Link Type Counter Utility
 * Counts unique link types from the cluster data
 */

import { Link } from "../../../../shared/interfaces/simpleDataGenerator.interface";
import { LinkTypeCount } from "../components/linkTypesDisplay";

/**
 * Counts the occurrences of each unique link type
 */
export function countLinkTypes(links: Link[]): LinkTypeCount[] {
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

  // Log the results
  print("[LinkTypeCounter] Link type counts:");
  result.forEach((item) => {
    print(`  ${item.type}: ${item.count}`);
  });
  print(`[LinkTypeCounter] Total unique link types: ${result.size()}`);

  return result;
}

/**
 * Gets link type counts from the server
 */
export function getLinkTypeCountsFromCluster(): LinkTypeCount[] {
  const ReplicatedStorage = game.GetService("ReplicatedStorage");
  const remoteFunction = ReplicatedStorage.WaitForChild(LINK_TYPE_COUNTS_REMOTE, 5) as RemoteFunction | undefined;
  
  if (!remoteFunction) {
    print("[LinkTypeCounter] RemoteFunction not found: " + LINK_TYPE_COUNTS_REMOTE);
    return [];
  }

  try {
    const result = remoteFunction.InvokeServer() as LinkTypeCount[];
    if (result && typeIs(result, "table")) {
      print(`[LinkTypeCounter] Received ${result.size()} link types from server`);
      return result;
    }
  } catch (error) {
    warn(`[LinkTypeCounter] Error getting link counts: ${error}`);
  }

  return [];
}

/**
 * Remote function name for getting link counts from server
 */
export const LINK_TYPE_COUNTS_REMOTE = "GetLinkTypeCounts";
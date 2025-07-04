import { NextRequest, NextResponse } from "next/server";
import { position2D } from "../../../lib/positioning/positioning";
import type { TestDataConfig } from "../../../lib/generateData/interfaces";
import {
  generateConfigurableData,
  findConnectedGroups,
  createSimpleASCII,
} from "../../../lib/generateData/generateData";

export async function POST(request: NextRequest) {
  try {
    const config: TestDataConfig = await request.json();

    // Validate input
    if (
      !config.numberOfNodes ||
      !config.numberOfConnectedChains ||
      !config.depthOfLongestChain
    ) {
      return NextResponse.json(
        { error: "Missing required configuration parameters" },
        { status: 400 }
      );
    }

    // Generate hierarchy data with typed connections
    const { entities, connections } = generateConfigurableData(config);
    const groups = findConnectedGroups(entities);
    const positioned = position2D(groups);
    const asciiMap = createSimpleASCII(positioned);

    return NextResponse.json({
      entities,
      connections,
      groups,
      positioned,
      asciiMap,
      config,
    });
  } catch (error) {
    console.error("Error generating hierarchy:", error);
    return NextResponse.json(
      { error: "Failed to generate hierarchy data" },
      { status: 500 }
    );
  }
}

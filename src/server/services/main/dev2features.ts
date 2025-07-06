/**
 * Dev2 Features
 * 
 * This file contains feature imports and initialization for developer 2.
 * This allows multiple developers to work on features simultaneously
 * without causing merge conflicts in game.service.ts
 */

import { GroupAnimationTestService } from "../groupAnimationTest.service";

// Feature flags
const RUN_ANIMATION_TEST = true; // Set to true to enable animation test

export function initializeDev2Features(myStuffFolder: Folder): void {
  print("🔧 Initializing Dev2 features...");

  // Run animation test if enabled
  if (RUN_ANIMATION_TEST) {
    const animationTest = new GroupAnimationTestService();
    animationTest.runTest(myStuffFolder);
    print("🎬 Animation test initialized");
  }

  // Add more dev2 features here as needed
}
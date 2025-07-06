/**
 * Dev2 Features
 * 
 * This file contains feature imports and initialization for developer 2.
 * This allows multiple developers to work on features simultaneously
 * without causing merge conflicts in game.service.ts
 */

import { GroupAnimationTestService } from "../groupAnimationTest.service";
import { ColorsTestService } from "../colorsTest.service";

// Feature flags
const RUN_ANIMATION_TEST = true; // Set to true to enable animation test
const RUN_COLORS_TEST = true; // Set to true to enable colors test

export function initializeDev2Features(myStuffFolder: Folder): void {
  print("🔧 Initializing Dev2 features...");

  // Run animation test if enabled
  if (RUN_ANIMATION_TEST) {
    const animationTest = new GroupAnimationTestService();
    animationTest.runTest(myStuffFolder);
    print("🎬 Animation test initialized");
  }

  // Run colors test if enabled
  if (RUN_COLORS_TEST) {
    const colorsTest = new ColorsTestService();
    colorsTest.runTest(myStuffFolder);
    print("🎨 Colors test initialized");
  }

  // Add more dev2 features here as needed
}
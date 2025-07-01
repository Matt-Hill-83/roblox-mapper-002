// Rectangle Creation Module
import { generateRectangle } from "./baseAssets/makeRectangle.js";

export function createRectangles({ project, count, startX, spacing }) {
  console.log(`🔷 Generating ${count} rectangles...`);

  let currentX = startX;

  for (let i = 1; i <= count; i++) {
    const rectangle = generateRectangle(i, [currentX, 2, 0]);
    Object.assign(project.tree.Workspace.MyStuff, rectangle);
    currentX += spacing;
  }

  return currentX; // Return the next X position
}

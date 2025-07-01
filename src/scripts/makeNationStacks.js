// makeNationStacks.js
import { makeNationsStack } from "./makeNationsStack.js";

/**
 * Adds n nation stacks to the project evenly spaced around a circle.
 * @param {object} params
 * @param {object} params.project - The project object to modify
 * @param {number} params.count - The number of nation stacks to create
 * @param {number} [params.radius=100] - The radius of the circle
 * @param {number} [params.y=2] - The Y position for all stacks
 */
export function makeNationStacks({ project, count, radius = 100, y = 2 }) {
  if (count < 1) return;
  // Place the first stack at the center
  const centerModels = makeNationsStack({
    project,
    id: `nationsStack1`,
    centerPosition: [0, y, 0],
    width: 8,
    height: 2,
    maxItems: 100,
  });
  for (const modelObj of centerModels) {
    Object.assign(project.tree.Workspace.MyStuff, modelObj);
  }
  // Place the remaining stacks around the circle
  for (let i = 1; i < count; i++) {
    const angle = (2 * Math.PI * (i - 1)) / (count - 1);
    const x = Math.round(Math.cos(angle) * radius);
    const z = Math.round(Math.sin(angle) * radius);
    const nationsStackModels = makeNationsStack({
      project,
      id: `nationsStack${i + 1}`,
      centerPosition: [x, y, z],
      width: 8,
      height: 2,
      maxItems: 100,
    });
    for (const modelObj of nationsStackModels) {
      Object.assign(project.tree.Workspace.MyStuff, modelObj);
    }
  }
}

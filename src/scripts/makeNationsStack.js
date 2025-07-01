import { makeSmartHexStack } from "./makeSmartHexStack.js";
import { data } from "./config.js";

export function makeNationsStack({
  project,
  id = "nationsStack1",
  centerPosition = [0, 2, 0],
  width = 8,
  height = 2,
  maxItems = 1, // new parameter with default
}) {
  const slicedNations = data.newNations.slice(0, maxItems); // Use maxItems in slice
  const stackItemsNations = slicedNations.map((item) => {
    const labels = [
      item.sport,
      item.country,
      item.capitalCity,
      item.animal,
      item.stadium,
      item.food,
    ];
    return {
      name: item.team,
      labels,
    };
  });

  const smartHexStackModels = makeSmartHexStack({
    project,
    id,
    centerPosition,
    width,
    height,
    stackItems: stackItemsNations,
  });

  return smartHexStackModels;
}

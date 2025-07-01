import { makeSmartHexStack } from "./makeSmartHexStack.js";
import { data } from "./config.js";

export function makeTeamsStack({
  project,
  id = "teamsStack1",
  centerPosition = [0, 2, 0],
  width = 8,
  height = 2,
  maxItems = 1, // new parameter with default
}) {
  const slicedTeams = data.newTeams.slice(0, maxItems); // Use maxItems in slice
  // const slicedTeams = teams.slice(0, maxItems); // Use maxItems in slice
  const stackItemsTeams = slicedTeams.map((item) => {
    const labels = [
      item.sport,
      item.country,
      item.city,
      item.animal,
      item.stadium,
      item.food,
    ];
    return {
      name: item.name,
      labels,
    };
  });

  const smartHexStackModels = makeSmartHexStack({
    project,
    id,
    centerPosition,
    width,
    height,
    stackItems: stackItemsTeams,
  });

  return smartHexStackModels;
}

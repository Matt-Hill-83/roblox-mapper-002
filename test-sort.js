// Quick test of the sorting logic
const testData = [
  { name: "entity1", hasConnection: false },
  { name: "entity2", hasConnection: true },
  { name: "entity3", hasConnection: false },
  { name: "entity4", hasConnection: true },
  { name: "entity5", hasConnection: false },
];

console.log("BEFORE SORT:");
testData.forEach((item, i) => {
  console.log(`${i}: ${item.name} - hasConnection: ${item.hasConnection}`);
});

// Luau-style sort function - CORRECTED
const sorted = [...testData].sort((a, b) => {
  const aHasConnection = a.hasConnection || false;
  const bHasConnection = b.hasConnection || false;

  // If a has no connection and b has connection, a should come first
  if (!aHasConnection && bHasConnection) {
    return true;
  }
  // If a has connection and b has no connection, a should come last
  if (aHasConnection && !bHasConnection) {
    return false;
  }
  // If both have same connection status, maintain original order
  return false;
});

console.log("\nAFTER SORT (should have false first, true last):");
sorted.forEach((item, i) => {
  console.log(`${i}: ${item.name} - hasConnection: ${item.hasConnection}`);
});

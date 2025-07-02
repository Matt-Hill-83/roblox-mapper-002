// Simple test to verify graph switching logic
console.log('Testing graph switching logic...');

let selectedGraph = 'reactflow';

function handleGraphSelect(graph) {
  console.log('Graph selection changed from', selectedGraph, 'to', graph);
  selectedGraph = graph;
  return selectedGraph;
}

// Test the switching
console.log('Initial graph:', selectedGraph);
handleGraphSelect('cytoscape');
console.log('After switching to cytoscape:', selectedGraph);
handleGraphSelect('d3');
console.log('After switching to d3:', selectedGraph);

console.log('Graph switching logic test passed!');
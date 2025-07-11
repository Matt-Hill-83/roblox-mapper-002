/**
 * Temporary test data extracted from actual data generator output
 * This data can be used for testing while we develop the system
 */

import { Node, Link } from "../interfaces/simpleDataGenerator.interface";

export const TEMP_TEST_NODES: Node[] = [
  {
    uuid: "node_1_0",
    name: "man 1-1",
    type: "man",
    color: [0.2, 0.4, 0.8],
    position: { x: 0, y: 0, z: 0 },
    attachmentNames: [],
    properties: {
      age: 56,
      petType: "Fish",
      petColor: "White",
      firstName: "Robert",
      lastName: "Smith",
      countryOfBirth: "United States",
      countryOfResidence: "Netherlands"
    }
  },
  {
    uuid: "node_1_1",
    name: "woman 1-2",
    type: "woman",
    color: [0.8, 0.4, 0.2],
    position: { x: 0, y: 0, z: 0 },
    attachmentNames: [],
    properties: {
      age: 47,
      petType: "Bird",
      petColor: "Golden",
      firstName: "John",
      lastName: "Brown",
      countryOfBirth: "Germany",
      countryOfResidence: "United States"
    }
  },
  {
    uuid: "node_1_2",
    name: "child 1-3",
    type: "child",
    color: [0.2, 0.8, 0.2],
    position: { x: 0, y: 0, z: 0 },
    attachmentNames: [],
    properties: {
      age: 17,
      petType: "Bird",
      petColor: "Orange",
      firstName: "John",
      lastName: "Brown",
      countryOfBirth: "Germany",
      countryOfResidence: "Australia"
    }
  },
  {
    uuid: "node_1_3",
    name: "grandparent 1-4",
    type: "grandparent",
    color: [0.8, 0.2, 0.8],
    position: { x: 0, y: 0, z: 0 },
    attachmentNames: [],
    properties: {
      age: 74,
      petType: "Bird",
      petColor: "Black",
      firstName: "Linda",
      lastName: "Williams",
      countryOfBirth: "United States",
      countryOfResidence: "Spain"
    }
  },
  {
    uuid: "node_2_0",
    name: "man 2-1",
    type: "man",
    color: [0.2, 0.4, 0.8],
    position: { x: 0, y: 0, z: 0 },
    attachmentNames: [],
    properties: {
      age: 55,
      petType: "Fish",
      petColor: "Golden",
      firstName: "James",
      lastName: "Jones",
      countryOfBirth: "India",
      countryOfResidence: "Germany"
    }
  },
  {
    uuid: "node_2_1",
    name: "woman 2-2",
    type: "woman",
    color: [0.8, 0.4, 0.2],
    position: { x: 0, y: 0, z: 0 },
    attachmentNames: [],
    properties: {
      age: 55,
      petType: "Dog",
      petColor: "Gray",
      firstName: "Jennifer",
      lastName: "Smith",
      countryOfBirth: "China",
      countryOfResidence: "France"
    }
  },
  {
    uuid: "node_2_2",
    name: "child 2-3",
    type: "child",
    color: [0.2, 0.8, 0.2],
    position: { x: 0, y: 0, z: 0 },
    attachmentNames: [],
    properties: {
      age: 7,
      petType: "Bird",
      petColor: "Gray",
      firstName: "Mary",
      lastName: "Rodriguez",
      countryOfBirth: "United States",
      countryOfResidence: "Australia"
    }
  },
  {
    uuid: "node_2_3",
    name: "grandparent 2-4",
    type: "grandparent",
    color: [0.8, 0.2, 0.8],
    position: { x: 0, y: 0, z: 0 },
    attachmentNames: [],
    properties: {
      age: 93,
      petType: "None",
      petColor: "White",
      firstName: "James",
      lastName: "Davis",
      countryOfBirth: "India",
      countryOfResidence: "Canada"
    }
  },
  {
    uuid: "node_2_4",
    name: "man 2-5",
    type: "man",
    color: [0.2, 0.4, 0.8],
    position: { x: 0, y: 0, z: 0 },
    attachmentNames: [],
    properties: {
      age: 24,
      petType: "Dog",
      petColor: "Black",
      firstName: "James",
      lastName: "Williams",
      countryOfBirth: "Brazil",
      countryOfResidence: "Canada"
    }
  },
  {
    uuid: "node_2_5",
    name: "woman 2-6",
    type: "woman",
    color: [0.8, 0.4, 0.2],
    position: { x: 0, y: 0, z: 0 },
    attachmentNames: [],
    properties: {
      age: 54,
      petType: "Dog",
      petColor: "Black",
      firstName: "Mary",
      lastName: "Miller",
      countryOfBirth: "Australia",
      countryOfResidence: "France"
    }
  }
];

export const TEMP_TEST_LINKS: Link[] = [
  {
    uuid: "link-1",
    type: "Link1",
    sourceNodeUuid: "node_1_0",
    targetNodeUuid: "node_2_4",
    color: [0.2, 0.8, 0.2]
  },
  {
    uuid: "link-2",
    type: "Link2",
    sourceNodeUuid: "node_1_0",
    targetNodeUuid: "node_2_0",
    color: [0.8, 0.2, 0.8]
  },
  {
    uuid: "link-3",
    type: "Link3",
    sourceNodeUuid: "node_1_1",
    targetNodeUuid: "node_2_5",
    color: [0.8, 0.8, 0.2]
  },
  {
    uuid: "link-4",
    type: "Link1",
    sourceNodeUuid: "node_1_1",
    targetNodeUuid: "node_2_1",
    color: [0.2, 0.8, 0.2]
  },
  {
    uuid: "link-5",
    type: "Link2",
    sourceNodeUuid: "node_1_2",
    targetNodeUuid: "node_2_2",
    color: [0.8, 0.2, 0.8]
  },
  {
    uuid: "link-6",
    type: "Link3",
    sourceNodeUuid: "node_1_2",
    targetNodeUuid: "node_2_6",
    color: [0.8, 0.8, 0.2]
  },
  {
    uuid: "link-7",
    type: "Link1",
    sourceNodeUuid: "node_1_3",
    targetNodeUuid: "node_2_7",
    color: [0.2, 0.8, 0.2]
  },
  {
    uuid: "link-8",
    type: "Link2",
    sourceNodeUuid: "node_1_3",
    targetNodeUuid: "node_2_3",
    color: [0.8, 0.2, 0.8]
  },
  {
    uuid: "link-9",
    type: "Link3",
    sourceNodeUuid: "node_2_0",
    targetNodeUuid: "node_2_2",
    color: [0.8, 0.8, 0.2]
  },
  {
    uuid: "link-10",
    type: "Link1",
    sourceNodeUuid: "node_2_0",
    targetNodeUuid: "node_3_4",
    color: [0.2, 0.8, 0.2]
  }
];
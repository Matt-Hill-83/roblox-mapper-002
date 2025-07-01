const Database = require("better-sqlite3");
const { v4: uuidv4 } = require("uuid");

const db = new Database("sports-data.db");

// Sample data arrays
const FIRST_NAMES = [
  "John",
  "Michael",
  "David",
  "James",
  "Robert",
  "William",
  "Richard",
  "Joseph",
  "Thomas",
  "Christopher",
  "Daniel",
  "Paul",
  "Mark",
  "Donald",
  "Steven",
  "Andrew",
  "Kenneth",
  "Joshua",
  "Kevin",
  "Brian",
  "George",
  "Edward",
  "Ronald",
  "Timothy",
  "Jason",
  "Jeffrey",
  "Ryan",
  "Jacob",
  "Gary",
  "Nicholas",
  "Eric",
  "Jonathan",
  "Stephen",
  "Larry",
  "Justin",
  "Scott",
  "Brandon",
  "Benjamin",
  "Samuel",
  "Gregory",
  "Frank",
  "Raymond",
  "Alexander",
  "Patrick",
  "Jack",
  "Dennis",
  "Jerry",
  "Tyler",
  "Aaron",
  "Jose",
  "Henry",
  "Adam",
  "Douglas",
  "Nathan",
  "Peter",
  "Zachary",
  "Kyle",
  "Walter",
  "Harold",
  "Carl",
];

const LAST_NAMES = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
  "Green",
  "Adams",
  "Nelson",
  "Baker",
  "Hall",
  "Rivera",
  "Campbell",
  "Mitchell",
  "Carter",
  "Roberts",
];

const TEAM_NAMES = [
  "Eagles",
  "Lions",
  "Tigers",
  "Wolves",
  "Dragons",
  "Phoenix",
  "Thunder",
  "Lightning",
  "Storm",
  "Hurricanes",
  "Tornadoes",
  "Blizzard",
  "Avalanche",
  "Earthquake",
  "Tsunami",
  "Volcano",
  "Meteor",
  "Comet",
  "Galaxy",
  "Universe",
  "Cosmos",
  "Stars",
  "Planets",
  "Moons",
  "Suns",
  "Warriors",
  "Knights",
  "Gladiators",
  "Spartans",
  "Vikings",
  "Pirates",
  "Raiders",
  "Crusaders",
  "Samurai",
  "Ninjas",
  "Assassins",
  "Hunters",
  "Rangers",
  "Scouts",
  "Explorers",
];

const CITIES = [
  { name: "New York", country: "USA", continent: "North America" },
  { name: "Los Angeles", country: "USA", continent: "North America" },
  { name: "London", country: "UK", continent: "Europe" },
  { name: "Paris", country: "France", continent: "Europe" },
  { name: "Tokyo", country: "Japan", continent: "Asia" },
  { name: "Sydney", country: "Australia", continent: "Oceania" },
  { name: "Berlin", country: "Germany", continent: "Europe" },
  { name: "Madrid", country: "Spain", continent: "Europe" },
  { name: "Rome", country: "Italy", continent: "Europe" },
  { name: "Moscow", country: "Russia", continent: "Europe" },
];

const HAIR_COLORS = ["black", "brown", "blonde", "red", "gray", "bald"];
const GENDERS = ["male", "female", "other"];
const POSITIONS = ["forward", "midfielder", "defender", "goalkeeper"];

// Helper functions
function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

// Database insert functions
const insertEntity = db.prepare(
  "INSERT INTO entities (guid, type, name, data) VALUES (?, ?, ?, ?)"
);
const insertRelationship = db.prepare(
  "INSERT INTO relationships (guid, type, source_guid, target_guid, properties) VALUES (?, ?, ?, ?, ?)"
);

function createPerson() {
  const guid = uuidv4();
  const firstName = randomChoice(FIRST_NAMES);
  const lastName = randomChoice(LAST_NAMES);
  const name = `${firstName} ${lastName}`;

  const data = {
    gender: randomChoice(GENDERS),
    age: randomInt(18, 45),
    hairColor: randomChoice(HAIR_COLORS),
    hat: Math.random() < 0.3,
    brandSponsor: Math.random() < 0.2 ? "Nike" : null,
    birthCountry: randomChoice(CITIES).country,
    residenceCountry: randomChoice(CITIES).country,
    nickname:
      Math.random() < 0.4
        ? `${firstName.slice(0, 3)}${randomInt(1, 99)}`
        : null,
    position: randomChoice(POSITIONS),
    skill_level: randomInt(60, 95),
    salary: randomInt(50000, 5000000),
    jersey_number: randomInt(1, 99),
  };

  insertEntity.run(guid, "person", name, JSON.stringify(data));
  return { guid, name, ...data };
}

function createTeam() {
  const guid = uuidv4();
  const city = randomChoice(CITIES);
  const name = `${city.name} ${randomChoice(TEAM_NAMES)}`;

  const data = {
    city: city.name,
    owner: null, // Will be set later
    stadium: `${city.name} Stadium`,
    color: randomChoice([
      "red",
      "blue",
      "green",
      "yellow",
      "black",
      "white",
      "purple",
      "orange",
    ]),
    founded_year: randomInt(1900, 2020),
    league: "Premier League",
    budget: randomInt(10000000, 500000000),
  };

  insertEntity.run(guid, "team", name, JSON.stringify(data));
  return { guid, name, ...data };
}

function createCity() {
  const guid = uuidv4();
  const cityData = randomChoice(CITIES);

  const data = {
    province: "Province",
    country: cityData.country,
    continent: cityData.continent,
    population: randomInt(100000, 10000000),
    timezone: "UTC+0",
  };

  insertEntity.run(guid, "city", cityData.name, JSON.stringify(data));
  return { guid, name: cityData.name, ...data };
}

function createRelationship(type, sourceGuid, targetGuid, properties = {}) {
  const guid = uuidv4();
  insertRelationship.run(
    guid,
    type,
    sourceGuid,
    targetGuid,
    JSON.stringify(properties)
  );
}

// Generate data
console.log("Generating random sports data...");

// Create cities first
const cities = [];
for (let i = 0; i < 20; i++) {
  cities.push(createCity());
}

// Create teams
const teams = [];
for (let i = 0; i < 50; i++) {
  teams.push(createTeam());
}

// Create people
const people = [];
for (let i = 0; i < 200; i++) {
  people.push(createPerson());
}

// Create relationships
console.log("Creating relationships...");

// Assign team owners
teams.forEach((team) => {
  const owner = randomChoice(people);
  createRelationship("OWNS_TEAM", owner.guid, team.guid, {
    since: randomDate(new Date(2010, 0, 1), new Date()).toISOString(),
    percentage: randomInt(51, 100),
  });
});

// Assign players to teams
people.forEach((person) => {
  if (Math.random() < 0.8) {
    // 80% of people play for a team
    const team = randomChoice(teams);
    createRelationship("PLAYS_FOR", person.guid, team.guid, {
      since: randomDate(new Date(2020, 0, 1), new Date()).toISOString(),
      jersey_number: person.jersey_number,
    });
  }
});

// Create family relationships
for (let i = 0; i < 50; i++) {
  const parent = randomChoice(people);
  const child = randomChoice(people);
  if (parent.guid !== child.guid && parent.age > child.age + 15) {
    createRelationship("IS_PARENT", parent.guid, child.guid, {});
  }
}

// Create friendships and rivalries
for (let i = 0; i < 100; i++) {
  const person1 = randomChoice(people);
  const person2 = randomChoice(people);
  if (person1.guid !== person2.guid) {
    const relType = Math.random() < 0.7 ? "LIKES" : "DISLIKES";
    createRelationship(relType, person1.guid, person2.guid, {
      intensity: randomInt(1, 10),
    });
  }
}

// People live in cities
people.forEach((person) => {
  const city = randomChoice(cities);
  createRelationship("LIVES_IN", person.guid, city.guid, {
    since: randomDate(new Date(2015, 0, 1), new Date()).toISOString(),
  });
});

console.log(`Generated:`);
console.log(`- ${cities.length} cities`);
console.log(`- ${teams.length} teams`);
console.log(`- ${people.length} people`);

db.close();
console.log("Data generation complete!");

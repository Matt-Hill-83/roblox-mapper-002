#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Data pools
const DATA_POOLS = {
  FIRST_NAMES: [
    "Emma", "Liam", "Olivia", "Noah", "Ava", "Ethan", "Sophia", "Mason",
    "Isabella", "William", "Mia", "James", "Charlotte", "Benjamin", "Amelia",
    "Lucas", "Harper", "Henry", "Evelyn", "Alexander", "Abigail", "Michael",
    "Emily", "Elijah", "Elizabeth", "Daniel", "Sofia", "Matthew", "Avery",
    "Aiden", "Ella", "Joseph", "Madison", "Jackson", "Scarlett", "David",
    "Victoria", "Carter", "Grace", "Wyatt", "Chloe", "Jayden", "Camila",
    "John", "Penelope", "Owen", "Riley", "Dylan", "Layla", "Luke", "Lillian",
    "Gabriel", "Nora", "Anthony", "Zoey", "Isaac", "Mila", "Grayson", "Aria",
    "Jack", "Aubrey", "Julian", "Ellie", "Levi", "Stella", "Christopher", "Natalie",
    "Joshua", "Zoe", "Andrew", "Leah", "Lincoln", "Hazel", "Ryan", "Violet",
    "Nathan", "Aurora", "Samuel", "Savannah", "Charles", "Brooklyn", "Caleb",
    "Bella", "Isaiah", "Claire", "Sebastian", "Skylar", "Thomas", "Lucy",
    "Aaron", "Paisley", "Eli", "Anna", "Connor", "Caroline", "Hunter", "Nova"
  ],
  
  LAST_NAMES: [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
    "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
    "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
    "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill",
    "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell",
    "Mitchell", "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz",
    "Parker", "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales",
    "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson",
    "Bailey", "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward",
    "Richardson", "Watson", "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray",
    "Mendoza", "Ruiz", "Hughes", "Price", "Alvarez", "Castillo", "Sanders", "Patel",
    "Myers", "Long", "Ross", "Foster", "Jimenez", "Powell", "Jenkins", "Perry"
  ],
  
  COUNTRIES: [
    "United States", "United Kingdom", "Canada", "Australia", "Germany", "France",
    "Spain", "Italy", "Netherlands", "Sweden", "Norway", "Denmark", "Finland",
    "Switzerland", "Belgium", "Austria", "Ireland", "Portugal", "Greece", "Poland",
    "Czech Republic", "Romania", "Hungary", "Bulgaria", "Croatia", "Serbia", "Slovenia",
    "Slovakia", "Estonia", "Latvia", "Lithuania", "Japan", "South Korea", "China",
    "India", "Singapore", "Malaysia", "Thailand", "Indonesia", "Philippines", "Vietnam",
    "Brazil", "Argentina", "Chile", "Colombia", "Peru", "Ecuador", "Uruguay",
    "Mexico", "Costa Rica", "Panama", "New Zealand", "South Africa", "Israel",
    "United Arab Emirates", "Saudi Arabia", "Egypt", "Morocco", "Kenya", "Nigeria"
  ],
  
  PET_TYPES: [
    "Dog", "Cat", "Fish", "Bird", "Hamster", "Rabbit", "Guinea Pig", "Turtle",
    "Lizard", "Snake", "Ferret", "Parrot", "Canary", "Goldfish", "Horse",
    "Chicken", "Duck", "Goose", "Pig", "Sheep", "Goat", "Cow", "Mouse",
    "Rat", "Gerbil", "Chinchilla", "Hedgehog", "Sugar Glider", "Tarantula", "Gecko",
    "Iguana", "Bearded Dragon", "Python", "Cockatiel", "Budgie", "Lovebird", "Finch",
    "Parakeet", "Cockatoo", "Macaw", "Conure", "African Grey", "Axolotl", "Frog",
    "Salamander", "Newt", "Hermit Crab", "Ant Farm", "Butterfly", "Praying Mantis",
    "None"
  ],
  
  CITIES: [
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
    "San Antonio", "San Diego", "Dallas", "Austin", "London", "Paris", "Berlin",
    "Madrid", "Rome", "Amsterdam", "Stockholm", "Oslo", "Copenhagen", "Vienna",
    "Prague", "Budapest", "Warsaw", "Tokyo", "Seoul", "Beijing", "Shanghai",
    "Mumbai", "Delhi", "Singapore", "Bangkok", "Jakarta", "Manila", "Sydney",
    "Melbourne", "Brisbane", "Toronto", "Vancouver", "Montreal", "Mexico City",
    "São Paulo", "Rio de Janeiro", "Buenos Aires", "Santiago", "Lima", "Bogotá",
    "Dubai", "Cairo", "Tel Aviv", "Cape Town", "Lagos", "Nairobi", "Moscow",
    "Istanbul", "Athens", "Lisbon", "Dublin", "Edinburgh", "Manchester", "Barcelona"
  ],
  
  ANIMALS: [
    "Lion", "Tiger", "Bear", "Wolf", "Fox", "Eagle", "Hawk", "Owl",
    "Elephant", "Giraffe", "Zebra", "Rhino", "Hippo", "Cheetah", "Leopard",
    "Jaguar", "Panther", "Monkey", "Gorilla", "Chimpanzee", "Orangutan", "Panda",
    "Koala", "Kangaroo", "Platypus", "Penguin", "Seal", "Dolphin", "Whale",
    "Shark", "Octopus", "Jellyfish", "Crab", "Lobster", "Starfish", "Seahorse",
    "Crocodile", "Alligator", "Komodo Dragon", "Chameleon", "Toucan", "Flamingo",
    "Peacock", "Ostrich", "Emu", "Cassowary", "Sloth", "Armadillo", "Anteater",
    "Meerkat", "Lemur", "Raccoon", "Otter", "Beaver", "Porcupine", "Hedgehog"
  ],
  
  RELATIONSHIP_TYPES: [
    "friend", "colleague", "family", "neighbor", "mentor", "acquaintance", "partner"
  ]
};

// Country profiles for realistic data
const COUNTRY_PROFILES = {
  tropical: { sunny: true, warm: true, happiness: [6, 9], expensive: [3, 7] },
  mediterranean: { sunny: true, warm: true, happiness: [7, 9], expensive: [5, 8] },
  northern: { sunny: false, warm: false, happiness: [8, 10], expensive: [7, 10] },
  temperate: { sunny: true, warm: false, happiness: [6, 8], expensive: [5, 8] },
  desert: { sunny: true, warm: true, happiness: [5, 7], expensive: [4, 9] },
};

// Helper functions
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r % 4) + 8;
    return v.toString(16);
  });
}

function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCountryProfile(name) {
  const profileMap = {
    "Brazil": "tropical", "Thailand": "tropical", "Indonesia": "tropical",
    "Philippines": "tropical", "Malaysia": "tropical", "Singapore": "tropical",
    "Costa Rica": "tropical", "Ecuador": "tropical", "Colombia": "tropical",
    
    "Spain": "mediterranean", "Italy": "mediterranean", "Greece": "mediterranean",
    "Portugal": "mediterranean", "Croatia": "mediterranean", "Morocco": "mediterranean",
    
    "Norway": "northern", "Sweden": "northern", "Denmark": "northern",
    "Finland": "northern", "Iceland": "northern", "Estonia": "northern",
    
    "United Arab Emirates": "desert", "Saudi Arabia": "desert", "Egypt": "desert",
    "Israel": "desert",
  };
  
  const profileType = profileMap[name] || "temperate";
  return COUNTRY_PROFILES[profileType];
}

// Data generators
function generateCountry(name) {
  const countryName = name || getRandomItem(DATA_POOLS.COUNTRIES);
  const profile = getCountryProfile(countryName);
  
  return {
    guid: generateGuid(),
    name: countryName,
    isSunny: profile.sunny,
    isWarm: profile.warm,
    happiness: randomInRange(profile.happiness[0], profile.happiness[1]),
    expensive: randomInRange(profile.expensive[0], profile.expensive[1]),
  };
}

function generatePerson(countries) {
  return {
    guid: generateGuid(),
    firstName: getRandomItem(DATA_POOLS.FIRST_NAMES),
    lastName: getRandomItem(DATA_POOLS.LAST_NAMES),
    country: getRandomItem(countries),
    petType: getRandomItem(DATA_POOLS.PET_TYPES),
    countryLivesIn: getRandomItem(countries),
    countryBornIn: getRandomItem(countries),
    countryWorksIn: getRandomItem(countries),
  };
}

function generateRelationships(persons, avgPerPerson = 1.5) {
  const relationships = [];
  const numRelationships = Math.floor(persons.length * avgPerPerson);
  
  for (let i = 0; i < numRelationships; i++) {
    const person1Idx = Math.floor(Math.random() * persons.length);
    let person2Idx = Math.floor(Math.random() * persons.length);
    
    // Ensure different people
    while (person2Idx === person1Idx) {
      person2Idx = Math.floor(Math.random() * persons.length);
    }
    
    relationships.push({
      person1: persons[person1Idx].guid,
      person2: persons[person2Idx].guid,
      type: getRandomItem(DATA_POOLS.RELATIONSHIP_TYPES),
    });
  }
  
  return relationships;
}

// Main generation function
function generateData(personCount, countryCount) {
  console.log(`Generating ${countryCount} countries...`);
  
  // Generate unique countries
  const countries = [];
  const usedCountryNames = new Set();
  
  for (let i = 0; i < Math.min(countryCount, DATA_POOLS.COUNTRIES.length); i++) {
    let countryName;
    do {
      countryName = getRandomItem(DATA_POOLS.COUNTRIES);
    } while (usedCountryNames.has(countryName));
    
    usedCountryNames.add(countryName);
    countries.push(generateCountry(countryName));
  }
  
  console.log(`Generating ${personCount} people...`);
  const countryNames = countries.map(c => c.name);
  const persons = [];
  
  for (let i = 0; i < personCount; i++) {
    persons.push(generatePerson(countryNames));
  }
  
  console.log('Generating relationships...');
  const relationships = generateRelationships(persons);
  
  return {
    metadata: {
      generatedAt: new Date().toISOString(),
      personCount: persons.length,
      countryCount: countries.length,
      relationshipCount: relationships.length,
    },
    persons,
    countries,
    relationships,
  };
}

// Write data to files
function writeDataFiles(data, outputDir) {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write main JSON file
  const jsonPath = path.join(outputDir, 'generated-data.json');
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
  console.log(`Written JSON data to: ${jsonPath}`);
  
  // Write CSV files
  writeCsvFile(path.join(outputDir, 'persons.csv'), data.persons, [
    'guid', 'firstName', 'lastName', 'country', 'petType', 
    'countryLivesIn', 'countryBornIn', 'countryWorksIn'
  ]);
  
  writeCsvFile(path.join(outputDir, 'countries.csv'), data.countries, [
    'guid', 'name', 'isSunny', 'isWarm', 'happiness', 'expensive'
  ]);
  
  writeCsvFile(path.join(outputDir, 'relationships.csv'), data.relationships, [
    'person1', 'person2', 'type'
  ]);
  
  // Write summary
  const summary = `Data Generation Summary
======================
Generated at: ${data.metadata.generatedAt}
Persons: ${data.metadata.personCount}
Countries: ${data.metadata.countryCount}
Relationships: ${data.metadata.relationshipCount}

Sample Person:
- Name: ${data.persons[0].firstName} ${data.persons[0].lastName}
- Country: ${data.persons[0].country}
- Pet: ${data.persons[0].petType}

Sample Country:
- Name: ${data.countries[0].name}
- Sunny: ${data.countries[0].isSunny}
- Warm: ${data.countries[0].isWarm}
- Happiness: ${data.countries[0].happiness}/10
- Expensive: ${data.countries[0].expensive}/10
`;
  
  fs.writeFileSync(path.join(outputDir, 'summary.txt'), summary);
  console.log('Written summary and CSV files');
}

function writeCsvFile(filepath, data, headers) {
  const lines = [headers.join(',')];
  
  for (const item of data) {
    const values = headers.map(header => {
      const value = item[header];
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : String(value);
    });
    lines.push(values.join(','));
  }
  
  fs.writeFileSync(filepath, lines.join('\n'));
  console.log(`Written CSV: ${filepath}`);
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  
  // Parse arguments
  let personCount = 50;
  let countryCount = 20;
  let outputDir = path.join(__dirname, '..', 'generated-data');
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--persons':
      case '-p':
        personCount = parseInt(args[++i]) || personCount;
        break;
      case '--countries':
      case '-c':
        countryCount = parseInt(args[++i]) || countryCount;
        break;
      case '--output':
      case '-o':
        outputDir = args[++i];
        break;
      case '--help':
      case '-h':
        console.log(`
Usage: npm run generate-data [options]

Options:
  -p, --persons <count>     Number of persons to generate (default: 50)
  -c, --countries <count>   Number of countries to generate (default: 20)
  -o, --output <dir>        Output directory (default: generated-data/)
  -h, --help                Show this help message

Example:
  npm run generate-data -- -p 100 -c 30 -o ./my-data
`);
        process.exit(0);
    }
  }
  
  console.log(`\nGenerating data with:`);
  console.log(`- Persons: ${personCount}`);
  console.log(`- Countries: ${countryCount}`);
  console.log(`- Output: ${outputDir}\n`);
  
  const data = generateData(personCount, countryCount);
  writeDataFiles(data, outputDir);
  
  console.log('\nData generation complete!');
}

if (require.main === module) {
  main();
}
// Configuration for block generation
export const config = {
  rectangles: 2,
  squares: 2,
  cylinders: 2,
  spacing: 16, // Space between objects
};

export const attachments = [];

const players = [
  { name: "bob", age: 30, eyeColor: "blue" },
  { name: "alice", age: 25, eyeColor: "green" },
  { name: "carol", age: 28, eyeColor: "brown" },
  { name: "dave", age: 35, eyeColor: "hazel" },
  { name: "eve", age: 22, eyeColor: "gray" },
  { name: "frank", age: 40, eyeColor: "amber" },
  { name: "grace", age: 27, eyeColor: "blue" },
  { name: "heidi", age: 31, eyeColor: "green" },
  { name: "ivan", age: 29, eyeColor: "brown" },
  { name: "judy", age: 33, eyeColor: "blue" },
];
const managers = [
  { name: "bob", age: 30, eyeColor: "blue" },
  { name: "alice", age: 25, eyeColor: "green" },
  { name: "carol", age: 28, eyeColor: "brown" },
  { name: "dave", age: 35, eyeColor: "hazel" },
  { name: "eve", age: 22, eyeColor: "gray" },
  { name: "frank", age: 40, eyeColor: "amber" },
  { name: "grace", age: 27, eyeColor: "blue" },
  { name: "heidi", age: 31, eyeColor: "green" },
  { name: "ivan", age: 29, eyeColor: "brown" },
  { name: "judy", age: 33, eyeColor: "blue" },
];

const teamColors = [
  "red",
  "green",
  "blue",
  "yellow",
  "purple",
  "orange",
  "pink",
  "amber",
  "cyan",
  "magenta",
];

const countries = [
  "USA",
  "Canada",
  "Mexico",
  "UK",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Australia",
  "Japan",
];

const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
];

const animals = [
  "lion",
  "tiger",
  "bear",
  "wolf",
  "eagle",
  "shark",
  "dolphin",
  "whale",
  "elephant",
  "giraffe",
];

const stadiums = [
  "camp nou",
  "wembley stadium",
  "luzhniki stadium",
  "fnb stadium",
  "maracanã stadium",
];

const food = [
  "pizza",
  "burger",
  "sushi",
  "pasta",
  "salad",
  "taco",
  "steak",
  "chicken",
  "fish",
  "vegetable",
];

const sports = [
  "football",
  "basketball",
  "baseball",
  "hockey",
  "tennis",
  "golf",
  "cricket",
  "rugby",
  "volleyball",
  "badminton",
];

const teams = ["team1", "team2", "team3"];

// export const nations = [
//   {
//     team: teams[0].name,
//     country: countries[0],
//     capitalCity: cities[0],
//     food: food[0],
//     team: teams[0],
//     sport: sports[0],
//     animal: animals[0],
//     stadium: stadiums[0],
//     color: teamColors[0],
//   },
//   {
//     team: teams[1].name,
//     country: countries[1],
//     capitalCity: cities[1],
//     food: food[1],
//     team: teams[1],
//     sport: sports[1],
//     animal: animals[1],
//     stadium: stadiums[1],
//     color: teamColors[1],
//   },
//   {
//     team: teams[2].name,
//     country: countries[2],
//     capitalCity: cities[2],
//     food: food[2],
//     team: teams[2],
//     sport: sports[2],
//     animal: animals[2],
//     stadium: stadiums[2],
//     color: teamColors[2],
//   },
//   {
//     team: teams[0].name,
//     country: countries[3],
//     capitalCity: cities[3],
//     food: food[3],
//     team: teams[0],
//     sport: sports[3],
//     animal: animals[3],
//     stadium: stadiums[3],
//     color: teamColors[3],
//   },
// ];

// Utility function to create n random teams
export function createTeams({ numTeams } = {}) {
  const result = [];
  for (let i = 0; i < numTeams; i++) {
    const name = `team${i + 1}`;
    const randomPlayers = Array.from(
      { length: 6 },
      () => players[Math.floor(Math.random() * players.length)]
    );
    const randomManagers = Array.from(
      { length: 2 },
      () => managers[Math.floor(Math.random() * managers.length)]
    );
    const country = countries[Math.floor(Math.random() * countries.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const stadium = stadiums[Math.floor(Math.random() * stadiums.length)];
    const foodItem = food[Math.floor(Math.random() * food.length)];
    const sport = sports[Math.floor(Math.random() * sports.length)];
    const color = teamColors[Math.floor(Math.random() * teamColors.length)];
    result.push({
      name,
      players: randomPlayers,
      managers: randomManagers,
      country,
      city,
      animal,
      stadium,
      food: foodItem,
      sport,
      color,
    });
  }
  return result;
}

// Utility function to create n random nations
export function createNations({ numNations } = {}) {
  const result = [];
  for (let i = 0; i < numNations; i++) {
    // const team = teams[Math.floor(Math.random() * teams.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];
    const capitalCity = cities[Math.floor(Math.random() * cities.length)];
    const foodItem = food[Math.floor(Math.random() * food.length)];
    const sport = sports[Math.floor(Math.random() * sports.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const stadium = stadiums[Math.floor(Math.random() * stadiums.length)];
    const color = teamColors[Math.floor(Math.random() * teamColors.length)];
    result.push({
      // team: team.name,
      country,
      capitalCity,
      food: foodItem,
      // team,
      sport,
      animal,
      stadium,
      color,
    });
  }
  return result;
}

const newTeams = createTeams({ numTeams: 10 }); // Create 10 random teams
const newNations = createNations({ numNations: 10 }); // Create 10 random nations
export const data = { newTeams, newNations };

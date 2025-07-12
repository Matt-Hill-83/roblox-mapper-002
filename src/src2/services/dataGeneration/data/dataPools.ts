export const DATA_POOLS = {
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
    "United States", "Brazil", "Japan", "Germany"
  ],
  
  PET_TYPES: [
    "Dog", "Cat", "Fish", "Bird"
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
  ]
};

// Helper function to get random item from array
export function getRandomItem<T extends defined>(array: T[]): T {
  return array[math.floor(math.random() * array.size())];
}

// Helper function to get multiple random unique items from array
export function getRandomItems<T extends defined>(array: T[], count: number): T[] {
  const shuffled = [...array];
  for (let i = shuffled.size() - 1; i > 0; i--) {
    const j = math.floor(math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Create result array with requested number of items
  const result: T[] = [];
  const maxItems = math.min(count, shuffled.size());
  for (let i = 0; i < maxItems; i++) {
    result.push(shuffled[i]);
  }
  return result;
}

// Generate a UUID v4
export function generateGuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".gsub("[xy]", (c) => {
    const r = math.floor(math.random() * 16);
    const v = c === "x" ? r : (r % 4) + 8;
    return string.format("%x", v);
  })[0];
}
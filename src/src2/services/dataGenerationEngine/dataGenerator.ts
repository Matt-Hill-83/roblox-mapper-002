import { Person, Country } from "./types";

// Random data pools
const FIRST_NAMES = ["John", "Jane", "Bob", "Alice", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
const PET_TYPES = ["Dog", "Cat", "Bird", "Fish", "Hamster", "Rabbit", "Snake", "Turtle", "Lizard", "None"];
const COUNTRY_NAMES = ["USA", "Canada", "Mexico", "Brazil", "UK", "France", "Germany", "Japan", "Australia", "India"];

function generateGuid(): string {
  const s4 = () => {
    const num = math.floor((1 + math.random()) * 0x10000);
    return string.format("%04x", num);
  };
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

function randomChoice<T>(arr: T[]): T {
  return arr[math.floor(math.random() * arr.size())];
}

function randomInt(min: number, max: number): number {
  return math.floor(math.random() * (max - min + 1)) + min;
}

export function generateCountries(count: number = 10): Country[] {
  const countries: Country[] = [];
  const usedNames = new Set<string>();
  
  for (let i = 0; i < count; i++) {
    let name: string;
    do {
      name = randomChoice(COUNTRY_NAMES);
    } while (usedNames.has(name) && usedNames.size() < COUNTRY_NAMES.size());
    
    usedNames.add(name);
    
    countries.push({
      guid: generateGuid(),
      name: name,
      isSunny: math.random() > 0.5,
      isWarm: math.random() > 0.5,
      happiness: randomInt(1, 10),
      expensive: randomInt(1, 10)
    });
  }
  
  return countries;
}

export function generatePersons(count: number, countries: Country[]): Person[] {
  const persons: Person[] = [];
  const countryNames = countries.map(c => c.name);
  
  for (let i = 0; i < count; i++) {
    persons.push({
      guid: generateGuid(),
      firstName: randomChoice(FIRST_NAMES),
      lastName: randomChoice(LAST_NAMES),
      country: randomChoice(countryNames),
      petType: randomChoice(PET_TYPES),
      countryLivesIn: randomChoice(countryNames),
      countryBornIn: randomChoice(countryNames),
      countryWorksIn: randomChoice(countryNames)
    });
  }
  
  return persons;
}

export function generateData(personCount: number = 50, countryCount: number = 10): { persons: Person[], countries: Country[] } {
  const countries = generateCountries(countryCount);
  const persons = generatePersons(personCount, countries);
  
  return { persons, countries };
}
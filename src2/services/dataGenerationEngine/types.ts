export interface Person {
  guid: string;
  firstName: string;
  lastName: string;
  country: string;
  petType: string;
  countryLivesIn: string;
  countryBornIn: string;
  countryWorksIn: string;
}

export interface Country {
  guid: string;
  name: string;
  isSunny: boolean;
  isWarm: boolean;
  happiness: number; // 1-10
  expensive: number; // 1-10
}

export interface GeneratedData {
  persons: Person[];
  countries: Country[];
}
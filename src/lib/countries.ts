export interface Country {
  code: string;
  name: string;
  name_en: string;
  name_de: string;
  name_es: string;
  name_fr: string;
  name_it: string;
  name_pl: string;
  name_nl: string;
  currency: string;
  currencySymbol: string;
  language: string;
  flag: string;
  population: number;
  capital: string;
  region: string;
}

export const COUNTRIES: Country[] = [
  {
    code: "DE",
    name: "Alemania",
    name_en: "Germany",
    name_de: "Deutschland",
    name_es: "Alemania",
    name_fr: "Allemagne",
    name_it: "Germania",
    name_pl: "Niemcy",
    name_nl: "Duitsland",
    currency: "EUR",
    currencySymbol: "€",
    language: "de",
    flag: "🇩🇪",
    population: 83000000,
    capital: "Berlín",
    region: "Central Europe"
  },
  {
    code: "ES",
    name: "España",
    name_en: "Spain",
    name_de: "Spanien",
    name_es: "España",
    name_fr: "Espagne",
    name_it: "Spagna",
    name_pl: "Hiszpania",
    name_nl: "Spanje",
    currency: "EUR",
    currencySymbol: "€",
    language: "es",
    flag: "🇪🇸",
    population: 47000000,
    capital: "Madrid",
    region: "Southern Europe"
  },
  {
    code: "FR",
    name: "Francia",
    name_en: "France",
    name_de: "Frankreich",
    name_es: "Francia",
    name_fr: "France",
    name_it: "Francia",
    name_pl: "Francja",
    name_nl: "Frankrijk",
    currency: "EUR",
    currencySymbol: "€",
    language: "fr",
    flag: "🇫🇷",
    population: 67000000,
    capital: "París",
    region: "Western Europe"
  },
  {
    code: "IT",
    name: "Italia",
    name_en: "Italy",
    name_de: "Italien",
    name_es: "Italia",
    name_fr: "Italie",
    name_it: "Italia",
    name_pl: "Włochy",
    name_nl: "Italië",
    currency: "EUR",
    currencySymbol: "€",
    language: "it",
    flag: "🇮🇹",
    population: 60000000,
    capital: "Roma",
    region: "Southern Europe"
  },
  {
    code: "GB",
    name: "Reino Unido",
    name_en: "United Kingdom",
    name_de: "Vereinigtes Königreich",
    name_es: "Reino Unido",
    name_fr: "Royaume-Uni",
    name_it: "Regno Unito",
    name_pl: "Wielka Brytania",
    name_nl: "Verenigd Koninkrijk",
    currency: "GBP",
    currencySymbol: "£",
    language: "en",
    flag: "🇬🇧",
    population: 67000000,
    capital: "Londres",
    region: "Northern Europe"
  },
  {
    code: "NL",
    name: "Países Bajos",
    name_en: "Netherlands",
    name_de: "Niederlande",
    name_es: "Países Bajos",
    name_fr: "Pays-Bas",
    name_it: "Paesi Bassi",
    name_pl: "Holandia",
    name_nl: "Nederland",
    currency: "EUR",
    currencySymbol: "€",
    language: "nl",
    flag: "🇳🇱",
    population: 17000000,
    capital: "Ámsterdam",
    region: "Western Europe"
  },
  {
    code: "PL",
    name: "Polonia",
    name_en: "Poland",
    name_de: "Polen",
    name_es: "Polonia",
    name_fr: "Pologne",
    name_it: "Polonia",
    name_pl: "Polska",
    name_nl: "Polen",
    currency: "PLN",
    currencySymbol: "zł",
    language: "pl",
    flag: "🇵🇱",
    population: 38000000,
    capital: "Varsovia",
    region: "Eastern Europe"
  },
  {
    code: "AT",
    name: "Austria",
    name_en: "Austria",
    name_de: "Österreich",
    name_es: "Austria",
    name_fr: "Autriche",
    name_it: "Austria",
    name_pl: "Austria",
    name_nl: "Oostenrijk",
    currency: "EUR",
    currencySymbol: "€",
    language: "de",
    flag: "🇦🇹",
    population: 9000000,
    capital: "Viena",
    region: "Central Europe"
  },
  {
    code: "DK",
    name: "Dinamarca",
    name_en: "Denmark",
    name_de: "Dänemark",
    name_es: "Dinamarca",
    name_fr: "Danemark",
    name_it: "Danimarca",
    name_pl: "Dania",
    name_nl: "Denemarken",
    currency: "DKK",
    currencySymbol: "kr",
    language: "da",
    flag: "🇩🇰",
    population: 5800000,
    capital: "Copenhague",
    region: "Northern Europe"
  },
  {
    code: "SE",
    name: "Suecia",
    name_en: "Sweden",
    name_de: "Schweden",
    name_es: "Suecia",
    name_fr: "Suède",
    name_it: "Svezia",
    name_pl: "Szwecja",
    name_nl: "Zweden",
    currency: "SEK",
    currencySymbol: "kr",
    language: "sv",
    flag: "🇸🇪",
    population: 10000000,
    capital: "Estocolmo",
    region: "Northern Europe"
  },
  {
    code: "NO",
    name: "Noruega",
    name_en: "Norway",
    name_de: "Norwegen",
    name_es: "Noruega",
    name_fr: "Norvège",
    name_it: "Norvegia",
    name_pl: "Norwegia",
    name_nl: "Noorwegen",
    currency: "NOK",
    currencySymbol: "kr",
    language: "no",
    flag: "🇳🇴",
    population: 5400000,
    capital: "Oslo",
    region: "Northern Europe"
  },
  {
    code: "FI",
    name: "Finlandia",
    name_en: "Finland",
    name_de: "Finnland",
    name_es: "Finlandia",
    name_fr: "Finlande",
    name_it: "Finlandia",
    name_pl: "Finlandia",
    name_nl: "Finland",
    currency: "EUR",
    currencySymbol: "€",
    language: "fi",
    flag: "🇫🇮",
    population: 5500000,
    capital: "Helsinki",
    region: "Northern Europe"
  },
  {
    code: "PT",
    name: "Portugal",
    name_en: "Portugal",
    name_de: "Portugal",
    name_es: "Portugal",
    name_fr: "Portugal",
    name_it: "Portogallo",
    name_pl: "Portugalia",
    name_nl: "Portugal",
    currency: "EUR",
    currencySymbol: "€",
    language: "pt",
    flag: "🇵🇹",
    population: 10000000,
    capital: "Lisboa",
    region: "Southern Europe"
  },
  {
    code: "CZ",
    name: "República Checa",
    name_en: "Czech Republic",
    name_de: "Tschechische Republik",
    name_es: "República Checa",
    name_fr: "République tchèque",
    name_it: "Repubblica Ceca",
    name_pl: "Czechy",
    name_nl: "Tsjechië",
    currency: "CZK",
    currencySymbol: "Kč",
    language: "cs",
    flag: "🇨🇿",
    population: 10700000,
    capital: "Praga",
    region: "Central Europe"
  },
  {
    code: "HU",
    name: "Hungría",
    name_en: "Hungary",
    name_de: "Ungarn",
    name_es: "Hungría",
    name_fr: "Hongrie",
    name_it: "Ungheria",
    name_pl: "Węgry",
    name_nl: "Hongarije",
    currency: "HUF",
    currencySymbol: "Ft",
    language: "hu",
    flag: "🇭🇺",
    population: 9700000,
    capital: "Budapest",
    region: "Central Europe"
  },
  {
    code: "RO",
    name: "Rumania",
    name_en: "Romania",
    name_de: "Rumänien",
    name_es: "Rumania",
    name_fr: "Roumanie",
    name_it: "Romania",
    name_pl: "Rumunia",
    name_nl: "Roemenië",
    currency: "RON",
    currencySymbol: "lei",
    language: "ro",
    flag: "🇷🇴",
    population: 19000000,
    capital: "Bucarest",
    region: "Eastern Europe"
  },
  {
    code: "BG",
    name: "Bulgaria",
    name_en: "Bulgaria",
    name_de: "Bulgarien",
    name_es: "Bulgaria",
    name_fr: "Bulgarie",
    name_it: "Bulgaria",
    name_pl: "Bułgaria",
    name_nl: "Bulgarije",
    currency: "BGN",
    currencySymbol: "лв",
    language: "bg",
    flag: "🇧🇬",
    population: 7000000,
    capital: "Sofía",
    region: "Eastern Europe"
  },
  {
    code: "HR",
    name: "Croacia",
    name_en: "Croatia",
    name_de: "Kroatien",
    name_es: "Croacia",
    name_fr: "Croatie",
    name_it: "Croazia",
    name_pl: "Chorwacja",
    name_nl: "Kroatië",
    currency: "EUR",
    currencySymbol: "€",
    language: "hr",
    flag: "🇭🇷",
    population: 4000000,
    capital: "Zagreb",
    region: "Southern Europe"
  },
  {
    code: "RS",
    name: "Serbia",
    name_en: "Serbia",
    name_de: "Serbien",
    name_es: "Serbia",
    name_fr: "Serbie",
    name_it: "Serbia",
    name_pl: "Serbia",
    name_nl: "Servië",
    currency: "RSD",
    currencySymbol: "дин",
    language: "sr",
    flag: "🇷🇸",
    population: 7000000,
    capital: "Belgrado",
    region: "Southern Europe"
  },
  {
    code: "SK",
    name: "Eslovaquia",
    name_en: "Slovakia",
    name_de: "Slowakei",
    name_es: "Eslovaquia",
    name_fr: "Slovaquie",
    name_it: "Slovacchia",
    name_pl: "Słowacja",
    name_nl: "Slowakije",
    currency: "EUR",
    currencySymbol: "€",
    language: "sk",
    flag: "🇸🇰",
    population: 5400000,
    capital: "Bratislava",
    region: "Central Europe"
  },
  {
    code: "SI",
    name: "Eslovenia",
    name_en: "Slovenia",
    name_de: "Slowenien",
    name_es: "Eslovenia",
    name_fr: "Slovénie",
    name_it: "Slovenia",
    name_pl: "Słowenia",
    name_nl: "Slovenië",
    currency: "EUR",
    currencySymbol: "€",
    language: "sl",
    flag: "🇸🇮",
    population: 2100000,
    capital: "Ljubljana",
    region: "Southern Europe"
  },
  {
    code: "EE",
    name: "Estonia",
    name_en: "Estonia",
    name_de: "Estland",
    name_es: "Estonia",
    name_fr: "Estonie",
    name_it: "Estonia",
    name_pl: "Estonia",
    name_nl: "Estland",
    currency: "EUR",
    currencySymbol: "€",
    language: "et",
    flag: "🇪🇪",
    population: 1300000,
    capital: "Tallin",
    region: "Northern Europe"
  },
  {
    code: "LV",
    name: "Letonia",
    name_en: "Latvia",
    name_de: "Lettland",
    name_es: "Letonia",
    name_fr: "Lettonie",
    name_it: "Lettonia",
    name_pl: "Łotwa",
    name_nl: "Letland",
    currency: "EUR",
    currencySymbol: "€",
    language: "lv",
    flag: "🇱🇻",
    population: 1900000,
    capital: "Riga",
    region: "Northern Europe"
  },
  {
    code: "LT",
    name: "Lituania",
    name_en: "Lithuania",
    name_de: "Litauen",
    name_es: "Lituania",
    name_fr: "Lituanie",
    name_it: "Lituania",
    name_pl: "Litwa",
    name_nl: "Litouwen",
    currency: "EUR",
    currencySymbol: "€",
    language: "lt",
    flag: "🇱🇹",
    population: 2800000,
    capital: "Vilna",
    region: "Northern Europe"
  }
];

export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find(country => country.code === code);
}

export function getCountryByName(name: string): Country | undefined {
  return COUNTRIES.find(country => 
    country.name === name || 
    country.name_en === name ||
    country.name_de === name ||
    country.name_es === name ||
    country.name_fr === name ||
    country.name_it === name ||
    country.name_pl === name ||
    country.name_nl === name
  );
}

export function getCountriesByRegion(region: string): Country[] {
  return COUNTRIES.filter(country => country.region === region);
}

export function getCountriesByLanguage(language: string): Country[] {
  return COUNTRIES.filter(country => country.language === language);
}

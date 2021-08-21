export type Country = {
    id: string;
    type: "country";
    countryCenter: [number, number];
    fullName: string;
    capital: string;
    capitalCenter?: [number, number];
    shortName: string;
    iso3166a2: string;
    iso3166a3: string;
    thumbnailUrl: string;
    flagUrl: string;
    search: string;
    zoom: number;
    area: number;
    regions: number;
    neigboursCount: number;
    tags: string[];
}

export type TerritoryWithCapital = {
    type: "british-overseas-territory" 
        | "unincorporated-territory-usa" 
        | "crown-dependency" 
        | "disputed-territories" 
        | "autonomous-region-of-portugal" 
        | "france-overseas-territory"
        | "constituent country";
    id: string;
    fullName: string;
    capital: string;
    flagUrl?: string;
    search: string;
}

export type Continent = {
    id: string;
    type: "continent";
    fullName: string;
    search: string;
}

export type GeoObject = Country | TerritoryWithCapital | Continent;

export const GeoObjectTypeMap = {
    "british-overseas-territory": "British overseas territory",
    "unincorporated-territory-usa": "Unincorporated territories of the United States",
    "crown-dependency": "Crown dependency",
    "disputed-territories": "Disputed territories",
    "autonomous-region-of-portugal" : "Autonomous egion of Portugal",
    "constituent country" : "Constituent country",
    "france-overseas-territory" : "France overseas territory",
    "country" : "Country"
} as const;
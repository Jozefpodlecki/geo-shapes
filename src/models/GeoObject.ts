export type Country = {
    id: string;
    type: "country";
    fullName: string;
    capital: string;
    shortName: string;
    countryCode: string;
    thumbnailUrl: string;
    flagUrl: string;
    search: string;
    center: [number, number];
}

export type Continent = {
    id: string;
    type: "continent";
    fullName: string;
    search: string;
}

export type GeoObject = Country | Continent
export type Country = {
    id: string;
    type: "country";
    countryCenter: [number, number];
    fullName: string;
    capital: string;
    capitalCenter?: [number, number];
    shortName: string;
    countryCode: string;
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

export type Continent = {
    id: string;
    type: "continent";
    fullName: string;
    search: string;
}

export type GeoObject = Country | Continent
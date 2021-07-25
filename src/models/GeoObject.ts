export type Country = {
    id: string;
    type: "country";
    fullName: string;
    capital: string;
    shortName: string;
    countryCode: string;
    iso3166a3: string;
    thumbnailUrl: string;
    flagUrl: string;
    search: string;
    center: [number, number];
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
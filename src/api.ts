import { baseUrl } from "./appConstants";
import { Country, GeoObject } from "models/GeoObject";
import { Region } from "./models/Region";
import { GeoJsonObject } from "geojson";

type Options = {
    phrase: string;
    pageSize: number;
}

export const searchGeoObjects = async (options: Options): Promise<GeoObject[]> => {
    const geoObjects = await fetch(`${baseUrl}/assets/geoObjects.json`)
        .then<GeoObject[]>(pr => pr.json());

    return geoObjects
        .filter(pr => pr.search.includes(options.phrase))
        .slice(0, options.pageSize);
}

export const getRegions = (countryCode: string): Promise<Region[]> => {
    
    return fetch(`${baseUrl}/assets/regions/${countryCode}.json`)
        .then(pr => pr.json());
}

export const getCountry = async (countryCode: string): Promise<Country | undefined> => {
    const countries = await fetch(`${baseUrl}/assets/geoObjects.json`)
        .then<Country[]>(pr => pr.json());

    return countries
        .find(pr => pr.countryCode.includes(countryCode));
}

export const getWorldSvg = () => {
    return fetch(`${baseUrl}/assets/shapes/world.svg`)
        .then(pr => pr.text());
}

export const getCountrySvg = (countryCode: string) => {
    return fetch(`${baseUrl}/assets/shapes/${countryCode}/first-level.svg`)
        .then(pr => pr.text());
}

export const getCountryGeojsonLink = (countryCode: string): string => {
    return `${baseUrl}/assets/geojson/${countryCode}.geojson`;
}

export const getCountryGeojson = (countryCode: string): Promise<GeoJsonObject | undefined> => {
    return fetch(`${baseUrl}/assets/geojson/${countryCode}.geojson`)
        .then(pr => pr.json());
}
import { baseUrl } from "./appConstants";
import { Country, GeoObject } from "models/GeoObject";
import { Region } from "./models/Region";
import { GeoJsonObject, FeatureCollection } from "geojson";
import PolygonLookup from "polygon-lookup";

type Options = {
    phrase: string;
    pageSize: number;
}

export const searchGeoObjects = async (options: Options): Promise<GeoObject[]> => {
    const geoObjects = await fetch(`${baseUrl}/assets/geoObjects.json`)
        .then<GeoObject[]>(pr => pr.json());

    return geoObjects
        .filter(pr => pr.search.toLowerCase().includes(options.phrase))
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

let lookup: PolygonLookup;

export const getCountryFromLatLng = async (lat: number, lng: number): Promise<string | undefined> => {
    
    if(!lookup) {
        const countries = await fetch(`${baseUrl}/assets/geojson/countries.geojson`)
            .then<FeatureCollection>(pr => pr.json());
        lookup = new PolygonLookup(countries);
    }

    const polygon = lookup.search(lat, lng);
    
    if(polygon) {
        console.log(polygon);
        debugger;
        return (polygon as any).properties.ISO_A3;
    }
}

export const getCountryGeojsonByIso3166a3 = async (iso3166a3: string): Promise<GeoJsonObject | undefined> => {
    const countries = await fetch(`${baseUrl}/assets/geoObjects.json`)
        .then<Country[]>(pr => pr.json());

    const country = countries.find(pr => pr.iso3166a3 === iso3166a3);
    
    return fetch(`${baseUrl}/assets/geojson/${country?.countryCode}.geojson`)
        .then(pr => pr.json());
}

export const getCountryGeojson = (countryCode: string): Promise<GeoJsonObject | undefined> => {
    return fetch(`${baseUrl}/assets/geojson/${countryCode}.geojson`)
        .then(pr => pr.json());
}
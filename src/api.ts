import { baseUrl } from "./appConstants";
import { Country, GeoObject } from "models/GeoObject";
import { Region } from "./models/Region";
import { GeoJsonObject, FeatureCollection, Feature, Polygon, MultiPolygon } from "geojson";
import PolygonLookup from "polygon-lookup";

type Options = {
    phrase: string;
    pageSize: number;
}

const geoObjectsPromise = fetch(`${baseUrl}/assets/geoObjects.json`)
        .then<GeoObject[]>(pr => pr.json());

export const searchGeoObjects = async (options: Options): Promise<GeoObject[]> => {
    const geoObjects = await geoObjectsPromise;

    return geoObjects
        .filter(pr => pr.search.toLowerCase().includes(options.phrase))
        .slice(0, options.pageSize);
}

export const getRegions = (countryCode: string): Promise<Region[]> => {
    
    return fetch(`${baseUrl}/assets/regions/${countryCode}.json`)
        .then(pr => pr.json());
}

export const getCountry = async (countryCode: string): Promise<Country | undefined> => {
    const geoObjects = await geoObjectsPromise;
    const countries = geoObjects.filter(pr => pr.type === "country") as Country[];

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

    const polygon = lookup.search(lat, lng) as Feature<Polygon | MultiPolygon, { ISO_A3: string }> | undefined;
    
    if(polygon) {
        return polygon.properties.ISO_A3.toLowerCase();
    }
}

export const getCountryGeojsonByIso3166a3 = async (iso3166a3: string): Promise<GeoJsonObject | undefined> => {
    const geoObjects = await geoObjectsPromise;
    const countries = geoObjects.filter(pr => pr.type === "country") as Country[];

    const country = countries.find(pr => pr.iso3166a3 === iso3166a3);
    
    return fetch(`${baseUrl}/assets/geojson/${country?.countryCode}.geojson`)
        .then(pr => pr.json());
}

export const getCountryGeojson = (countryCode: string): Promise<GeoJsonObject | undefined> => {
    return fetch(`${baseUrl}/assets/geojson/${countryCode}.geojson`)
        .then(pr => pr.json());
}
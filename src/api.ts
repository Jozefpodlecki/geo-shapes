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

export const getRegions = (iso3166a2: string): Promise<Region[]> => {
    
    return fetch(`${baseUrl}/assets/regions/${iso3166a2}.json`)
        .then(pr => pr.json());
}

export const getCountry = async (iso3166a2: string): Promise<Country | undefined> => {
    const geoObjects = await geoObjectsPromise;
    const countries = geoObjects.filter(pr => pr.type === "country") as Country[];

    return countries
        .find(pr => pr.iso3166a2.includes(iso3166a2));
}

export const getWorldSvg = () => {
    return fetch(`${baseUrl}/assets/shapes/world.svg`)
        .then(pr => pr.text());
}

export const getCountrySvg = (iso3166a2: string) => {
    return fetch(`${baseUrl}/assets/shapes/${iso3166a2}/first-level.svg`)
        .then(pr => pr.text());
}

export const getCountryGeojsonLink = (iso3166a2: string): string => {
    return `${baseUrl}/assets/geojson/${iso3166a2}.geojson`;
}

let countryLookup: PolygonLookup;

export const getCountryFromLatLng = async (lat: number, lng: number): Promise<string | undefined> => {
    
    if(!countryLookup) {
        const countries = await fetch(`${baseUrl}/assets/geojson/countries.geojson`)
            .then<FeatureCollection>(pr => pr.json());
            countryLookup = new PolygonLookup(countries);
    }

    const polygon = countryLookup.search(lat, lng) as Feature<Polygon | MultiPolygon, { ISO_A3: string }> | undefined;
    
    if(polygon) {
        return polygon.properties.ISO_A3.toLowerCase();
    }
}

let continentLookup: PolygonLookup;

export const getContinentFromLatLng = async (lat: number, lng: number): Promise<string | undefined> => {
    
    if(!continentLookup) {
        const countries = await fetch(`${baseUrl}/assets/geojson/continents.geojson`)
            .then<FeatureCollection>(pr => pr.json());
            continentLookup = new PolygonLookup(countries);
    }

    const polygon = continentLookup.search(lat, lng) as Feature<Polygon | MultiPolygon, { continent: string }> | undefined;
    
    if(polygon) {
        return polygon.properties.continent.toLowerCase();
    }
}

export const getCountryGeojsonByIso3166a3 = async (iso3166a3: string): Promise<GeoJsonObject | undefined> => {
    const geoObjects = await geoObjectsPromise;
    const countries = geoObjects.filter(pr => pr.type === "country") as Country[];

    const country = countries.find(pr => pr.iso3166a3 === iso3166a3);
    
    return fetch(`${baseUrl}/assets/geojson/${country?.iso3166a2}.geojson`)
        .then(pr => pr.json());
}

export const getContinentGeojson = async (continent: string): Promise<GeoJsonObject | undefined> => {
    return fetch(`${baseUrl}/assets/geojson/${continent}.geojson`)
        .then(pr => pr.json());
}

export const getCountryGeojson = (iso3166a2: string): Promise<GeoJsonObject | undefined> => {
    return fetch(`${baseUrl}/assets/geojson/${iso3166a2}.geojson`)
        .then(pr => pr.json());
}
import { baseUrl } from "./appConstants";
import { GeoObject } from "./models/GeoObject";
import { Region } from "./models/Region";

export const searchGeoObjects = async (phrase: string): Promise<GeoObject[]> => {
    const geoObjects = await fetch(`${baseUrl}/assets/geoObjects.json`)
        .then<GeoObject[]>(pr => pr.json());

    return geoObjects
        .filter(pr => pr.search.includes(phrase))
        .slice(0, 5);
}

export const getRegions = (countryCode: string): Promise<Region[]> => {
    return fetch(`${baseUrl}/assets/${countryCode}.json`)
        .then(pr => pr.json());
}
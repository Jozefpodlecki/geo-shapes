import { baseUrl } from "./appConstants";
import { GeoObject } from "./models/GeoObject";
import { Region } from "./models/Region";

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
    return fetch(`${baseUrl}/assets/${countryCode}.json`)
        .then(pr => pr.json());
}
import { GeoJsonObject, Feature, FeatureCollection } from 'geojson';
import { Base64 } from 'js-base64';
import moment from 'moment';
import { parse } from 'wkt';
export * from "./circleToPolygon";

export const newId = () => {    
    return '_' + Math.random().toString(36).substr(2, 9);
};

export const toBase64DataUri = (text: string) => {
    const payload = Base64.encode(text);
    const dataUri = `data:text/plain;base64,${payload}`;
    return dataUri;
}

export const download = (url: string, fileName: string) => {
    const anchor = document.createElement("a");
    document.body.appendChild(anchor);
    anchor.style.display = "none";
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
}

export const getTextFromBlob = async(blob: Blob): Promise<string> => {
    return await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = function() {
            const text = reader.result as string;
            resolve(text);
        }; 
        reader.readAsText(blob);
    })
}

const latlngTextRegex = /(-?\d*\.?\d+)[,\s]*(-?\d*\.?\d+)/;

export const extractGeoObjectFromText = (text: string): GeoJsonObject | undefined => {
    
    try {
        const data = JSON.parse(text) as GeoJsonObject | number[];

        if(Array.isArray(data)) {

            if(!data.length || typeof data[0] !== "number") {
                return;
            }

            return {
                type: "LineString",
                coordinates: [data],
            } as GeoJsonObject;
        }

        return data;
    }
    catch(error) {
        try {
            const geojson = parse(text);
            return geojson;
        } catch (error) {
        }
    }

    const latlngText = latlngTextRegex.exec(text);

    if(latlngText && latlngText.length === 3) {
        const [,lat,lng] = latlngText;
        const type = "Point";
        const coordinates = [Number(lat), Number(lng)];

        return {
            type,
            coordinates,
        } as GeoJsonObject;
    }
}

export const getGeojsonFriendlyName = (data: GeoJsonObject): string => {
    let name = "";

    if(data) {
        switch(data.type) {
            case "Feature":
                name += "feature";
                const feature = data as Feature;
                if(feature.geometry.type === "Polygon") {
                    name += "_polygon";
                    const coordinates = feature.geometry.coordinates;

                    if(coordinates.length && coordinates[0].length) {
                        const numberOfPoints = coordinates[0].length;
                        name += `_${numberOfPoints}`;
                    }
                }
                if(feature.geometry.type === "MultiPolygon") {
                    name += "_multipolygon";
                    const coordinates = feature.geometry.coordinates;

                    if(coordinates.length && coordinates[0].length) {
                        const numberOfPolygons = coordinates[0].length;
                        name += `_${numberOfPolygons}`;
                    }
                }
            break;
            case "Point":
                name += "_point";
            break;
            case "Polygon":
                name += "_polygon";
            break;
            case "MultiPolygon":
                name += "_multipolygon";
            break;
            case "LineString":
                name += "linestring";
            break;
            case "FeatureCollection":
                const features = data as FeatureCollection;
                name += `features_${features.features.length}`;
            break;
        }
    }

    name += moment().format("_YYYYMMDDHHmmss");

    return name;
}

export const trySaveToLocalStorage = (data: any): boolean => {
    try {
        localStorage.setItem("saved", JSON.stringify(data));
        return true;
    } catch (error) {
        return false;
    }
}

export const openFileDialog = () => new Promise<File | null>((resolve, reject) => {
    const input = document.createElement("input")
    input.type = "file";
    let resolved = false;

    const onFocus = () => {
        window.removeEventListener("focus", onFocus)
        setTimeout(() => {
            if(!resolved) {
                resolve(null);
            }
            input.remove();
        }, 100);
    }

    window.addEventListener("focus", onFocus)

    input.onchange = (event) => {
        if (!(event.target instanceof HTMLInputElement)) {
            return;
        }

        resolved = true;
        const [file] = Array.from(event.target.files!);
        resolve(file);
    }

    input.click();
})

export const backgroundImageUrl = (url: string) => ({
    background: `url(${url}) center center / contain no-repeat`
})
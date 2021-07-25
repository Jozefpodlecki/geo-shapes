import { Polygon } from "geojson";

const defaultEarthRadius = 6378137;
const defaultNumberOfEdges = 64;

type Options = {
    numberOfEdges: number;
    earthRadius: number;
    rightHandRule: number;
    bearing: number;
}

const toRadiansRatio = Math.PI / 180;
const toDegreesRatio = 180 / Math.PI;

function toRadians(angleInDegrees: number): number {
    return angleInDegrees * toRadiansRatio;
}

function toDegrees(angleInRadians: number): number {
    return angleInRadians * toDegreesRatio
}

function offset(c1: [number, number], distance: number, earthRadius: number, bearing: number): [number, number] {
    const lat1 = toRadians(c1[1]);
    const lon1 = toRadians(c1[0]);
    const dByR = distance / earthRadius;

    const a = Math.cos(dByR);
    const b = Math.cos(lat1);
    const c = Math.sin(dByR);
    const d = Math.sin(lat1);

    const lat = Math.asin(d * a + b * c * Math.cos(bearing));
    const lon = lon1 + Math.atan2(Math.sin(bearing) * c * b, a - d * Math.sin(lat));

    return [toDegrees(lon), toDegrees(lat)];
}

function getNumberOfEdges(options?: Partial<Options>) {
    if (isUndefinedOrNull(options)) {
        return defaultNumberOfEdges;
    }
    
    if (isObjectNotArray(options)) {
        const numberOfEdges = options.numberOfEdges;
        return numberOfEdges === undefined ? defaultNumberOfEdges : numberOfEdges;
    }

    return defaultNumberOfEdges;
}

function getEarthRadius(options?: Partial<Options>) {
    
    if (isUndefinedOrNull(options)) {
        return defaultEarthRadius;
    }
    
    if(isObjectNotArray(options)) {
        const earthRadius = options.earthRadius;
        return earthRadius === undefined ? defaultEarthRadius : earthRadius;
    }

    return defaultEarthRadius;
}

function getDirection(options?: Partial<Options>){
    if (isObjectNotArray(options) && options.rightHandRule){
        return -1;
    }
    
    return 1;
}

function getBearing(options?: Partial<Options>) {
    if (isUndefinedOrNull(options)) {
        return 0;
    } 
    
    if(isObjectNotArray(options)) {
        const bearing = options.bearing;
        return bearing === undefined ? 0 : bearing;
    }

    return 0;
}

function isObjectNotArray(argument: Partial<Options> | Array<any> | undefined): argument is Options {
    return argument !== null && typeof argument === "object" && !Array.isArray(argument);
}

function isUndefinedOrNull(argument?: Partial<Options>): argument is undefined {
    return argument === null || argument === undefined;
}

export function circleToPolygon(center: [number, number], radius: number, options?: Partial<Options>): Polygon {
    const n = getNumberOfEdges(options);
    const earthRadius = getEarthRadius(options);
    const bearing = getBearing(options);
    const direction = getDirection(options);
  
    const start = toRadians(bearing);
    const coordinates = new Array<[number, number]>();
    
    for (let i = 0; i < n; ++i) {
        const coordinate = offset(center, radius, earthRadius, start + (direction * 2 * Math.PI * -i) / n);
        coordinates.push(coordinate);
    }
    
    coordinates.push(coordinates[0]);
  
    return {
        type: "Polygon",
        coordinates: [coordinates]
    };
};
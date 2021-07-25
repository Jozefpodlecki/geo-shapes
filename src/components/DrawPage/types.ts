import { GeoJsonObject, Feature } from 'geojson';

export type DrawOption = "none" | "polygon" | "circle" | "lineString";
export type ExportType = "geojson" | "csv" | "wkt" | "wkb";

export type GeoObject = {
    id: string;
    data: GeoJsonObject;
}
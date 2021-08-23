import { GeoJsonObject } from 'geojson';

export type GeoJsonObjectWithId = {
    id: string;
    data: GeoJsonObject;
}
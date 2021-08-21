import { GeoJsonObject, Feature, MultiPolygon } from 'geojson';

export const breakDownGeojson = (data: GeoJsonObject) => {
    let result = new Array<GeoJsonObject>();
    let header = "None";

    if(data.type === "Feature") {
        header = "Feature";
        const feature = data as Feature;
        
        if(feature.geometry.type === "MultiPolygon") {
            header += "_MultiPolygon";
            const multiPolygonCoordinates = feature.geometry.coordinates;

            for(const coordinates of multiPolygonCoordinates) {

                const polygon = {
                    type: "Polygon" as const,
                    coordinates
                }
    
                result.push(polygon);
            }
    
            return [header, result] as [string, GeoJsonObject[]];
        }

        if(feature.geometry.type === "Polygon") {
            header += "_Polygon";
            const polygonCoordinates = feature.geometry.coordinates;
            
            const polygon = {
                type: "Polygon" as const,
                coordinates: polygonCoordinates
            }

            result.push(polygon);
    
            return [header, result] as [string, GeoJsonObject[]];
        }
    }

    if(data.type === "MultiPolygon") {
        header = "MultiPolygon";
        const multiPolygon = data as MultiPolygon;
        for(const coordinates of multiPolygon.coordinates) {

            const polygon = {
                type: "Polygon" as const,
                coordinates
            }

            result.push(polygon);
        }

        return [header, result] as [string, GeoJsonObject[]];
    }

    return [header, result] as [string, GeoJsonObject[]];
}
import { LatLngBoundsExpression, LatLngLiteral } from 'leaflet';
import React, { FunctionComponent, useEffect, memo } from 'react';
import { useMapEvents, GeoJSON } from 'react-leaflet';
import { GeoJsonObjectWithId } from 'models/GeoJsonObjectWithId';

type Props = {
    zoom: number;
    center: LatLngLiteral;
    bounds?: LatLngBoundsExpression;
    geoJsons?: GeoJsonObjectWithId[];
    onGeojsonClick?(): void;
}

const MapHandler: FunctionComponent<Props> = ({
    zoom,
    center,
    bounds,
    geoJsons = [],
    onGeojsonClick
}) => {
    const map = useMapEvents({});

    useEffect(() => {
        map.setView(center, zoom);
    }, [map, center]);

    useEffect(() => {
        if(bounds) {
            map.fitBounds(bounds);
        }
    }, [map, bounds]);
    
    return <>
        {geoJsons.map(pr => <GeoJSON eventHandlers={{
            click: onGeojsonClick ? onGeojsonClick : () => {},
        }} key={pr.id} data={pr.data}/>)}
    </>;
}

export default memo(MapHandler);

import { LatLngBoundsExpression, LatLngLiteral } from 'leaflet';
import React, { FunctionComponent, memo, ReactNode } from 'react';
import { GeoJsonObjectWithId } from 'models/GeoJsonObjectWithId';
import OpenStreetMapTileLayer from './OpenStreetMapTileLayer';
import MapHandler from './MapHandler';
import { MapContainer } from 'react-leaflet';

type Props = {
    zoom: number;
    className?: string;
    center: LatLngLiteral;
    bounds?: LatLngBoundsExpression;
    geoJsons?: GeoJsonObjectWithId[];
    children: ReactNode;
}

const BaseMapContainer: FunctionComponent<Props> = ({
    zoom,
    center,
    className,
    bounds,
    geoJsons = [],
    children,
}) => {
    return <MapContainer
        zoom={zoom}
        center={center}
        scrollWheelZoom={true}
        className={className}>
        <OpenStreetMapTileLayer/>
        <MapHandler
            zoom={zoom}
            center={center}
            bounds={bounds}
            geoJsons={geoJsons}
        />
        {children}
    </MapContainer>
}

export default memo(BaseMapContainer);

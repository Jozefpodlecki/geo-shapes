import { LatLngBoundsExpression, LatLngLiteral, LeafletEvent } from 'leaflet';
import { FunctionComponent, memo, useMemo, useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import { useEffect } from 'react';

type Props = {
    center: LatLngLiteral;
    bounds?: LatLngBoundsExpression;
}

const MapHandler: FunctionComponent<Props> = ({
    center,
    bounds,
}) => {
    const map = useMapEvents({});

    useEffect(() => {
        map.setView(center);
    }, [map, center]);

    useEffect(() => {
        if(bounds) {
            map.fitBounds(bounds);
        }
    }, [map, bounds]);
    
    return null;
}

export default memo(MapHandler);

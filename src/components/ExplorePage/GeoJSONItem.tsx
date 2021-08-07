import { FunctionComponent, memo, useCallback, useMemo } from 'react';
import { GeoJSON } from 'react-leaflet';
import { GeoJsonObject, Feature } from 'geojson';
import { LeafletEventHandlerFnMap } from 'leaflet';

type Props = {
    id: string;
    isSelected: boolean;
    eventHandlers: LeafletEventHandlerFnMap;
    data: GeoJsonObject;
}

const GeoJSONItem: FunctionComponent<Props> = ({
    id,
    data,
    eventHandlers,

    isSelected
}) => {
    const style = useMemo(() => {
        return {
            color: isSelected ? "blue" : "gray"
        };
    }, [isSelected])

    const onEachFeature = useCallback((feature: Feature) => {
        feature.id = id;
    }, [id]);

    return <GeoJSON
        data={data}
        data-id={id}
        style={style}
        eventHandlers={eventHandlers}
        onEachFeature={onEachFeature} />
}

export default memo(GeoJSONItem);

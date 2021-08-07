import { LatLngBoundsExpression, LatLngLiteral, LeafletEvent } from 'leaflet';
import { FunctionComponent, memo, useMemo, useState } from 'react';
import { GeoJsonObject, Feature } from 'geojson';
import GeoJSONItem from './GeoJSONItem';
import { useMapEvents } from 'react-leaflet';
import { useEffect } from 'react';
import Menu, { Actions } from './Menu';

type Props = {
    onAction(action: Actions, latlng: LatLngLiteral): void;
    geojsonObjects: any[];
    center: [number, number];
    bounds?: LatLngBoundsExpression;
}

const MapHandler: FunctionComponent<Props> = ({
    onAction,
    geojsonObjects,
    center,
    bounds,
}) => {
    const [menu, setMenu] = useState({
        x: 0,
        y: 0,
        latlng: {
            lat: -1,
            lng: -1,
        },
        isShowing: false,
    });
    const map = useMapEvents({
        click: (event) => {
            const propagatedFrom = event.propagatedFrom;

            if(propagatedFrom && propagatedFrom.feature) {
                const feature = event.propagatedFrom.feature as Feature;
                const id = feature.id as string;
            }

        },
        contextmenu(event) {
            const originalEvent = event.originalEvent;
            originalEvent.preventDefault();
            const { clientX, clientY } = originalEvent;
            const latlng = event.latlng;

            setMenu({
                x: clientX,
                y: clientY,
                latlng,
                isShowing: true,
            });
        }
    });

    useEffect(() => {
        map.setView(center);
    }, [map, center]);

    useEffect(() => {
        if(bounds) {
            map.fitBounds(bounds);
        }
    }, [map, bounds]);
    
    const eventHandlers = useMemo(() => ({
        click(event: LeafletEvent) {
            const target = event.sourceTarget;

            if("feature" in target) {
                const id = target.feature.id;

                // setGeojsonObjects((state) => {
                //     const newState = [...state];

                //     if(!newState.some(pr => pr.id === id)) {
                //         return state;
                //     }

                //     for (const item of newState) {
                        
                //         if(item.isSelected) {
                //             item.isSelected = !item.isSelected;
                //         }

                //         if(item.id === id) {
                //             item.isSelected = !item.isSelected;
                //         }
                //     }

                //     return newState;
                // });
                
            }
        }
    }), []);

    const _onAction = (action: Actions) => {
        onAction(action, menu.latlng);
        onHide();
    }

    const onHide = () => setMenu(state => ({
        ...state,
        isShowing: false,
    }));
    
    return <>
        <Menu
            {...menu}
            onAction={_onAction}
            onHide={onHide}/>
       {geojsonObjects.filter(pr => !pr.invalid).map(pr => <GeoJSONItem
            key={pr.id}
            {...pr}
            eventHandlers={eventHandlers}
            data={pr.data as GeoJsonObject} />)}
    </>;
}

export default memo(MapHandler);

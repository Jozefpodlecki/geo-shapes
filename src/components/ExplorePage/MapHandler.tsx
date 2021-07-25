import { LeafletEvent } from 'leaflet';
import React, { FunctionComponent, MouseEvent, useCallback, useMemo, useState } from 'react';
import { GeoJsonObject, Feature } from 'geojson';
import GeoJSONItem from './GeoJSONItem';
import { useMapEvents } from 'react-leaflet';
import { useEffect } from 'react';
import Menu, { Actions } from './Menu';
import { getCountryFromLatLng, getCountryGeojsonByIso3166a3 } from 'api';

type Props = {
    geojsonObjects: any[];
    center: [number, number];
}

const MapHandler: FunctionComponent<Props> = ({
    geojsonObjects,
    center,
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
    }, [center]);
    
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

    const onHide = () => setMenu(state => ({
        ...state,
        isShowing: false,
    }));

    const onAction = (action: Actions) => {
        if(action === "nearby-country") {
            const { lat, lng } = menu.latlng;

            (async () => {
                const iso3166a3 = await getCountryFromLatLng(lng, lat);

                if(iso3166a3) {
                    const geojson = await getCountryGeojsonByIso3166a3(iso3166a3);
                }

            })();
            
        }

        onHide();
    }
    
    return <>
        <Menu
            {...menu}
            onAction={onAction}
            onHide={onHide}/>
       {geojsonObjects.filter(pr => !pr.invalid).map(pr => <GeoJSONItem
            key={pr.id}
            {...pr}
            eventHandlers={eventHandlers}
            data={pr.data as GeoJsonObject} />)}
    </>;
}

export default MapHandler;
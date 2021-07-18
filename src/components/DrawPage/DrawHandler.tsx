import { DrawOption } from 'components/DrawPage/types';
import React, { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { GeoJSON, Circle, MapContainer, Pane, TileLayer, useMap, useMapEvents } from 'react-leaflet';

type State = {
    type: "LineString" | "Polygon";
    coordinates: number[][] | number[][][];
}

type Props = {
    onChange(): void;
    drawOption: DrawOption;
}

const DrawHandler: FunctionComponent<Props> = ({
    drawOption
}) => {
    const [isDragging, setDragging] = useState(false);
    const [center, setCenter] = useState({
        lat: 50,
        lng: -1,
    });
    const [created, setCreated] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [radius, setRadius] = useState(10);
    const [data, setData] = useState<State>({
        type: "Polygon",
        coordinates: []
    });
    const map = useMapEvents({
        click: (event) => {
            if(!created && drawOption === "circle") {
                map.dragging.disable();
                setCreated(true);
                setCenter(event.latlng);
                setRadius(100);
            }
            if(!completed && created && drawOption === "circle") {
                map.dragging.enable();
                setCompleted(true);
            }
            if(drawOption === "polygon") {
                const { lat, lng } = event.latlng;
                const item = [lng, lat];
                setData(state => {
                    const coordinates = [...state.coordinates[0] as number[][], item];

                    return {
                        ...state,
                        coordinates: [coordinates],
                    };
                });
            }
            if(drawOption === "lineString") {
                const { lat, lng } = event.latlng;
                const item = [lng, lat];
                setData(state => {
                    const coordinates = [...state.coordinates as number[][], item];

                    return {
                        ...state,
                        coordinates,
                    };
                });
            }
        },
        mouseup: (event) => {
            
        },
        mousemove(event) {
            if(created && !completed && drawOption === "circle") {
                const radius = event.latlng.distanceTo(center);
                setRadius(radius);
            }
        }
    });

    useEffect(() => {

        if(drawOption === "none") {
            return;
        }
       
        if((drawOption === "polygon" && data.type === "Polygon")
        || (drawOption === "circle" && data.type === "Polygon")
        || (drawOption === "lineString" && data.type === "LineString")) {
            return;
        }

        setData(state => {
            let type: "LineString" | "Polygon" = "LineString";
            let coordinates: number[][] | number[][][] = [];

            if(drawOption === "circle" || drawOption === "polygon") {
                type = "Polygon";

                if(data.type === "LineString") {
                    coordinates = [data.coordinates as number[][]];
                }
                else {
                    coordinates = [[]];
                }
            }

            return {
                type,
                coordinates,
            }
        });
    }, [data, drawOption]);

    if(drawOption == "none") {
        return null;
    }

    return <>
        <GeoJSON key={Math.random()} data={data}/>
        {created ? <Circle eventHandlers={{
            mousemove: (event) => {
                if(isDragging) {
                    setCenter(event.latlng);
                }
            },
            mousedown: (event) => {
                setDragging(true);
                map.dragging.disable();
            },
            mouseup: (event) => {
                setDragging(false);
                map.dragging.enable();
            }
        }} center={center} radius={radius} /> : null}
    </>
}

export default DrawHandler;
import React, { ChangeEvent, FunctionComponent, useEffect, useRef, useState } from 'react';
import { Link, Route } from 'react-router-dom';
import { GeoJSON, Circle, MapContainer, Pane, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { faCircle, faCircleNotch, faDrawPolygon, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './App.scss';

type State = {
    type: "LineString" | "Polygon";
    coordinates: number[][] | number[][][];
}

type Props = {
    onChange(): void;
    option: "none" | "polygon" | "circle" | "lineString";
}

const MapHandler: FunctionComponent<Props> = ({
    option
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
            if(!created && option === "circle") {
                map.dragging.disable();
                setCreated(true);
                setCenter(event.latlng);
                setRadius(100);
            }
            if(!completed && created && option === "circle") {
                map.dragging.enable();
                setCompleted(true);
            }
            if(option === "polygon") {
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
            if(option === "lineString") {
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
            if(created && !completed && option === "circle") {
                const radius = event.latlng.distanceTo(center);
                setRadius(radius);
            }
        }
    });

    useEffect(() => {

        if(option === "none") {
            return;
        }
       
        if((option === "polygon" && data.type === "Polygon")
        || (option === "circle" && data.type === "Polygon")
        || (option === "lineString" && data.type === "LineString")) {
            return;
        }

        setData(state => {
            let type: "LineString" | "Polygon" = "LineString";
            let coordinates: number[][] | number[][][] = [];

            if(option === "circle" || option === "polygon") {
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
    }, [data, option]);

    if(option == "none") {
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

export default MapHandler;
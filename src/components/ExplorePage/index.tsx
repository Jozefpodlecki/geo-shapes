import React, { FunctionComponent, MouseEvent, useCallback } from 'react';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import { useDropzone } from 'react-dropzone';
import { faDownload, faFileUpload, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { GeoJsonObject } from 'geojson';
import { useEffect } from 'react';
import { newId } from 'appUtils';
import { DotLoader } from 'react-spinners';
import { Feature } from 'geojson';
import { NotificationManager } from 'react-notifications';
import { parse, stringify } from "wkt";
import { LeafletEvent } from 'leaflet';
import './index.scss';
import ImportItem from './ImportItem';
import DragOverlay from './DragOverlay';

type EnhancedGeoJsonObject = {
    id: string;
    fileName: string;
    loadedAt: Date;
    data: GeoJsonObject;
    isSelected: boolean;
    featuresCount: number;
}

const ExplorePage: FunctionComponent = () => {
    const [geojsonObjects, setGeojsonObjects] = useState<EnhancedGeoJsonObject[]>([]);
    const [isUploading, setUploading] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if(!acceptedFiles.length) {
            return;
        }
  
        setUploading(true);
        const reader = new FileReader();

        (async () => {
            let newState = new Array<EnhancedGeoJsonObject>();

            for(const file of acceptedFiles) {

                const geojsonObject = await new Promise<EnhancedGeoJsonObject>((resolve) => {
                    reader.onload = function() {
                        const text = reader.result as string;
                        let data;
                        let featuresCount = 0;

                        try {
                            data = JSON.parse(text) as GeoJsonObject;
                        }
                        catch(error) {
                            data = parse(text);
                        }
                        
            
                        const geojsonObject = {
                            id: newId(),
                            fileName: file.name,
                            loadedAt: new Date(),
                            isSelected: false,
                            featuresCount,
                            data
                        };
                        
                        resolve(geojsonObject);
                    };

                    reader.readAsText(file);
                })

                newState.push(geojsonObject);
            }

            newState = newState.concat(geojsonObjects)
            setGeojsonObjects(newState)
            localStorage.setItem("saved", JSON.stringify(newState));
            setUploading(false);
        })();

      }, [geojsonObjects])
    const {getRootProps, isDragActive} = useDropzone({onDrop})

    useEffect(() => {

        const savedObjects = localStorage.getItem("saved");

        if(savedObjects) {
            new Promise(() => {
                const data = JSON.parse(savedObjects);
                setGeojsonObjects(data);
            });
        }

    }, []);

    useEffect(() => {
        const checkClipboard = async () => {

            try {
                const text = await navigator.clipboard.readText();
                setTimeout(checkClipboard, 2000);    
            } catch (error) {
                //NotificationManager.error("We could not read content from the clipboard", "Clipboard read error.");
            }
            
        }

        setTimeout(checkClipboard, 2000);
    }, []);

    const onToggle = (event: MouseEvent<HTMLDivElement>) => {
        const { id } = event.currentTarget.dataset;

        setGeojsonObjects((state) => {
            const newState = [...state];

            if(!newState.some(pr => pr.id === id)) {
                return state;
            }

            for (const item of newState) {
                
                if(item.isSelected) {
                    item.isSelected = !item.isSelected;
                }

                if(item.id === id) {
                    item.isSelected = !item.isSelected;
                }
            }

            return newState;
        });
    }

    const onDeleteUploaded = (event: MouseEvent<HTMLDivElement>) => {
        const { id } = event.currentTarget.dataset;

        setGeojsonObjects((state) => {
            const newState = state.filter(pr => pr.id !== id);
            localStorage.setItem("saved", JSON.stringify(newState));

            return newState;
        });
        
    }

    const eventHandlers = {
        click(event: LeafletEvent) {
            const target = event.sourceTarget;

            if("feature" in target) {
                const id = target.feature.id;

                setGeojsonObjects((state) => {
                    const newState = [...state];

                    if(!newState.some(pr => pr.id === id)) {
                        return state;
                    }

                    for (const item of newState) {
                        
                        if(item.isSelected) {
                            item.isSelected = !item.isSelected;
                        }

                        if(item.id === id) {
                            item.isSelected = !item.isSelected;
                        }
                    }

                    return newState;
                });
                
            }
        }
    };

    const onEachFeature = (id: string) => (feature: Feature) => {
        feature.id = id;
    }

    const onExport = () => {
        
    }

    return <div className="explore-page" {...getRootProps()}>
        <DragOverlay isShowing={isDragActive}/>
        <MapContainer
            zoom={4}
            center={[51.505, -0.09]}
            scrollWheelZoom={true}
            className="explore-page__map">
            <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {geojsonObjects.map(pr => <GeoJSON
            key={pr.id}
            data={pr.data}
            data-id={pr.id}
            style={{
                color: pr.isSelected ? "blue" : "gray"
            }}
            eventHandlers={eventHandlers}
            onEachFeature={onEachFeature(pr.id)} />)}
        </MapContainer>
        <div className="explore-page__panel">
            {isUploading ? <DotLoader color="white" /> : null}
            {geojsonObjects.map(pr => <ImportItem
                key={pr.id}
                onDeleteUploaded={onDeleteUploaded}
                onExport={onExport}
                onToggle={onToggle}
                {...pr} />)}
        </div>
    </div>;
}

export default ExplorePage;

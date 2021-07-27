import { FunctionComponent, MouseEvent, useCallback, useMemo } from 'react';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import { useDropzone } from 'react-dropzone';
import { useState } from 'react';
import { GeoJsonObject, Feature } from 'geojson';
import { useEffect } from 'react';
import { download, extractGeoObjectFromText, getGeojsonFriendlyName, getTextFromBlob, newId, toBase64DataUri, trySaveToLocalStorage } from 'appUtils';
import { BarLoader, DotLoader } from 'react-spinners';
import { NotificationManager } from 'react-notifications';
import { parse, stringify } from "wkt";
import { geoJSON, LatLngLiteral, LeafletEvent } from 'leaflet';
import ImportItem from './ImportItem';
import DragOverlay from './DragOverlay';
import './index.scss';
import MapHandler from './MapHandler';
import PreviewDialog from './PreviewDialog';
import WarningDialog from './WarningDialog';
import { Actions } from './Menu';
import { getCountryFromLatLng, getCountryGeojsonByIso3166a3 } from 'api';
import moment from 'moment';

type GeoObject = {
    id: string;
    name: string;
    fileName?: string;
    loadedAt: Date;
    isSelected: boolean;
    featuresCount: number;
    area: number;
    points: number;
    warning?: string;
} & ({
    data: GeoJsonObject;
    invalid: false;
} | {
    data: unknown;
    invalid: true;
})

type PageMode = "show-preview" | "show-warning" | undefined;

const ExplorePage: FunctionComponent = () => {
    const [geojsonObjects, setGeojsonObjects] = useState<GeoObject[]>([]);
    const [isUploading, setUploading] = useState(true);
    const [{
        id,
        warning,
        data,
    }, setData] = useState<{
        id: string;
        warning: string | undefined;
        data: GeoJsonObject;
    }>({
        id: "",
        warning: "",
        data: {
            type: "Point"
        },
    });
    const [pageMode, setPageMode] = useState<PageMode>();
    const [center, setCenter] = useState<[number, number]>([51.505, -0.09]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if(!acceptedFiles.length) {
            return;
        }
  
        setUploading(true);
        

        (async () => {
            let newState = new Array<GeoObject>();

            for(const file of acceptedFiles) {

                const text = await getTextFromBlob(file);
                const data = extractGeoObjectFromText(text);
                let featuresCount = 0;

                const geoObject = {
                    id: newId(),
                    name: file.name,
                    fileName: file.name,
                    loadedAt: new Date(),
                    isSelected: false,
                    featuresCount,
                    data,
                    invalid: !data,
                } as GeoObject;

                newState.push(geoObject);

                if(!trySaveToLocalStorage(newState)) {
                    geoObject.warning = "We could not save geo-object to local storage. The file size is too big.";
                }
            }

            newState = newState.concat(geojsonObjects);
            setGeojsonObjects(newState)
            
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
                setUploading(false);
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

    const onPaste = (_event: Event) => {
        const event = _event as ClipboardEvent;
        const text = event.clipboardData?.getData("text");

        if(!text) {
            return;
        }

        const data = extractGeoObjectFromText(text);

        if(!data) {
            return;
        }

        let featuresCount = 0;

        const name = getGeojsonFriendlyName(data);

        const geojsonObject = {
            id: newId(),
            name,
            loadedAt: new Date(),
            isSelected: false,
            featuresCount: 0,
            data,
            invalid: !data,
        }  as GeoObject;

        setGeojsonObjects(state => [...state, geojsonObject]);
    }

    useEffect(() => {
        window.addEventListener("paste", onPaste);

        return () => {
            window.removeEventListener("paste", onPaste);
        }
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

    const onDelete = (event: MouseEvent<HTMLDivElement>) => {
        const { id } = event.currentTarget.dataset;

        setGeojsonObjects((state) => {
            const newState = state.filter(pr => pr.id !== id && !pr.warning);
            localStorage.setItem("saved", JSON.stringify(newState));

            return newState;
        });
        
    }

    const onShowOnMap = (id: string) => {
        const geojsonObject = geojsonObjects.find(pr => pr.id === id)!;

        if(geojsonObject.invalid) {
            return;
        }
        
        const { lat,lng } = geoJSON(geojsonObject.data).getBounds().getCenter();

        setCenter([lat, lng]);
    }

    const onShowWarning = (id: string) => {
        const geojsonObject = geojsonObjects.find(pr => pr.id === id)!;

        setPageMode("show-warning");
        setData(state => ({
            ...state,
            warning: geojsonObject.warning,
        }));
    }

    const onHide = () => setPageMode(undefined);

    const onShowGeojson = (id: string) => {
        const geojsonObject = geojsonObjects.find(pr => pr.id === id)!;

        if(geojsonObject.invalid) {
            return;
        }

        setPageMode("show-preview");
        setData(state => ({
            ...state,
            id: geojsonObject.id,
            data: geojsonObject.data,
        }));
    }

    const onExport = (id: string) => {
        const geojsonObject = geojsonObjects.find(pr => pr.id === id)!;
        const text = toBase64DataUri(JSON.stringify(geojsonObject?.data));
        const fileName = geojsonObject.fileName ? geojsonObject.fileName : `${geojsonObject.name}.geojson`;

        download(text, fileName);
    }

    const onAction = (action: Actions, latlng: LatLngLiteral) => {
        setUploading(true);
        if(action === "nearby-country") {
            const { lat, lng } = latlng;

            (async () => {
                try {
                    const iso3166a3 = await getCountryFromLatLng(lng, lat);

                    if(!iso3166a3) {
                        return;
                    }
    
                    const geojson = await getCountryGeojsonByIso3166a3(iso3166a3);
                    const suffix = moment().format("_YYYYMMDDHHmmss");
                    
                    if(!geojson) {
                        return;
                    }

                    setGeojsonObjects(state => {
                        const newState = [...state, {
                            id: newId(),
                            data: geojson,
                            name: `${iso3166a3}${suffix}`,
                            area: 0,
                            featuresCount: 0,
                            invalid: false,
                            isSelected: false,
                            loadedAt: new Date(),
                            points: 0,
                        }];
                        localStorage.setItem("saved", JSON.stringify(newState));
    
                        return newState;
                    });
                            
                    setTimeout(() => {
                        setUploading(false);
                    }, 1000);
                } catch (error) {
                    setUploading(false);
                }

            })();
            
        }

        onHide();
    }

    return <div className="explore-page" {...getRootProps()}>
        <DragOverlay isShowing={isDragActive}/>
        <MapContainer
            zoom={4}
            center={center}
            scrollWheelZoom={true}
            className="explore-page__map">
            <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
         <MapHandler
            onAction={onAction}
            geojsonObjects={geojsonObjects}
            center={center}
         />
        </MapContainer>
        <PreviewDialog
            id={id}
            onHide={onHide}
            onExport={onExport}
            isShowing={pageMode === "show-preview"}
            data={data}
            />
        <WarningDialog
            isShowing={pageMode === "show-warning"}
            warning={warning}
            onHide={onHide}
        />
        <div className="explore-page__panel">
            <div className="explore-page__loader">
                <BarLoader speedMultiplier={.5} color={isUploading ? "white" : "transparent"} width="100%"/>
            </div>
            <div className="explore-page__toolbar"></div>
            <div className="explore-page__list">
                {geojsonObjects.map(pr => <ImportItem
                    key={pr.id}
                    onDelete={onDelete}
                    onExport={onExport}
                    onToggle={onToggle}
                    onShowWarning={onShowWarning}
                    onShowOnMap={onShowOnMap}
                    onShowGeojson={onShowGeojson}
                    {...pr} />)}
            </div>
            
        </div>
    </div>;
}

export default ExplorePage;

import { FunctionComponent, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import MapHandler from './MapHandler';
import Panel, { PanelChangeOptions } from './Panel';
import { DrawOption, ExportType, GeoObject } from './types';
import { Geometry } from "geojson";
import { stringify } from 'wkt';
import { download, toBase64DataUri } from 'appUtils';
import './index.scss';

type State = {
    geoObjects: GeoObject[];
    selectedCount: number;
}

const DrawPage: FunctionComponent = () => {
    const [{
        geoObjects,
        selectedCount
    }, setGeoObjects] = useState<State>({
        geoObjects: [],
        selectedCount: 0,
    });
    const [isPreviewShowing, setPreviewShow] = useState(false);
    const [drawOption, setDrawOption] = useState<DrawOption>("none");
    const [exportType, setExportType] = useState<ExportType>("geojson");
    const [data, setData] = useState<any>();

    const onPanelChange = (options: PanelChangeOptions) => {
        setDrawOption(options.drawOption);
        setExportType(options.exportType);
        setData("");
    }

    const onDrawChange = (data: GeoObject) => {
        setGeoObjects(state => ({
            ...state,
            geoObjects: [...state.geoObjects, data],
        }));
        setDrawOption("none");
    }

    const onRemoveShapes = () => setGeoObjects({
        geoObjects: [],
        selectedCount: 0,
    });

    const onHide = () => setPreviewShow(false);

    const onPreview = () => {

        let geometry: Geometry;

        if(geoObjects.length === 1) {
            geometry = geoObjects[0].data as any;
        }
        else {
            geometry = {
                type: "GeometryCollection",
                geometries: [...geoObjects.map<Geometry>(pr => pr.data as any)]
            }
        }

        if(exportType === "wkt") {
            let wkt = stringify(geometry);
            wkt = wkt.replace(/,/g, ",\n")
            setData(wkt);
            setPreviewShow(true);

            return;
        }

        setData(geometry);
        setPreviewShow(true);
    }

    const onExport = () => {
        const text = toBase64DataUri(JSON.stringify(data));
        const fileName = exportType === "geojson" ?  "data.geojson" : "wkt.txt";

        download(text, fileName);
    }

    const onAllItemsSelect = () => {
        setGeoObjects(state => {
            const selected = state.geoObjects.some(pr => pr.selected === false) ? true : false;
            const geoObjects = [...state.geoObjects.map(pr => ({...pr, selected}))];
            const selectedCount = selected ? geoObjects.length : 0;

            return {
                geoObjects,
                selectedCount
            };
        })
    }

    const onItemClick = (id: string) => {
        
        setGeoObjects(state => {
            const geoObjects = [...state.geoObjects.map(pr => ({...pr}))];
            let item = geoObjects.find(pr => pr.id === id)!;
            item.selected = !item.selected;
            let selectedCount = state.selectedCount;
            selectedCount = item.selected ? selectedCount + 1 : selectedCount - 1;
            
            return {
                geoObjects,
                selectedCount
            };
        })
    }

    return <div className="draw-page">
        <Panel
            geoObjects={geoObjects}
            drawOption={drawOption}
            exportType={exportType}
            onChange={onPanelChange}
            onExport={onExport}
            onPreview={onPreview}
            onHide={onHide}
            onRemoveShapes={onRemoveShapes}
            onItemClick={onItemClick}
            onAllItemsSelect={onAllItemsSelect}
            data={data}
            selectedCount={selectedCount}
            dataAvailable={!!geoObjects.length}
            isPreviewShowing={isPreviewShowing}
        />
        <MapContainer
            zoom={4}
            center={[51.505, -0.09]}
            scrollWheelZoom={true}
            className="draw-page__map">
            <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapHandler
                onChange={onDrawChange}
                geoObjects={geoObjects}
                drawOption={drawOption}/>
        </MapContainer>
    </div>
}

export default DrawPage;
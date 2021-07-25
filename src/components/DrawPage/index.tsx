import React, { FunctionComponent, useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import MapHandler from './MapHandler';
import Panel, { PanelChangeOptions } from './Panel';
import { DrawOption, ExportType, GeoObject } from './types';
import { GeoJsonObject, FeatureCollection, Feature } from "geojson";
import './index.scss';
import { stringify } from 'wkt';


const DrawPage: FunctionComponent = ({
}) => {
    const [geoObjects, setGeoObjects] = useState<GeoObject[]>([]);
    const [isPreviewShowing, setPreviewShow] = useState(false);
    const [drawOption, setDrawOption] = useState<DrawOption>("none");
    const [exportType, setExportType] = useState<ExportType>("geojson");
    const [data, setData] = useState<any>();

    const onPanelChange = (options: PanelChangeOptions) => {
        setDrawOption(options.drawOption);
        setExportType(options.exportType);
    }

    const onDrawChange = (data: GeoObject) => {
        setGeoObjects(state => [...state, data]);
        setDrawOption("none")
    }

    const onExport = () => {

    }

    const onRemoveShapes = () => setGeoObjects([]);

    const onHide = () => setPreviewShow(false);

    const onPreview = () => {

        if(exportType === "wkt") {

            if(geoObjects.length === 1) {
                let wkt = stringify(geoObjects[0].data as any);
                wkt = wkt.replace(/,/g, ",\n")
                setData(wkt);
                setPreviewShow(true);
                return;
            }

            let result = "";

            for(const geoObject of geoObjects) {
                let wkt = stringify(geoObject.data as any);
                wkt = wkt.replace(/,/g, ",\n");
                result += "\n" + wkt;
            }
            
            setData(result);
            setPreviewShow(true);

            return;
        }

        if(!geoObjects.length) {
            setData("");
            setPreviewShow(true);
            return;
        }

        if(geoObjects.length === 1) {
            setData(geoObjects[0].data);
            setPreviewShow(true);
            return;
        }
        
        const features: FeatureCollection = {
            type: "FeatureCollection",
            features: [...geoObjects.map<Feature>(pr => ({
                type: "Feature",
                geometry: pr.data as any,
                properties: {},
            }))]
        }

        setData(features);
        setPreviewShow(true);
    }


    return <div className="draw-page">
        <Panel
            drawOption={drawOption}
            exportType={exportType}
            onChange={onPanelChange}
            onExport={onExport}
            onPreview={onPreview}
            onHide={onHide}
            onRemoveShapes={onRemoveShapes}
            data={data}
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
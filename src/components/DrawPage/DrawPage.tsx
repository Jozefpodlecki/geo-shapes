import React, { FunctionComponent, useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import MapHandler from './DrawHandler';
import Panel from './Panel';
import { DrawOption, ExportType } from './types';
import './drawPage.scss';

const DrawPage: FunctionComponent = ({
}) => {
    const [isShowing, setShow] = useState(false);
    const [drawOption, setDrawOption] = useState<DrawOption>("none");
    const [exportType, setExportType] = useState<ExportType>("geojson");
    const [data, setData] = useState("");

    const onSearch = () => setShow(true);
    const onHide = () => setShow(false);

    useEffect(() => {
        // if(!circleRef.current) {
        //     return;
        // }

    }, [])

    const onPanelChange = () => {

    }

    const onDrawChange = () => {

    }

    const onExport = () => {

    }

    return <div className="appMap">
        <Panel
            drawOption={drawOption}
            exportType={exportType}
            onChange={onPanelChange}
            onExport={onExport}
            data={data}
        />
        <MapContainer
            zoom={4}
            center={[51.505, -0.09]}
            scrollWheelZoom={true}
            className="appMap__map">
            <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapHandler
                onChange={onDrawChange}
                drawOption={drawOption}/>
        </MapContainer>
    </div>
}

export default DrawPage;
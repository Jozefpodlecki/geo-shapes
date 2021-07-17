import React, { ChangeEvent, FunctionComponent, MouseEvent, useEffect, useRef, useState } from 'react';
import CountryPage from './CountryPage';
import Toolbar from './Toolbar';
import { Link, Route } from 'react-router-dom';
import SearchGeoObjectsDialog from './SearchGeoObjectsDialog';
import { GeoJSON, Circle, MapContainer, Pane, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { faCircle, faCircleNotch, faClipboard, faDownload, faDrawPolygon, faEye, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Highlight from "react-highlight";
import MapHandler from '../MapHandler';
import './drawPage.scss';

const DrawPage: FunctionComponent = ({
}) => {
    const [isShowing, setShow] = useState(false);
    const [option, setOption] = useState<"none" | "polygon" | "circle" | "lineString">("none");
    const [exportType, setExportType] = useState<"geojson" | "csv" | "wkt" | "wkb">("geojson");
    const [data, setData] = useState("");

    const onSearch = () => setShow(true);
    const onHide = () => setShow(false);

    useEffect(() => {
        // if(!circleRef.current) {
        //     return;
        // }

    }, [])

    const onPolygon = () => option === "polygon" ? setOption("none") : setOption("polygon")

    const onLineString = () => option === "lineString" ? setOption("none") : setOption("lineString")

    const onCircle = () => option === "circle" ? setOption("none") : setOption("circle")

    const onExportType = (event: MouseEvent<HTMLDivElement>) => {
        const { exporttype } = event.currentTarget.dataset;
    }

    const onChange = () => {

    }

    return <div className="appMap">
        <div className="appMap__panel">
            <div className="appMap__toolbox">
                <div onClick={onPolygon} className={`appMap__tool ${option === "polygon" ? "selected" : ""}`}><FontAwesomeIcon icon={faDrawPolygon}/></div>
                <div onClick={onLineString} className={`appMap__tool ${option === "lineString" ? "selected" : ""}`}><FontAwesomeIcon icon={faPencilAlt}/></div>
                <div onClick={onCircle} className={`appMap__tool ${option === "circle" ? "selected" : ""}`}><FontAwesomeIcon icon={faCircle}/></div>
            </div>
            <div>
                <div>Export</div>
                <div className="export">
                    <div data-exporttype="geojson" onClick={onExportType} className={`export__option ${exportType === "geojson" ? "selected" : ""}`}>Geojson</div>
                    <div data-exporttype="csv" onClick={onExportType} className={`export__option ${exportType === "csv" ? "selected" : ""}`}>CSV</div>
                    <div data-exporttype="wkt" onClick={onExportType} className={`export__option ${exportType === "wkt" ? "selected" : ""}`}>WKT</div>
                    <div data-exporttype="wkb" onClick={onExportType} className={`export__option ${exportType === "wkb" ? "selected" : ""}`}>WKB</div>
                </div>
                <div className="data">
                    {exportType === "geojson" ? <Highlight className="json">
                    {data}
                    </Highlight> : null}
                </div>
                <div className="payload">
                    <div onClick={onExportType} className="payload__option"><FontAwesomeIcon icon={faEye}/></div>
                    <div onClick={onExportType} className="payload__option"><FontAwesomeIcon icon={faClipboard}/></div>
                    <div onClick={onExportType} className="payload__option"><FontAwesomeIcon icon={faDownload}/></div>
                </div>
            </div>
        </div>
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
                onChange={onChange}
                option={option}/>
        </MapContainer>
    </div>
}

export default DrawPage;
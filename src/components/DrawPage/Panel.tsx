import React, { FunctionComponent, MouseEvent, useEffect, useRef, useState } from 'react';
import { faCircle, faClipboard, faDownload, faDrawPolygon, faEye, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Highlight from "react-highlight";
import { DrawOption, ExportType } from './types';
import './panel.scss';

type Props = {
    drawOption: DrawOption;
    exportType: ExportType;
    data: any;
    onChange(options: {
        drawOption: DrawOption,
        exportType: ExportType
    }): void;
    onExport(): void;
}

const Panel: FunctionComponent<Props> = ({
    drawOption,
    exportType,
    data,
    onChange,
    onExport
}) => {

    const onDrawOptionChange = (event: MouseEvent<HTMLDivElement>) => {
        const { drawoption } = event.currentTarget.dataset;
        onChange({
            drawOption: drawoption as typeof drawOption,
            exportType
        })
    }

    const onExportTypeChange = (event: MouseEvent<HTMLDivElement>) => {
        const { exporttype } = event.currentTarget.dataset;
        onChange({
            drawOption,
            exportType: exporttype as typeof exportType,
        })
    }

    return <div className="appMap__panel">
        <div className="appMap__toolbox">
            <div data-drawoption="polygon" onClick={onDrawOptionChange} className={`appMap__tool ${drawOption === "polygon" ? "selected" : ""}`}><FontAwesomeIcon icon={faDrawPolygon}/></div>
            <div data-drawoption="lineString" onClick={onDrawOptionChange} className={`appMap__tool ${drawOption === "lineString" ? "selected" : ""}`}><FontAwesomeIcon icon={faPencilAlt}/></div>
            <div data-drawoption="circle" onClick={onDrawOptionChange} className={`appMap__tool ${drawOption === "circle" ? "selected" : ""}`}><FontAwesomeIcon icon={faCircle}/></div>
        </div>
        <div>
            <div>Export</div>
            <div className="export">
                <div data-exporttype="geojson" onClick={onExportTypeChange} className={`export__option ${exportType === "geojson" ? "selected" : ""}`}>Geojson</div>
                <div data-exporttype="csv" onClick={onExportTypeChange} className={`export__option ${exportType === "csv" ? "selected" : ""}`}>CSV</div>
                <div data-exporttype="wkt" onClick={onExportTypeChange} className={`export__option ${exportType === "wkt" ? "selected" : ""}`}>WKT</div>
                <div data-exporttype="wkb" onClick={onExportTypeChange} className={`export__option ${exportType === "wkb" ? "selected" : ""}`}>WKB</div>
            </div>
            <div className="data">
                {exportType === "geojson" ? <Highlight className="json">
                {data}
                </Highlight> : null}
            </div>
            <div className="payload">
                <div onClick={onExport} className="payload__option"><FontAwesomeIcon icon={faEye}/></div>
                <div onClick={onExport} className="payload__option"><FontAwesomeIcon icon={faClipboard}/></div>
                <div onClick={onExport} className="payload__option"><FontAwesomeIcon icon={faDownload}/></div>
            </div>
        </div>
    </div>
}

export default Panel;
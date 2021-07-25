import React, { FunctionComponent, memo, MouseEvent, useEffect, useRef, useState } from 'react';
import { faCircle, faClipboard, faDownload, faDrawPolygon, faEye, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { DrawOption, ExportType, GeoObject } from './types';
import Icon from 'components/Icon';
import PreviewDialog from './PreviewDialog';
import './panel.scss';

export type PanelChangeOptions = {
    drawOption: DrawOption;
    exportType: ExportType;
}

type Props = {
    drawOption: DrawOption;
    exportType: ExportType;
    data?: GeoObject;
    onChange(options: PanelChangeOptions): void;
    onExport(): void;
    onPreview(): void;
    onHide(): void;
    isPreviewShowing: boolean;
}

const Panel: FunctionComponent<Props> = ({
    drawOption,
    exportType,
    data,
    onChange,
    onExport,
    onPreview,
    onHide,
    isPreviewShowing,
}) => {

    const onDrawOptionChange = (event: MouseEvent<HTMLDivElement>) => {
        const { id } = event.currentTarget.dataset;
        onChange({
            drawOption: id as typeof drawOption,
            exportType
        })
    }

    const onCopy = () => {
        
    }

    const onExportTypeChange = (event: MouseEvent<HTMLDivElement>) => {
        const { id } = event.currentTarget.dataset;
        onChange({
            drawOption,
            exportType: id as typeof exportType,
        })
    }

    return <div className="draw-page__panel">
        <div className="draw-page__toolbox">
            <Icon data-id="polygon" onClick={onDrawOptionChange} className={`draw-page__tool ${drawOption === "polygon" ? "selected" : ""}`} icon={faDrawPolygon}/>
            <Icon data-id="lineString" onClick={onDrawOptionChange} className={`draw-page__tool ${drawOption === "lineString" ? "selected" : ""}`} icon={faPencilAlt}/>
            <Icon data-id="circle" onClick={onDrawOptionChange} className={`draw-page__tool ${drawOption === "circle" ? "selected" : ""}`} icon={faCircle}/>
        </div>
        <div className="export-section">
            <div className="export-section__title">Export</div>
            <div className="export">
                <div data-id="geojson" onClick={onExportTypeChange} className={`export__option ${exportType === "geojson" ? "export__option--selected" : ""}`}>Geojson</div>
                {/* <div data-id="csv" onClick={onExportTypeChange} className={`export__option ${exportType === "csv" ? "selected" : ""}`}>CSV</div> */}
                <div data-id="wkt" onClick={onExportTypeChange} className={`export__option ${exportType === "wkt" ? "export__option--selected" : ""}`}>WKT</div>
                {/* <div data-id="wkb" onClick={onExportTypeChange} className={`export__option ${exportType === "wkb" ? "selected" : ""}`}>WKB</div> */}
            </div>
            <PreviewDialog
                id={data?.id}
                data={data}
                onExport={onExport}
                onHide={onHide}
                isShowing={isPreviewShowing}
                exportType={exportType}
            />
            <div className="payload">
                <Icon onClick={onPreview} className="payload__option" icon={faEye}/>
                <Icon onClick={onExport} className="payload__option" icon={faClipboard}/>
                <Icon onClick={onCopy} className="payload__option" icon={faDownload}/>
                {/* <div onClick={onExport} className="payload__option"><FontAwesomeIcon icon={faClipboard}/></div>
                <div onClick={onExport} className="payload__option"><FontAwesomeIcon icon={faDownload}/></div> */}
            </div>
        </div>
    </div>
}

export default memo(Panel);
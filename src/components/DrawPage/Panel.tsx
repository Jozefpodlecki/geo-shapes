import React, { FunctionComponent, memo, MouseEvent, ChangeEvent } from 'react';
import { faCircle, faClipboard, faDownload, faDrawPolygon, faEye, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { DrawOption, ExportType, GeoObject } from './types';
import Icon from 'components/Icon';
import PreviewDialog from './PreviewDialog';
import './panel.scss';
import Checkbox from './Checkbox';

export type PanelChangeOptions = {
    drawOption: DrawOption;
    exportType: ExportType;
}

type Props = {
    drawOption: DrawOption;
    exportType: ExportType;
    data?: GeoObject;
    geoObjects: GeoObject[];
    dataAvailable: boolean;
    onChange(options: PanelChangeOptions): void;
    onExport(): void;
    onPreview(): void;
    onHide(): void;
    onRemoveShapes(): void;
    onItemClick(id: string): void;
    onAllItemsSelect(): void;
    selectedCount: number;
    isPreviewShowing: boolean;
}

const Panel: FunctionComponent<Props> = ({
    drawOption,
    exportType,
    data,
    geoObjects,
    onChange,
    onExport,
    onPreview,
    onHide,
    onRemoveShapes,
    onItemClick,
    onAllItemsSelect,
    selectedCount,
    isPreviewShowing,
    dataAvailable,
}) => {
    const dataNotAvailable = !dataAvailable;

    const onDrawOptionChange = (event: MouseEvent<HTMLDivElement>) => {
        const { id } = event.currentTarget.dataset;
        onChange({
            drawOption: id as typeof drawOption,
            exportType
        })
    }

    const onCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(data));
    }

    const onExportTypeChange = (event: MouseEvent<HTMLDivElement>) => {
        const { id } = event.currentTarget.dataset;
        onChange({
            drawOption,
            exportType: id as typeof exportType,
        })
    }

    const _onItemClick = (event: React.MouseEvent<HTMLElement>) => {
        const { id } = event.currentTarget.dataset;
        onItemClick(id!);
    }

    const onItemSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const { id } = event.currentTarget.dataset;
        onItemClick(id!);
    }

    return <div className="draw-page__panel">
        <div className="draw-page__topBar">
            Remove shapes <Icon disabled={dataNotAvailable} onClick={onRemoveShapes} className={``} icon={faTrash}/>
        </div>
        <div className="draw-page__toolbox">
            <Icon data-id="polygon" onClick={onDrawOptionChange} className={`draw-page__tool ${drawOption === "polygon" ? "selected" : ""}`} icon={faDrawPolygon}/>
            <Icon data-id="lineString" onClick={onDrawOptionChange} className={`draw-page__tool ${drawOption === "lineString" ? "selected" : ""}`} icon={faPencilAlt}/>
            <Icon data-id="circle" onClick={onDrawOptionChange} className={`draw-page__tool ${drawOption === "circle" ? "selected" : ""}`} icon={faCircle}/>
        </div>
        <div className="items-section">
            <div className="items-section__header">
                <div>
                    <Checkbox onChange={onAllItemsSelect} checked={geoObjects.length && selectedCount === geoObjects.length || false}/>
                </div>
                <div className="items-section__title">Items</div>
            </div>
            {geoObjects.map(pr => <div className="items-section__item"
                data-id={pr.id}
                key={pr.id}
                onClick={_onItemClick}>
                <div>
                    <Checkbox data-id={pr.id} onChange={onItemSelect} checked={pr.selected}/>
                </div>
                <div>{pr.id}</div>
            </div>)}
        </div>
        <div className="export-section">
            <div className="export-section__title">Export</div>
            <div className="export">
                <div data-id="geojson" onClick={onExportTypeChange} className={`export__option ${exportType === "geojson" ? "export__option--selected" : ""}`}>Geojson</div>
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
                <Icon disabled={dataNotAvailable} onClick={onPreview} className="payload__option" icon={faEye}/>
                <Icon disabled={dataNotAvailable} onClick={onCopy} className="payload__option" icon={faClipboard}/>
                <Icon disabled={dataNotAvailable} onClick={onExport} className="payload__option" icon={faDownload}/>
            </div>
        </div>
    </div>
}

export default memo(Panel);
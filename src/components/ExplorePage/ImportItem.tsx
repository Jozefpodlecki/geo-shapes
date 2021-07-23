import React, { FunctionComponent, MouseEvent, useCallback } from 'react';
import { faDownload, faFileUpload, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './importItem.scss';

type Props = {
    id: string;
    fileName: string;
    loadedAt: string | Date;
    isSelected: boolean;
    featuresCount: number;
    onToggle(event: MouseEvent<HTMLDivElement>): void;
    onDeleteUploaded(event: MouseEvent<HTMLDivElement>): void;
    onExport(): void;
}

const ImportItem: FunctionComponent<Props> = ({
    id,
    isSelected,
    loadedAt,
    fileName,
    featuresCount,
    onDeleteUploaded,
    onExport,
    onToggle,
}) => {

    return <div className={`uploaded-item ${isSelected ? "selected" : ""}`}>
        <div className="uploaded-item__topBar">
            <div data-id={id} onClick={onToggle}>
                <div className="uploaded-item__title">{fileName}</div>
                <div className="uploaded-item__detail">Loaded at: {new Date(loadedAt).toLocaleString()}</div>
            </div>
            <div data-id={id} className="uploaded-item__delete" onClick={onDeleteUploaded}><FontAwesomeIcon icon={faTimes}/></div>
        </div>
        <div className="uploaded-item__body">
            <div className="uploaded-item__detail">Features: {featuresCount}</div>
            <div className="popup__iconButton" onClick={onExport}>
                <FontAwesomeIcon icon={faDownload}/>
            </div>
        </div>
    </div>;
}

export default ImportItem;

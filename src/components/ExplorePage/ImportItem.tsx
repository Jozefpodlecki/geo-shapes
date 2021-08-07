import { FunctionComponent, MouseEvent } from 'react';
import { faCode, faCrosshairs, faDownload, faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';
import Icon from 'components/Icon';
import './importItem.scss';

type Props = {
    id: string;
    name: string;
    loadedAt: string | Date;
    isSelected: boolean;
    featuresCount: number;
    warning?: string;
    invalid: boolean;
    onToggle(event: MouseEvent<HTMLDivElement>): void;
    onDelete(event: MouseEvent<HTMLDivElement>): void;
    onExport(id: string): void;
    onShowOnMap(id: string): void;
    onShowGeojson(id: string): void;
    onShowWarning(id: string): void;
}

const ImportItem: FunctionComponent<Props> = ({
    id,
    isSelected,
    loadedAt,
    name,
    featuresCount,
    warning,
    invalid,
    onDelete,
    onShowOnMap,
    onShowGeojson,
    onShowWarning,
    onExport,
    onToggle,
}) => {

    const _onExport = () => onExport(id);
    const _onShowOnMap = () => onShowOnMap(id);
    const _onShowGeojson = () => onShowGeojson(id);
    const _onShowWarning = () => onShowWarning(id);
    
    return <div className={`uploaded-item ${isSelected ? "selected" : ""}`}>
        <div className="uploaded-item__topBar">
            <div data-id={id} onClick={onToggle}>
                <div className="uploaded-item__title">{name}</div>
                <div className="uploaded-item__detail">Loaded at: {new Date(loadedAt).toLocaleString()}</div>
            </div>
            <Icon data-id={id} className="uploaded-item__delete" onClick={onDelete} icon={faTimes}/>
        </div>
        {invalid ? <div className="uploaded-item__body">
            {warning ? <Icon className="popup__iconButton" onClick={_onShowWarning} icon={faExclamationTriangle}/> : null}
        </div> : <div className="uploaded-item__body">
            <Icon className="popup__iconButton" onClick={_onShowOnMap} icon={faCrosshairs}/>
            {featuresCount ? <div className="uploaded-item__detail">Features: {featuresCount}</div> : null}
            <Icon className="popup__iconButton" onClick={_onExport} icon={faDownload}/>
            <Icon className="popup__iconButton" onClick={_onShowGeojson} icon={faCode}/>
            {warning ? <Icon className="popup__iconButton" onClick={_onShowWarning} icon={faExclamationTriangle}/> : null}
        </div>}
    </div>;
}

export default ImportItem;

import { FunctionComponent, memo, useCallback, useEffect, useState } from 'react';
import ToolTip from 'components/ToolTip';
import { baseUrl } from 'appConstants';
import { GeoObject } from 'models/GeoObject';
import { searchGeoObjects } from 'api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faInfo } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './popup.scss';

type Props = {
    fullName: string;
    capital: string;
    flagUrl: string;
    countryCode: string;
    center: [number, number];
    onExport(): void;
}

const Popup: FunctionComponent<Props> = ({
    capital,
    flagUrl,
    fullName,
    countryCode,
    center,
    onExport
}) => {

    return <div className="popup" style={{
            top: center[1],
            left: center[0],
        }}>
        <div className="popup__body">
            <div>
                <img className="popup__image" src={baseUrl + flagUrl}/>
            </div>
            <div className="popup__info">
                <div>Country: {fullName}</div>
                <div>Capital: {capital}</div>
            </div>
        </div>
        <div className="popup__footer">
            <div className="popup__iconButton" onClick={onExport}>
                <FontAwesomeIcon icon={faDownload}/>
            </div>
            <Link className="popup__iconButton" to={`/country/${countryCode}`}>
                <FontAwesomeIcon icon={faInfo}/>
            </Link>
        </div>
    </div>;
}

export default memo(Popup);

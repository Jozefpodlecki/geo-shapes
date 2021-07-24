import { FunctionComponent, memo } from 'react';
import { baseUrl } from 'appConstants';
import { faDownload, faInfo } from '@fortawesome/free-solid-svg-icons';
import './popup.scss';
import LinkIcon from 'components/LinkIcon';
import TextIcon from 'components/TextIcon';

type Props = {
    fullName: string;
    capital: string;
    flagUrl: string;
    countryCode: string;
    center: [number, number];
    area: number;
    regions: number;
    neigboursCount: number;
    tags: string[];
    onExport(): void;
}

const Popup: FunctionComponent<Props> = ({
    capital,
    flagUrl,
    fullName,
    countryCode,
    center,
    area,
    regions,
    neigboursCount,
    tags,
    onExport
}) => {

    return <div className="popup" style={{
            top: `${center[1]}px`,
            left: `${center[0]}px`,
        }}>
        <div className="popup__body">
            <div>
                <img className="popup__image" src={baseUrl + flagUrl}/>
            </div>
            <div className="popup__info">
                <div className="popup__field">
                    <div className="popup__fieldLabel">Country:</div>
                    <div className="popup__fieldValue">{fullName}</div>
                </div>
                <div className="popup__field">
                    <div className="popup__fieldLabel">Capital:</div>
                    <div className="popup__fieldValue">{capital}</div>
                </div>
                <div className="popup__field">
                    <div className="popup__fieldLabel">Area:</div>
                    <div className="popup__fieldValue">{area} km2</div>
                </div>
                <div className="popup__field">
                    <div className="popup__fieldLabel">Number of regions:</div>
                    <div className="popup__fieldValue">{regions}</div>
                </div>
                <div className="popup__field">
                    <div className="popup__fieldLabel">Number of neigbours:</div>
                    <div className="popup__fieldValue">{neigboursCount}</div>
                </div>
                <div className="popup__badges">
                    {tags.map(pr => <div className="popup__badge" key={pr}>{pr}</div>)}
                </div>
            </div>
        </div>
        <div className="popup__footer">
            <TextIcon text="Geojson" className="popup__" onClick={onExport} icon={faDownload} />
            <LinkIcon className="popup__iconButton" to={`/country/${countryCode}`} icon={faInfo}/>
        </div>
    </div>;
}

export default memo(Popup);

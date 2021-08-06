import { FunctionComponent, MouseEvent } from 'react';
import { Country } from "models/GeoObject";
import { baseUrl } from 'appConstants';
import './item.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

type Props = Country & {
    onClick(event: MouseEvent<HTMLDivElement>): void;
    toggled: boolean;
};

const Item: FunctionComponent<Props> = ({
    id,
    fullName,
    capital,
    iso3166a2,
    iso3166a3,
    flagUrl,
    neigboursCount,
    area,
    onClick,
    toggled,
}) => {
   
    return <div data-id={id} className={`country-item`} onClick={onClick}>
        <div className="country-item__row">
            <div className="country-item__column">{fullName}</div>
            <div className="country-item__column">{capital}</div>
            <div className="country-item__column">
            <div className="country-item__flag" style={{
                    background: `url(${baseUrl + flagUrl}) center center / cover`
                }}/>
            </div>
            <div className="country-item__column">{iso3166a2}</div>
            <div className="country-item__column">{iso3166a3}</div>
        </div>
        {toggled ? <div className="country-item__details">
            <div className="country-item__field">Neighbours: {neigboursCount}</div>
            <div className="country-item__field">Area: {area} km2</div>
            <div className="country-item__bottom">
                <Link className="country-item__link" to={`/country/${iso3166a2}`}><FontAwesomeIcon icon={faMap}/></Link>
            </div>
        </div> : null}
    </div>;
}


export default Item;

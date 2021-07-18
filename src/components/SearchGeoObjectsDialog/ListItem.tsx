import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { baseUrl } from '../../appConstants';
import { Country } from 'models/GeoObject';
import './listItem.scss';

type Props = Country;

const ListItem: FunctionComponent<Props> = ({
    capital,
    code,
    flagUrl,
    fullName,
    id,
    thumbnailUrl,
    type
}) => {
    return <div key={id} className="geoObject">
        <div className="geoObject__imageWrapper">
            <div className="geoObject__image" style={{
            background: `url(${baseUrl + thumbnailUrl}) center center / cover`
        }}></div>
        </div>
        <Link className="geoObject__link" to={`/country/${code}`}>
            <div>
                <div className="geoObject__name">{fullName}</div>
                <div className="geoObject__type">{type}</div>
            </div>
            <div className="geoObject__flag" style={{
                background: `url(${baseUrl + flagUrl}) center center / cover`
            }}></div>
        </Link>
    </div>
}

export default ListItem;
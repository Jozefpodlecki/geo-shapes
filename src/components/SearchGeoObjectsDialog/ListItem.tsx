import { FunctionComponent, memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { baseUrl } from '../../appConstants';
import { Country } from 'models/GeoObject';
import './listItem.scss';

type Props = Country & {
    onClick(): void;
}

const ListItem: FunctionComponent<Props> = ({
    capital,
    countryCode,
    flagUrl,
    fullName,
    id,
    thumbnailUrl,
    type,
    onClick,
}) => {
    const [imageUrl, setImageUrl] = useState<string | undefined>(baseUrl + thumbnailUrl);

    useEffect(() => {
        if(!imageUrl) {
            return;
        }

        const image = new Image();
        image.onerror = () => setImageUrl(undefined)
        image.src = imageUrl;
        
    }, [imageUrl]);

    return <div key={id} className="geoObject">
        <div className="geoObject__imageWrapper">
            <div className="geoObject__image" style={{
            background: imageUrl ? `url(${imageUrl}) center center / cover` : "gray"
        }}></div>
        </div>
        <Link className="geoObject__link" onClick={onClick} to={`/country/${countryCode}`}>
            <div>
                <div className="geoObject__name">{fullName}</div>
                <div className="geoObject__type">{capital}</div>
            </div>
            <div className="geoObject__flag" style={{
                background: `url(${baseUrl + flagUrl}) center center / cover`
            }}></div>
        </Link>
    </div>
}

export default memo(ListItem);
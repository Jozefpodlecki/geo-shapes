import { FunctionComponent, MouseEvent } from 'react';
import { BritishOverseasTerritory, GeoObjectTypeMap } from "models/GeoObject";
import { baseUrl } from 'appConstants';
import './item.scss';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap } from '@fortawesome/free-solid-svg-icons';

type Props = BritishOverseasTerritory & {
    onClick(event: MouseEvent<HTMLDivElement>): void;
    toggled: boolean;
};

const Item: FunctionComponent<Props> = ({
    id,
    fullName,
    type,
    onClick,
    toggled,
}) => {
   
    return <div data-id={id} className={`item`} onClick={onClick}>
        <div className="item__row">
            <div className="item__column">{fullName}</div>
        </div>
        {toggled ? <div className="item__details">
            <div className="item__bottom">
                <Link className="country-item__link" to={`/bot/${fullName}`}><FontAwesomeIcon icon={faMap}/></Link>
            </div>
        </div> : null}
    </div>;
}


export default Item;

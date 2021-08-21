import { FunctionComponent, MouseEvent } from 'react';
import { TerritoryWithCapital, GeoObjectTypeMap } from "models/GeoObject";
import { baseUrl } from 'appConstants';
import './item.scss';

type Props = TerritoryWithCapital & {
    onClick(event: MouseEvent<HTMLDivElement>): void;
    toggled: boolean;
};

const Item: FunctionComponent<Props> = ({
    id,
    fullName,
    capital,
    flagUrl,
    type,
    onClick,
    toggled,
}) => {
   
    return <div data-id={id} className={`item`} onClick={onClick}>
        <div className="item__row">
            <div className="item__column">{fullName}</div>
            <div className="item__column">{capital}</div>
            <div className="item__column">{GeoObjectTypeMap[type]}</div>
            <div className="item__column">
            <div className="item__flag" style={{
                    background: `url(${baseUrl + flagUrl}) center center / cover`
                }}/>
            </div>
        </div>
        {toggled ? <div className="item__details">
            <div className="item__bottom">
                
            </div>
        </div> : null}
    </div>;
}


export default Item;

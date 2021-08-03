import { FunctionComponent } from 'react';
import { Country, GeoObject } from "models/GeoObject";
import './index.scss';

type Props = Country;

const Item: FunctionComponent<Props> = ({
    fullName,
    iso3166a2
}) => {
   

    return <div className={`country-item`}>
        <div>{fullName}</div>
        <div>{iso3166a2}</div>
    </div>;
}


export default Item;

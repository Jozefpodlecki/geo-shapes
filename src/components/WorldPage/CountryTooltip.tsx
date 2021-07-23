import { FunctionComponent } from 'react';
import ToolTip from 'components/ToolTip';
import { baseUrl } from 'appConstants';
import './countryTooltip.scss';
import { Country } from 'models/GeoObject';

type Props = {
    hasEntered: boolean,
    x: number,
    y: number,
    country?: Country;
}

const CountryTooltip: FunctionComponent<Props> = ({
    hasEntered,
    x,
    y,
    country
}) => {
    
    return <ToolTip
        show={hasEntered}
        x={x}
        y={y}>
        {country ? <div className="geoObject">
            <div>
                <img className="geoObject__image" src={baseUrl + country.flagUrl}/>
            </div>
            <div className="geoObject__info">
                <div>Country: {country.fullName}</div>
                <div>Capital: {country.capital}</div>
            </div>
        </div> : null}
    </ToolTip>;
}

export default CountryTooltip;
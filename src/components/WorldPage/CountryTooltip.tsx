import { FunctionComponent } from 'react';
import ToolTip from 'components/ToolTip';
import { baseUrl } from 'appConstants';
import './countryTooltip.scss';

type Props = {
    hasEntered: boolean,
    x: number,
    y: number,
    flagUrl: string,
    fullName: string,
    capital: string
}

const CountryTooltip: FunctionComponent<Props> = ({
    hasEntered,
    x,
    y,
    flagUrl,
    fullName,
    capital
}) => {
    
    return <ToolTip
        show={hasEntered}
        x={x}
        y={y}>
        {<div className="geoObject">
            <div>
                <img className="geoObject__image" src={baseUrl + flagUrl}/>
            </div>
            <div className="geoObject__info">
                <div>Country: {fullName}</div>
                <div>Capital: {capital}</div>
            </div>
        </div>}
    </ToolTip>;
}

export default CountryTooltip;
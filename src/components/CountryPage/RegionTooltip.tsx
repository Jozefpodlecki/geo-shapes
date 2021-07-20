import React, { FunctionComponent, memo } from 'react';
import ToolTip from 'components/ToolTip';
import { baseUrl } from 'appConstants';
import { Region } from 'models/Region';
import './regionTooltip.scss';

type Props = {
    hasEntered: boolean;
    region?: Region;
    x: number;
    y: number;
}

const RegionTooltip: FunctionComponent<Props> = ({
    hasEntered,
    region,
    x,
    y,
}) => {

    return <ToolTip
        show={hasEntered && !!region}
        x={x}
        y={y}>
        {region ? <div className="region">
            <div>
                <img className="region__image" src={baseUrl + region.flagUrl}/>
            </div>
            <div className="region__info">
                <div>Region: {region.region}</div>
                <div>Capital: {region.capital}</div>
            </div>
            
        </div> : null}
    </ToolTip>;
}

export default memo(RegionTooltip);

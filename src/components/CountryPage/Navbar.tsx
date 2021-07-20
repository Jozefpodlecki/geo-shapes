import React, { FunctionComponent, MouseEvent, memo } from 'react';
import { baseUrl } from 'appConstants';

import './navbar.scss';
import { MapType } from './types';

type Props = {
    flagUrl: string;
    fullName: string;
    mapType: MapType;
    onMapChange(mapType: MapType): void;
}

const backgroundImageUrl = (url: string) => ({
    background: `url(${url}) center center / contain no-repeat`
})

const Navbar: FunctionComponent<Props> = ({
    flagUrl,
    fullName,
    mapType,
    onMapChange
}) => {

    const onMapSelect = (event: MouseEvent<HTMLDivElement>) => {
        const { mapoption } = event.currentTarget.dataset;
        onMapChange(mapoption as MapType);
    }

    return <div className="country-page__navbar">
        <div className="country-page__navbarCountry">
            <div className="country-page__navbarCountryFlag" style={backgroundImageUrl(baseUrl + flagUrl)}></div>
            <div className="country-page__navbarCountryTitle">{fullName}</div>
        </div>
        <div className="country-page__navbarMapSwitch">
            <div
                onClick={onMapSelect}
                data-mapoption="leaflet"
                className={`country-page__navbarMapOption ${mapType === "leaflet" ? "country-page__navbarMapOption--selected" : null}`}>
                    Leaflet</div>
            <div
                onClick={onMapSelect}
                data-mapoption="svg"
                className={`country-page__navbarMapOption ${mapType === "svg" ? "country-page__navbarMapOption--selected" : null}`}>
                    Svg</div>
        </div>
    </div>;
}

export default memo(Navbar);

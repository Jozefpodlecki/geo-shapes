import { FunctionComponent, MouseEvent, memo } from 'react';
import { MapType } from './types';
import Breadcrumbs from 'common/Breadcrumbs';
import './navbar.scss';
import { Link } from 'react-router-dom';

type Props = {
    hasNeigbours: boolean
    iso3166a2: string;
    flagUrl: string;
    fullName: string;
    mapType: MapType;
    onMapChange(mapType: MapType): void;
}

const Navbar: FunctionComponent<Props> = ({
    hasNeigbours,
    iso3166a2,
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
        <Breadcrumbs
            iso3166a2={iso3166a2}
            flagUrl={flagUrl}
            fullName={fullName}
        />
        <div>
            {hasNeigbours ? <Link
                className="country-page__link"
                to={`/country/${iso3166a2}/neighbours`}>Neighbours</Link> : null}
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

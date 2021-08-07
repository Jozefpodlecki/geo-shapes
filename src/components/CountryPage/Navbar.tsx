import { FunctionComponent, MouseEvent, memo } from 'react';
import { MapType } from './types';
import Breadcrumbs from 'components/Breadcrumbs';
import './navbar.scss';

type Props = {
    flagUrl: string;
    fullName: string;
    mapType: MapType;
    onMapChange(mapType: MapType): void;
}

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
        <Breadcrumbs
            flagUrl={flagUrl}
            fullName={fullName}
        />
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

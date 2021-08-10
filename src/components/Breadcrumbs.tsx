import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { baseUrl } from 'appConstants';
import { backgroundImageUrl } from 'appUtils';
import { FunctionComponent, memo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './breadcrumbs.scss';

type Props = {
    flagUrl?: string;
    fullName?: string;
}

const Breadcrumbs: FunctionComponent<Props> = ({
    flagUrl,
    fullName,
}) => {
    const { pathname } = useLocation();
    
    return <div className="breadcrumbs">
        <NavLink
            exact
            activeClassName="breadcrumbs__node--active"
            className="breadcrumbs__node" to="/">
            Home
        </NavLink>
        {pathname === "/inspect-geojson" ? <>
            <div className="breadcrumbs__separator">
                <FontAwesomeIcon icon={faChevronRight}/>
            </div>
            <NavLink
                exact
                activeClassName="breadcrumbs__node--active"
                className="breadcrumbs__node" to="/inspect-geojson">
                Inspect Geojson
            </NavLink>
        </> : null}
        {pathname === "/explore" ? <>
            <div className="breadcrumbs__separator">
                <FontAwesomeIcon icon={faChevronRight}/>
            </div>
            <NavLink
                exact
                activeClassName="breadcrumbs__node--active"
                className="breadcrumbs__node" to="/explore">
                Explore
            </NavLink>
        </> : null}
        {pathname.includes("/country") || pathname.includes("/countries") ? <>
            <div className="breadcrumbs__separator">
                <FontAwesomeIcon icon={faChevronRight}/>
            </div>
            <NavLink
                exact
                activeClassName="breadcrumbs__node--active"
                className="breadcrumbs__node" to="/countries">
                Countries
            </NavLink>
        </> : null}
        {flagUrl && fullName ? <>
            <div className="breadcrumbs__separator">
                <FontAwesomeIcon icon={faChevronRight}/>
            </div>
            <div className="countryNode">
                <div className="countryNode__flag" style={backgroundImageUrl(baseUrl + flagUrl)}></div>
                <div className="countryNode__title">{fullName}</div>
            </div>
        </>: null}
    </div>;
}

export default memo(Breadcrumbs);
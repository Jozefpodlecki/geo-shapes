import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { baseUrl } from 'appConstants';
import { backgroundImageUrl } from 'appUtils';
import { FunctionComponent, memo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import BasicNode from './BasicNode';
import './breadcrumbs.scss';

type Props = {
    iso3166a2?: string;
    flagUrl?: string;
    fullName?: string;
}

const Breadcrumbs: FunctionComponent<Props> = ({
    iso3166a2,
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
        <BasicNode
            match={pathname === "/inspect-geojson"}
            linkPath="/inspect-geojson"
            text="Inspect Geojson" />
        <BasicNode
            match={pathname === "/explore"}
            linkPath="/explore"
            text="Explore" />
        <BasicNode
            match={pathname === "/capitals"}
            linkPath="/capitals"
            text="Capitals" />
        <BasicNode
            match={pathname.includes("/bot") || pathname.includes("/bot")}
            linkPath="/bots"
            text="British Overseas territories" />
        <BasicNode
            match={pathname.includes("/country") || pathname.includes("/countries")}
            linkPath="/countries"
            text="Countries" />
        <BasicNode
            match={pathname.includes("/bot")}
            linkPath={pathname}
            text={fullName || ""} />
        {flagUrl && fullName ? <>
            <div className="breadcrumbs__separator">
                <FontAwesomeIcon icon={faChevronRight}/>
            </div>
            <NavLink
                exact
                activeClassName="breadcrumbs__node--active"
                className="countryNode breadcrumbs__node"
                to={`/country/${iso3166a2}`}>
                <div className="countryNode__flag" style={backgroundImageUrl(baseUrl + flagUrl)}></div>
                <div className="countryNode__title">{fullName}</div>
            </NavLink>
        </>: null}
        <BasicNode
            match={pathname.includes("/neighbours")}
            linkPath={`/country/${iso3166a2}/neighbours`}
            text="Neigbours" />
    </div>;
}

export default memo(Breadcrumbs);
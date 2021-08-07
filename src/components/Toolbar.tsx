import { FunctionComponent, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faGlobe, faHome, faPencilAlt, faSearch } from '@fortawesome/free-solid-svg-icons'
import { Link, NavLink } from 'react-router-dom';
import './toolbar.scss';

type Props = {
    onSearch(): void;
}

const Toolbar: FunctionComponent<Props> = ({
    onSearch
}) => {

    return <div className="toolbar">
        <Link className="toolbar__logo" to={`/`}>
            <div className="toolbar__logoText">Geo-shapes</div>
            <div className="toolbar__logoIcon">
                <FontAwesomeIcon icon={faGlobe}/>
            </div>
        </Link>
        <div className="toolbar__menu">
            <NavLink activeClassName="toolbar__iconButton--selected" className="toolbar__iconButton" exact to={`/`}>
                <FontAwesomeIcon icon={faHome}/>
            </NavLink>
            <NavLink activeClassName="toolbar__iconButton--selected" className="toolbar__iconButton" exact to={`/explore`}>
                <FontAwesomeIcon icon={faEye}/>
            </NavLink>
            <NavLink activeClassName="toolbar__iconButton--selected" className="toolbar__iconButton" exact to={`/draw`}>
                <FontAwesomeIcon icon={faPencilAlt}/>
            </NavLink>
            <div className="toolbar__iconButton" onClick={onSearch}>
                <FontAwesomeIcon icon={faSearch}/>
            </div>
        </div>
    </div>;
}

export default memo(Toolbar);

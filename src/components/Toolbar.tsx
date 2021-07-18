import React, { FunctionComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faEye, faHome, faPencilAlt, faSearch } from '@fortawesome/free-solid-svg-icons'
import './toolbar.scss';
import { NavLink } from 'react-router-dom';

type Props = {
    onSearch(): void;
}

const Toolbar: FunctionComponent<Props> = ({
    onSearch
}) => {

    return <div className="toolbar">
        <div className="toolbar__logo">Geo-shapes</div>
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

export default Toolbar;

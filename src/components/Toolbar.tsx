import React, { FunctionComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faEye, faSearch } from '@fortawesome/free-solid-svg-icons'
import './toolbar.scss';
import { Link } from 'react-router-dom';

type Props = {
    onSearch(): void;
}

const Toolbar: FunctionComponent<Props> = ({
    onSearch
}) => {

    return <div className="toolbar">
        <div className="toolbar__logo">Geo-shapes</div>
        <div className="toolbar__menu">
            <Link className="toolbar__iconButton" to={`/explore`}>
                <FontAwesomeIcon icon={faEye}/>
            </Link>
            <div className="toolbar__iconButton" onClick={onSearch}>
                <FontAwesomeIcon icon={faSearch}/>
            </div>
        </div>
    </div>;
}

export default Toolbar;

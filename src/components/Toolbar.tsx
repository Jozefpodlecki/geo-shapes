import React, { FunctionComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faSearch } from '@fortawesome/free-solid-svg-icons'
import './toolbar.scss';

type Props = {
    onSearch(): void;
}

const Toolbar: FunctionComponent<Props> = ({
    onSearch
}) => {

    return <div className="toolbar">
        <div className="toolbar__logo">Geo-shapes</div>
        {/* <div className="icon-button" onClick={onExport}>
            <FontAwesomeIcon icon={faDownload}/>
            <div className="icon-button__text">Geojson</div>
        </div> */}
        <div className="icon-button" onClick={onSearch}>
            <FontAwesomeIcon icon={faSearch}/>
        </div>
    </div>;
}

export default Toolbar;

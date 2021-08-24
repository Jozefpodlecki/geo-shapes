import React, { FunctionComponent, memo } from 'react';
import { faHardHat } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './underConstruction.scss';

const UnderConstruction: FunctionComponent = ({
}) => {
 
    return <div className="country-page__info">
    <div>
        <FontAwesomeIcon size="10x" icon={faHardHat} />
    </div>
    <div>
        <div className="country-page__infoTitle">
            Page is under construction
        </div>
        <div className="country-page__infoDescription">
            The data required for this page might not be prepared or an error occurred while loading it.
        </div>
    </div>
</div>
}

export default memo(UnderConstruction);
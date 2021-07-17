import React, { ChangeEvent, FunctionComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import GridLoader from 'react-spinners/GridLoader';
import { Link, Route } from 'react-router-dom';
import { useState } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import useDebounce from 'use-debounce/lib/useDebounce';
import { baseUrl } from '../../appConstants';
import './listItem.scss';
import { GeoObject } from 'models/GeoObject';

type Props = GeoObject

const ListItem: FunctionComponent<Props> = ({
    capital,
    code,
    flagUrl,
    fullName,
    id,
    thumbnailUrl,
    type
}) => {
    return <div key={id} className="geoObject">
        <div className="geoObject__imageWrapper">
            <div className="geoObject__image" style={{
            background: `url(${baseUrl + thumbnailUrl}) center center / cover`
        }}></div>
        </div>
        <Link className="geoObject__link" to={`/country/${code}`}>
            <div>
                <div className="geoObject__name">{fullName}</div>
                <div className="geoObject__type">{type}</div>
            </div>
            <div className="geoObject__flag" style={{
                background: `url(${baseUrl + flagUrl}) center center / cover`
            }}></div>
        </Link>
    </div>
}

export default ListItem;
import React, { ChangeEvent, FunctionComponent } from 'react';
import { baseUrl } from '../appConstants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import GridLoader from 'react-spinners/GridLoader';
import { Link, Route } from 'react-router-dom';
import { useState } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { searchGeoObjects } from '../api';
import { GeoObject } from '../models/GeoObject';
import useDebounce from 'use-debounce/lib/useDebounce';

import './searchGeoObjectsDialog.scss';

type Props = {
    isShowing: boolean;
    onHide(): void;
}

type State = {
    isLoading: boolean;
    items: GeoObject[];
}

const SearchGeoObjectsDialog: FunctionComponent<Props> = ({
    isShowing,
    onHide,
}) => {
    const [_value, setValue] = useState("");
    const [{
        isLoading,
        items
    }, setResults] = useState<State>({
        isLoading: true,
        items: [],
    });
    const [value] = useDebounce(_value, 50000);

    const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        setValue(value);
    }, []);

    const onClear = useCallback(() => {
        setValue("");
    }, []);

    useEffect(() => {
        setResults({
            isLoading: true,
            items: [],
        });
    }, [_value]);

    useEffect(() => {
        // if(!value) {
        //     return;
        // }

        (async () => {
            const result = await searchGeoObjects(value);

            setResults({
                isLoading: false,
                items: result,
            });
        })()
        

    }, [value]);

    return <div className={`searchDialog ${isShowing ? "" : "hide"}`}>
        <div className="searchDialog__panel">
            <div onClick={onHide} className="searchDialog__close"><FontAwesomeIcon icon={faTimes}/></div>
        </div>
        <div className="content">
            <div className="searchbox">
                <div className="searchbox__icon"><FontAwesomeIcon icon={faSearch}/></div>
                <input
                    type="text"
                    value={_value}
                    onChange={onChange}
                    className="searchbox__input"
                    placeholder="I am looking for..."
                    />
                {_value ? <div onClick={onClear} className="searchbox__clearIcon"><FontAwesomeIcon icon={faTimes}/></div> : null}
            </div>
            <div className="container">

                {isLoading ? <GridLoader color="white" size={9} /> : items.map(pr => <div key={pr.id} className="geoObject">
                    <div className="geoObject__imageWrapper">
                        <div className="geoObject__image" style={{
                        background: `url(${baseUrl + pr.thumbnailUrl}) center center / cover`
                    }}></div>
                    </div>
                    <Link className="geoObject__link" to={`/country/${pr.code}`}>
                        <div>
                            <div className="geoObject__name">{pr.fullName}</div>
                            <div className="geoObject__type">{pr.type}</div>
                        </div>
                        <div className="geoObject__flag" style={{
                            background: `url(${baseUrl + pr.flagUrl}) center center / cover`
                        }}></div>
                    </Link>
                </div>)}
            </div>
        </div>
    </div>
}

export default SearchGeoObjectsDialog;
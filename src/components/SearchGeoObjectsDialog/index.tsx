import React, { ChangeEvent, FunctionComponent } from 'react';
import { baseUrl } from 'appConstants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import GridLoader from 'react-spinners/GridLoader';
import { Link, Route } from 'react-router-dom';
import { useState } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { searchGeoObjects } from 'api';
import { GeoObject } from 'models/GeoObject';
import useDebounce from 'use-debounce/lib/useDebounce';

import './index.scss';
import ListItem from './ListItem';
import SearchBox from './SearchBox';

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
    const [{
        isLoading,
        items
    }, setResults] = useState<State>({
        isLoading: true,
        items: [],
    });
    const [_value, setValue] = useState("");
    const [value] = useDebounce(_value, 50000);

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
            const result = await searchGeoObjects({
                pageSize: 5,
                phrase: value,
            });

            setResults({
                isLoading: false,
                items: result,
            });
        })()
        

    }, [value]);

    return <div className={`searchDialog ${isShowing ? "" : "hide"}`}>
        <div className="searchDialog__navbar">
            <div onClick={onHide} className="searchDialog__close"><FontAwesomeIcon icon={faTimes}/></div>
        </div>
        <div className="searchDialog__body">
            <SearchBox
                onChange={setValue}
                onClear={onClear}
                value={_value}
            />
            <div className="searchDialog__list">
                {isLoading ? <GridLoader color="white" size={12} /> : items.map(pr => <ListItem key={pr.id} {...pr} />)}
            </div>
        </div>
    </div>
}

export default SearchGeoObjectsDialog;
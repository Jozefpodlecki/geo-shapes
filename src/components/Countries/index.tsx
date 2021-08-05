import React, { MouseEvent, ChangeEvent, FunctionComponent } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import { Region } from 'models/Region';
import { getCountries, getCountry, getCountryGeojson, getCountrySvg, getRegions } from 'api';
import { Link, NavLink, useParams } from 'react-router-dom';
import { Country, GeoObject } from "models/GeoObject";
import { GeoJsonObject } from "geojson";
import GridLoader from 'react-spinners/GridLoader';
import './index.scss';
import Item from './Item';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faSearch } from '@fortawesome/free-solid-svg-icons';

type State = {
    countries: (Country & { toggled?: boolean })[];
    isLoading: boolean;
    hasError: boolean;
}

const Countries: FunctionComponent = () => {
    const [value, setValue] = useState("");
    const [state, setState] = useState<State>({
        countries: [],
        isLoading: true,
        hasError: false,
    });

    useEffect(() => {

        (async () => {
            try {
                const countries = await getCountries({
                    pageSize: 25,
                    phrase: value,
                });

                setState({
                    countries,
                    isLoading: false,
                    hasError: false,
                });
            } catch (error) {
                setState({
                    countries: [],
                    hasError: true,
                    isLoading: false,
                });
            }
        })();
        
    }, [value])

    const onItemClick = (event: MouseEvent<HTMLDivElement>) => {
        const { id } = event.currentTarget.dataset;
        setState(state => ({
            ...state,
            countries: state.countries.map(pr => ({...pr, toggled: pr.id === id ? !pr.toggled : false}))
        }));
    }

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        setValue(value);
    }

    return <div className={`countries-page`}>
        <div className="breadcrumbs">
            <NavLink exact activeClassName="breadcrumbs__node--active" className="breadcrumbs__node" to="/">
                Home
            </NavLink>
            <div className="breadcrumbs__separator">
                <FontAwesomeIcon icon={faChevronRight}/>
            </div>
            <NavLink exact activeClassName="breadcrumbs__node--active" className="breadcrumbs__node" to="/countries">
                Countries
            </NavLink>
        </div>
        <div className="search">
            <div className="search__icon">
                <FontAwesomeIcon icon={faSearch}/>
            </div>
            <input
                className={`search__input`}
                value={value}
                onChange={onChange}
                placeholder="Search..."
                type="text"/>
        </div>
        <div>
            <div className="countries-page__headers">
                <div className="countries-page__header">Full Name</div>
                <div className="countries-page__header">Capital</div>
                <div className="countries-page__header">Flag</div>
                <div className="countries-page__header">ISO 3166-2</div>
                <div className="countries-page__header">ISO 3166-3</div>
            </div>
            {state.countries.map(pr => <Item
                toggled={pr.toggled || false}
                onClick={onItemClick}
                key={pr.id}
                {...pr}/>)}
        </div>
    </div>;
}


export default Countries;

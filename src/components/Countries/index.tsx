import React, { FunctionComponent } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import { Region } from 'models/Region';
import { getCountries, getCountry, getCountryGeojson, getCountrySvg, getRegions } from 'api';
import { useParams } from 'react-router-dom';
import { Country, GeoObject } from "models/GeoObject";
import { GeoJsonObject } from "geojson";
import GridLoader from 'react-spinners/GridLoader';
import './index.scss';
import Item from './Item';

type State = {
    countries: Country[];    
    isLoading: boolean;
    hasError: boolean;
}

const Countries: FunctionComponent = () => {
    const [state, setState] = useState<State>({
        countries: [],
        isLoading: true,
        hasError: false,
    });

    useEffect(() => {

        (async () => {
            try {
                const countries = await getCountries();

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
        
    }, [])


    return <div className={`countries-page`}>
        {state.countries.map(pr => <Item key={pr.id} {...pr}/>)}
    </div>;
}


export default Countries;

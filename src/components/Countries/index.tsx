import { MouseEvent, ChangeEvent, FunctionComponent } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { getCountries } from 'api';
import { Country } from "models/GeoObject";
import Item from './Item';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Breadcrumbs from 'components/Breadcrumbs';
import './index.scss';

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
                    phrase: value.toLowerCase(),
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
        <Breadcrumbs/>
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

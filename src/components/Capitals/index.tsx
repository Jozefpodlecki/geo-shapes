import { MouseEvent, ChangeEvent, FunctionComponent } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { getCapitals, getCountries } from 'api';
import { TerritoryWithCapital } from "models/GeoObject";
import Item from './Item';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Breadcrumbs from 'common/Breadcrumbs';
import './index.scss';

type State = {
    items: (TerritoryWithCapital & { toggled?: boolean })[];
    isLoading: boolean;
    hasError: boolean;
}

const Capitals: FunctionComponent = () => {
    const [value, setValue] = useState("");
    const [state, setState] = useState<State>({
        items: [],
        isLoading: true,
        hasError: false,
    });

    useEffect(() => {

        (async () => {
            try {
                const items = await getCapitals({
                    pageSize: 25,
                    phrase: value.toLowerCase(),
                });

                setState({
                    items,
                    isLoading: false,
                    hasError: false,
                });
            } catch (error) {
                setState({
                    items: [],
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
            items: state.items.map(pr => ({...pr, toggled: pr.id === id ? !pr.toggled : false}))
        }));
    }

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        setValue(value);
    }

    return <div className={`capitals-page`}>
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
            <div className="table__headers">
                <div className="table__header">Territory</div>
                <div className="table__header">Capital</div>
                <div className="table__header">Type</div>
                <div className="table__header">Flag</div>
            </div>
            {state.items.map(pr => <Item
                toggled={pr.toggled || false}
                onClick={onItemClick}
                key={pr.id}
                {...pr}/>)}
        </div>
    </div>;
}


export default Capitals;

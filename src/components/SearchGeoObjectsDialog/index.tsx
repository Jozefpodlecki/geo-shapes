import React, { FunctionComponent } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import GridLoader from 'react-spinners/GridLoader';
import { useState, useCallback, useEffect } from 'react';
import { searchGeoObjects } from 'api';
import { GeoObject } from 'models/GeoObject';
import useDebounce from 'use-debounce/lib/useDebounce';
import ListItem from './ListItem';
import { useSpring, animated } from 'react-spring';
import SearchBox from './SearchBox';
import Icon from 'components/Icon';
import './index.scss';

type Props = {
    isShowing: boolean;
    onHide(): void;
    onClick(): void;
}

type State = {
    isLoading: boolean;
    items: GeoObject[];
}

const SearchGeoObjectsDialog: FunctionComponent<Props> = ({
    isShowing,
    onHide,
    onClick,
}) => {
    const [{
        isLoading,
        items
    }, setResults] = useState<State>({
        isLoading: true,
        items: [],
    });
    const [_value, setValue] = useState("");
    const [value] = useDebounce(_value, 1000);
    const styles = useSpring({
        opacity: isShowing ? 1 : 0,
    })

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

        if(isShowing) {
            (async () => {
                const result = await searchGeoObjects({
                    pageSize: 10,
                    phrase: value,
                });
    
                setResults({
                    isLoading: false,
                    items: result,
                });
            })()
        }
        else {
            setResults({
                isLoading: true,
                items: [],
            });
            setValue("");
        }

    }, [isShowing, value]);

    return <animated.div style={{
            ...styles,
            display: styles.opacity.to(pr => pr === 0 ? "none" : "flex")
        }} className={`searchDialog ${isShowing ? "" : ""}`}>
        <div className="searchDialog__navbar">
            <Icon onClick={onHide} className="searchDialog__close" icon={faTimes}/>
        </div>
        <div className="searchDialog__body">
            <div className="searchDialog__top">
                <SearchBox
                    onChange={setValue}
                    onClear={onClear}
                    value={_value}
                />
            </div>
            <div className={`searchDialog__list ${isLoading ? "searchDialog__list--center": ""}`}>
                {isLoading ? <GridLoader color="white" size={15} /> : 
                    items.map(pr => pr.type === "country" && <ListItem onClick={onClick} key={pr.id} {...pr} />)}
            </div>
        </div>
    </animated.div>
}

export default SearchGeoObjectsDialog;


import React, { ChangeEvent, FunctionComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useCallback } from 'react';
import './searchBox.scss';

type Props = {
    value?: string;
    onChange(value: string): void;
    onClear(): void;
}

const SearchBox: FunctionComponent<Props> = ({
    value,
    onChange,
    onClear
}) => {
    const _onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        onChange(value);
    }, []);

    return <div className="searchbox">
    <div className="searchbox__icon"><FontAwesomeIcon icon={faSearch}/></div>
        <input
            type="text"
            value={value}
            onChange={_onChange}
            className="searchbox__input"
            placeholder="I am looking for..."
            />
        {value ? <div onClick={onClear} className="searchbox__clearIcon"><FontAwesomeIcon icon={faTimes}/></div> : null}
    </div>
}

export default SearchBox;
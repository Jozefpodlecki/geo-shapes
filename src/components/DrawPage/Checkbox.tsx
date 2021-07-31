import { FunctionComponent, memo, ChangeEvent } from 'react';
import './checkbox.scss';

type Props = {
    checked: boolean;
    onChange?(event: ChangeEvent): void;
    label?: string;
}

const Checkbox: FunctionComponent<Props> = ({
    checked,
    onChange,
    label,
    ...rest
}) => {
 
    return <div className="checkbox">
        <label className={`checkbox__label ${checked ? "checkbox__label--selected": ""}`}>
            <input {...rest}
                className="checkbox__input"
                type="checkbox"
                onChange={onChange} checked={checked} />{label}
        </label>
    </div>
}

export default memo(Checkbox);
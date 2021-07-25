import React, { FunctionComponent, MouseEvent, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import './icon.scss';

type Props = {
    className?: string;
    onClick?(event: MouseEvent<HTMLDivElement>): void
    icon: IconProp;
    disabled?: boolean;
}

const Icon: FunctionComponent<Props> = ({
    className,
    onClick,
    icon,
    disabled = false,
    ...rest
}) => {
    return <div
        {...rest}
        onClick={onClick}
        className={`icon ${disabled ? "icon--disabled" : ""} ${onClick ? "icon--interactive" : ""} ${className}`}>
            <FontAwesomeIcon icon={icon}/>
    </div>
}

export default memo(Icon);
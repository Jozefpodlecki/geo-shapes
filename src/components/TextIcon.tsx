import React, { FunctionComponent, MouseEvent, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import './textIcon.scss';

type Props = {
    text: string;
    className: string;
    onClick(event: MouseEvent<HTMLDivElement>): void
    icon: IconProp;
}

const TextIcon: FunctionComponent<Props> = ({
    text,
    className,
    onClick,
    icon,
    ...rest
}) => {
    return <div {...rest} onClick={onClick} className={`text-icon ${className}`}>
        <span className="text-icon__text">{text}</span>
        <FontAwesomeIcon icon={icon}/>
    </div>
}

export default memo(TextIcon);
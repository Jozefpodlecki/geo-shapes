import { FunctionComponent, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Link } from 'react-router-dom';
import './linkIcon.scss';

type Props = {
    className: string;
    to: string;
    icon: IconProp;
}

const LinkIcon: FunctionComponent<Props> = ({
    className,
    to,
    icon,
    ...rest
}) => {
    return <Link {...rest} to={to} className={`link-icon ${className}`}><FontAwesomeIcon icon={icon}/></Link>
}

export default memo(LinkIcon);
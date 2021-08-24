import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FunctionComponent, memo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './breadcrumbs.scss';

type Props = {
    match: boolean;
    linkPath: string;
    text: string;
}

const BasicNode: FunctionComponent<Props> = ({
    match,
    linkPath,
    text
}) => {

    if(!match) {
        return null;
    }

    return <>
        <div className="breadcrumbs__separator">
            <FontAwesomeIcon icon={faChevronRight}/>
        </div>
        <NavLink
            exact
            activeClassName="breadcrumbs__node--active"
            className="breadcrumbs__node" to={linkPath}>
            {text}
        </NavLink>
    </>
}
export default memo(BasicNode);
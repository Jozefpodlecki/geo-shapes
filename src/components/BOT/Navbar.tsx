import { FunctionComponent, MouseEvent, memo } from 'react';
import Breadcrumbs from 'common/Breadcrumbs';
import './navbar.scss';

type Props = {
    iso3166a2?: string;
    flagUrl?: string;
    fullName: string;
}

const Navbar: FunctionComponent<Props> = ({
    iso3166a2,
    flagUrl,
    fullName,
}) => {

    return <div className="country-page__navbar">
        <Breadcrumbs
            iso3166a2={iso3166a2}
            flagUrl={flagUrl}
            fullName={fullName}
        />
    </div>;
}

export default memo(Navbar);

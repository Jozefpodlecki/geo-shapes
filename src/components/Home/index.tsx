import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faList, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { baseUrl } from 'appConstants';
import { FunctionComponent, memo } from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

const menuItems = [
    {
        icon: faList,
        text: "List of countries",
        link: "/countries"
    },
    {
        icon: faList,
        text: "List of capitals",
        link: "/capitals"
    },
    {
        icon: faPen,
        text: "Draw shapes",
        link: "/draw"
    },
    {
        icon: faEye,
        text: "Explore map",
        link: "/explore"
    },
    {
        icon: faEye,
        text: "Inspect Geojson",
        link: "/inspect-geojson"
    }
]

const Home: FunctionComponent = () => {
    const imageUrl = `${baseUrl}/assets/background.jpg`;

    return <div className="home">
        <div className="background" style={{
            background: `url(${imageUrl}) center center / cover`
        }}/>
        <div className="header">Explore</div>
        <div className="list">
            {menuItems.map(pr => <Link key={pr.link} to={pr.link} className="link">
                <div><FontAwesomeIcon size="2x" icon={pr.icon}/></div>
                <div className="link__text">{pr.text}</div>
            </Link>)}
        </div>
    </div>
}

export default memo(Home);
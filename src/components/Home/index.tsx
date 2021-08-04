import { baseUrl } from 'appConstants';
import React, { FunctionComponent, MouseEvent, memo } from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

const Home: FunctionComponent = () => {
    const imageUrl = `${baseUrl}/assets/background.jpg`;

    const menuItems = [
        {
            text: "List of countries",
            link: "/countries"
        },
        {
            text: "List of capitals",
            link: "/capitals"
        },
        {
            text: "Draw shapes",
            link: "/draw"
        },
        {
            text: "Explore map",
            link: "/explore"
        }
    ]

    return <div className="home">
        <div className="background" style={{
            background: `url(${imageUrl}) center center / cover`
        }}/>
        <div className="header">Explore</div>
        <div className="list">
            {menuItems.map(pr => <Link key={pr.link} to={pr.link} className="link">{pr.text}</Link>)}
        </div>
    </div>
}

export default memo(Home);
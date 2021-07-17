import React, { FunctionComponent } from 'react';
import { useEffect } from 'react';
import './countryPage.scss';
import ToolTip from './ToolTip';
import { useState } from 'react';
import { useCallback } from 'react';
import { Region } from '../models/Region';
import { getRegions } from '../api';
import { MapContainer, TileLayer } from 'react-leaflet';
import { baseUrl } from '../appConstants';
import { useParams } from 'react-router-dom';
import { CzFirstLevel } from '../svgs';

const CountryPage: FunctionComponent = () => {
    const [{x,y}, setPosition] = useState({
        x: -1,
        y: -1,
    });
    const [region, setRegion] = useState<Region>()
    const [regions, setRegions] = useState<Region[]>([]);
    const [hasEntered, setEntered] = useState(false)
    const { code } = useParams<{ code: string }>();
    
    useEffect(() => {
        (async () => {
            const regions = await getRegions(code);
            setRegions(regions);
        })();
        
    }, [])

    const onMouseMove = useCallback(async (event: MouseEvent) => {
        setPosition({
            x: event.clientX,
            y: event.clientY
        })

        if(event.target instanceof SVGElement) {
            const id = event.target.id;

            if(id) {
                const item = regions.find(pr => pr.id === id);

                if(item) {
                    setRegion(item);
                }
            }
            else {
                setRegion(undefined);
            }
        }
    }, [regions]);

    useEffect(() => {
        if(region) {
        }
    }, [region]);

    const onMouseEnter = (event: React.MouseEvent<SVGElement>) => {
        setEntered(true);
        window.addEventListener("mousemove", onMouseMove);
    }

    const onMouseLeave = () => {
        setEntered(false);
        window.removeEventListener("mousemove", onMouseMove);
    }

    return <div className="country-page">
        <div className="map">
            <CzFirstLevel className="svg" viewBox="0 440 650 350"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            />
            <ToolTip
                show={hasEntered && !!region}
                x={x}
                y={y}>
                {region ? <div className="region">
                    <div>
                        <img className="region__image" src={baseUrl + region.flagUrl}/>
                    </div>
                    <div className="region__info">
                        <div>Region: {region.region}</div>
                        <div>Capital: {region.capital}</div>
                    </div>
                    
                </div> : null}
            </ToolTip>
            <div>
                <MapContainer zoom={13} center={[51.505, -0.09]} scrollWheelZoom={false} className="test">
                    <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </MapContainer>
            </div>
        </div>
    </div>;
}

export default CountryPage;

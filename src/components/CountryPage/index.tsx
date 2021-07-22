import React, { FunctionComponent } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import { Region } from 'models/Region';
import { getCountry, getCountryGeojson, getCountrySvg, getRegions } from 'api';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { baseUrl } from 'appConstants';
import { useParams } from 'react-router-dom';
import { Country, GeoObject } from "models/GeoObject";
import { GeoJsonObject } from "geojson";
import GridLoader from 'react-spinners/GridLoader';
import SvgMap from './SvgMap';
import Navbar from './Navbar';
import RegionTooltip from './RegionTooltip';
import { MapType } from './types';
import './index.scss';
import UnderConstruction from './UnderConstruction';

type State = {
    regions: Region[];
    country?: Country;    
    isLoading: true;
    hasError: boolean;
} | {
    regions: Region[];
    country: Country;
    isLoading: false;
    hasError: boolean;
} | {
    regions?: Region[];
    country?: Country;
    isLoading: false;
    hasError: true;
}



const CountryPage: FunctionComponent = () => {
    const [{x,y}, setPosition] = useState({
        x: -1,
        y: -1,
    });
    const [state, setState] = useState<State>({
        regions: [],
        isLoading: true,
        hasError: false,
    });
    const [region, setRegion] = useState<Region>();
    const [hasEntered, setEntered] = useState(false);
    const [mapType, setMapType] = useState<MapType>("svg");
    const [geojson, setGeojson] = useState<GeoJsonObject>();
    const [svg, setSvg] = useState<string>("");
    const { countryCode } = useParams<{ countryCode: string }>();

    useEffect(() => {

        if(!countryCode || !state.isLoading) {
            return;
        }

        (async () => {
            try {
                const country = await getCountry(countryCode);
                const regions = await getRegions(countryCode);

                if(!country || !regions.length) {
                    setState({
                        hasError: true,
                        isLoading: false,
                    });
                    return;
                }

                setState({
                    country,
                    regions,
                    isLoading: false,
                    hasError: false,
                });
            } catch (error) {
                console.log(error)
                setState({
                    hasError: true,
                    isLoading: false,
                });
            }
        })();
        
    }, [state, countryCode])

    const onMouseMove = useCallback((event: MouseEvent) => {
        if(state.isLoading || state.hasError) {
            return;
        }
        
        setPosition({
            x: event.clientX,
            y: event.clientY
        })
        
        if(event.target instanceof SVGElement) {
            const id = event.target.id;

            if(id) {
                const item = state.regions.find(pr => pr.id === id);

                if(item) {
                    setRegion(item);
                }
            }
            else {
                setRegion(undefined);
            }
        }
    }, [state]);

    const onMouseEnter = () => {
        setEntered(true);
    }

    const onMouseLeave = () => {
        setEntered(false);
    }

    useEffect(() => {

        (async () => {

            try {
                if(mapType === "svg") {
                    const svg = await getCountrySvg(countryCode);
                    setSvg(svg);
                }
                else {
                    const geojson = await getCountryGeojson(countryCode);
                    setGeojson(geojson);
                }
            } catch (error) {
                
            }

         
        })();
       
    }, [mapType]);

    return <div className={`country-page ${state.isLoading || state.hasError ? "center": null}`}>
        {state.isLoading ? <GridLoader color="white" size={15} /> :
        state.hasError ? <UnderConstruction/>
        : <>
            <Navbar
                flagUrl={state.country.flagUrl}
                fullName={state.country.fullName}
                mapType={mapType}
                onMapChange={setMapType}
            />
            <RegionTooltip
                hasEntered={hasEntered}
                x={x}
                y={y}
                region={region}
            />
            <div className="country-page__map">
                {mapType === "svg" ? <SvgMap
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    onMouseMove={onMouseMove}
                    svg={svg}
                /> :
                <MapContainer zoom={4} center={state.country.center} scrollWheelZoom={false} className="country-page__leafletMap">
                    <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {geojson ? <GeoJSON data={geojson}/> : null}
                </MapContainer>}
            </div>
        </>}
    </div>;
}

export default CountryPage;

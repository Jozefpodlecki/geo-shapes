import { useCallback, FunctionComponent, useState, useEffect, MouseEvent } from 'react';
import { Region } from 'models/Region';
import { getBot, getCountry, getCountryGeojson, getNeighbours, getRegions } from 'api';
import { Marker, Popup } from 'react-leaflet';
import { useLocation, useParams } from 'react-router-dom';
import { BritishOverseasTerritory, Country } from "models/GeoObject";
import GridLoader from 'react-spinners/GridLoader';
import Navbar from './Navbar';
import UnderConstruction from './UnderConstruction';
import { geoJSON, latLng, LatLngBoundsExpression, LatLngLiteral, point } from 'leaflet';
import { GeoJsonObjectWithId } from 'models/GeoJsonObjectWithId';
import BaseMapContainer from 'common/BaseMapContainer';
import { Point } from 'geojson';
import './index.scss';
import PositionOnClick from 'components/PositionOnClick';

type State = {
    name?: string;
    bot?: BritishOverseasTerritory;
    pageState: "loaded" | "loading" | "error";
};

const CountryPage: FunctionComponent = () => {
    const [state, setState] = useState<State>({
        pageState: "loading",
    });
    const [geojsonObjects, setGeojsonObjects] = useState<GeoJsonObjectWithId[]>([]);
    const { name } = useParams<{ name: string }>();
    const location = useLocation();

    const [center, setCenter] = useState<LatLngLiteral>({
        lat: 51.505,
        lng: -0.09,
    });
    const [zoom, setZoom] = useState(5);
    const [bounds, setBounds] = useState<LatLngBoundsExpression>();
    
    useEffect(() => {
        setState(state => ({
            ...state,
            name,
            pageState: "loading",
        }));
    }, [location, name]);

    useEffect(() => {

        if(state.name == name && state.pageState === "loaded") {
            return;
        }

        (async () => {
            try {
                const bot = await getBot(name);
                let geojson;

                if(bot?.position) {
                    geojson = {
                        type: "Point" as const,
                        coordinates: bot.position,
                    } as Point;
                }

                if(bot?.iso3166a2) {
                    geojson = await getCountryGeojson(bot.iso3166a2);
                }

                if(!bot || !geojson) {
                    setState(state => ({
                        ...state,
                        pageState: "error",
                    }));
                    return;
                }
                
                const bounds = geoJSON(geojson).getBounds();
                
                setBounds(bounds);
                setGeojsonObjects(geojson ? [{
                    id: Date.now().toString(),
                    data: geojson,
                }] : []);
                setState(state => ({
                    ...state,
                    bot,
                    pageState: "loaded",
                }));

            } catch (error) {
            
                setState(state => ({
                    ...state,
                    pageState: "error",
                }));
            }
        })();
        
    }, [location, state])

    let content;

    switch(state.pageState) {
        case "loading":
            content = <GridLoader color="white" size={15} />;
        break;
        case "error":
            content = <UnderConstruction/>;
        break;
        case "loaded":
            content =  <>
                <Navbar
                    fullName={state.bot?.fullName || "test"}
                />
                <div className="bot-page__map">
                    <BaseMapContainer
                        zoom={zoom}
                        center={center}
                        bounds={bounds}
                        geoJsons={geojsonObjects}
                        className="bot-page__leafletMap">
                        <PositionOnClick/>
                    </BaseMapContainer>
                </div>
            </>
        break;
    }

    return <div className={`bot-page ${state.pageState !== "loaded" ? "center": null}`}>
        {content}
    </div>;
}

export default CountryPage;

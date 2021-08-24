import { useCallback, FunctionComponent, useState, useEffect, MouseEvent } from 'react';
import { Region } from 'models/Region';
import { getCountry, getCountryGeojson, getCountrySvg, getNeighbours, getRegions } from 'api';
import { MapContainer, TileLayer, GeoJSON, useMapEvents, Marker, Popup } from 'react-leaflet';
import { useLocation, useParams } from 'react-router-dom';
import { Country } from "models/GeoObject";
import { GeoJsonObject } from "geojson";
import GridLoader from 'react-spinners/GridLoader';
import SvgMap from './SvgMap';
import Navbar from './Navbar';
import RegionTooltip from './RegionTooltip';
import { MapType } from './types';
import UnderConstruction from './UnderConstruction';
import { latLng, point, geoJSON, LatLng, LatLngBoundsExpression, LatLngLiteral } from 'leaflet';
import './index.scss';
import { GeoJsonObjectWithId } from 'models/GeoJsonObjectWithId';
import BaseMapContainer from 'common/BaseMapContainer';
import PositionOnClick from 'components/PositionOnClick';

type State = {
    iso3166a2?: string;
    regions: Region[];
} & ({
    country?: Country;
    pageState: "loading" | "error";
} | {
    country: Country;
    pageState: "loaded";
})

const CountryPage: FunctionComponent = () => {
    const [{x,y}, setPosition] = useState({
        x: -1,
        y: -1,
    });
    const [state, setState] = useState<State>({
        regions: [],
        pageState: "loading",
    });
    const [level, setLevel] = useState<number>(0);
    const [region, setRegion] = useState<Region>();
    const [hasEntered, setEntered] = useState(false);
    const [mapType, setMapType] = useState<MapType>("leaflet");
    const [geojsonObjects, setGeojsonObjects] = useState<GeoJsonObjectWithId[]>([]);

    const [svg, setSvg] = useState<string>("");
    const { iso3166a2 } = useParams<{ iso3166a2: string }>();
    const location = useLocation();

    const [center, setCenter] = useState<LatLngLiteral>({
        lat: 51.505,
        lng: -0.09,
    });
    const [zoom, setZoom] = useState(5);
    const [bounds, setBounds] = useState<LatLngBoundsExpression>();
    
    const [hasNeighbours, setHasNeighbours] = useState(false);
    const neighboursPath = location.pathname.includes("neighbours");

    useEffect(() => {
        setState(state => ({
            ...state,
            iso3166a2,
            pageState: "loading",
        }));
    }, [location, iso3166a2]);

    useEffect(() => {

        if(state.iso3166a2 == iso3166a2 && state.pageState === "loaded") {
            return;
        }

        if(neighboursPath) {
            (async () => {
                const country = await getCountry(iso3166a2);
                const neighbours = await getNeighbours(iso3166a2);
                const geojsons = []

                if(!country) {
                    setState(state => ({
                        ...state,
                        pageState: "error",
                    }));
                    return;
                }

                const landNeighbours = neighbours?.landNeighbours || [];

                for(const neighbour of landNeighbours) {

                    if(!neighbour.iso3166a2) {
                        continue;
                    }

                    const geojson = await getCountryGeojson(neighbour.iso3166a2);

                    if(!geojson) {
                        continue;
                    }

                    geojsons.push(geojson!);
                }

                const concatenatedGeojson = {
                    type: "FeatureCollection" as const,
                    features: geojsons,
                };

                const bounds = geoJSON(concatenatedGeojson).getBounds();
                
                setBounds(bounds);
                setGeojsonObjects(geojsons.map((data, index) => ({
                    id: index.toString(),
                    data,
                })));

                setState(state => ({
                    ...state,
                    iso3166a2,
                    country,
                    regions: [],
                    pageState: "loaded",
                }));
            })();
            return;
        }

        (async () => {
            try {
                const country = await getCountry(iso3166a2);
                const regions = await getRegions(iso3166a2);
                const neighbours = await getNeighbours(iso3166a2);
                const geojson = await getCountryGeojson(iso3166a2);

                if(!country || !geojson) {
                    setState(state => ({
                        ...state,
                        pageState: "error",
                    }));
                    return;
                }

                const [lat, lng] = country.countryCenter;
                
                setGeojsonObjects([{
                    id: Date.now().toString(),
                    data: geojson,
                }]);
                setBounds(undefined);
                setCenter({lat, lng});
                setZoom(country.zoom);

                setHasNeighbours(!!neighbours?.landNeighboursCount);
                setState({
                    iso3166a2,
                    country,
                    regions,
                    pageState: "loaded",
                });
            } catch (error) {

                setState(state => ({
                    ...state,
                    pageState: "error",
                }));
            }
        })();
        
    }, [location, state])

    const onMouseMove = useCallback((event: globalThis.MouseEvent) => {
        if(state.pageState !== "loaded") {
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

    // useEffect(() => {

    //     (async () => {

    //         try {
    //             if(mapType === "svg") {
    //                 const svg = await getCountrySvg(iso3166a2);
    //                 setSvg(svg);
    //             }
    //             else {
    //                 const geojson = await getCountryGeojson(iso3166a2);
    //                 setGeojson(geojson);
    //             }
    //         } catch (error) {
                
    //         }

         
    //     })();
       
    // }, [iso3166a2, mapType]);

    const onADLChange = (event: MouseEvent<HTMLDivElement>) => {
        const { level } = event.currentTarget.dataset;
        setLevel(Number(level));
    };

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
                    hasNeigbours={!neighboursPath && hasNeighbours}
                    iso3166a2={iso3166a2}
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
                    <BaseMapContainer
                        zoom={zoom}
                        center={center}
                        bounds={bounds}
                        geoJsons={geojsonObjects}
                        className="country-page__leafletMap">
                        {state.country.capitalCenter ? <Marker position={state.country.capitalCenter}>
                            <Popup>
                                {state.country.capital}
                            </Popup>
                        </Marker> : null}
                        <PositionOnClick/>
                    </BaseMapContainer>}
                </div>
                <div className="country-page__footer">
                    <div className="country-page__administrativeDivisions">
                        <div className={`country-page__administrativeDivision ${level === 0 ? "selected" : ""}`} data-level={0} onClick={onADLChange}>Country</div>
                        <div className={`country-page__administrativeDivision ${level === 1 ? "selected" : ""}`} data-level={1} onClick={onADLChange}>Departments</div>
                    </div>
                </div>
            </>
        break;
    }

    return <div className={`country-page ${state.pageState !== "loaded" ? "center": null}`}>
        {content}
    </div>;
}

export default CountryPage;

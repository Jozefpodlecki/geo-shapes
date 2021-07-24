import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { Country, GeoObject } from 'models/GeoObject';
import { getCountryGeojson, getCountryGeojsonLink, getWorldSvg, searchGeoObjects } from 'api';
import Popup from './Popup';
import CountryTooltip from './CountryTooltip';
import SvgMap from './SvgMap';
import './index.scss';
import { GridLoader } from 'react-spinners';
import { NotificationManager } from 'react-notifications';
import { download } from 'appUtils';

const WorldPage: FunctionComponent = () => {
    
    const [{x,y}, setPosition] = useState({
        x: -1,
        y: -1,
    });
    const [selected, setSelected] = useState<{
        element: SVGElement;
        item?: GeoObject;
        center: [number, number];
    }>();
    const [svg, setSvg] = useState<string>("");
    const [hasEntered, setEntered] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [geoObject, setGeoObject] = useState<Country>()
    const [geoObjects, setGeoObjects] = useState<Country[]>([])

    const onClick = useCallback((event: MouseEvent) => {
        const target = event.target;

        if(!(target instanceof SVGElement)) {
            return;
        }

        if(selected) {
            selected.element.classList.toggle("selected");
        }

        const id = target.id.toLowerCase();
        let item;

        if(!id) {               
            return;
        }
        
        item = geoObjects.find(pr => pr.id === id)!;

        target.classList.toggle("selected");
        const { x, y, width, height } = target.getBoundingClientRect();
        console.log(event.clientX)

        setSelected({
            element: target,
            item,
            center: [event.clientX - 100, event.clientY - 100],
        });
    }, [geoObjects, selected]);

    const onMouseMove = useCallback((event: MouseEvent) => {
        setPosition({
            x: event.clientX,
            y: event.clientY
        })

        const target = event.target;

        if(!(target instanceof SVGElement)) {
            setGeoObject(undefined);
            return;
        }

        const id = target.id.toLowerCase();

        if(!id) {
            setGeoObject(undefined);
            return;
        }           
            
        const item = geoObjects.find(pr => pr.id === id);
      
        if(!item) {
            setGeoObject(undefined);
            return;
        }
        
        setGeoObject(item);

    }, [geoObjects]);

    const onMouseEnter = useCallback(() => {
        setEntered(true);
    }, []);

    const onMouseLeave = useCallback(() => {
        setEntered(false);
    }, []);

    useEffect(() => {
        (async () => {
            const svg = await getWorldSvg();
            setSvg(svg);
            setLoading(false);
        })();
    }, []);

    const onExport = () => {
        (async () => {

            try {
                const item = selected!.item as Country;
                const geojsonLink = await getCountryGeojsonLink(item.countryCode);
                download(geojsonLink, `${item.countryCode}.json`);
            } catch (error) {
                NotificationManager.error("We could not find geojson for country", "Download error.");
            }
            
        })();
    }

    useEffect(() => {
        (async () => {
            const geoObjects = await searchGeoObjects({
                phrase: "",
                pageSize: 200,
            });
            setGeoObjects(geoObjects as Country[]);
        })();
        
    }, [])

    return <div className={`world-page ${isLoading ? "center" : ""}`}>
        {isLoading ? <div className="world-page__loader"><GridLoader color="white" size={15} /></div> : <SvgMap
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onMouseMove={onMouseMove}
            onClick={onClick}
            svg={svg}
        />}
        <CountryTooltip
            hasEntered={geoObject && hasEntered && selected?.item?.id !== geoObject.id || false}
            country={geoObject}
            x={x}
            y={y}/>
        {selected?.item?.type === "country" ? <Popup
                onExport={onExport}
                {...selected.item}
                center={selected.center}/>
                : null}
    </div>;
}

export default WorldPage;
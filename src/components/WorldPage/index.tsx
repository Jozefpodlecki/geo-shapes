import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import ToolTip from 'components/ToolTip';
import { baseUrl } from 'appConstants';
import { GeoObject } from 'models/GeoObject';
import { searchGeoObjects } from 'api';
import Popup from './Popup';
import './index.scss';
import CountryTooltip from './CountryTooltip';

const WorldPage: FunctionComponent = () => {
    
    const [{x,y}, setPosition] = useState({
        x: -1,
        y: -1,
    });
    const [selected, setSelected] = useState<{
        element: SVGPathElement;
        item: GeoObject;
        center: [number, number];
    }>();

    const [hasEntered, setEntered] = useState(false);
    const [geoObject, setGeoObject] = useState<GeoObject>()
    const [geoObjects, setGeoObjects] = useState<GeoObject[]>([])

    const onClick = useCallback(async (event: React.MouseEvent<SVGElement>) => {
        const target = event.target;

        if(!(target instanceof SVGPathElement)) {
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


        setSelected({
            element: target,
            item,
            center: [x + width / 2, y + height / 2],
        });
    }, [selected]);

    const onMouseMove = useCallback((event: MouseEvent) => {
        setPosition({
            x: event.clientX,
            y: event.clientY
        })
        const target = event.target;

        if(!(target instanceof SVGPathElement)) {
            setGeoObject(undefined);
            return;
        }

        const id = target.id.toLowerCase();

        if(id) {               
            const item = geoObjects.find(pr => pr.id === id);

            if(item) {
                setGeoObject(item);
            }
            else {
                setGeoObject(undefined);
            }
        }

    }, [geoObjects]);

    const onMouseEnter = useCallback((event: React.MouseEvent<SVGElement>) => {
        setEntered(true);
    }, []);

    const onMouseLeave = useCallback(() => {
        setEntered(false);
    }, []);

    useEffect(() => {
        window.addEventListener("mousemove", onMouseMove);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
        }
    }, [geoObjects])

    const onExport = () => {

    }

    useEffect(() => {
        (async () => {
            const geoObjects = await searchGeoObjects({
                phrase: "",
                pageSize: 200,
            });
            setGeoObjects(geoObjects);
        })();
        
    }, [])
    
    return <div className="world-page">
        {/* <World className="svg"
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        /> */}
        {geoObject && geoObject.type === "country" && selected?.item?.id !== geoObject.id ? 
            <CountryTooltip
                hasEntered={hasEntered}
                capital={geoObject.capital}
                x={x}
                y={y}
                flagUrl={geoObject.flagUrl}
                fullName={geoObject.fullName}/> : null}
        {selected && selected.item.type === "country" ? <Popup onExport={onExport} {...selected.item}/> : null}
    </div>;
}

export default WorldPage;

{/* <div className="popup" style={{
            top: selected.center[1],
            left: selected.center[0],
        }}>
            <div className="popup__body">
                <div>
                    <img className="popup__image" src={baseUrl + selected.item.flagUrl}/>
                </div>
                <div className="popup__info">
                    <div>Country: {selected.item.fullName}</div>
                    <div>Capital: {selected.item.capital}</div>
                </div>
            </div>
            <div className="popup__footer">
                <div className="popup__iconButton" onClick={onExport}>
                    <FontAwesomeIcon icon={faDownload}/>
                </div>
                <Link className="popup__iconButton" to={`/country/${selected.item.code}`}>
                    <FontAwesomeIcon icon={faInfo}/>
                </Link>
            </div>
        </div> : null} */}
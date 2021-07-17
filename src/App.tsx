import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import CountryPage from './components/CountryPage';
import Toolbar from './components/Toolbar';
import { Route } from 'react-router-dom';
import SearchGeoObjectsDialog from './components/SearchGeoObjectsDialog';
import { World } from './svgs';
import './app.scss';
import ToolTip from './components/ToolTip';
import { baseUrl } from './appConstants';
import { GeoObject } from './models/GeoObject';
import { searchGeoObjects } from './api';

const App: FunctionComponent = () => {
    const [isShowing, setShow] = useState(false);
    const [{x,y}, setPosition] = useState({
        x: -1,
        y: -1,
    });
    const onSearch = () => setShow(true);
    const onHide = () => setShow(false);
    const [hasEntered, setEntered] = useState(false);
    const [geoObject, setGeoObject] = useState<GeoObject>()
    const [geoObjects, setGeoObjects] = useState<GeoObject[]>([])
    
    useEffect(() => {
        (async () => {
            const geoObjects = await searchGeoObjects({
                phrase: "",
                pageSize: 200,
            });
            setGeoObjects(geoObjects);
        })();
        
    }, [])

    const onMouseMove = useCallback(async (event: MouseEvent) => {
        setPosition({
            x: event.clientX,
            y: event.clientY
        })

        if(event.target instanceof SVGElement) {
            const id = event.target.id.toLowerCase();

            if(id) {               
                const item = geoObjects.find(pr => pr.id === id);

                if(item) {
                    setGeoObject(item);
                }
                else {
                    setGeoObject(undefined);
                }
            }
            else {
                setGeoObject(undefined);
            }
        }
    }, [geoObjects]);

    const onMouseEnter = (event: React.MouseEvent<SVGElement>) => {
        setEntered(true);
        window.addEventListener("mousemove", onMouseMove);
    }

    const onMouseLeave = () => {
        setEntered(false);
        window.removeEventListener("mousemove", onMouseMove);
    }

    return <div className="app">
        <Toolbar onSearch={onSearch} />
        <div className="world">
            <World className="worldsvg"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            />
            {geoObject ? <ToolTip
                show={hasEntered}
                x={x}
                y={y}>
                {<div className="geoObject">
                    <div>
                        <img className="geoObject__image" src={baseUrl + geoObject.flagUrl}/>
                    </div>
                    <div className="geoObject__info">
                        <div>Country: {geoObject.fullName}</div>
                        <div>Capital: {geoObject.capital}</div>
                    </div>
                </div>}
            </ToolTip> : null}
        </div>
        <SearchGeoObjectsDialog
            onHide={onHide}
            isShowing={isShowing}/>
        <Route path="/explore">
            
        </Route>
        <Route path="/draw">
            <CountryPage/>
        </Route>
        <Route path="/country/:code">
            <CountryPage/>
        </Route>
    </div>;
}

export default App;

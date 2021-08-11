import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faList, faPen, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { baseUrl } from 'appConstants';
import Breadcrumbs from 'components/Breadcrumbs';
import Icon from 'components/Icon';
import { FunctionComponent, memo, useState, MouseEvent } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { GeoJSON } from 'react-leaflet';
import { GeoJsonObject, MultiPolygon } from 'geojson';
import './style.scss';
import { useEffect } from 'react';
import { extractGeoObjectFromText, getTextFromBlob, openFileDialog } from 'appUtils';

const test1 = {
    "type": "MultiPoint", 
    "coordinates": [
        [10.0, 40.0], [40.0, 30.0], [20.0, 20.0], [30.0, 10.0]
    ]
} as const

const test2 = {
    "type": "MultiPolygon", 
    "coordinates": [
        [
            [[40.0, 40.0], [20.0, 45.0], [45.0, 30.0], [40.0, 40.0]]
        ], 
        [
            [[20.0, 35.0], [10.0, 30.0], [10.0, 10.0], [30.0, 5.0], [45.0, 20.0], [20.0, 35.0]],
            [[30.0, 20.0], [20.0, 15.0], [20.0, 25.0], [30.0, 20.0]]
        ]
    ]
} as const;

const breakDownGeojson = (data: GeoJsonObject) => {
    let result = new Array<GeoJsonObject>();
    let header = "None";

    if(data.type === "MultiPolygon") {
        header = "MultiPolygon";
        const multiPolygon = data as MultiPolygon;
        for(const coordinates of multiPolygon.coordinates) {

            const polygon = {
                type: "Polygon" as const,
                coordinates
            }

            result.push(polygon);
        }

        return [header, result] as [string, GeoJsonObject[]];
    }

    return [header, result] as [string, GeoJsonObject[]];
}

type GeoObjectWithId = {
    id: string;
    name: string;
    selected: boolean;
    data: GeoJsonObject;
}

const InspectGeojson: FunctionComponent = () => {
    const [center, setCenter] = useState<[number, number]>([51.505, -0.09]);
    const [{
        header,
        data
    }, setData] = useState<{
        header: string;
        data: GeoObjectWithId[];
    }>({
        header: "",
        data: [],
    });

    useEffect(() => {
        const [header, result] = breakDownGeojson(test2);

        const data = result.map((data, index) => ({
            id: index.toString(),
            name: `polygon_${index + 1}`,
            selected: false,
            data,
        }))

        setData({header, data});
    }, []);

    const onUpload = async () => {
        const file = await openFileDialog();

        if(!file) {
            return false;
        }

        const text = await getTextFromBlob(file);
        const geojsonObject = extractGeoObjectFromText(text);

        if(!geojsonObject) {
            return false;
        }

        const [header, result] = breakDownGeojson(geojsonObject);

        const data = result.map((data, index) => ({
            id: index.toString(),
            name: `polygon_${index + 1}`,
            selected: false,
            data,
        }))

        setData({header, data});
    }

    const onAllSelect = () => {
        setData(({header, data}) => {
            const newState = data.map(pr => ({...pr, selected: true}));

            return {
                header,
                data: newState,
            };
        })
    }

    const onSelect = (event: MouseEvent<HTMLDivElement>) => {
        const { id } = event.currentTarget.dataset;
        setData(({header, data}) => {
            const newState = data.map(pr => ({...pr}));

            for(const it of newState.filter(pr => pr.selected)) {
                it.selected = false;
            }

            const item = newState.find(pr => pr.id === id)!;
            item.selected = !item.selected;

            return {
                header,
                data: newState,
            };
        })
    }

    return <div className="inspect-geojson">
        <div className="inspect-geojson__topBar">
            <Breadcrumbs/>
        </div>
        <div className="inspect-geojson__container">
            <div className="inspect-geojson__panel">
                <div className="inspect-geojson__panelTopBar">
                    <Icon className="navbar__upload" onClick={onUpload} icon={faUpload}/>
                </div>
                <div className="inspect-geojson__content">
                    <div onClick={onAllSelect} className="inspect-geojson__header">{header}</div>
                    {data.map(pr => <div
                        data-id={pr.id}
                        onClick={onSelect}
                        className={`inspect-geojson__item ${pr.selected ? "inspect-geojson__item--selected": ""}`}
                        key={pr.id}>{pr.name}</div>)}
                </div>
            </div>
            <div className="inspect-geojson__view">
                <MapContainer
                    zoom={4}
                    center={center}
                    scrollWheelZoom={true}
                    className="explore-page__map">
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {data.map(pr => <GeoJSON
                        key={pr.id}
                        style={{
                            color: pr.selected ? "blue" : "gray",
                        }}
                        data={pr.data} />)}
                </MapContainer>
            </div>
        </div>
    </div>
}

export default memo(InspectGeojson);
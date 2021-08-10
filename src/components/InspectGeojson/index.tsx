import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faList, faPen, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { baseUrl } from 'appConstants';
import Breadcrumbs from 'components/Breadcrumbs';
import Icon from 'components/Icon';
import { FunctionComponent, memo, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { GeoJSON } from 'react-leaflet';
import { GeoJsonObject, MultiPolygon } from 'geojson';
import './style.scss';
import { useEffect } from 'react';

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

    if(data.type === "MultiPolygon") {
        const multiPolygon = data as MultiPolygon;
        for(const coordinates of multiPolygon.coordinates) {

            const polygon = {
                type: "Polygon" as const,
                coordinates
            }

            result.push(polygon);
        }

        return result;
    }

    return result;
}

type GeoObjectWithId = {
    id: string;
    name: string;
    data: GeoJsonObject;
}

const InspectGeojson: FunctionComponent = () => {
    const [center, setCenter] = useState<[number, number]>([51.505, -0.09]);
    const [data, setData] = useState<GeoObjectWithId[]>([]);

    useEffect(() => {
        const result = breakDownGeojson(test2);

        const data = result.map((data, index) => ({
            id: index.toString(),
            name: `polygon_${index + 1}`,
            data,
        }))

        setData(data);
    }, []);

    const onUpload = () => {

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
                    {data.map(pr => <div key={pr.id}></div>)}
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
                        data={pr.data} />)}
                </MapContainer>
            </div>
        </div>
    </div>
}

export default memo(InspectGeojson);
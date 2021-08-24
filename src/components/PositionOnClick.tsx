import React from 'react';
import { useMapEvents } from 'react-leaflet';

const PositionOnClick = () => {
    const map = useMapEvents({
        click(event) {
            const { lat, lng } = map.getCenter();
            
            console.log([lat, lng], map.getZoom());
        }
    })

    return null;
}

export default PositionOnClick;
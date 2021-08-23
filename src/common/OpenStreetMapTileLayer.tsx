import React, { memo, FunctionComponent } from "react";
import { TileLayer } from "react-leaflet";

const attribution = "&copy; <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors";

const OpenStreetMapTileLayer: FunctionComponent = () => 
    <TileLayer
        attribution={attribution}
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

export default memo(OpenStreetMapTileLayer);
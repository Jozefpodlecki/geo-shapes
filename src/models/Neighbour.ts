export type Neighbour = {
    iso3166a2: string;
    iso3166a3: string;
    landNeighboursCount: number;
    maritimeNeigboursCount: number;
    landNeighbours: {
        name: string;
        iso3166a2?: string;
        iso3166a3?: string;
    }[];
    maritimeNeigbours: {
        name: string;
        iso3166a2?: string;
        iso3166a3?: string;
    }[];
}
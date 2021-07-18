declare module "react-notifications" {
    var NotificationManager: {
        info(message: string, title: string, timeOut?: number, callback?: () => {}, priority?: boolean): void;
        success(message: string, title: string, timeOut?: number, callback?: () => {}, priority?: boolean): void;
        warning(message: string, title: string, timeOut?: number, callback?: () => {}, priority?: boolean): void;
        error(message: string, title: string, timeOut?: number, callback?: () => {}, priority?: boolean): void;
    }
    var NotificationContainer: (props: {enterTimeout?: number, leaveTimeout?: number}) => JSX.Element;
}

declare module "wkt" {
    type Geojson = {
        type: "Point" | "LineString" | "Polygon";
        coordinates: number[] | number[][] | number[][][];
    }

    function parse(wkt: string): Geojson;
    function stringify(geojson: Geojson): string;

    export {
        parse,
        stringify
    }
}
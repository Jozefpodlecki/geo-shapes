import { FunctionComponent, useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import { GeoJsonObject } from 'geojson';
import stringify from "json-stringify-pretty-compact"
import Highlight from 'react-highlight';
import Icon from 'components/Icon';
import { ExportType } from './types';
import { faClipboard, faDownload, faTimes } from '@fortawesome/free-solid-svg-icons';
import './previewDialog.scss';

type Props = {
    id?: string;
    isShowing: boolean;
    onHide(): void;
    onExport(id: string): void;
    data?: any;
    exportType: ExportType;
}

const PreviewDialog: FunctionComponent<Props> = ({
    id,
    isShowing,
    onHide,
    onExport,
    data,
    exportType,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const styles = useSpring({
        opacity: isShowing ? 1 : 0,
    })
    const text = exportType === "geojson" ? stringify(data) : data ? data.replace(/,/g, ",\n") : data;

    const _onExport = () => onExport(id!);

    const onCopy = () => {
        navigator.clipboard.writeText(text);
    }

    useEffect(() => {
        const parent = ref.current;

        if(!parent) {
            return;
        }

        const onOutsideClick = (event: Event) => {
            const element = event.target as HTMLElement;
            
            if(!parent.contains(element)) {
                onHide();
            }
        }

        if(isShowing) {
            window.addEventListener("click", onOutsideClick);
        }

        return () => {
            window.removeEventListener("click", onOutsideClick);
        }
    }, [ref, isShowing])

    return <animated.div ref={ref} style={{
        ...styles,
        display: styles.opacity.to(pr => pr === 0 ? "none" : "flex")
    }} className="preview-dialog__overlay">
        <div className="preview-dialog">
            <div className="preview-dialog__topBar">
                <div className="preview-dialog__right">
                    <Icon onClick={onCopy} className="" icon={faClipboard}/>
                    <Icon onClick={_onExport} className="" icon={faDownload}/>
                </div>
                <Icon onClick={onHide} className="preview-dialog__close" icon={faTimes}/>
            </div>
            <div className="preview-dialog__body">
                {data ? <Highlight className={exportType === "geojson" ? "json" : "none"}>
                    {text}
                </Highlight> : null}
            </div>
        </div>
    </animated.div>;
}

export default PreviewDialog;

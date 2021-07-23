import React, { FunctionComponent, MouseEvent, useCallback } from 'react';
import { faDownload, faFileUpload, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './dragOverlay.scss';
import { useSpring, animated } from 'react-spring';

type Props = {
    isShowing: boolean;
}

const DragOverlay: FunctionComponent<Props> = ({
    isShowing,
}) => {
    const styles = useSpring({
        opacity: isShowing ? 1 : 0,
    })
    
    return <animated.div style={{
        ...styles,
        display: styles.opacity.to(pr => pr === 0 ? "none" : "flex")
    }}className="explore-page__dropOverlay">
        <div className="explore-page__dropModal">
            <div><FontAwesomeIcon size="5x" icon={faFileUpload}/></div>
            <div className="explore-page__dropModalText">Drop geojson</div>
        </div>
    </animated.div>;
}

export default DragOverlay;

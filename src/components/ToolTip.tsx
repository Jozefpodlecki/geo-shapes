import React, { FunctionComponent } from 'react';
import { animated, useSpring } from 'react-spring';
import './tooltip.scss';

type Props = {
    show: boolean;
    x: number;
    y: number;
}

const ToolTip: FunctionComponent<Props> = ({
    x,
    y,
    show,
    children
}) => {
    const styles = useSpring({
        opacity: show ? 1 : 0,
    })

    return <animated.div className="tooltip" style={{
        ...styles,
        top: `${y - 60}px`,
        left: `${x - 90}px`,
        display: styles.opacity.to(pr => pr === 0 ? "none" : "block")
    }}>
        {children}
    </animated.div>;
}

export default ToolTip;

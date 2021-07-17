import React, { FunctionComponent } from 'react';
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

    const style = {
        display: show ? "block" : "none",
        top: `${y - 60}px`,
        left: `${x - 90}px`,
    }

    return <div className="tooltip" style={style}>
        {children}
    </div>;
}

export default ToolTip;

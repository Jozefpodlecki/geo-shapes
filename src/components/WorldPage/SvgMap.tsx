import React, { FunctionComponent, memo } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import './svgMap.scss';

type Props = {
    onMouseMove(event: MouseEvent): void;
    onMouseEnter(): void;
    onMouseLeave(): void;
    onClick(event: MouseEvent): void;
    svg: string;
}

const SvgMap: FunctionComponent<Props> = ({
  
    onClick,
    svg,
}) => {
    const svgWrapperRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const element = svgWrapperRef.current;
       
        if(!element) {
            return;
        }

        const svg = element.firstChild;
       
        if(!(svg instanceof SVGSVGElement)) {
            return;
        }
        
        const svgGroup = svg.querySelector("g")!;

        const { x, y, width, height, left, top } = svgGroup.getBoundingClientRect();
        const transformMatrix = [1, 0, 0, 1, 0, 0];
    

        const onMouseWheel = (event: WheelEvent) => {
            let scale = 1;

            if(event.deltaY < 0) {
                scale = 1.1;
            }
            else {
                scale = 0.9;
            }

            for (let i = 0; i < 4; i++) {
                transformMatrix[i] *= scale;
            }

            const { clientX, clientY } = event;
            transformMatrix[4] += (1 - scale) * clientX;
            transformMatrix[5] += (1 - scale) * clientY;

            const newMatrix = `matrix(${transformMatrix.join(' ')})`;
            svgGroup.setAttributeNS(null, "transform", newMatrix);
        };

        let isDragging = false;
        const point = svg.createSVGPoint();
        const matrix = svg.getScreenCTM()?.inverse();
        let center = [-1, -1];

        const onMouseMove = (event: MouseEvent) => {
            const { clientX, clientY } = event;

            if(!isDragging) {
                return;
            }

            point.x = clientX - center[0];
            point.y = clientY - center[1];
            const cursorPoint =  point.matrixTransform(matrix);
            transformMatrix[4] = cursorPoint.x;
            transformMatrix[5] = cursorPoint.y;
            const newMatrix = `matrix(${transformMatrix.join(' ')})`;
            svgGroup.setAttributeNS(null, "transform", newMatrix);
        }

        const onMouseDown = (event: MouseEvent) => {
            const { clientX, clientY } = event;
            center = [clientX, clientY];
            isDragging = true;
        }

        const onMouseUp = () => {
            isDragging = false;
        }

        const onContextMenu = (event: MouseEvent) => {
            event.preventDefault();
        };

        svg.addEventListener("wheel", onMouseWheel);
        svg.addEventListener("mousemove", onMouseMove);
        svg.addEventListener("mousedown", onMouseDown);
        svg.addEventListener("mouseup", onMouseUp);
        // svg.addEventListener("mouseenter", onMouseEnter);
        // svg.addEventListener("mouseleave", onMouseLeave);
        svg.addEventListener("click", onClick);
        svg.addEventListener("contextmenu", onContextMenu);

        return () => {
            svg.removeEventListener("wheel", onMouseMove);
            svg.removeEventListener("mousemove", onMouseMove);
            svg.addEventListener("mousedown", onMouseDown);
            svg.addEventListener("mouseup", onMouseUp);
            // svg.removeEventListener("mouseenter", onMouseEnter);
            // svg.removeEventListener("mouseleave", onMouseLeave);
            svg.removeEventListener("click", onClick);
            svg.removeEventListener("contextmenu", onContextMenu);
        }

    }, [svgWrapperRef])

    return <div
        className="country-page__svg"
        ref={svgWrapperRef}
        dangerouslySetInnerHTML={{ __html: svg }}
    />
}

export default memo(SvgMap);
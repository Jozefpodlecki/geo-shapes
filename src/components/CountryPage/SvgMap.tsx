import React, { FunctionComponent, memo } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import './svgMap.scss';

type Props = {
    onMouseMove(event: MouseEvent): void;
    onMouseEnter(): void;
    onMouseLeave(): void;
    svg: string;
}

const SvgMap: FunctionComponent<Props> = ({
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
    svg,
}) => {
    const svgWrapperRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const element = svgWrapperRef.current;
 
        if(!element) {
            return;
        }

        const svg = element.firstChild;
       
        if(!(svg instanceof SVGElement)) {
            return;
        }
        
        const shape = svg.querySelector("g")!;

        const { y, width, height } = shape.getBoundingClientRect();
        shape.style.transform = `translate(calc(50% - ${width / 2}px), calc(50% - ${(y + height)}px))`;

        svg.addEventListener("mousemove", onMouseMove);
        svg.addEventListener("mouseenter", onMouseEnter);
        svg.addEventListener("mouseleave", onMouseLeave);

        return () => {
            svg.removeEventListener("mousemove", onMouseMove);
            svg.addEventListener("mouseenter", onMouseEnter);
            svg.addEventListener("mouseleave", onMouseLeave);
        }

    }, [svgWrapperRef])

    return <div
        className="country-page__svg"
        ref={svgWrapperRef}
        dangerouslySetInnerHTML={{ __html: svg }}
    />
}

export default memo(SvgMap);
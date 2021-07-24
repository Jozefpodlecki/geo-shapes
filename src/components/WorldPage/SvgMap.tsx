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
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
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
       
        if(!(svg instanceof SVGElement)) {
            return;
        }
        
        const shape = svg.querySelector("g")!;

        const { x, y, width, height } = shape.getBoundingClientRect();
        shape.style.transform = `translate(-${x/2}px, 0)`;

        // const onScroll = (event: any) => {
        //     const viewBox = svg.getAttribute('viewBox')?.split(" ");

        //     if(event.wheelDelta > 0) {
        //         svg.setAttribute("viewBox", "0 0 400 400");
        //     }
        //     else {
        //         svg.setAttribute("viewBox", "0 0 800 800");
        //     }

        // }
        // svg.addEventListener("wheel", onScroll);

        const onContextMenu = (event: MouseEvent) => {
            event.preventDefault();
        };

        svg.addEventListener("mousemove", onMouseMove);
        svg.addEventListener("mouseenter", onMouseEnter);
        svg.addEventListener("mouseleave", onMouseLeave);
        svg.addEventListener("click", onClick);
        svg.addEventListener("contextmenu", onContextMenu);

        return () => {
            svg.removeEventListener("mousemove", onMouseMove);
            svg.removeEventListener("mouseenter", onMouseEnter);
            svg.removeEventListener("mouseleave", onMouseLeave);
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
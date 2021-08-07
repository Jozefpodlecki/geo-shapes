import { useEffect, FunctionComponent, MouseEvent, useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import './menu.scss';

export type Actions = "nearby-country" | "nearby-continent";

type Props = {
    x: number;
    y: number;
    isShowing: boolean;
    onAction(action: Actions): void;
    onHide(): void;
}

const Menu: FunctionComponent<Props> = ({
    x,
    y,
    isShowing,
    onAction,
    onHide
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const styles = useSpring({
        opacity: isShowing ? 1 : 0,
    })
    
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
    }, [ref, onHide, isShowing])

    const _onAction = (event: MouseEvent<HTMLDivElement>) => {
        const { action } = event.currentTarget.dataset;
        onAction(action as Actions);
    }
    
    const { height } = ref?.current?.getBoundingClientRect() || { height: 0 };
    
    return <animated.div ref={ref} style={{
        ...styles,
        top: `${y - height / 2 }px`,
        left: `${x}px`,
        display: styles.opacity.to(pr => pr === 0 ? "none" : "flex")
    }} className="menu__overlay">
        <div className="menu">
           <div className="menu__item" onClick={_onAction} data-action="nearby-country">Get nearby country</div>
           <div className="menu__item" onClick={_onAction} data-action="nearby-continent">Get nearby continent</div>
        </div>
    </animated.div>;
}

export default Menu;

import { FunctionComponent, useEffect, memo, useRef } from 'react';
import { faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';
import Icon from 'components/Icon';
import { useSpring, animated } from 'react-spring';
import './warningDialog.scss';

type Props = {
    isShowing: boolean;
    onHide(): void;
    warning?: string;
}

const WarningDialog: FunctionComponent<Props> = ({
    isShowing,
    onHide,
    warning,
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
            
            if(parent === element) {
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
    }} className="warning-dialog__overlay">
        <div className="warning-dialog">
            <Icon onClick={onHide} className="warning-dialog__closeIcon" icon={faTimes} />
            <div className="warning-dialog__body">
                <Icon className="warning-dialog__warningIcon" icon={faExclamationTriangle} />
                <div className="warning-dialog__text">
                    {warning}
                </div>
            </div>
        </div>
    </animated.div>
}

export default memo(WarningDialog);

import { FunctionComponent, memo, useEffect } from 'react';
import { createPortal } from 'react-dom';

const mount = document.body;

const Portal : FunctionComponent = ({
    children
}) => {
    const element = document.createElement("div");

    useEffect(() => {
        mount.appendChild(element);

        return () => {
            mount.removeChild(element);
        }
    }, [element, mount]);

  return createPortal(children, element)
}

export default Portal;
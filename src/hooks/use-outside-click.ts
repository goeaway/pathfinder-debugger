import { MutableRefObject, useEffect } from "react";

const useOutsideClick = (refs: Array<MutableRefObject<HTMLElement>>, handler: (event: MouseEvent) => void) => {
    useEffect(() => {
        const listener = (event: MouseEvent) => {
            if(refs) {
                for(let ref of refs) {
                    // Do nothing if clicking ref's element or descendent elements
                    if (!ref.current || ref.current.contains(event.target as Node)) {
                        return;
                    }
                }
            }

            handler(event);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [refs, handler]);
}

export default useOutsideClick;
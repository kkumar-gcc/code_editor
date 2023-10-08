import {DependencyList, EffectCallback, useEffect, useRef} from "react";

export default function useUpdate(effect: EffectCallback, deps: DependencyList) {
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false
        } else {
            return effect()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)
}
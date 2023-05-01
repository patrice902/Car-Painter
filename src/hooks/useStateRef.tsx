import { useEffect, useRef, useState } from "react";

export const useStateRef = <T,>(value: T) => {
  const [state, setState] = useState<T>(value);
  const ref = useRef(state);

  useEffect(() => {
    ref.current = state;
  }, [state]);

  return [state, setState, ref];
};

import { useRef, useState } from "react";

export const useStateRef = <T,>(
  value: T
): [T, React.Dispatch<React.SetStateAction<T>>, React.MutableRefObject<T>] => {
  const [state, _setState] = useState<T>(value);
  const ref = useRef(state);

  const setState: React.Dispatch<React.SetStateAction<T>> = (
    val: T | ((prevState: T) => T)
  ) => {
    if (typeof val === "function") {
      ref.current = (val as (prevState: T) => T)(state);
    } else {
      ref.current = val;
    }
    _setState(val);
  };

  return [state, setState, ref];
};

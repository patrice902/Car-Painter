import { MutableRefObject, useEffect, useRef } from "react";

export const useReducerRef = <T,>(value: T): [T, MutableRefObject<T>] => {
  const ref = useRef<T>(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return [value, ref];
};

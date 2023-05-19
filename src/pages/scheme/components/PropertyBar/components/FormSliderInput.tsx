import React, { useCallback } from "react";
import { SliderInput } from "src/components/common";
import { SliderInputProps } from "src/components/common/SliderInput";
import { ValueMap } from "src/types/common";
import { useDebouncedCallback } from "use-debounce";

type FormSliderInputProps = {
  fieldKey: string;
  fieldFunc?: (value: number) => ValueMap;
  onUpdateField: (valueMap: ValueMap) => void;
  onUpdateDB: (valueMap: ValueMap) => void;
} & Omit<SliderInputProps, "setValue">;

export const FormSliderInput = React.memo(
  ({
    fieldKey,
    fieldFunc,
    onUpdateField,
    onUpdateDB,
    ...props
  }: FormSliderInputProps) => {
    const handleChangeDebounced = useDebouncedCallback(
      (valueMap) => onUpdateDB(valueMap),
      300
    );

    const handleChange = useCallback(
      (value) => {
        const valueMap = fieldFunc ? fieldFunc(value) : { [fieldKey]: value };
        onUpdateField(valueMap);
        handleChangeDebounced(valueMap);
      },
      [fieldKey, fieldFunc, handleChangeDebounced, onUpdateField]
    );

    return <SliderInput {...props} setValue={handleChange} small />;
  }
);

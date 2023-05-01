import React, { useCallback } from "react";
import { ColorPickerInput } from "src/components/common";
import { ColorPickerInputProps } from "src/components/common/ColorPickerInput";
import { ValueMap } from "src/types/common";

type FormColorPickerInputProps = {
  fieldKey: string;
  fieldFunc?: (value: string) => ValueMap;
  onUpdateDB: (valueMap: ValueMap) => void;
} & Omit<ColorPickerInputProps, "onChange" | "onInputChange">;

export const FormColorPickerInput = React.memo(
  ({
    fieldKey,
    fieldFunc,
    onUpdateDB,
    ...props
  }: FormColorPickerInputProps) => {
    const handleChange = useCallback(
      (value: string) => {
        const valueMap: ValueMap = fieldFunc
          ? fieldFunc(value)
          : ({ [fieldKey]: value } as ValueMap);
        onUpdateDB(valueMap);
      },
      [fieldFunc, fieldKey, onUpdateDB]
    );

    return (
      <ColorPickerInput
        {...props}
        onChange={handleChange}
        onInputChange={handleChange}
      />
    );
  }
);

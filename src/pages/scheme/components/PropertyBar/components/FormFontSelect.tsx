import React, { useCallback } from "react";
import { FontSelect } from "src/components/common";
import { FontSelectProps } from "src/components/common/FontSelect";
import { ValueMap } from "src/types/common";
import { useDebouncedCallback } from "use-debounce";

type FormFontSelectProps = {
  fieldKey: string;
  fieldFunc?: (value: number) => ValueMap;
  onUpdateField: (valueMap: ValueMap) => void;
  onUpdateDB: (valueMap: ValueMap) => void;
} & Omit<FontSelectProps, "onChange">;

export const FormFontSelect = React.memo(
  ({
    fieldKey,
    fieldFunc,
    onUpdateField,
    onUpdateDB,
    ...props
  }: FormFontSelectProps) => {
    const handleChangeDebounced = useDebouncedCallback(
      (valueMap) => onUpdateDB(valueMap),
      300
    );

    const handleChange = useCallback(
      (value: number) => {
        const valueMap = fieldFunc ? fieldFunc(value) : { [fieldKey]: value };
        onUpdateField(valueMap);
        handleChangeDebounced(valueMap);
      },
      [fieldKey, fieldFunc, handleChangeDebounced, onUpdateField]
    );

    return <FontSelect {...props} onChange={handleChange} />;
  }
);

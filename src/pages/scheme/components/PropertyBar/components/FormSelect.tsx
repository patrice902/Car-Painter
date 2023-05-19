import { Select, SelectProps } from "@material-ui/core";
import React, { useCallback } from "react";
import { ValueMap } from "src/types/common";
import { useDebouncedCallback } from "use-debounce";

type FormSelectProps = {
  fieldKey: string;
  fieldFunc?: (value: string) => ValueMap;
  onUpdateField: (valueMap: ValueMap) => void;
  onUpdateDB: (valueMap: ValueMap) => void;
} & SelectProps;

export const FormSelect = React.memo(
  ({
    fieldKey,
    fieldFunc,
    onUpdateField,
    onUpdateDB,
    ...props
  }: FormSelectProps) => {
    const handleChangeDebounced = useDebouncedCallback(
      (valueMap) => onUpdateDB(valueMap),
      300
    );

    const handleChange = useCallback(
      (e) => {
        const value = e.target.value;
        const valueMap = fieldFunc ? fieldFunc(value) : { [fieldKey]: value };
        onUpdateField(valueMap);
        handleChangeDebounced(valueMap);
      },
      [fieldKey, fieldFunc, handleChangeDebounced, onUpdateField]
    );

    return (
      <Select onChange={handleChange} variant="outlined" fullWidth {...props} />
    );
  }
);

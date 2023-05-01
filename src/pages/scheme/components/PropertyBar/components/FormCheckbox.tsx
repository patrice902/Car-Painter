import { Checkbox, CheckboxProps } from "@material-ui/core";
import React, { ChangeEvent, useCallback } from "react";
import { ValueMap } from "src/types/common";
import { useDebouncedCallback } from "use-debounce";

type FormCheckboxProps = {
  fieldKey: string;
  fieldFunc?: (value: boolean) => ValueMap;
  onUpdateField: (valueMap: ValueMap) => void;
  onUpdateDB: (valueMap: ValueMap) => void;
} & CheckboxProps;

export const FormCheckbox = React.memo(
  ({
    fieldKey,
    fieldFunc,
    onUpdateField,
    onUpdateDB,
    ...props
  }: FormCheckboxProps) => {
    const handleChangeDebounced = useDebouncedCallback(
      (valueMap) => onUpdateDB(valueMap),
      300
    );

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const valueMap = fieldFunc
          ? fieldFunc(event.target.checked)
          : { [fieldKey]: event.target.checked };
        onUpdateField(valueMap);
        handleChangeDebounced(valueMap);
      },
      [fieldKey, fieldFunc, handleChangeDebounced, onUpdateField]
    );

    return <Checkbox onChange={handleChange} {...props} />;
  }
);

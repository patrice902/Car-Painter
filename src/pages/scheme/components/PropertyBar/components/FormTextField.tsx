import { TextFieldProps } from "@material-ui/core";
import React, { useCallback } from "react";
import { ValueMap } from "src/types/common";
import { useDebouncedCallback } from "use-debounce";

import { SmallTextField } from "../PropertyBar.style";

type FormTextFieldProps = {
  fieldKey: string;
  fieldFunc?: (value: string) => ValueMap;
  onUpdateField: (valueMap: ValueMap) => void;
  onUpdateDB: (valueMap: ValueMap) => void;
} & TextFieldProps;

export const FormTextField = React.memo(
  ({
    type,
    fieldKey,
    fieldFunc,
    onUpdateField,
    onUpdateDB,
    ...props
  }: FormTextFieldProps) => {
    const handleChangeDebounced = useDebouncedCallback(
      (valueMap) => onUpdateDB(valueMap),
      300
    );

    const handleChange = useCallback(
      (e) => {
        const min = props.inputProps?.min;
        const max = props.inputProps?.max;
        let value =
          type === "number" ? Number(e.target.value) || 0 : e.target.value;

        if (type === "number" && min !== null && min !== undefined) {
          value = Math.max(value, min);
        }

        if (type === "number" && max !== null && max !== undefined) {
          value = Math.min(value, max);
        }

        const valueMap = fieldFunc ? fieldFunc(value) : { [fieldKey]: value };
        onUpdateField(valueMap);
        handleChangeDebounced(valueMap);
      },
      [
        fieldKey,
        fieldFunc,
        handleChangeDebounced,
        type,
        onUpdateField,
        props.inputProps,
      ]
    );

    return <SmallTextField onChange={handleChange} type={type} {...props} />;
  }
);

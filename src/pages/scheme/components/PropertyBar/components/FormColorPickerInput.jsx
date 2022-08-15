import { ColorPickerInput } from "components/common";
import React, { useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

export const FormColorPickerInput = React.memo(
  ({ fieldKey, fieldFunc, onUpdateField, onUpdateDB, ...props }) => {
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
      [fieldKey, handleChangeDebounced, onUpdateField, fieldFunc]
    );

    return (
      <ColorPickerInput
        onChange={handleChange}
        onInputChange={handleChange}
        {...props}
      />
    );
  }
);

import { ColorPickerInput } from "components/common";
import React, { useCallback } from "react";

export const FormColorPickerInput = React.memo(
  ({ fieldKey, fieldFunc, onUpdateDB, ...props }) => {
    const handleChange = useCallback(
      (value) => {
        const valueMap = fieldFunc ? fieldFunc(value) : { [fieldKey]: value };
        onUpdateDB(valueMap);
      },
      [fieldFunc, fieldKey, onUpdateDB]
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

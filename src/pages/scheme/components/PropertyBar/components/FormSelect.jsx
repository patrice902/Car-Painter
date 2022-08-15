import { Select } from "@material-ui/core";
import React, { useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

export const FormSelect = React.memo(
  ({ fieldKey, fieldFunc, onUpdateField, onUpdateDB, ...props }) => {
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

import { Checkbox } from "components/MaterialUI";
import React, { useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

export const FormCheckbox = React.memo(
  ({ fieldKey, fieldFunc, onUpdateField, onUpdateDB, ...props }) => {
    const handleChangeDebounced = useDebouncedCallback(
      (valueMap) => onUpdateDB(valueMap),
      300
    );

    const handleChange = useCallback(
      (e) => {
        const value = e.target.checked;
        const valueMap = fieldFunc ? fieldFunc(value) : { [fieldKey]: value };
        onUpdateField(valueMap);
        handleChangeDebounced(valueMap);
      },
      [fieldKey, fieldFunc, handleChangeDebounced, onUpdateField]
    );

    return <Checkbox onChange={handleChange} {...props} />;
  }
);

import { FontSelect } from "components/common";
import React, { useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

export const FormFontSelect = React.memo(
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
      [fieldKey, fieldFunc, handleChangeDebounced, onUpdateField]
    );

    return <FontSelect onChange={handleChange} {...props} />;
  }
);

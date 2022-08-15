import React, { useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

import { SmallTextField } from "../PropertyBar.style";

export const FormTextField = React.memo(
  ({ type, fieldKey, fieldFunc, onUpdateField, onUpdateDB, ...props }) => {
    const handleChangeDebounced = useDebouncedCallback(
      (valueMap) => onUpdateDB(valueMap),
      300
    );

    const handleChange = useCallback(
      (e) => {
        const value =
          type === "number" ? Number(e.target.value) || 0 : e.target.value;
        const valueMap = fieldFunc ? fieldFunc(value) : { [fieldKey]: value };
        onUpdateField(valueMap);
        handleChangeDebounced(valueMap);
      },
      [fieldKey, fieldFunc, handleChangeDebounced, type, onUpdateField]
    );

    return <SmallTextField onChange={handleChange} type={type} {...props} />;
  }
);

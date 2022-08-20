import { LockButton } from "components/common";
import React, { useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

export const FormLockButton = React.memo(
  ({ fieldKey, fieldFunc, onUpdateField, onUpdateDB, ...props }) => {
    const handleChangeDebounced = useDebouncedCallback(
      (valueMap) => onUpdateDB(valueMap),
      300
    );

    const onClick = useCallback(() => {
      const value = props.locked !== "true";
      const valueMap = fieldFunc ? fieldFunc(value) : { [fieldKey]: value };
      onUpdateField(valueMap);
      handleChangeDebounced(valueMap);
    }, [fieldFunc, fieldKey, handleChangeDebounced, onUpdateField, props]);

    return <LockButton onClick={onClick} {...props} />;
  }
);

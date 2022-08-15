import { IconButton } from "@material-ui/core";
import React, { useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

export const FormIconButton = React.memo(
  ({ fieldKey, fieldFunc, value, onUpdateField, onUpdateDB, ...props }) => {
    const handleChangeDebounced = useDebouncedCallback(
      (valueMap) => onUpdateDB(valueMap),
      300
    );

    const onClick = useCallback(() => {
      const valueMap = fieldFunc ? fieldFunc(!value) : { [fieldKey]: !value };
      onUpdateField(valueMap);
      handleChangeDebounced(valueMap);
    }, [fieldFunc, fieldKey, handleChangeDebounced, onUpdateField, value]);

    return <IconButton size="small" onClick={onClick} {...props} />;
  }
);

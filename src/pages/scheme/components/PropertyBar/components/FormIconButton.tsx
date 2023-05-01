import { IconButton, IconButtonProps } from "@material-ui/core";
import React, { useCallback } from "react";
import { ValueMap } from "src/types/common";
import { useDebouncedCallback } from "use-debounce";

type FormIconButtonProps = {
  fieldKey?: string;
  fieldFunc?: (value: boolean) => ValueMap;
  onUpdateField: (valueMap: ValueMap) => void;
  onUpdateDB: (valueMap: ValueMap) => void;
} & IconButtonProps;

export const FormIconButton = React.memo(
  ({
    fieldKey,
    fieldFunc,
    value,
    onUpdateField,
    onUpdateDB,
    ...props
  }: FormIconButtonProps) => {
    const handleChangeDebounced = useDebouncedCallback(
      (valueMap) => onUpdateDB(valueMap),
      300
    );

    const onClick = useCallback(() => {
      const valueMap = fieldFunc
        ? fieldFunc(!value)
        : { [fieldKey as string]: !value };
      onUpdateField(valueMap);
      handleChangeDebounced(valueMap);
    }, [fieldFunc, fieldKey, handleChangeDebounced, onUpdateField, value]);

    return <IconButton size="small" onClick={onClick} {...props} />;
  }
);

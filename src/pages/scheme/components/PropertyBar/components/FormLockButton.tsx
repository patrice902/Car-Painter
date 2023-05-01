import React, { useCallback } from "react";
import { LockButton } from "src/components/common";
import { LockButtonProps } from "src/components/common/LockButton";
import { ValueMap } from "src/types/common";
import { useDebouncedCallback } from "use-debounce";

type FormLockButtonProps = {
  fieldKey: string;
  fieldFunc?: (value: boolean) => ValueMap;
  onUpdateField: (valueMap: ValueMap) => void;
  onUpdateDB: (valueMap: ValueMap) => void;
} & LockButtonProps;

export const FormLockButton = React.memo(
  ({
    fieldKey,
    fieldFunc,
    onUpdateField,
    onUpdateDB,
    ...props
  }: FormLockButtonProps) => {
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

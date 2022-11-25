import React, { useCallback, useState } from "react";
import useInterval from "react-useinterval";
import { ColorPicker } from "material-ui-color";
import { Box, TextField, Typography } from "@material-ui/core";
import { Palette } from "constant";
import styled from "styled-components";
import { focusBoard, focusBoardQuickly } from "helper";
import { useDebouncedCallback } from "use-debounce";
import { useEffect } from "react";

const CustomColorPicker = styled(ColorPicker)`
  &.ColorPicker-MuiButton-contained {
    margin-left: 0;
  }
`;
const CustomTextField = styled(TextField)`
  .MuiInputBase-input {
    padding: 0;
    text-align: right;
  }
`;

export const ColorPickerInput = React.memo((props) => {
  const {
    separateValues,
    valuePicker,
    value,
    disabled,
    onChange,
    onInputChange,
    error,
    helperText,
    fullWidth = true,
  } = props;
  const [innerValue, setInnerValue] = useState(value);

  const onChangeDebounced = useDebouncedCallback(
    (newValue) => onChange(newValue),
    300
  );

  const onInputChangeDebounced = useDebouncedCallback(
    (newValue) => onInputChange(newValue),
    500
  );

  const handleChange = useCallback(
    (newValue) => {
      setInnerValue(newValue);
      onChangeDebounced(newValue);
    },
    [onChangeDebounced]
  );

  const handleInputChange = useCallback(
    (newValue) => {
      setInnerValue(newValue);
      onInputChangeDebounced(newValue);
    },
    [onInputChangeDebounced]
  );

  const handleInputKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter") {
        handleChange(event.target.value);
      }
    },
    [handleChange]
  );

  const handleHexInputKeyDown = useCallback((event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.target
        .closest(".MuiPaper-root")
        .getElementsByClassName("muicc-colorbox-controls")[0]
        .children[0].click();
      focusBoard();
    }
  }, []);

  const handleColorChange = useCallback(
    (color) => {
      handleChange(color.error ? "" : color.css.backgroundColor);
      focusBoard();
    },
    [handleChange]
  );

  useInterval(() => {
    const hexInput = document.getElementById("hex");
    if (hexInput && !hexInput.onkeydown)
      hexInput.onkeydown = handleHexInputKeyDown;
  }, [200]);

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-between"
      width={fullWidth ? "100%" : "auto"}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width={fullWidth ? "100%" : "auto"}
      >
        {disabled ? (
          <Box
            width="24px"
            height="24px"
            bgcolor={innerValue || "white"}
            borderRadius="5px"
            m="4px"
          ></Box>
        ) : (
          <CustomColorPicker
            value={separateValues ? valuePicker : innerValue || "#"}
            onChange={handleColorChange}
            onOpen={focusBoardQuickly}
            palette={Palette}
            deferred
            hideTextfield
          />
        )}

        <CustomTextField
          value={innerValue || ""}
          placeholder="default"
          disabled={disabled}
          style={{ width: 85, borderBottom: "1px solid gray", padding: 0 }}
          onChange={(event) => handleInputChange(event.target.value)}
          onKeyDown={handleInputKeyDown}
        />
      </Box>
      {error ? (
        <Typography color="secondary" variant="body2">
          {helperText}
        </Typography>
      ) : (
        <></>
      )}
    </Box>
  );
});

export default ColorPickerInput;

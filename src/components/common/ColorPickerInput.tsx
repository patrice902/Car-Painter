import { Box, IconButton, TextField, Typography } from "@material-ui/core";
import ColorizeIcon from "@material-ui/icons/Colorize";
import { ColorPicker } from "material-ui-color";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useInterval from "react-useinterval";
import { focusBoard, focusBoardQuickly } from "src/helper";
import { useEyeDrop } from "src/hooks/useEyeDrop";
import { Palette } from "src/types/enum";
import styled from "styled-components";
import { useDebouncedCallback } from "use-debounce";

import LightTooltip from "./LightTooltip";

const DisabledTransparentColorPicker = styled(Box)`
  background-image: linear-gradient(
      45deg,
      rgb(204, 204, 204) 25%,
      transparent 25%
    ),
    linear-gradient(135deg, rgb(204, 204, 204) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgb(204, 204, 204) 75%),
    linear-gradient(135deg, transparent 75%, rgb(204, 204, 204) 75%);
  background-color: white;
  border-color: rgb(118, 118, 118);
  border-width: 0px;
  width: 24px;
  min-width: 24px;
  height: 24px;
  padding: 0;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  border-style: solid;
  border-radius: 4px;
  background-size: 8px 8px;
  background-position: 0 0, 4px 0, 4px -4px, 0px 4px;
  margin: 6px 6px 6px 0;
  position: relative;

  :after {
    content: "";
    position: absolute;
    background: repeating-linear-gradient(
        135deg,
        transparent,
        transparent 14px,
        rgb(244, 67, 54) 14px,
        rgb(244, 67, 54) 16px
      )
      transparent;
    width: 24px;
    min-width: 24px;
    height: 24px;
    border: 2px solid rgb(244, 67, 54);
    border-radius: 4px;
  }
`;

const CustomTextField = styled(TextField)`
  .MuiInputBase-input {
    padding: 0;
    text-align: right;
  }
`;

export type ColorPickerInputProps = {
  separateValues?: boolean;
  valuePicker?: string;
  value: string | undefined;
  disabled?: boolean;
  onChange: (value: string) => void;
  onInputChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
};

export const ColorPickerInput = React.memo((props: ColorPickerInputProps) => {
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
  const [showPickerColorBox, setShowPickerColorBox] = useState(false);
  const [showEyeDropper, setShowEyeDropper] = useState(false);
  const eyeDropperRef = useRef<HTMLButtonElement>(null);

  const colorBoxControl = document.getElementsByClassName(
    "muicc-colorbox-controls"
  )[0];

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

  const { pickColor } = useEyeDrop({
    once: true,
    onChange: (hexColor) => {
      handleChange(hexColor);
      focusBoardQuickly();
    },
  });

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

  const handleColorPickerOpen = useCallback((open?: boolean) => {
    if (open) {
      setShowPickerColorBox(true);
    } else {
      setShowPickerColorBox(false);
      setShowEyeDropper(false);
      focusBoardQuickly();
    }
  }, []);

  useInterval(() => {
    const hexInput = document.getElementById("hex");
    if (hexInput && !hexInput.onkeydown)
      hexInput.onkeydown = handleHexInputKeyDown;
  }, 200);

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  const EyeDropButton = () => (
    <LightTooltip title="Color Eye Dropper" arrow>
      <IconButton ref={eyeDropperRef} onClick={() => setTimeout(pickColor, 10)}>
        <ColorizeIcon />
      </IconButton>
    </LightTooltip>
  );

  useEffect(() => {
    // Create a new MutationObserver instance
    const observer = new MutationObserver(() => {
      // Check each mutation in the list
      if (
        document.getElementsByClassName("muicc-colorbox-controls")[0] &&
        showPickerColorBox
      ) {
        setShowEyeDropper(true);
      }
    });

    // Start observing the document body for mutations
    observer.observe(document.body, { childList: true, subtree: true });

    // Clean up the observer when the component unmounts
    return () => {
      observer.disconnect();
    };
  }, [showPickerColorBox]);

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
          <>
            {!innerValue ? (
              <DisabledTransparentColorPicker />
            ) : (
              <Box
                width="24px"
                minWidth="24px"
                height="24px"
                bgcolor={innerValue}
                borderRadius="5px"
                m="6px 6px 6px 0"
              />
            )}
          </>
        ) : (
          <ColorPicker
            value={separateValues ? valuePicker : innerValue || "#"}
            onChange={handleColorChange}
            onOpen={handleColorPickerOpen}
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
      {showEyeDropper && colorBoxControl
        ? createPortal(<EyeDropButton />, colorBoxControl)
        : null}
    </Box>
  );
});

export default ColorPickerInput;

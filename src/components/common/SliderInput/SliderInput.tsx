import {
  Box,
  Grid,
  Slider,
  SliderProps,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useCallback } from "react";

import { CustomInput, SliderWrapper, Wrapper } from "./SliderInput.style";

type ValueLabelComponentProps = {
  children: React.ReactElement;
  open: boolean;
  value: number;
};

const ValueLabelComponent = React.memo((props: ValueLabelComponentProps) => (
  <Tooltip
    open={props.open}
    enterTouchDelay={0}
    placement="top"
    title={props.value}
  >
    {props.children}
  </Tooltip>
));

export type SliderInputProps = {
  label: string;
  disabled?: boolean;
  min: number;
  max: number;
  value?: number;
  setValue: (value: number) => void;
  step?: number;
  small?: boolean;
} & Omit<SliderProps, "value">;

export const SliderInput = React.memo(
  ({
    label,
    disabled,
    min,
    max,
    value,
    setValue,
    step,
    small,
    ...props
  }: SliderInputProps) => {
    const handleBlur = useCallback(() => {
      if (value === undefined) return;

      if (value < min) {
        setValue(min);
      } else if (value > max) {
        setValue(max);
      }
    }, [value, min, max, setValue]);

    return (
      <Box height="40px" width="100%">
        <Wrapper container spacing={2}>
          <Grid item xs={6}>
            <Typography
              color="textSecondary"
              style={{ fontSize: small ? "14px" : "16px", marginRight: "8px" }}
            >
              {label}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <SliderWrapper>
                <Slider
                  {...props}
                  min={min}
                  max={max}
                  step={step}
                  value={value}
                  disabled={disabled}
                  onChange={(event, value) => setValue(value as number)}
                  aria-labelledby="shape-size"
                  ValueLabelComponent={ValueLabelComponent}
                />
              </SliderWrapper>
              <CustomInput
                value={value}
                disabled={disabled}
                margin="dense"
                type="number"
                onChange={(event) =>
                  setValue(
                    event.target.value === ""
                      ? Math.max(min, 0)
                      : Number(event.target.value)
                  )
                }
                onBlur={handleBlur}
                inputProps={{
                  min,
                  max,
                  step: step || 1,
                  "aria-labelledby": "input-slider",
                }}
              />
            </Box>
          </Grid>
        </Wrapper>
      </Box>
    );
  }
);

export default SliderInput;

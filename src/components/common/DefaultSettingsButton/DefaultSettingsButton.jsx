import { LightTooltip } from "components/common";
import { Box, useMediaQuery } from "components/MaterialUI";
import { alphaToHex } from "helper";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

export const DefaultSettingsButton = React.memo(({ onClick }) => {
  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const currentLayer = useSelector((state) => state.layerReducer.current);
  const isAboveMobile = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  const bgColor = useMemo(
    () =>
      currentLayer
        ? (currentLayer.layer_data.color || "#000000") +
          alphaToHex(currentLayer.layer_data.opacity || 1)
        : (currentScheme.guide_data.default_shape_color || "#000000") +
          alphaToHex(currentScheme.guide_data.default_shape_opacity || 1),
    [currentScheme, currentLayer]
  );

  const outlineWidth = useMemo(
    () =>
      Math.min(
        (currentLayer
          ? currentLayer.layer_data.stroke / 2.0
          : currentScheme.guide_data.default_shape_stroke) || 0,
        5
      ),
    [currentScheme, currentLayer]
  );

  const outlineColor = useMemo(
    () =>
      (currentLayer
        ? currentLayer.layer_data.scolor
        : currentScheme.guide_data.default_shape_scolor) || "#000000",
    [currentScheme, currentLayer]
  );

  return (
    <Box
      display="flex"
      justifyContent="center"
      width={isAboveMobile ? "45px" : "30px"}
      height={isAboveMobile ? "45px" : "30px"}
      alignItems="center"
    >
      <LightTooltip title="Default Shape Settings" arrow placement="right">
        <Box
          bgcolor="#FFFFFF"
          height={isAboveMobile ? "30px" : "20px"}
          borderRadius="3px"
        >
          <CustomButton
            width={isAboveMobile ? "30px" : "20px"}
            height={isAboveMobile ? "30px" : "20px"}
            bgcolor={bgColor}
            outline={`${outlineWidth}px solid ${outlineColor}`}
            borderRadius="3px"
            onClick={onClick}
          />
        </Box>
      </LightTooltip>
    </Box>
  );
});

const CustomButton = styled(Box)`
  outline: ${(props) => props.outline};
  cursor: pointer;
  caret-color: transparent;
`;

export default DefaultSettingsButton;

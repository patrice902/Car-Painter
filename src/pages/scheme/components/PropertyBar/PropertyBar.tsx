import { Box, Theme, useMediaQuery } from "@material-ui/core";
import { Stage } from "konva/types/Stage";
import React, { RefObject, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/redux";
import { setShowProperties } from "src/redux/reducers/boardReducer";
import { CloneLayerProps } from "src/redux/reducers/layerReducer";
import { BuilderLayerJSON } from "src/types/query";

import { LayerProperty } from "./LayerProperty";
import { SchemeProperty } from "./SchemeProperty";

const Wrapper = React.memo(({ children }) => {
  const showProperties = useSelector(
    (state: RootState) => state.boardReducer.showProperties
  );

  if (!showProperties) {
    return <></>;
  }

  return (
    <Box
      position="relative"
      display="flex"
      overflow="visible"
      width={showProperties ? "14%" : "0"}
      minWidth={showProperties ? "260px" : "0"}
      maxWidth="300px"
      bgcolor="#666"
    >
      {children}
    </Box>
  );
});

export interface PropertyBarProps {
  editable: boolean;
  stageRef: RefObject<Stage>;
  transformingLayer?: BuilderLayerJSON | null;
  onDeleteLayer: (layer: BuilderLayerJSON) => void;
  onCloneLayer: (props: CloneLayerProps) => void;
}

export const PropertyBar = React.memo((props: PropertyBarProps) => {
  const {
    editable,
    stageRef,
    transformingLayer,
    onCloneLayer,
    onDeleteLayer,
  } = props;
  const dispatch = useDispatch();

  const isAboveTablet = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("md")
  );
  const currentLayer = useSelector(
    (state: RootState) => state.layerReducer.current
  );
  const currentScheme = useSelector(
    (state: RootState) => state.schemeReducer.current
  );

  useEffect(() => {
    if (!isAboveTablet) {
      dispatch(setShowProperties(false));
    } else {
      dispatch(setShowProperties(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAboveTablet]);

  return (
    <Wrapper>
      <Box
        overflow="auto"
        py={5}
        px={2}
        height="100%"
        width="100%"
        position="relative"
      >
        {currentLayer ? (
          <LayerProperty
            editable={editable}
            stageRef={stageRef}
            transformingLayer={transformingLayer}
            onClone={onCloneLayer}
            onDelete={onDeleteLayer}
          />
        ) : currentScheme ? (
          <SchemeProperty editable={editable} />
        ) : (
          <></>
        )}
      </Box>
    </Wrapper>
  );
});

export default PropertyBar;

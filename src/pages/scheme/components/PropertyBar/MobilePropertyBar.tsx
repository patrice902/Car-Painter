import { Box, IconButton } from "@material-ui/core";
import { Stage } from "konva/types/Stage";
import React, { RefObject, useEffect } from "react";
import { BsChevronDoubleDown } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/redux";
import { setShowProperties } from "src/redux/reducers/boardReducer";
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
      position="absolute"
      display="flex"
      overflow="visible"
      width="100%"
      height="300px"
      bottom={0}
      zIndex={1202}
      flexDirection="column"
      bgcolor="#666"
    >
      {children}
    </Box>
  );
});

export interface MobilePropertyBarProps {
  editable: boolean;
  stageRef: RefObject<Stage>;
  transformingLayer?: BuilderLayerJSON | null;
  onDeleteLayer: (layer: BuilderLayerJSON) => void;
  onCloneLayer: (
    layer: BuilderLayerJSON,
    samePosition?: boolean,
    pushingToHistory?: boolean
  ) => void;
}

export const MobilePropertyBar = React.memo(
  ({
    editable,
    stageRef,
    transformingLayer,
    onCloneLayer,
    onDeleteLayer,
  }: MobilePropertyBarProps) => {
    const dispatch = useDispatch();

    const currentLayer = useSelector(
      (state: RootState) => state.layerReducer.current
    );
    const currentScheme = useSelector(
      (state: RootState) => state.schemeReducer.current
    );

    const hidePropertyBar = () => {
      dispatch(setShowProperties(false));
    };

    useEffect(() => {
      dispatch(setShowProperties(false));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <Wrapper>
        <IconButton
          style={{
            width: "100%",
            borderRadius: "0px",
            background: "black",
          }}
          onClick={hidePropertyBar}
        >
          <BsChevronDoubleDown />
        </IconButton>

        <Box
          overflow="auto"
          py={1}
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
  }
);

export default MobilePropertyBar;

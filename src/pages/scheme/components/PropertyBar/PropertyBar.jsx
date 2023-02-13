import { Box, useMediaQuery } from "components/MaterialUI";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShowProperties } from "redux/reducers/boardReducer";

import { LayerProperty } from "./LayerProperty";
import { SchemeProperty } from "./SchemeProperty";

const Wrapper = React.memo(({ children }) => {
  const showProperties = useSelector(
    (state) => state.boardReducer.showProperties
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

export const PropertyBar = React.memo((props) => {
  const {
    editable,
    stageRef,
    transformingLayer,
    onCloneLayer,
    onDeleteLayer,
  } = props;
  const dispatch = useDispatch();

  const isAboveTablet = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const currentLayer = useSelector((state) => state.layerReducer.current);
  const currentScheme = useSelector((state) => state.schemeReducer.current);

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

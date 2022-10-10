import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import { LayerProperty } from "./LayerProperty";
import { SchemeProperty } from "./SchemeProperty";
import { Box, IconButton, useMediaQuery } from "components/MaterialUI";
import { BsChevronDoubleDown } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { setShowProperties } from "redux/reducers/boardReducer";

const Wrapper = React.memo(({ children }) => {
  const overMobile = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const showProperties = useSelector(
    (state) => state.boardReducer.showProperties
  );

  if (!showProperties) {
    return <></>;
  }

  if (overMobile) {
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
  }

  return (
    <Box
      position="absolute"
      display="flex"
      overflow="visible"
      width="100%"
      height="300px"
      bottom={0}
      zIndex={1500}
      flexDirection="column"
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

  const overMobile = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const currentLayer = useSelector((state) => state.layerReducer.current);
  const currentScheme = useSelector((state) => state.schemeReducer.current);

  const hidePropertyBar = () => {
    dispatch(setShowProperties(false));
  };

  useEffect(() => {
    if (!overMobile) {
      hidePropertyBar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper>
      {!overMobile ? (
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
      ) : (
        <></>
      )}

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

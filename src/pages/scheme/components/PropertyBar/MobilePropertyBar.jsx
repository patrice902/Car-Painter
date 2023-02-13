import { Box, IconButton } from "components/MaterialUI";
import React, { useEffect } from "react";
import { BsChevronDoubleDown } from "react-icons/bs";
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

export const MobilePropertyBar = React.memo((props) => {
  const {
    editable,
    stageRef,
    transformingLayer,
    onCloneLayer,
    onDeleteLayer,
  } = props;
  const dispatch = useDispatch();

  const currentLayer = useSelector((state) => state.layerReducer.current);
  const currentScheme = useSelector((state) => state.schemeReducer.current);

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
});

export default MobilePropertyBar;

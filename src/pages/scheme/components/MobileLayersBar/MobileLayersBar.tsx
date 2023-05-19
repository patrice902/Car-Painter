import { Box, IconButton } from "@material-ui/core";
import React, { useCallback, useEffect } from "react";
import { BsChevronDoubleDown } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/redux";
import { setShowLayers } from "src/redux/reducers/boardReducer";

import { LayersBar } from "../LayersBar";
import { LayersBarProps } from "../LayersBar/LayersBar";

export const MobileLayersBar = React.memo((props: LayersBarProps) => {
  const dispatch = useDispatch();

  const showLayers = useSelector(
    (state: RootState) => state.boardReducer.showLayers
  );

  const hideLayersBar = useCallback(() => {
    dispatch(setShowLayers(false));
  }, [dispatch]);

  useEffect(() => {
    hideLayersBar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {showLayers ? (
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
          <IconButton
            style={{
              width: "100%",
              borderRadius: "0px",
              background: "black",
            }}
            onClick={hideLayersBar}
          >
            <BsChevronDoubleDown />
          </IconButton>
          <LayersBar {...props} />
        </Box>
      ) : (
        <></>
      )}
    </>
  );
});

export default MobileLayersBar;

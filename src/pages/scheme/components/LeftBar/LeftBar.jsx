import { Box } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";

import { LayersBar } from "../LayersBar";
import { DrawerBar } from "./DrawerBar";
import { TitleWrapper, Wrapper } from "./LeftBar.style";
import { TitleBar } from "./TitleBar";

export const LeftBar = React.memo((props) => {
  const { dialog, setDialog, editable, stageRef, onBack } = props;

  const showLayers = useSelector((state) => state.boardReducer.showLayers);

  return (
    <Box
      display="flex"
      flexDirection="column"
      bgcolor="#666666"
      width={showLayers ? "20%" : "auto"}
      minWidth={showLayers ? "300px" : "0"}
      maxWidth="400px"
    >
      <TitleWrapper pl={3} pr={1} height="55px">
        {showLayers ? <TitleBar editable={editable} onBack={onBack} /> : <></>}
      </TitleWrapper>
      <Wrapper display="flex">
        <DrawerBar
          dialog={dialog}
          setDialog={setDialog}
          stageRef={stageRef}
          editable={editable}
        />
        {showLayers ? <LayersBar {...props} /> : <></>}
      </Wrapper>
    </Box>
  );
});

export default LeftBar;

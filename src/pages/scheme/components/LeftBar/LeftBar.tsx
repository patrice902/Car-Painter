import { Box } from "@material-ui/core";
import { Stage } from "konva/types/Stage";
import React, { RefObject } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/redux";
import { DialogTypes } from "src/types/enum";

import { LayersBar } from "../LayersBar";
import { DrawerBar } from "./DrawerBar";
import { TitleWrapper, Wrapper } from "./LeftBar.style";
import { TitleBar } from "./TitleBar";

type LeftBarProps = {
  dialog?: DialogTypes | null;
  setDialog: (dialog?: DialogTypes | null) => void;
  editable: boolean;
  stageRef: RefObject<Stage | undefined>;
  hoveredLayerJSON: Record<number, boolean>;
  onChangeHoverJSONItem: (layerId: number, flag: boolean) => void;
  onBack: () => void;
};

export const LeftBar = React.memo(
  ({
    dialog,
    setDialog,
    editable,
    stageRef,
    hoveredLayerJSON,
    onChangeHoverJSONItem,
    onBack,
  }: LeftBarProps) => {
    const showLayers = useSelector(
      (state: RootState) => state.boardReducer.showLayers
    );

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
          {showLayers ? (
            <TitleBar editable={editable} onBack={onBack} />
          ) : (
            <></>
          )}
        </TitleWrapper>
        <Wrapper display="flex">
          <DrawerBar
            dialog={dialog}
            setDialog={setDialog}
            stageRef={stageRef}
            editable={editable}
          />
          {showLayers ? (
            <LayersBar
              setDialog={setDialog}
              editable={editable}
              hoveredLayerJSON={hoveredLayerJSON}
              onChangeHoverJSONItem={onChangeHoverJSONItem}
            />
          ) : (
            <></>
          )}
        </Wrapper>
      </Box>
    );
  }
);

export default LeftBar;

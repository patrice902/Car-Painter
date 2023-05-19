import {
  faCar,
  faFolderOpen,
  faFont,
  faShapes,
} from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Grid,
  MenuItem,
  Select,
  Theme,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LogoIcon from "src/assets/insert-logo.svg";
import { ColorPickerInput } from "src/components/common";
import { FinishOptions } from "src/constant";
import { EnglishLang } from "src/constant/language";
import { colorValidatorWithoutAlpha, focusBoardQuickly } from "src/helper";
import { RootState } from "src/redux";
import { setShowProperties } from "src/redux/reducers/boardReducer";
import { updateScheme } from "src/redux/reducers/schemeReducer";
import { DialogTypes, LayerTypes } from "src/types/enum";

import {
  ColorApplyButton,
  CustomFontAwesomeIcon,
  LayerWrapper,
} from "./LayersBar.style";
import { PartGroup } from "./PartGroup";

export type LayersBarProps = {
  editable: boolean;
  hoveredLayerJSON: Record<number, boolean>;
  onChangeHoverJSONItem: (layerId: number, flag: boolean) => void;
  setDialog: (type: DialogTypes) => void;
};

export const LayersBar = React.memo(
  ({
    setDialog,
    editable,
    hoveredLayerJSON,
    onChangeHoverJSONItem,
  }: LayersBarProps) => {
    const dispatch = useDispatch();
    const isAboveMobile = useMediaQuery((theme: Theme) =>
      theme.breakpoints.up("sm")
    );

    const currentScheme = useSelector(
      (state: RootState) => state.schemeReducer.current
    );
    const layerList = useSelector(
      (state: RootState) => state.layerReducer.list
    );
    const currentCarMake = useSelector(
      (state: RootState) => state.carMakeReducer.current
    );

    const baseColor = useMemo(
      () =>
        currentScheme?.base_color === "transparent"
          ? currentScheme?.base_color
          : "#" + currentScheme?.base_color,
      [currentScheme?.base_color]
    );

    const [colorInput, setColorInput] = useState(baseColor);
    const [colorDirty, setColorDirty] = useState(false);

    const pickerValue = useMemo(
      () => (colorValidatorWithoutAlpha(colorInput) ? colorInput : baseColor),
      [colorInput, baseColor]
    );

    useEffect(() => {
      setColorInput(baseColor);
    }, [baseColor]);

    const handleChangeBasePaintColor = useCallback(
      (color) => {
        if (!currentScheme) return;

        let correctedColor = color;
        if (correctedColor[0] === "#" && correctedColor.length > 7) {
          correctedColor = correctedColor.slice(0, 7);
        }
        let base_color = correctedColor;
        if (base_color !== "transparent") {
          base_color = base_color.replaceAll("#", "");
        }
        dispatch(updateScheme({ id: currentScheme.id, base_color }));
        setColorInput(correctedColor);
        setColorDirty(false);
        focusBoardQuickly();
      },
      [dispatch, currentScheme]
    );

    const handleChangeBasePaintColorInput = useCallback(
      (color) => {
        setColorInput(color);
        if (color !== baseColor) setColorDirty(true);
        else setColorDirty(false);
      },
      [baseColor, setColorInput, setColorDirty]
    );

    const handleApplyBasePaintColor = useCallback(() => {
      if (!currentScheme) return;

      let base_color = colorInput;
      if (base_color !== "transparent") {
        base_color = base_color.replaceAll("#", "");
      }

      dispatch(updateScheme({ id: currentScheme.id, base_color }));
      setColorDirty(false);
      focusBoardQuickly();
    }, [colorInput, dispatch, currentScheme]);

    const handleChangeFinishColor = useCallback(
      (color) => {
        if (!currentScheme) return;

        dispatch(updateScheme({ id: currentScheme.id, finish: color }));
        focusBoardQuickly();
      },
      [currentScheme, dispatch]
    );

    const handleDoubleClickItem = useCallback(() => {
      dispatch(setShowProperties(true));
      focusBoardQuickly();
    }, [dispatch]);

    const showUploadDialog = useCallback(() => setDialog(DialogTypes.UPLOAD), [
      setDialog,
    ]);

    const showLogoDialog = useCallback(() => setDialog(DialogTypes.LOGO), [
      setDialog,
    ]);

    const showTextDialog = useCallback(() => setDialog(DialogTypes.TEXT), [
      setDialog,
    ]);

    const showShapeDialog = useCallback(() => setDialog(DialogTypes.SHAPE), [
      setDialog,
    ]);

    const showBaseDialog = useCallback(() => setDialog(DialogTypes.BASEPAINT), [
      setDialog,
    ]);

    if (!currentScheme) return <></>;

    return (
      <LayerWrapper width="100%" p={isAboveMobile ? "0 12px 0 0" : "8px"}>
        <PartGroup
          title={currentCarMake ? currentCarMake.name : ""}
          layerList={layerList.filter(
            (item) => item.layer_type === LayerTypes.CAR
          )}
          disabled={!editable}
          disableLock={true}
          disableDnd={true}
          hoveredLayerJSON={hoveredLayerJSON}
          onChangeHoverJSONItem={onChangeHoverJSONItem}
          onDoubleClickItem={handleDoubleClickItem}
        />
        <PartGroup
          title="Logos & Text"
          layerList={layerList.filter(
            (item) =>
              item.layer_type === LayerTypes.LOGO ||
              item.layer_type === LayerTypes.TEXT ||
              item.layer_type === LayerTypes.UPLOAD
          )}
          disabled={!editable}
          hoveredLayerJSON={hoveredLayerJSON}
          actions={[
            {
              icon: <CustomFontAwesomeIcon icon={faFolderOpen} />,
              title: EnglishLang.INSERT_MY_LOGO,
              onClick: showUploadDialog,
            },
            {
              icon: (
                <img
                  src={LogoIcon}
                  alt="logo"
                  width={30}
                  style={{ marginLeft: "-3px", marginRight: "8px" }}
                />
              ),
              title: EnglishLang.INSERT_LOGO,
              onClick: showLogoDialog,
            },
            {
              icon: <CustomFontAwesomeIcon icon={faFont} />,
              title: EnglishLang.INSERT_TEXT,
              onClick: showTextDialog,
            },
          ]}
          onChangeHoverJSONItem={onChangeHoverJSONItem}
          onDoubleClickItem={handleDoubleClickItem}
        />
        <PartGroup
          title="Shapes"
          layerList={layerList.filter(
            (item) => item.layer_type === LayerTypes.SHAPE
          )}
          disabled={!editable}
          hoveredLayerJSON={hoveredLayerJSON}
          onChangeHoverJSONItem={onChangeHoverJSONItem}
          onDoubleClickItem={handleDoubleClickItem}
        />
        <PartGroup
          title="Graphics"
          layerList={layerList.filter(
            (item) => item.layer_type === LayerTypes.OVERLAY
          )}
          disabled={!editable}
          hoveredLayerJSON={hoveredLayerJSON}
          onChangeHoverJSONItem={onChangeHoverJSONItem}
          onDoubleClickItem={handleDoubleClickItem}
          actions={[
            {
              icon: faShapes,
              title: EnglishLang.INSERT_GRAPHICS,
              onClick: showShapeDialog,
            },
          ]}
        />
        <PartGroup
          title="Base Paint"
          layerList={layerList.filter(
            (item) => item.layer_type === LayerTypes.BASE
          )}
          disabled={!editable}
          disableLock={true}
          hoveredLayerJSON={hoveredLayerJSON}
          onChangeHoverJSONItem={onChangeHoverJSONItem}
          onDoubleClickItem={handleDoubleClickItem}
          actions={[
            {
              icon: faCar,
              title: EnglishLang.INSERT_BASEPAINT,
              onClick: showBaseDialog,
            },
          ]}
          extraChildren={
            <>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mt={2}
              >
                <ColorPickerInput
                  separateValues={true}
                  valuePicker={pickerValue}
                  value={colorInput}
                  disabled={!editable}
                  fullWidth={false}
                  onChange={handleChangeBasePaintColor}
                  onInputChange={handleChangeBasePaintColorInput}
                />
                {colorDirty && colorValidatorWithoutAlpha(colorInput) ? (
                  <ColorApplyButton
                    onClick={handleApplyBasePaintColor}
                    variant="outlined"
                  >
                    Apply
                  </ColorApplyButton>
                ) : !colorValidatorWithoutAlpha(colorInput) ? (
                  <Typography color="secondary" variant="body2">
                    Invalid Color
                  </Typography>
                ) : (
                  <></>
                )}
              </Box>
              {!currentScheme.hide_spec && currentCarMake?.car_type !== "Misc" && (
                <Grid container spacing={2} component={Box} mt={2}>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center" height="100%">
                      <Typography
                        variant="body1"
                        color="textSecondary"
                        style={{ marginRight: "8px" }}
                      >
                        Finish
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Select
                      name="layer_data.finish"
                      variant="outlined"
                      value={currentScheme.finish || FinishOptions[0].value}
                      disabled={!editable}
                      onChange={(event) =>
                        handleChangeFinishColor(event.target.value)
                      }
                      onClose={focusBoardQuickly}
                      fullWidth
                    >
                      {FinishOptions.map((finishItem, index) => (
                        <MenuItem value={finishItem.value} key={index}>
                          {finishItem.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>
              )}
            </>
          }
        />
      </LayerWrapper>
    );
  }
);

export default LayersBar;

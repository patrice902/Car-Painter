import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  ImageListItemBar,
  Theme,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import _ from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ImageWithLoad,
  SearchBox,
  SVGImageWithLoad,
} from "src/components/common";
import { generateCarMakeImageURL } from "src/helper";
import { useScheme } from "src/hooks";
import { RootState } from "src/redux";
import {
  cloneCarPartsLayer,
  setCurrent as setCurrentLayer,
} from "src/redux/reducers/layerReducer";
import { CarObjLayerData } from "src/types/common";
import { LayerTypes } from "src/types/enum";
import { BuilderLayerJSON } from "src/types/query";

import {
  CustomDialogContent,
  CustomImageList,
  CustomImageListItem,
} from "./CloneCarPartsDialog.style";

type OverlayDialogProps = {
  open: boolean;
  onCancel: () => void;
};

export const CloneCarPartsDialog = React.memo(
  ({ onCancel, open }: OverlayDialogProps) => {
    const dispatch = useDispatch();
    const isAboveMobile = useMediaQuery((theme: Theme) =>
      theme.breakpoints.up("sm")
    );

    const { legacyMode } = useScheme();

    const layerList = useSelector(
      (state: RootState) => state.layerReducer.list
    );
    const carMake = useSelector(
      (state: RootState) => state.carMakeReducer.current
    );

    const [cloningCarParts, setCloningCarParts] = useState(false);
    const [selectedCarParts, setSelectedCarParts] = useState<
      BuilderLayerJSON<CarObjLayerData>[]
    >([]);
    const [search, setSearch] = useState("");

    const carPartLayers = useMemo(
      () =>
        _.orderBy(
          layerList.filter((item) => item.layer_type === LayerTypes.CAR),
          ["layer_order"],
          ["desc"]
        ) as BuilderLayerJSON<CarObjLayerData>[],
      [layerList]
    );

    const filteredCarPartLayers = useMemo(
      () =>
        search?.length
          ? carPartLayers.filter((item) =>
              item.layer_data.name.toLowerCase().includes(search.toLowerCase())
            )
          : carPartLayers,
      [carPartLayers, search]
    );

    const cloneBtnText = useMemo(
      () =>
        selectedCarParts.length
          ? `Clone ${selectedCarParts.length} layer${
              selectedCarParts.length > 1 ? "s" : ""
            }`
          : "Clone",
      [selectedCarParts]
    );

    const getCarMakeImage = useCallback(
      (layer_data: CarObjLayerData) =>
        generateCarMakeImageURL(layer_data, carMake, legacyMode),
      [legacyMode, carMake]
    );

    const handleToggleCarPart = (
      carPart: BuilderLayerJSON<CarObjLayerData>
    ) => {
      if (selectedCarParts.find((item) => item.id === carPart.id)) {
        setSelectedCarParts((prev) =>
          prev.filter((item) => item.id !== carPart.id)
        );
      } else {
        setSelectedCarParts((prev) => [...prev, carPart]);
      }
    };

    const handleClose = useCallback(() => {
      setSelectedCarParts([]);
      onCancel();
    }, [onCancel]);

    const handleApply = useCallback(() => {
      setCloningCarParts(true);
      dispatch(
        cloneCarPartsLayer(selectedCarParts, legacyMode, (clonedLayers) => {
          if (clonedLayers) {
            dispatch(setCurrentLayer(clonedLayers[0]));
          }
          setCloningCarParts(false);
          handleClose();
        })
      );
    }, [dispatch, selectedCarParts, legacyMode, handleClose]);

    const handleSearchChange = useCallback((value) => setSearch(value), []);

    return (
      <Dialog
        aria-labelledby="clone-carparts-title"
        open={open}
        onClose={handleClose}
      >
        <DialogTitle id="clone-carparts-title">Clone Car Parts</DialogTitle>
        <CustomDialogContent dividers>
          <Box
            bgcolor="#666"
            p="10px 16px"
            borderRadius={10}
            border="2px solid navajowhite"
            position="relative"
            mb="10px"
          >
            <Typography>
              Select Car Parts layers to duplicate as editable layers.
            </Typography>
          </Box>
          <Box mb={2}>
            <SearchBox value={search} onChange={handleSearchChange} />
          </Box>
          <Box
            id="clone-carparts-dialog-content"
            overflow="auto"
            height="min(700px, calc(100vh - 300px))"
          >
            <CustomImageList
              rowHeight="auto"
              cols={isAboveMobile ? 3 : 1}
              gap={10}
            >
              {filteredCarPartLayers.map((carPart) => (
                <CustomImageListItem
                  key={carPart.id}
                  cols={1}
                  active={Boolean(
                    selectedCarParts.find((item) => item.id === carPart.id)
                  )}
                  onClick={() => handleToggleCarPart(carPart)}
                >
                  {carPart.layer_data.img.includes(".svg") ? (
                    <SVGImageWithLoad
                      src={getCarMakeImage(carPart.layer_data)}
                      alt={carPart.layer_data.name}
                    />
                  ) : (
                    <ImageWithLoad
                      src={getCarMakeImage(carPart.layer_data)}
                      alt={carPart.layer_data.name}
                      height="100%"
                      maxHeight="250px"
                    />
                  )}
                  <ImageListItemBar title={carPart.layer_data.name} />
                </CustomImageListItem>
              ))}
            </CustomImageList>
          </Box>
        </CustomDialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            color="primary"
            variant="outlined"
            onClick={handleApply}
            disabled={!selectedCarParts.length}
            style={{ marginLeft: "10px" }}
          >
            {cloningCarParts ? <CircularProgress size={20} /> : cloneBtnText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

export default CloneCarPartsDialog;

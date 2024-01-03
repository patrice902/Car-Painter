import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  ImageListItemBar,
  Theme,
  useMediaQuery,
} from "@material-ui/core";
import _ from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import {
  ImageWithLoad,
  Loader,
  SearchBox,
  SVGImageWithLoad,
} from "src/components/common";
import config from "src/config";
import { stopPropagation } from "src/helper";
import { RootState } from "src/redux";
import {
  createFavoriteOverlay,
  deleteFavoriteOverlayItem,
} from "src/redux/reducers/overlayReducer";
import { BuilderOverlay } from "src/types/model";

import {
  CategoryText,
  CustomDialogContent,
  CustomImageList,
  CustomImageListItem,
  faStarOff,
  faStarOn,
} from "./OverlayDialog.style";

type OverlayDialogProps = {
  overlays: BuilderOverlay[];
  open: boolean;
  onCancel: () => void;
  onOpenOverlay: (overlay: BuilderOverlay) => void;
};

export const OverlayDialog = React.memo(
  ({ overlays, onCancel, open, onOpenOverlay }: OverlayDialogProps) => {
    const dispatch = useDispatch();
    const step = 40;
    const [limit, setLimit] = useState(step);
    const [search, setSearch] = useState("");

    const isAboveMobile = useMediaQuery((theme: Theme) =>
      theme.breakpoints.up("sm")
    );

    const guide_data = useSelector(
      (state: RootState) => state.schemeReducer.current?.guide_data
    );
    const user = useSelector((state: RootState) => state.authReducer.user);
    const favoriteOverlayList = useSelector(
      (state: RootState) => state.overlayReducer.favoriteOverlayList
    );

    const favoriteOverlayIDs = useMemo(
      () => favoriteOverlayList.map((overlay) => overlay.overlay_id),
      [favoriteOverlayList]
    );

    const filteredOverlays = useMemo(
      () =>
        _.orderBy(overlays, ["name"], ["asc"]).filter(
          (item) =>
            !item.legacy_mode &&
            (item.name.toLowerCase().includes(search.toLowerCase()) ||
              item.description.toLowerCase().includes(search.toLowerCase()))
        ),
      [overlays, search]
    );

    const favoriteFilteredOverlays = useMemo(
      () =>
        filteredOverlays.filter((overlay) =>
          favoriteOverlayIDs.includes(overlay.id)
        ),
      [favoriteOverlayIDs, filteredOverlays]
    );

    const increaseData = useCallback(() => {
      setLimit(limit + step);
    }, [limit, step, setLimit]);

    const handleSearchChange = useCallback((value) => setSearch(value), []);

    const handleClickAddFavorite = useCallback(
      (event, overlay: BuilderOverlay) => {
        stopPropagation(event);

        if (!user) return;

        dispatch(
          createFavoriteOverlay({ overlay_id: overlay.id, user_id: user.id })
        );
      },
      [dispatch, user]
    );

    const handleClickRemoveFavorite = useCallback(
      (event, overlay: BuilderOverlay) => {
        stopPropagation(event);

        const favoriteLogoItem = favoriteOverlayList.find(
          (item) => item.overlay_id === overlay.id
        );

        if (!favoriteLogoItem) return;

        dispatch(deleteFavoriteOverlayItem(favoriteLogoItem.id));
      },
      [dispatch, favoriteOverlayList]
    );

    const renderOvelayList = (overlayList: BuilderOverlay[]) => (
      <CustomImageList rowHeight="auto" cols={isAboveMobile ? 3 : 1} gap={10}>
        {overlayList.map((shape) => {
          const isFavorite = favoriteOverlayIDs.includes(shape.id);

          return (
            <CustomImageListItem
              key={shape.id}
              cols={1}
              onClick={() => onOpenOverlay(shape)}
            >
              {shape.overlay_thumb.includes(".svg") ? (
                <SVGImageWithLoad
                  src={`${config.assetsURL}/${shape.overlay_thumb}`}
                  alt={shape.name}
                  options={{
                    color: guide_data?.default_shape_color,
                    opacity: guide_data?.default_shape_opacity || 1,
                    stroke: guide_data?.default_shape_scolor,
                    strokeWidth:
                      (guide_data?.default_shape_stroke ?? 1) *
                      shape.stroke_scale,
                  }}
                />
              ) : (
                <ImageWithLoad
                  src={`${config.assetsURL}/${shape.overlay_thumb}`}
                  alt={shape.name}
                  height="100%"
                  maxHeight="250px"
                />
              )}
              <ImageListItemBar
                position="top"
                actionIcon={
                  <IconButton
                    color="secondary"
                    onClick={(event) =>
                      isFavorite
                        ? handleClickRemoveFavorite(event, shape)
                        : handleClickAddFavorite(event, shape)
                    }
                  >
                    <FontAwesomeIcon
                      icon={isFavorite ? faStarOn : faStarOff}
                      size="sm"
                    />
                  </IconButton>
                }
              />
            </CustomImageListItem>
          );
        })}
      </CustomImageList>
    );

    return (
      <Dialog aria-labelledby="shape-title" open={open} onClose={onCancel}>
        <DialogTitle id="shape-title">Insert Graphics</DialogTitle>
        <CustomDialogContent dividers>
          <Box mb={2}>
            <SearchBox value={search} onChange={handleSearchChange} />
          </Box>
          <Box
            id="shape-dialog-content"
            overflow="auto"
            height="min(700px, calc(100vh - 300px))"
          >
            <InfiniteScroll
              dataLength={limit} //This is important field to render the next data
              next={increaseData}
              hasMore={limit < filteredOverlays.length}
              loader={<Loader />}
              scrollableTarget="shape-dialog-content"
            >
              {favoriteFilteredOverlays.length ? (
                <>
                  <CategoryText color="secondary">Favorite</CategoryText>
                  {renderOvelayList(favoriteFilteredOverlays)}
                  <CategoryText color="secondary">All</CategoryText>
                </>
              ) : (
                <></>
              )}
              {renderOvelayList(
                filteredOverlays.slice(
                  0,
                  Math.max(limit - favoriteFilteredOverlays.length, 4)
                )
              )}
            </InfiniteScroll>
          </Box>
        </CustomDialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

export default OverlayDialog;

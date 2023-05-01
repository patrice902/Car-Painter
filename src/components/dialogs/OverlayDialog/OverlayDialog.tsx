import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Theme,
  useMediaQuery,
} from "@material-ui/core";
import _ from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import {
  ImageWithLoad,
  Loader,
  SearchBox,
  SVGImageWithLoad,
} from "src/components/common";
import config from "src/config";
import { RootState } from "src/redux";
import { BuilderOverlay } from "src/types/model";

import {
  CustomDialogContent,
  CustomImageList,
  CustomImageListItem,
} from "./OverlayDialog.style";

type OverlayDialogProps = {
  overlays: BuilderOverlay[];
  open: boolean;
  onCancel: () => void;
  onOpenOverlay: (overlay: BuilderOverlay) => void;
};

export const OverlayDialog = React.memo(
  ({ overlays, onCancel, open, onOpenOverlay }: OverlayDialogProps) => {
    const step = 40;
    const [limit, setLimit] = useState(step);
    const [search, setSearch] = useState("");

    const isAboveMobile = useMediaQuery((theme: Theme) =>
      theme.breakpoints.up("sm")
    );

    const guide_data = useSelector(
      (state: RootState) => state.schemeReducer.current?.guide_data
    );

    const increaseData = useCallback(() => {
      setLimit(limit + step);
    }, [limit, step, setLimit]);

    const handleSearchChange = useCallback((value) => setSearch(value), []);

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
              <CustomImageList
                rowHeight="auto"
                cols={isAboveMobile ? 3 : 1}
                gap={10}
              >
                {filteredOverlays.slice(0, limit).map((shape) => (
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
                      />
                    )}
                  </CustomImageListItem>
                ))}
              </CustomImageList>
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

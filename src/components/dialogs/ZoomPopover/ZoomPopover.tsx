import {
  Box,
  Button,
  InputAdornment,
  OutlinedInput,
  Popover,
  Typography,
} from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";

type ZoomPopoverProps = {
  anchorEl: HTMLElement | null;
  zoom: number;
  setZoom: (zoom: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomFit: () => void;
  onClose: () => void;
};

export const ZoomPopover = React.memo(
  ({
    anchorEl,
    zoom,
    setZoom,
    onZoomIn,
    onZoomOut,
    onZoomFit,
    onClose,
  }: ZoomPopoverProps) => {
    const handleZoomKeyDown = useCallback(
      (event) => {
        if (event.keyCode === 13) {
          event.preventDefault();
          onClose();
        }
      },
      [onClose]
    );
    const [innerValue, setInnerValue] = useState((zoom * 100).toFixed(2));

    const handleZoomChange = useCallback(
      (event) => {
        setZoom(parseInt(event.target.value || 0) / 100.0);
      },
      [setZoom]
    );

    const handleFocus = useCallback((event) => event.target.select(), []);

    const handleZoom100 = useCallback(() => {
      setZoom(1);
    }, [setZoom]);

    useEffect(() => {
      setInnerValue((zoom * 100).toFixed(2));
    }, [zoom]);

    return (
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Box display="flex" flexDirection="column" p={4} width="200px">
          <Button onClick={onZoomIn}>
            <Box
              component="p"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              margin={0}
              width="100%"
            >
              <Typography variant="subtitle2">Zoom in</Typography>
              <Typography variant="subtitle2">Shift +</Typography>
            </Box>
          </Button>

          <Button onClick={onZoomOut}>
            <Box
              component="p"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              margin={0}
              width="100%"
            >
              <Typography variant="subtitle2">Zoom out</Typography>
              <Typography variant="subtitle2">Shift -</Typography>
            </Box>
          </Button>

          <Button onClick={onZoomFit}>
            <Box
              component="p"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              margin={0}
              width="100%"
            >
              <Typography variant="subtitle2">Zoom to fit</Typography>
              <Typography variant="subtitle2">Shift 9</Typography>
            </Box>
          </Button>

          <Button onClick={handleZoom100} style={{ marginBottom: "4px" }}>
            <Box
              component="p"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              margin={0}
              width="100%"
            >
              <Typography variant="subtitle2">Zoom to 100%</Typography>
              <Typography variant="subtitle2">Shift 0</Typography>
            </Box>
          </Button>

          <OutlinedInput
            id="zoom-value"
            value={innerValue}
            onChange={(e) => setInnerValue(e.target.value)}
            onBlur={handleZoomChange}
            onFocus={handleFocus}
            onKeyDown={handleZoomKeyDown}
            endAdornment={<InputAdornment position="end">%</InputAdornment>}
            labelWidth={0}
            fullWidth
            autoFocus={true}
          />
        </Box>
      </Popover>
    );
  }
);

export default ZoomPopover;

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@material-ui/core";
import { Check, Warning } from "@material-ui/icons";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NumberModSwitch } from "src/components/common";
import { isWindows } from "src/helper";
import { RootState } from "src/redux";
import { getDownloaderStatus } from "src/redux/reducers/downloaderReducer";
import styled from "styled-components";

type SimPreviewGuideDialogProps = {
  open: boolean;
  applying: boolean;
  onApply: (isCustomNumber: boolean) => void;
  onCancel: () => void;
};

export const SimPreviewGuideDialog = React.memo(
  ({ open, applying, onApply, onCancel }: SimPreviewGuideDialogProps) => {
    const dispatch = useDispatch();
    const currentCarMake = useSelector(
      (state: RootState) => state.carMakeReducer.current
    );
    const currentScheme = useSelector(
      (state: RootState) => state.schemeReducer.current
    );
    const iracing = useSelector(
      (state: RootState) => state.downloaderReducer.iracing
    );
    const downloaderChecking = useSelector(
      (state: RootState) => state.downloaderReducer.loading
    );
    const [isCustomNumber, setIsCustomNumber] = useState(
      currentScheme?.last_number
    );

    const handleSubmit = useCallback(() => {
      onApply(Boolean(isCustomNumber));
    }, [isCustomNumber, onApply]);

    const handleCheckDownloader = useCallback(() => {
      if (isWindows()) {
        dispatch(getDownloaderStatus());
      }
    }, [dispatch]);

    useEffect(() => {
      setIsCustomNumber(currentScheme?.last_number);
    }, [currentScheme?.last_number]);

    return (
      <Dialog open={open} onClose={onCancel} fullWidth maxWidth="md">
        <DialogTitle>Sim Preview</DialogTitle>
        <DialogContent dividers id="seam-preview-dialog-content">
          <Typography>
            Preview your Paint Builder project in iRacing’s 3D car model viewer.
          </Typography>
          <Box>
            <ol>
              <Typography component="li">
                Ensure{" "}
                <a
                  href="https://www.tradingpaints.com/install"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#f48fb1", textDecoration: "none" }}
                >
                  Trading Paints Downloader
                </a>{" "}
                is installed and running, and that your firewall & network
                settings allow Downloader to communicate.
                {iracing ? (
                  <Check
                    style={{ color: "#f48fb1", margin: "0 0 -5px 10px" }}
                  />
                ) : (
                  <Button
                    variant="outlined"
                    color="secondary"
                    disabled={downloaderChecking}
                    onClick={handleCheckDownloader}
                    style={{ marginLeft: "4px" }}
                  >
                    {downloaderChecking ? (
                      <CircularProgress
                        size={17}
                        style={{ color: "#f48fb1" }}
                      />
                    ) : (
                      <Typography variant="body2">CHECK</Typography>
                    )}
                  </Button>
                )}
              </Typography>
              <Typography component="li">
                <a
                  href="https://iracing.link/owned/cars"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#f48fb1", textDecoration: "none" }}
                >
                  Open the iRacing UI
                </a>{" "}
                and select {currentCarMake?.name} from the My Content → Cars
                menu.
              </Typography>
              <Typography component="li">
                Select the Car Model tab to open iRacing’s 3D car viewer.
              </Typography>
              <Typography component="li">
                Choose Sim-Stamped Number or Custom Number below, then press
                Update to load the project into the iRacing UI.
              </Typography>
            </ol>
          </Box>
          <TipTypography>
            Tip: You can also press the <KeyText>P</KeyText> key in Paint
            Builder to update your changes in the iRacing UI.
          </TipTypography>
          {iracing ? (
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              spacing={1}
            >
              <CustomGrid item onClick={() => setIsCustomNumber(0)}>
                <Typography>Sim-Stamped Number</Typography>
              </CustomGrid>
              <Grid item>
                <NumberModSwitch
                  checked={isCustomNumber ? true : false}
                  onChange={(event) =>
                    setIsCustomNumber(event.target.checked ? 1 : 0)
                  }
                  name="number"
                />
              </Grid>
              <CustomGrid item onClick={() => setIsCustomNumber(1)}>
                <Typography>Custom Number</Typography>
              </CustomGrid>
            </Grid>
          ) : (
            <></>
          )}
        </DialogContent>
        <DialogActions style={{ justifyContent: "space-between" }}>
          <Typography
            style={{
              display: "flex",
              alignItems: "center",
              color: iracing ? "#76ff03" : "white",
            }}
          >
            {iracing ? (
              <Check
                style={{
                  marginRight: "4px",
                  marginLeft: "8px",
                  fontSize: "20px",
                }}
              />
            ) : (
              <Warning
                style={{
                  marginRight: "4px",
                  marginLeft: "8px",
                  fontSize: "20px",
                }}
              />
            )}{" "}
            {iracing === false
              ? "Trading Paints downloader program is running but you are not in a iRacing session"
              : !iracing
              ? "Trading Paints downloader program is not running"
              : "Trading Paints downloader program is running"}
          </Typography>
          <Box display="flex" alignItems="center">
            <Button onClick={onCancel} color="secondary">
              Close
            </Button>
            {iracing ? (
              <Button
                color="primary"
                variant="outlined"
                onClick={handleSubmit}
                style={{ marginLeft: "10px" }}
              >
                {applying ? <CircularProgress size={20} /> : "Update"}
              </Button>
            ) : (
              <></>
            )}
          </Box>
        </DialogActions>
      </Dialog>
    );
  }
);

const CustomGrid = styled(Grid)`
  cursor: pointer;
`;

export const TipTypography = styled(Typography)`
  align-items: center;
`;

export const KeyText = styled(Typography)`
  display: inline-flex;
  color: #ca812c;
  background: #000000;
  width: fit-content;
  padding: 0px 10px;
  border-radius: 3px;
  font-family: AkkuratMonoLLWeb-Regular;
`;

export default SimPreviewGuideDialog;

import React, { useState, useMemo, useCallback } from "react";

import {
  Accordion,
  AccordionDetails,
  Box,
  Typography,
  Grid,
  IconButton,
} from "components/MaterialUI";
import {
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@material-ui/icons";
import { CustomAccordionSummary } from "./styles";
import { LabelTypography } from "pages/scheme/components/PropertyBar/PropertyBar.style";
import { focusBoardQuickly } from "helper";
import {
  FormColorPickerInput,
  FormSliderInput,
} from "pages/scheme/components/PropertyBar/components";

export const SubForm = React.memo((props) => {
  const {
    label,
    editable,
    colorKey,
    opacityKey,
    errors,
    values,
    extraChildren,
    guideID,
    paintingGuides,
    onToggleGuideVisible,
    onSchemeUpdate,
    onSchemeUpdateOnly,
  } = props;
  const [expanded, setExpanded] = useState(true);
  const guideVisible = useMemo(
    () =>
      paintingGuides && guideID
        ? paintingGuides.indexOf(guideID) !== -1
        : false,
    [guideID, paintingGuides]
  );

  const handleToggleGuideVisible = useCallback(
    () => onToggleGuideVisible(guideID),
    [guideID, onToggleGuideVisible]
  );

  return (
    <Accordion
      expanded={expanded}
      onChange={() => {
        setExpanded(!expanded);
        focusBoardQuickly();
      }}
    >
      <CustomAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">{label}</Typography>
      </CustomAccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" width="100%" my={1}>
          <Grid container spacing={2}>
            {guideID ? (
              <Grid
                item
                xs={12}
                sm={12}
                component={Box}
                height="40px"
                width="100%"
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <LabelTypography variant="body1" color="textSecondary" mr={2}>
                  Visibility
                </LabelTypography>
                <IconButton
                  disabled={!editable}
                  onClick={handleToggleGuideVisible}
                  size="small"
                  style={{ padding: "9px" }}
                >
                  {guideVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </Grid>
            ) : (
              <></>
            )}
            {colorKey || opacityKey ? (
              <>
                {colorKey ? (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    component={Box}
                    height="40px"
                    width="100%"
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <LabelTypography
                      variant="body1"
                      color="textSecondary"
                      mr={2}
                    >
                      Color
                    </LabelTypography>
                    <Box pr="9px">
                      <FormColorPickerInput
                        disabled={!editable}
                        fieldKey={colorKey}
                        value={values[colorKey]}
                        error={Boolean(errors[colorKey])}
                        helperText={errors[colorKey]}
                        onUpdateField={onSchemeUpdateOnly}
                        onUpdateDB={onSchemeUpdate}
                      />
                    </Box>
                  </Grid>
                ) : (
                  <></>
                )}
                {opacityKey ? (
                  <Grid item xs={12} sm={12} component={Box} height="40px">
                    <Box pr="9px">
                      <FormSliderInput
                        label="Opacity"
                        fieldKey={opacityKey}
                        disabled={!editable}
                        min={0.0}
                        max={1.0}
                        step={0.1}
                        marks
                        value={values[opacityKey]}
                        onUpdateField={onSchemeUpdateOnly}
                        onUpdateDB={onSchemeUpdate}
                      />
                    </Box>
                  </Grid>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
            {extraChildren}
          </Grid>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
});

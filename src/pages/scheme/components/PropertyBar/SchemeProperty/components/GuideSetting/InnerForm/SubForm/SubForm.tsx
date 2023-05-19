import {
  Accordion,
  AccordionDetails,
  Box,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import {
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@material-ui/icons";
import { FormikProps } from "formik";
import React, { useCallback, useMemo, useState } from "react";
import { focusBoardQuickly } from "src/helper";
import {
  FormColorPickerInput,
  FormSliderInput,
} from "src/pages/scheme/components/PropertyBar/components";
import { LabelTypography } from "src/pages/scheme/components/PropertyBar/PropertyBar.style";
import { ValueMap } from "src/types/common";

import { GuideSettingFormValues } from "../model";
import { CustomAccordionSummary } from "./styles";

type SubFormProps = {
  label: string;
  editable: boolean;
  colorKey?: string;
  opacityKey?: string;
  errors: Record<string, string>;
  extraChildren?: React.ReactNode;
  guideID?: string;
  paintingGuides?: string[];
  onToggleGuideVisible?: (guideID: string) => void;
  onSchemeUpdate: (valueMap: ValueMap) => void;
  onSchemeUpdateOnly: (valueMap: ValueMap) => void;
} & FormikProps<GuideSettingFormValues>;

export const SubForm = React.memo(
  ({
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
  }: SubFormProps) => {
    const [expanded, setExpanded] = useState(true);
    const guideVisible = useMemo(
      () =>
        paintingGuides && guideID
          ? paintingGuides.indexOf(guideID) !== -1
          : false,
      [guideID, paintingGuides]
    );

    const handleToggleGuideVisible = useCallback(
      () => guideID && onToggleGuideVisible?.(guideID),
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
                  alignItems="center"
                  justifyContent="space-between"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    height: "40px",
                    width: "100%",
                  }}
                >
                  <LabelTypography
                    variant="body1"
                    color="textSecondary"
                    style={{ marginRight: "8px" }}
                  >
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
                      alignItems="center"
                      justifyContent="space-between"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        height: "40px",
                        width: "100%",
                      }}
                    >
                      <LabelTypography
                        variant="body1"
                        color="textSecondary"
                        style={{ marginRight: "8px" }}
                      >
                        Color
                      </LabelTypography>
                      <Box pr="9px">
                        <FormColorPickerInput
                          disabled={!editable}
                          fieldKey={colorKey}
                          value={
                            values[
                              colorKey as keyof GuideSettingFormValues
                            ] as string
                          }
                          error={Boolean(errors[colorKey])}
                          helperText={errors[colorKey]}
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
                          value={
                            +values[opacityKey as keyof GuideSettingFormValues]
                          }
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
  }
);

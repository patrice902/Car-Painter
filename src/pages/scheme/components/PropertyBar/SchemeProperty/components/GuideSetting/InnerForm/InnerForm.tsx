import { Box, Button, Grid } from "@material-ui/core";
import { Form, FormikProps } from "formik";
import _ from "lodash";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LightTooltip } from "src/components/common";
import { CloneCarPartsDialog } from "src/components/dialogs/CloneCarPartsDialog";
import {
  FormCheckbox,
  FormSliderInput,
} from "src/pages/scheme/components/PropertyBar/components";
import { RootState } from "src/redux";
import { setPaintingGuides } from "src/redux/reducers/boardReducer";
import {
  setCurrent as setCurrentScheme,
  updateScheme,
} from "src/redux/reducers/schemeReducer";

import { GuideSettingFormValues } from "./model";
import { CustomFormControlLabel } from "./styles";
import { SubForm } from "./SubForm";

type InnerFormProps = {
  editable: boolean;
} & FormikProps<GuideSettingFormValues>;

export const InnerForm = React.memo(
  ({ editable, ...formProps }: InnerFormProps) => {
    const dispatch = useDispatch();

    const currentScheme = useSelector(
      (state: RootState) => state.schemeReducer.current
    );
    const paintingGuides = useSelector(
      (state: RootState) => state.boardReducer.paintingGuides
    );

    const [openCloneCarPartsDialog, setOpenCloneCarPartsDialog] = useState(
      false
    );

    const setMultiFieldValue = useCallback(
      (valueMap) => {
        for (const itemKey of Object.keys(valueMap)) {
          formProps.setFieldValue(itemKey, valueMap[itemKey]);
        }
      },
      [formProps]
    );

    const handleSchemeUpdate = useCallback(
      (guide_data) => {
        if (!currentScheme) return;

        dispatch(
          updateScheme({
            id: currentScheme.id,
            guide_data,
          })
        );
      },
      [dispatch, currentScheme]
    );

    const handleSchemeUpdateOnly = useCallback(
      (guide_data) => {
        if (!currentScheme) return;

        setMultiFieldValue(guide_data);
        dispatch(
          setCurrentScheme({
            id: currentScheme.id,
            guide_data,
          })
        );
      },
      [setMultiFieldValue, dispatch, currentScheme]
    );

    const handleTogglePaintingGuide = useCallback(
      (guideItem) => {
        const index = paintingGuides.indexOf(guideItem);
        const newGuide = [...paintingGuides];
        if (index === -1) newGuide.push(guideItem);
        else newGuide.splice(index, 1);
        dispatch(setPaintingGuides(newGuide));
      },
      [dispatch, paintingGuides]
    );

    return (
      <Form onSubmit={formProps.handleSubmit} noValidate>
        <Box height="100%" overflow="auto">
          <SubForm
            guideID="car-mask"
            label="Car Mask"
            colorKey="carmask_color"
            opacityKey="carmask_opacity"
            editable={editable}
            paintingGuides={paintingGuides}
            onSchemeUpdateOnly={handleSchemeUpdateOnly}
            onSchemeUpdate={handleSchemeUpdate}
            onToggleGuideVisible={handleTogglePaintingGuide}
            {...formProps}
          />
          <SubForm
            guideID="wireframe"
            label="Wireframe"
            colorKey="wireframe_color"
            opacityKey="wireframe_opacity"
            editable={editable}
            paintingGuides={paintingGuides}
            onSchemeUpdateOnly={handleSchemeUpdateOnly}
            onSchemeUpdate={handleSchemeUpdate}
            onToggleGuideVisible={handleTogglePaintingGuide}
            {...formProps}
            extraChildren={
              <Grid item xs={12} sm={12}>
                <LightTooltip
                  title="Automatically display the wireframe guide when actively moving, resizing, or rotating a layer"
                  arrow
                >
                  <CustomFormControlLabel
                    control={
                      <FormCheckbox
                        color="primary"
                        name="show_wireframe"
                        fieldKey="show_wireframe"
                        checked={formProps.values.show_wireframe}
                        disabled={!editable}
                        onUpdateField={handleSchemeUpdateOnly}
                        onUpdateDB={handleSchemeUpdate}
                      />
                    }
                    label="Show when editing"
                    labelPlacement="start"
                  />
                </LightTooltip>
              </Grid>
            }
          />
          <SubForm
            guideID="sponsor-blocks"
            label="Sponsor Blocks"
            colorKey="sponsor_color"
            opacityKey="sponsor_opacity"
            editable={editable}
            paintingGuides={paintingGuides}
            onSchemeUpdateOnly={handleSchemeUpdateOnly}
            onSchemeUpdate={handleSchemeUpdate}
            onToggleGuideVisible={handleTogglePaintingGuide}
            {...formProps}
            extraChildren={
              <>
                <Grid item xs={12} sm={12}>
                  <LightTooltip
                    title="Automatically display the sponsor blocks guide when actively moving, resizing, or rotating a layer"
                    arrow
                  >
                    <CustomFormControlLabel
                      control={
                        <FormCheckbox
                          color="primary"
                          name="show_sponsor"
                          fieldKey="show_sponsor"
                          checked={formProps.values.show_sponsor}
                          disabled={!editable}
                          onUpdateField={handleSchemeUpdateOnly}
                          onUpdateDB={handleSchemeUpdate}
                        />
                      }
                      label="Show when editing"
                      labelPlacement="start"
                    />
                  </LightTooltip>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <LightTooltip
                    title="If checked, when the sponsor blocks guide is visible, it will appear on top of all the layers"
                    arrow
                  >
                    <CustomFormControlLabel
                      control={
                        <FormCheckbox
                          color="primary"
                          name="show_sponsor_block_on_top"
                          fieldKey="show_sponsor_block_on_top"
                          checked={formProps.values.show_sponsor_block_on_top}
                          disabled={!editable}
                          onUpdateField={handleSchemeUpdateOnly}
                          onUpdateDB={handleSchemeUpdate}
                        />
                      }
                      label={`Display above layers`}
                      labelPlacement="start"
                    />
                  </LightTooltip>
                </Grid>
              </>
            }
          />
          <SubForm
            guideID="number-blocks"
            label="Number Blocks"
            colorKey="numberblock_color"
            opacityKey="numberblock_opacity"
            editable={editable}
            paintingGuides={paintingGuides}
            onSchemeUpdateOnly={handleSchemeUpdateOnly}
            onSchemeUpdate={handleSchemeUpdate}
            onToggleGuideVisible={handleTogglePaintingGuide}
            {...formProps}
            extraChildren={
              <>
                <Grid item xs={12} sm={12}>
                  <LightTooltip
                    title="Automatically display the number blocks guide when actively moving, resizing, or rotating a layer"
                    arrow
                  >
                    <CustomFormControlLabel
                      control={
                        <FormCheckbox
                          color="primary"
                          name="show_numberBlocks"
                          fieldKey="show_numberBlocks"
                          checked={formProps.values.show_numberBlocks}
                          disabled={!editable}
                          onUpdateField={handleSchemeUpdateOnly}
                          onUpdateDB={handleSchemeUpdate}
                        />
                      }
                      label="Show when editing"
                      labelPlacement="start"
                    />
                  </LightTooltip>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <LightTooltip
                    title="If checked, when the number blocks guide is visible, it will appear on top of all the layers"
                    arrow
                  >
                    <CustomFormControlLabel
                      control={
                        <FormCheckbox
                          color="primary"
                          name="show_number_block_on_top"
                          fieldKey="show_number_block_on_top"
                          checked={formProps.values.show_number_block_on_top}
                          disabled={!editable}
                          onUpdateField={handleSchemeUpdateOnly}
                          onUpdateDB={handleSchemeUpdate}
                        />
                      }
                      label={`Display above layers`}
                      labelPlacement="start"
                    />
                  </LightTooltip>
                </Grid>
              </>
            }
          />
          <SubForm
            guideID="grid"
            label="Grid"
            colorKey="grid_color"
            opacityKey="grid_opacity"
            editable={editable}
            paintingGuides={paintingGuides}
            onSchemeUpdateOnly={handleSchemeUpdateOnly}
            onSchemeUpdate={handleSchemeUpdate}
            onToggleGuideVisible={handleTogglePaintingGuide}
            {...formProps}
            extraChildren={
              <>
                <Grid item xs={12} sm={12} component={Box} height="40px">
                  <Box pr="9px">
                    <FormSliderInput
                      label="Column Size"
                      fieldKey="grid_padding"
                      min={5}
                      max={50}
                      step={1}
                      value={formProps.values.grid_padding}
                      disabled={!editable}
                      onUpdateField={handleSchemeUpdateOnly}
                      onUpdateDB={handleSchemeUpdate}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} component={Box} height="40px">
                  <Box pr="9px">
                    <FormSliderInput
                      label="Stroke Width"
                      fieldKey="grid_stroke"
                      min={0.01}
                      max={3}
                      step={0.01}
                      value={formProps.values.grid_stroke}
                      disabled={!editable}
                      onUpdateField={handleSchemeUpdateOnly}
                      onUpdateDB={handleSchemeUpdate}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <LightTooltip
                    title="Automatically display the grid guide when actively moving, resizing, or rotating a layer"
                    arrow
                  >
                    <CustomFormControlLabel
                      control={
                        <FormCheckbox
                          color="primary"
                          name="show_grid"
                          fieldKey="show_grid"
                          checked={formProps.values.show_grid}
                          disabled={!editable}
                          onUpdateField={handleSchemeUpdateOnly}
                          onUpdateDB={handleSchemeUpdate}
                        />
                      }
                      label="Show when editing"
                      labelPlacement="start"
                    />
                  </LightTooltip>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CustomFormControlLabel
                    control={
                      <FormCheckbox
                        color="primary"
                        name="snap_grid"
                        fieldKey="snap_grid"
                        checked={formProps.values.snap_grid}
                        disabled={!editable}
                        onUpdateField={handleSchemeUpdateOnly}
                        onUpdateDB={handleSchemeUpdate}
                      />
                    }
                    label="Snap when editing"
                    labelPlacement="start"
                  />
                </Grid>
              </>
            }
          />
          <SubForm
            label="Car Parts"
            editable={editable}
            onSchemeUpdateOnly={handleSchemeUpdateOnly}
            onSchemeUpdate={handleSchemeUpdate}
            {...formProps}
            extraChildren={
              <>
                <Grid item xs={12} sm={12}>
                  <LightTooltip
                    title="If checked, it will appear on top of all the layers"
                    arrow
                  >
                    <CustomFormControlLabel
                      control={
                        <FormCheckbox
                          color="primary"
                          name="show_carparts_on_top"
                          fieldKey="show_carparts_on_top"
                          checked={formProps.values.show_carparts_on_top}
                          disabled={!editable}
                          onUpdateField={handleSchemeUpdateOnly}
                          onUpdateDB={handleSchemeUpdate}
                        />
                      }
                      label="Display above layers"
                      labelPlacement="start"
                    />
                  </LightTooltip>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setOpenCloneCarPartsDialog(true)}
                  >
                    Clone as new layers
                  </Button>
                </Grid>
              </>
            }
          />
        </Box>
        <CloneCarPartsDialog
          open={openCloneCarPartsDialog}
          onCancel={() => setOpenCloneCarPartsDialog(false)}
        />
      </Form>
    );
  }
);

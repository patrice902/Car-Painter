import { LightTooltip } from "components/common";
import { Box, Grid } from "components/MaterialUI";
import { Form } from "formik";
import {
  FormCheckbox,
  FormSliderInput,
} from "pages/scheme/components/PropertyBar/components";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPaintingGuides } from "redux/reducers/boardReducer";
import {
  setCurrent as setCurrentScheme,
  updateScheme,
} from "redux/reducers/schemeReducer";

import { CustomFormControlLabel } from "./styles";
import { SubForm } from "./SubForm";

export const InnerForm = React.memo(
  ({ editable, initialValues, ...formProps }) => {
    const dispatch = useDispatch();

    const currentScheme = useSelector((state) => state.schemeReducer.current);
    const paintingGuides = useSelector(
      (state) => state.boardReducer.paintingGuides
    );

    const setMultiFieldValue = useCallback(
      (valueMap) => {
        for (let itemKey of Object.keys(valueMap)) {
          formProps.setFieldValue(itemKey, valueMap[itemKey]);
        }
      },
      [formProps]
    );

    const handleSchemeUpdate = useCallback(
      (guide_data) => {
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
        setMultiFieldValue(guide_data);
        dispatch(
          setCurrentScheme({
            id: currentScheme.id,
            guide_data,
          })
        );
      },
      [setMultiFieldValue, dispatch, currentScheme.id]
    );

    const handleTogglePaintingGuide = useCallback(
      (guideItem) => {
        let index = paintingGuides.indexOf(guideItem);
        let newGuide = [...paintingGuides];
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
            fields={["carmask_color", "carmask_opacity"]}
            initialValues={initialValues}
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
            fields={["wireframe_color", "wireframe_opacity", "show_wireframe"]}
            editable={editable}
            initialValues={initialValues}
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
            fields={[
              "sponsor_color",
              "sponsor_opacity",
              "show_sponsor",
              "show_sponsor_block_on_top",
            ]}
            editable={editable}
            initialValues={initialValues}
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
            fields={[
              "numberblock_color",
              "numberblock_opacity",
              "show_numberBlocks",
              "show_number_block_on_top",
            ]}
            editable={editable}
            initialValues={initialValues}
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
            fields={[
              "grid_color",
              "grid_opacity",
              "grid_padding",
              "grid_stroke",
              "show_grid",
              "snap_grid",
            ]}
            editable={editable}
            initialValues={initialValues}
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
            fields={["show_carparts_on_top"]}
            editable={editable}
            initialValues={initialValues}
            onSchemeUpdateOnly={handleSchemeUpdateOnly}
            onSchemeUpdate={handleSchemeUpdate}
            {...formProps}
            extraChildren={
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
            }
          />
        </Box>
      </Form>
    );
  }
);

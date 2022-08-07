import React, { useCallback } from "react";
import { Form } from "formik";

import { Box, Checkbox, Grid } from "components/MaterialUI";
import { SubForm } from "./SubForm";

import { LightTooltip, SliderInput } from "components/common";
import { CustomFormControlLabel } from "./styles";
import { useDebouncedCallback } from "use-debounce";

export const InnerForm = React.memo(
  ({
    editable,
    initialValues,
    paintingGuides,
    onCancel,
    onChangePaintingGuides,
    onApply,
    ...formProps
  }) => {
    const handleTogglePaintingGuide = useCallback(
      (guideItem) => {
        let index = paintingGuides.indexOf(guideItem);
        let newGuide = [...paintingGuides];
        if (index === -1) newGuide.push(guideItem);
        else newGuide.splice(index, 1);
        onChangePaintingGuides(newGuide);
      },
      [onChangePaintingGuides, paintingGuides]
    );

    const setMultiFieldValue = useCallback(
      (valueMap) => {
        for (let itemKey of Object.keys(valueMap)) {
          formProps.setFieldValue(itemKey, valueMap[itemKey]);
        }
      },
      [formProps]
    );

    const handleShowWireframeChangeDebounced = useDebouncedCallback(
      onApply,
      300
    );

    const handleShowWireframeChange = useCallback(
      (e) => {
        const map = {
          show_wireframe: e.target.checked,
        };
        setMultiFieldValue(map);
        handleShowWireframeChangeDebounced(map);
      },
      [handleShowWireframeChangeDebounced, setMultiFieldValue]
    );

    const handleShowSponsorChangeDebounced = useDebouncedCallback(onApply, 300);

    const handleShowSponsorChange = useCallback(
      (e) => {
        const map = {
          show_sponsor: e.target.checked,
        };
        setMultiFieldValue(map);
        handleShowSponsorChangeDebounced(map);
      },
      [handleShowSponsorChangeDebounced, setMultiFieldValue]
    );

    const handleShowSponsorBlockOnTopDebounced = useDebouncedCallback(
      onApply,
      300
    );

    const handleShowSponsorBlockOnTop = useCallback(
      (e) => {
        const map = {
          show_sponsor_block_on_top: e.target.checked,
        };
        setMultiFieldValue(map);
        handleShowSponsorBlockOnTopDebounced(map);
      },
      [handleShowSponsorBlockOnTopDebounced, setMultiFieldValue]
    );

    const handleShowNumberBlocksDebounced = useDebouncedCallback(onApply, 300);

    const handleShowNumberBlocks = useCallback(
      (e) => {
        const map = {
          show_numberBlocks: e.target.checked,
        };
        setMultiFieldValue(map);
        handleShowNumberBlocksDebounced(map);
      },
      [handleShowNumberBlocksDebounced, setMultiFieldValue]
    );

    const handleShowNumberBlockOnTopDebounced = useDebouncedCallback(
      onApply,
      300
    );

    const handleShowNumberBlockOnTop = useCallback(
      (e) => {
        const map = {
          show_number_block_on_top: e.target.checked,
        };
        setMultiFieldValue(map);
        handleShowNumberBlockOnTopDebounced(map);
      },
      [handleShowNumberBlockOnTopDebounced, setMultiFieldValue]
    );

    const handleGridPaddingChangeDebounced = useDebouncedCallback(onApply, 300);

    const handleGridPaddingChange = useCallback(
      (e) => {
        const map = {
          grid_padding: e.target.checked,
        };
        setMultiFieldValue(map);
        handleGridPaddingChangeDebounced(map);
      },
      [handleGridPaddingChangeDebounced, setMultiFieldValue]
    );

    const handleGridStrokeChangeDebounced = useDebouncedCallback(onApply, 300);

    const handleGridStrokeChange = useCallback(
      (e) => {
        const map = {
          grid_stroke: e.target.checked,
        };
        setMultiFieldValue(map);
        handleGridStrokeChangeDebounced(map);
      },
      [handleGridStrokeChangeDebounced, setMultiFieldValue]
    );

    const handleShowGridChangeDebounced = useDebouncedCallback(onApply, 300);

    const handleShowGridChange = useCallback(
      (e) => {
        const map = {
          show_grid: e.target.checked,
        };
        setMultiFieldValue(map);
        handleShowGridChangeDebounced(map);
      },
      [handleShowGridChangeDebounced, setMultiFieldValue]
    );

    const handleSnapGridChangeDebounced = useDebouncedCallback(onApply, 300);

    const handleSnapGridChange = useCallback(
      (e) => {
        const map = {
          snap_grid: e.target.checked,
        };
        setMultiFieldValue(map);
        handleSnapGridChangeDebounced(map);
      },
      [handleSnapGridChangeDebounced, setMultiFieldValue]
    );

    const handleShowCarpartsOnTopChangeDebounced = useDebouncedCallback(
      onApply,
      300
    );

    const handleShowCarpartsOnTopChange = useCallback(
      (e) => {
        const map = {
          show_carparts_on_top: e.target.checked,
        };
        setMultiFieldValue(map);
        handleShowCarpartsOnTopChangeDebounced(map);
      },
      [handleShowCarpartsOnTopChangeDebounced, setMultiFieldValue]
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
            onApply={onApply}
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
            onApply={onApply}
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
                      <Checkbox
                        color="primary"
                        name="show_wireframe"
                        checked={formProps.values.show_wireframe}
                        disabled={!editable}
                        onChange={handleShowWireframeChange}
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
            onApply={onApply}
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
                        <Checkbox
                          color="primary"
                          name="show_sponsor"
                          checked={formProps.values.show_sponsor}
                          disabled={!editable}
                          onChange={handleShowSponsorChange}
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
                        <Checkbox
                          color="primary"
                          name="show_sponsor_block_on_top"
                          checked={formProps.values.show_sponsor_block_on_top}
                          disabled={!editable}
                          onChange={handleShowSponsorBlockOnTop}
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
            onApply={onApply}
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
                        <Checkbox
                          color="primary"
                          name="show_numberBlocks"
                          checked={formProps.values.show_numberBlocks}
                          disabled={!editable}
                          onChange={handleShowNumberBlocks}
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
                        <Checkbox
                          color="primary"
                          name="show_number_block_on_top"
                          checked={formProps.values.show_number_block_on_top}
                          disabled={!editable}
                          onChange={handleShowNumberBlockOnTop}
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
            onApply={onApply}
            onToggleGuideVisible={handleTogglePaintingGuide}
            {...formProps}
            extraChildren={
              <>
                <Grid item xs={12} sm={12} component={Box} height="40px">
                  <Box pr="9px">
                    <SliderInput
                      label="Column Size"
                      min={5}
                      max={50}
                      step={1}
                      value={formProps.values.grid_padding}
                      disabled={!editable}
                      setValue={handleGridPaddingChange}
                      small
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} component={Box} height="40px">
                  <Box pr="9px">
                    <SliderInput
                      label="Stroke Width"
                      min={0.01}
                      max={3}
                      step={0.01}
                      value={formProps.values.grid_stroke}
                      disabled={!editable}
                      setValue={handleGridStrokeChange}
                      small
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
                        <Checkbox
                          color="primary"
                          name="show_grid"
                          checked={formProps.values.show_grid}
                          disabled={!editable}
                          onChange={handleShowGridChange}
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
                      <Checkbox
                        color="primary"
                        name="snap_grid"
                        checked={formProps.values.snap_grid}
                        disabled={!editable}
                        onChange={handleSnapGridChange}
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
            onApply={onApply}
            {...formProps}
            extraChildren={
              <Grid item xs={12} sm={12}>
                <LightTooltip
                  title="If checked, it will appear on top of all the layers"
                  arrow
                >
                  <CustomFormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        name="show_carparts_on_top"
                        checked={formProps.values.show_carparts_on_top}
                        disabled={!editable}
                        onChange={handleShowCarpartsOnTopChange}
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

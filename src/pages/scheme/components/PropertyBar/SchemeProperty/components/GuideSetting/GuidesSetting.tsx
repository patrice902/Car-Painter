import { Formik, FormikHelpers } from "formik";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { colorValidator } from "src/helper";
import { RootState } from "src/redux";
import * as Yup from "yup";

import { InnerForm } from "./InnerForm";
import { GuideSettingFormValues } from "./InnerForm/model";

export interface GuidesSettingProps {
  editable: boolean;
}

const validationSchema = Yup.object().shape({
  carmask_color: Yup.string()
    .nullable()
    .test("color-validation", "Incorrect Color Format", colorValidator),
  wireframe_color: Yup.string()
    .nullable()
    .test("color-validation", "Incorrect Color Format", colorValidator),
  sponsor_color: Yup.string()
    .nullable()
    .test("color-validation", "Incorrect Color Format", colorValidator),
  numberblock_color: Yup.string()
    .nullable()
    .test("color-validation", "Incorrect Color Format", colorValidator),
  grid_color: Yup.string()
    .nullable()
    .test("color-validation", "Incorrect Color Format", colorValidator),
});

export const GuidesSetting = React.memo((props: GuidesSettingProps) => {
  const { editable } = props;
  const currentScheme = useSelector(
    (state: RootState) => state.schemeReducer.current
  );
  const guide_data = useMemo(
    () => (currentScheme ? currentScheme.guide_data : {}),
    [currentScheme]
  );

  const initialValues: GuideSettingFormValues = useMemo(
    () => ({
      carmask_color:
        guide_data.carmask_color != null ? guide_data.carmask_color : "",
      carmask_opacity:
        guide_data.carmask_opacity != null ? guide_data.carmask_opacity : 1,
      wireframe_color:
        guide_data.wireframe_color != null ? guide_data.wireframe_color : "",
      wireframe_opacity:
        guide_data.wireframe_opacity != null ? guide_data.wireframe_opacity : 1,
      sponsor_color:
        guide_data.sponsor_color != null ? guide_data.sponsor_color : "",
      sponsor_opacity:
        guide_data.sponsor_opacity != null ? guide_data.sponsor_opacity : 1,
      numberblock_color:
        guide_data.numberblock_color != null
          ? guide_data.numberblock_color
          : "",
      numberblock_opacity:
        guide_data.numberblock_opacity != null
          ? guide_data.numberblock_opacity
          : 1,
      grid_color: guide_data.grid_color != null ? guide_data.grid_color : "",
      grid_opacity:
        guide_data.grid_opacity != null ? guide_data.grid_opacity : 1,
      grid_padding:
        guide_data.grid_padding != null ? guide_data.grid_padding : 10,
      grid_stroke:
        guide_data.grid_stroke != null ? guide_data.grid_stroke : 0.1,
      show_wireframe: guide_data.show_wireframe || false,
      show_sponsor: guide_data.show_sponsor || false,
      show_numberBlocks: guide_data.show_numberBlocks || false,
      show_grid: guide_data.show_grid || false,
      snap_grid: guide_data.snap_grid || false,
      show_carparts_on_top: guide_data.show_carparts_on_top || false,
      show_sponsor_block_on_top: guide_data.show_sponsor_block_on_top || false,
      show_number_block_on_top: guide_data.show_number_block_on_top || false,
    }),
    [guide_data]
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validate={() => ({})}
      enableReinitialize
      onSubmit={(
        _values: GuideSettingFormValues,
        _formikHelpers: FormikHelpers<GuideSettingFormValues>
      ) => undefined}
    >
      {(formProps) => <InnerForm {...formProps} editable={editable} />}
    </Formik>
  );
});

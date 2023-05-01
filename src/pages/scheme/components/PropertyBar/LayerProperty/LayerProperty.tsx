import { Formik, FormikHelpers } from "formik";
import { Group } from "konva/types/Group";
import { Stage } from "konva/types/Stage";
import _ from "lodash";
import React, { RefObject, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { DefaultLayer } from "src/constant";
import {
  colorValidator,
  focusBoardQuickly,
  getAllowedLayerTypes,
} from "src/helper";
import { RootState } from "src/redux";
import { BuilderLayerJSONParitalAll } from "src/types/common";
import { BuilderLayerJSON } from "src/types/query";
import { useDebounce } from "use-debounce";
import * as Yup from "yup";

import { InnerForm } from "./InnerForm";

export interface LayerPropertyProps {
  editable: boolean;
  stageRef: RefObject<Stage>;
  baseLayerRef?: RefObject<Group>;
  mainLayerRef?: RefObject<Group>;
  carMaskLayerRef?: RefObject<Group>;
  transformingLayer?: BuilderLayerJSON | null;
  onDelete: (layer: BuilderLayerJSON) => void;
  onClone: (
    layer: BuilderLayerJSON,
    samePosition?: boolean,
    pushingToHistory?: boolean
  ) => void;
}

export const LayerProperty = React.memo((props: LayerPropertyProps) => {
  const { editable, stageRef, transformingLayer, onClone, onDelete } = props;

  const currentLayer = useSelector(
    (state: RootState) => state.layerReducer.current
  );
  const fontList = useSelector((state: RootState) => state.fontReducer.list);
  const pressedKey = useSelector(
    (state: RootState) => state.boardReducer.pressedKey
  );
  const user = useSelector((state: RootState) => state.authReducer.user);
  const AllowedLayerTypes = useMemo(() => getAllowedLayerTypes(currentLayer), [
    currentLayer,
  ]);
  const defaultValues = useMemo(
    () =>
      _.pick(
        {
          layer_visible: 1,
          layer_locked: 0,
          layer_data: _.pick(
            DefaultLayer.layer_data,
            AllowedLayerTypes.filter((item) =>
              item.includes("layer_data.")
            ).map((item) => item.replaceAll("layer_data.", ""))
          ),
        },
        AllowedLayerTypes.filter((item) => !item.includes("layer_data."))
      ),
    [AllowedLayerTypes]
  );
  const layerData = useMemo(
    () =>
      transformingLayer
        ? transformingLayer.layer_data
        : currentLayer
        ? currentLayer.layer_data
        : {},
    [currentLayer, transformingLayer]
  );
  const initialValues = useMemo(
    () =>
      (currentLayer
        ? {
            ...defaultValues,
            ...currentLayer,
            layer_data: {
              ...defaultValues.layer_data,
              ...layerData,
            },
          }
        : { ...defaultValues }) as BuilderLayerJSONParitalAll,
    [currentLayer, defaultValues, layerData]
  );
  const [debouncedValues] = useDebounce(initialValues, 100);

  const handleClone = useCallback(() => {
    if (currentLayer) onClone(currentLayer);
    focusBoardQuickly();
  }, [onClone, currentLayer]);
  const handleDelete = useCallback(() => {
    if (currentLayer) onDelete(currentLayer);
    focusBoardQuickly();
  }, [onDelete, currentLayer]);

  return (
    <>
      <Formik
        initialValues={debouncedValues || initialValues}
        validationSchema={Yup.object({
          layer_order: Yup.number(),
          layer_visible: Yup.number(),
          layer_locked: Yup.number(),
          layer_data: Yup.object(
            _.pick(
              {
                name: Yup.string().required("Required"),
                text: Yup.string().test(
                  "text-validation",
                  "Required",
                  (value) =>
                    Boolean(
                      value?.length ||
                        !AllowedLayerTypes.includes("layer_data.text")
                    )
                ),
                width: Yup.number().test(
                  "width-validation",
                  "Required",
                  (value) =>
                    Boolean(
                      value || !AllowedLayerTypes.includes("layer_data.width")
                    )
                ),
                height: Yup.number().test(
                  "height-validation",
                  "Required",
                  (value) =>
                    Boolean(
                      value || !AllowedLayerTypes.includes("layer_data.height")
                    )
                ),
                left: Yup.number(),
                top: Yup.number(),
                rotation: Yup.number()
                  .moreThan(-181, "Must be greater than -181")
                  .lessThan(181, "Must be less than 181"),
                flop: Yup.number(),
                flip: Yup.number(),
                scaleX: Yup.number().moreThan(0, "Must be greater than 0"),
                scaleY: Yup.number().moreThan(0, "Must be greater than 0"),
                color: Yup.string()
                  .nullable()
                  .test(
                    "color-validation",
                    "Incorrect Color Format",
                    colorValidator
                  ),
                size: Yup.number(),
                scolor: Yup.string()
                  .nullable()
                  .test(
                    "color-validation",
                    "Incorrect Color Format",
                    colorValidator
                  ),
                stroke: Yup.number(),
                font: Yup.number(),
                opacity: Yup.number(),
                shadowColor: Yup.string()
                  .nullable()
                  .test(
                    "color-validation",
                    "Incorrect Color Format",
                    colorValidator
                  ),
                shadowBlur: Yup.number(),
                shadowOpacity: Yup.number(),
                shadowOffsetX: Yup.number(),
                shadowOffsetY: Yup.number(),
                skewX: Yup.number(),
                skewY: Yup.number(),
                cornerTopLeft: Yup.number(),
                cornerTopRight: Yup.number(),
                cornerBottomLeft: Yup.number(),
                cornerBottomRight: Yup.number(),
                radius: Yup.number().moreThan(0, "Must be greater than 0"),
                innerRadius: Yup.number().moreThan(0, "Must be greater than 0"),
                outerRadius: Yup.number().moreThan(0, "Must be greater than 0"),
                numPoints: Yup.number().moreThan(1, "Must be greater than 1"),
                angle: Yup.number(),
                pointerLength: Yup.number().moreThan(
                  0,
                  "Must be greater than 0"
                ),
                pointerWidth: Yup.number().moreThan(
                  0,
                  "Must be greater than 0"
                ),
              },
              AllowedLayerTypes.filter((item) =>
                item.includes("layer_data.")
              ).map((item) => item.replaceAll("layer_data.", ""))
            )
          ),
        })}
        enableReinitialize
        onSubmit={(
          _values: BuilderLayerJSONParitalAll,
          _formikHelpers: FormikHelpers<BuilderLayerJSONParitalAll>
        ) => undefined}
      >
        {(formProps) => (
          <InnerForm
            {...formProps}
            editable={editable}
            user={user}
            stageRef={stageRef}
            fontList={fontList}
            currentLayer={currentLayer}
            pressedKey={pressedKey}
            onClone={handleClone}
            onDelete={handleDelete}
          />
        )}
      </Formik>
    </>
  );
});

export default LayerProperty;

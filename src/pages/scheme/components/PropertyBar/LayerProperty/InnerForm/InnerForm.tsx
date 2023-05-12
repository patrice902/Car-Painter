import { Form, FormikProps } from "formik";
import Konva from "konva";
import React, { RefObject, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  mergeListItemOnly as mergeLayerListItemOnly,
  updateLayer,
} from "src/redux/reducers/layerReducer";
import {
  BuilderLayerJSONParitalAll,
  PartialAllLayerData,
} from "src/types/common";
import { BuilderFont } from "src/types/model";
import { BuilderLayerJSON, UserWithoutPassword } from "src/types/query";

import {
  BackgroundProperty,
  ColorProperty,
  CornerProperty,
  ExtraProperty,
  FontProperty,
  GeneralProperty,
  NameProperty,
  PositionProperty,
  RotationProperty,
  ShadowProperty,
  SizeProperty,
  SkewProperty,
  StrokeProperty,
} from "./components";

type InnerFormProps = {
  user?: UserWithoutPassword;
  editable: boolean;
  stageRef: RefObject<Konva.Stage>;
  fontList: BuilderFont[];
  currentLayer?: BuilderLayerJSON | null;
  pressedKey?: string | null;
  onClone: () => void;
  onDelete: () => void;
} & FormikProps<BuilderLayerJSONParitalAll>;

export const InnerForm = React.memo(
  ({
    user,
    editable,
    stageRef,
    fontList,
    currentLayer,
    pressedKey,
    onClone,
    onDelete,
    ...formProps
  }: InnerFormProps) => {
    const dispatch = useDispatch();

    const setMultiFieldValue = useCallback(
      (valueMap, prefix?: string) => {
        for (const itemKey of Object.keys(valueMap)) {
          formProps.setFieldValue(
            prefix ? `${prefix}.${itemKey}` : itemKey,
            valueMap[itemKey]
          );
        }
      },
      [formProps]
    );

    const handleLayerUpdate = useCallback(
      (valueMap: Record<string, unknown>) => {
        if (!currentLayer) return;

        dispatch(
          updateLayer(
            {
              ...valueMap,
              id: currentLayer.id,
            },
            true,
            currentLayer
          )
        );
      },
      [currentLayer, dispatch]
    );

    const handleLayerUpdateOnly = useCallback(
      (valueMap: Record<string, unknown>) => {
        if (!currentLayer) return;

        setMultiFieldValue(valueMap);
        dispatch(
          mergeLayerListItemOnly({
            ...valueMap,
            id: currentLayer.id,
          } as Partial<BuilderLayerJSON>)
        );
      },
      [currentLayer, dispatch, setMultiFieldValue]
    );

    const handleLayerDataUpdate = useCallback(
      (valueMap: PartialAllLayerData) => {
        if (!currentLayer) return;

        dispatch(
          updateLayer(
            {
              id: currentLayer.id,
              layer_data: valueMap,
            } as Partial<BuilderLayerJSON>,
            true,
            currentLayer
          )
        );
      },
      [currentLayer, dispatch]
    );

    const handleLayerDataUpdateOnly = useCallback(
      (valueMap: PartialAllLayerData) => {
        if (!currentLayer) return;

        setMultiFieldValue(valueMap, "layer_data");
        dispatch(
          mergeLayerListItemOnly({
            id: currentLayer.id,
            layer_data: valueMap,
          } as Partial<BuilderLayerJSON>)
        );
      },
      [currentLayer, dispatch, setMultiFieldValue]
    );

    return (
      <Form onSubmit={formProps.handleSubmit} noValidate>
        <NameProperty
          {...formProps}
          editable={editable}
          user={user}
          layerType={currentLayer?.layer_type}
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <GeneralProperty
          {...formProps}
          editable={editable}
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
          onLayerUpdate={handleLayerUpdate}
          onLayerUpdateOnly={handleLayerUpdateOnly}
        />
        <FontProperty
          {...formProps}
          editable={editable}
          fontList={fontList}
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <ColorProperty
          {...formProps}
          editable={editable}
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <BackgroundProperty
          {...formProps}
          editable={editable}
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <StrokeProperty
          {...formProps}
          editable={editable}
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <SizeProperty
          {...formProps}
          editable={editable}
          currentLayer={currentLayer}
          pressedKey={pressedKey}
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <PositionProperty
          {...formProps}
          editable={editable}
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <RotationProperty
          {...formProps}
          editable={editable}
          stageRef={stageRef}
          currentLayer={currentLayer}
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <SkewProperty
          {...formProps}
          editable={editable}
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <ShadowProperty
          {...formProps}
          editable={editable}
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <CornerProperty
          {...formProps}
          editable={editable}
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <ExtraProperty
          {...formProps}
          editable={editable}
          onClone={onClone}
          onDelete={onDelete}
        />
      </Form>
    );
  }
);

import React, { useCallback } from "react";
import { Form } from "formik";

import { DefaultLayer } from "constant";

import {
  NameProperty,
  GeneralProperty,
  SizeProperty,
  PositionProperty,
  FontProperty,
  StrokeProperty,
  ColorProperty,
  BackgroundProperty,
  RotationProperty,
  ShadowProperty,
  CornerProperty,
  ExtraProperty,
  SkewProperty,
} from "./components";
import { useDispatch } from "react-redux";
import { updateLayer } from "redux/reducers/layerReducer";

export const InnerForm = React.memo(
  ({
    user,
    editable,
    stageRef,
    fontList,
    currentLayer,
    currentCarMake,
    pressedKey,
    onClone,
    onDelete,
    ...formProps
  }) => {
    const dispatch = useDispatch();

    const checkLayerDataDirty = useCallback(
      (params) => {
        if (!currentLayer) return false;
        for (let param of params) {
          if (
            formProps.values.layer_data[param] !=
              currentLayer.layer_data[param] &&
            !(
              formProps.values.layer_data[param] ===
                DefaultLayer.layer_data[param] &&
              currentLayer.layer_data[param] === undefined
            )
          )
            return true;
        }
        return false;
      },
      [formProps.values, currentLayer]
    );

    const setMultiFieldValue = useCallback(
      (valueMap, prefix) => {
        for (let itemKey of Object.keys(valueMap)) {
          formProps.setFieldValue(
            prefix ? `${prefix}.${itemKey}` : itemKey,
            valueMap[itemKey]
          );
        }
      },
      [formProps]
    );

    const handleLayerUpdate = useCallback(
      (valueMap) => {
        dispatch(
          updateLayer({
            id: currentLayer.id,
            ...valueMap,
          })
        );
      },
      [currentLayer, dispatch]
    );

    const handleLayerUpdateOnly = useCallback(
      (valueMap) => {
        setMultiFieldValue(valueMap);
        dispatch(
          updateLayer({
            id: currentLayer.id,
            ...valueMap,
          })
        );
      },
      [currentLayer, dispatch, setMultiFieldValue]
    );

    const handleLayerDataUpdate = useCallback(
      (valueMap) => {
        dispatch(
          updateLayer({
            id: currentLayer.id,
            layer_data: valueMap,
          })
        );
      },
      [currentLayer, dispatch]
    );

    const handleLayerDataUpdateOnly = useCallback(
      (valueMap) => {
        setMultiFieldValue(valueMap, "layer_data");
        dispatch(
          updateLayer({
            id: currentLayer.id,
            layer_data: valueMap,
          })
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
          layerType={currentLayer && currentLayer.layer_type}
          checkLayerDataDirty={checkLayerDataDirty}
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <GeneralProperty
          {...formProps}
          editable={editable}
          checkLayerDataDirty={checkLayerDataDirty}
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
          onLayerUpdate={handleLayerUpdate}
          onLayerUpdateOnly={handleLayerUpdateOnly}
        />
        <FontProperty
          {...formProps}
          editable={editable}
          fontList={fontList}
          checkLayerDataDirty={checkLayerDataDirty}
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <ColorProperty
          {...formProps}
          editable={editable}
          currentCarMake={currentCarMake}
          checkLayerDataDirty={checkLayerDataDirty}
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <BackgroundProperty
          {...formProps}
          editable={editable}
          checkLayerDataDirty={checkLayerDataDirty}
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <StrokeProperty
          {...formProps}
          editable={editable}
          checkLayerDataDirty={checkLayerDataDirty}
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
          checkLayerDataDirty={checkLayerDataDirty}
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <RotationProperty
          {...formProps}
          editable={editable}
          stageRef={stageRef}
          currentLayer={currentLayer}
          checkLayerDataDirty={checkLayerDataDirty}
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <SkewProperty
          {...formProps}
          editable={editable}
          checkLayerDataDirty={checkLayerDataDirty}
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <ShadowProperty
          {...formProps}
          editable={editable}
          checkLayerDataDirty={checkLayerDataDirty}
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <CornerProperty
          {...formProps}
          editable={editable}
          checkLayerDataDirty={checkLayerDataDirty}
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

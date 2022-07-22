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

export const InnerForm = React.memo(
  ({
    user,
    editable,
    stageRef,
    fontList,
    toggleField,
    toggleLayerDataField,
    currentLayer,
    currentCarMake,
    pressedKey,
    onClone,
    onDelete,
    onLayerDataUpdate,
    onLayerDataMultiUpdate,
    ...formProps
  }) => {
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
    const handleDataFieldChange = useCallback(
      (field, value) => {
        formProps.setFieldValue(`layer_data.${field}`, value);
        onLayerDataUpdate(field, value);
      },
      [formProps, onLayerDataUpdate]
    );
    const handleLayerDataMultiUpdate = useCallback(
      (valueMap) => {
        for (let itemKey of Object.keys(valueMap)) {
          formProps.setFieldValue(`layer_data.${itemKey}`, valueMap[itemKey]);
        }
        onLayerDataMultiUpdate(valueMap);
      },
      [formProps, onLayerDataMultiUpdate]
    );

    return (
      <Form onSubmit={formProps.handleSubmit} noValidate>
        <NameProperty
          {...formProps}
          editable={editable}
          user={user}
          layerType={currentLayer && currentLayer.layer_type}
          checkLayerDataDirty={checkLayerDataDirty}
          onDataFieldChange={handleDataFieldChange}
        />
        <GeneralProperty
          {...formProps}
          editable={editable}
          toggleField={toggleField}
          checkLayerDataDirty={checkLayerDataDirty}
          onDataFieldChange={handleDataFieldChange}
        />
        <FontProperty
          {...formProps}
          editable={editable}
          fontList={fontList}
          onLayerDataUpdate={onLayerDataUpdate}
          onDataFieldChange={handleDataFieldChange}
          checkLayerDataDirty={checkLayerDataDirty}
        />
        <ColorProperty
          {...formProps}
          editable={editable}
          currentCarMake={currentCarMake}
          onLayerDataUpdate={onLayerDataUpdate}
          checkLayerDataDirty={checkLayerDataDirty}
          onDataFieldChange={handleDataFieldChange}
        />
        <BackgroundProperty
          {...formProps}
          editable={editable}
          onLayerDataUpdate={onLayerDataUpdate}
          onDataFieldChange={handleDataFieldChange}
          checkLayerDataDirty={checkLayerDataDirty}
        />
        <StrokeProperty
          {...formProps}
          editable={editable}
          checkLayerDataDirty={checkLayerDataDirty}
          onLayerDataUpdate={onLayerDataUpdate}
          onDataFieldChange={handleDataFieldChange}
        />
        <SizeProperty
          {...formProps}
          editable={editable}
          toggleLayerDataField={toggleLayerDataField}
          currentLayer={currentLayer}
          pressedKey={pressedKey}
          checkLayerDataDirty={checkLayerDataDirty}
          onDataFieldChange={handleDataFieldChange}
          onLayerDataMultiUpdate={handleLayerDataMultiUpdate}
        />
        <PositionProperty
          {...formProps}
          editable={editable}
          checkLayerDataDirty={checkLayerDataDirty}
          onDataFieldChange={handleDataFieldChange}
        />
        <RotationProperty
          {...formProps}
          editable={editable}
          stageRef={stageRef}
          currentLayer={currentLayer}
          toggleField={toggleField}
          checkLayerDataDirty={checkLayerDataDirty}
          onLayerDataUpdate={onLayerDataUpdate}
          onLayerDataMultiUpdate={handleLayerDataMultiUpdate}
          onDataFieldChange={handleDataFieldChange}
        />
        <SkewProperty
          {...formProps}
          editable={editable}
          checkLayerDataDirty={checkLayerDataDirty}
          onDataFieldChange={handleDataFieldChange}
        />
        <ShadowProperty
          {...formProps}
          editable={editable}
          checkLayerDataDirty={checkLayerDataDirty}
          onLayerDataUpdate={onLayerDataUpdate}
          onApply={formProps.handleSubmit}
          onDataFieldChange={handleDataFieldChange}
          onLayerDataMultiUpdate={handleLayerDataMultiUpdate}
        />
        <CornerProperty
          {...formProps}
          editable={editable}
          checkLayerDataDirty={checkLayerDataDirty}
          onLayerDataUpdate={onLayerDataUpdate}
          onDataFieldChange={handleDataFieldChange}
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

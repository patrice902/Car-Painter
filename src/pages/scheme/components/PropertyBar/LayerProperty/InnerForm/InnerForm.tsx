import { Box, Button, Typography } from "@material-ui/core";
import { Form, FormikProps } from "formik";
import Konva from "konva";
import React, { RefObject, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/redux";
import {
  mergeListItemOnly as mergeLayerListItemOnly,
  updateLayer,
} from "src/redux/reducers/layerReducer";
import {
  BuilderLayerJSONParitalAll,
  MovableObjLayerData,
  PartialAllLayerData,
} from "src/types/common";
import { BuilderFont, UserMin } from "src/types/model";
import { BuilderLayerJSON } from "src/types/query";

import {
  BackgroundProperty,
  ColorProperty,
  CornerProperty,
  ExtraProperty,
  FontProperty,
  GeneralProperty,
  NameProperty,
  PositionProperty,
  PublicSharingProperty,
  RotationProperty,
  ShadowProperty,
  SizeProperty,
  SkewProperty,
  StrokeProperty,
} from "./components";

type InnerFormProps = {
  user?: UserMin;
  editable: boolean;
  stageRef: RefObject<Konva.Stage>;
  fontList: BuilderFont[];
  currentLayer?: BuilderLayerJSON | null;
  pressedKey?: string | null;
  onClone: (mirrorRotation?: boolean) => void;
  onDelete: () => void;
} & FormikProps<BuilderLayerJSONParitalAll>;

const EditLockAlert = ({
  editable,
  layerData,
  onUpdate,
}: {
  editable: boolean;
  layerData?: MovableObjLayerData;
  onUpdate: (valueMap: PartialAllLayerData) => void;
}) => {
  const owner = useSelector((state: RootState) => state.schemeReducer.owner);
  const isOriginOwner =
    editable &&
    layerData?.ownerForGallery &&
    owner?.id === layerData.ownerForGallery;

  const handleUnlock = useCallback(() => {
    onUpdate({ editLock: false });
  }, [onUpdate]);

  return (
    <Box
      bgcolor="#666"
      p="10px 16px"
      borderRadius={10}
      border="2px solid navajowhite"
      position="relative"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gridGap="8px"
      mb="10px"
    >
      <Typography>Locked by project owner</Typography>
      {isOriginOwner && (
        <Button variant="outlined" color="secondary" onClick={handleUnlock}>
          Unlock
        </Button>
      )}
    </Box>
  );
};

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

        formProps.validateForm();
      },
      [currentLayer, dispatch, formProps]
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

        formProps.validateForm();
      },
      [currentLayer, dispatch, setMultiFieldValue, formProps]
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

        formProps.validateForm();
      },
      [currentLayer, dispatch, formProps]
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

        formProps.validateForm();
      },
      [currentLayer, dispatch, setMultiFieldValue, formProps]
    );

    return (
      <Form onSubmit={formProps.handleSubmit} noValidate>
        <NameProperty
          {...formProps}
          editable={
            editable &&
            !(currentLayer?.layer_data as MovableObjLayerData).editLock
          }
          user={user}
          layerType={currentLayer?.layer_type}
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        {(currentLayer?.layer_data as MovableObjLayerData).editLock && (
          <EditLockAlert
            editable={editable}
            layerData={currentLayer?.layer_data as MovableObjLayerData}
            onUpdate={handleLayerDataUpdate}
          />
        )}
        <GeneralProperty
          {...formProps}
          editable={
            editable &&
            !(currentLayer?.layer_data as MovableObjLayerData).editLock
          }
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
          onLayerUpdate={handleLayerUpdate}
          onLayerUpdateOnly={handleLayerUpdateOnly}
        />
        <FontProperty
          {...formProps}
          editable={
            editable &&
            !(currentLayer?.layer_data as MovableObjLayerData).editLock
          }
          fontList={fontList}
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <ColorProperty
          {...formProps}
          editable={
            editable &&
            !(currentLayer?.layer_data as MovableObjLayerData).editLock
          }
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <BackgroundProperty
          {...formProps}
          editable={
            editable &&
            !(currentLayer?.layer_data as MovableObjLayerData).editLock
          }
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <StrokeProperty
          {...formProps}
          editable={
            editable &&
            !(currentLayer?.layer_data as MovableObjLayerData).editLock
          }
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <SizeProperty
          {...formProps}
          editable={
            editable &&
            !(currentLayer?.layer_data as MovableObjLayerData).editLock
          }
          currentLayer={currentLayer}
          pressedKey={pressedKey}
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <PositionProperty
          {...formProps}
          editable={
            editable &&
            !(currentLayer?.layer_data as MovableObjLayerData).editLock
          }
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <RotationProperty
          {...formProps}
          editable={
            editable &&
            !(currentLayer?.layer_data as MovableObjLayerData).editLock
          }
          stageRef={stageRef}
          currentLayer={currentLayer}
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <SkewProperty
          {...formProps}
          editable={
            editable &&
            !(currentLayer?.layer_data as MovableObjLayerData).editLock
          }
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <ShadowProperty
          {...formProps}
          editable={
            editable &&
            !(currentLayer?.layer_data as MovableObjLayerData).editLock
          }
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <CornerProperty
          {...formProps}
          editable={
            editable &&
            !(currentLayer?.layer_data as MovableObjLayerData).editLock
          }
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <PublicSharingProperty
          {...formProps}
          editable={editable}
          onLayerDataUpdate={handleLayerDataUpdate}
          onLayerDataUpdateOnly={handleLayerDataUpdateOnly}
        />
        <ExtraProperty
          {...formProps}
          editable={
            editable &&
            !(currentLayer?.layer_data as MovableObjLayerData).editLock
          }
          onClone={onClone}
          onDelete={onDelete}
        />
      </Form>
    );
  }
);

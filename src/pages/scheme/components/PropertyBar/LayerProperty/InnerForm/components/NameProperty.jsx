import { Box } from "@material-ui/core";
import { AllowedLayerProps, LayerTypes } from "constant";
import React, { useCallback, useMemo } from "react";
import styled from "styled-components/macro";

import { FormTextField } from "../../../components";

const CustomeTextField = styled(FormTextField)`
  margin: 0 !important;
  .MuiInputBase-input {
    height: 1.5rem;
    font-family: CircularXXWeb-Regular;
  }
  [disabled] {
    color: white;
  }
`;

export const NameProperty = React.memo((props) => {
  const {
    user,
    editable,
    errors,
    handleBlur,
    touched,
    values,
    layerType,
    onLayerDataUpdateOnly,
    onLayerDataUpdate,
  } = props;
  const layerDataProperties = ["name"];
  const AllowedLayerTypes = useMemo(
    () =>
      !values.layer_type
        ? []
        : values.layer_type !== LayerTypes.SHAPE
        ? AllowedLayerProps[values.layer_type]
        : AllowedLayerProps[values.layer_type][values.layer_data.type],
    [values]
  );
  const layerName = useCallback(
    (name, type) => {
      if (type === LayerTypes.UPLOAD && name.indexOf(user.id.toString()) === 0)
        return name.slice(user.id.toString().length + 1);
      return name;
    },
    [user]
  );

  if (
    !AllowedLayerTypes ||
    layerDataProperties.every(
      (value) => !AllowedLayerTypes.includes("layer_data." + value)
    )
  )
    return <></>;
  return (
    <>
      {AllowedLayerTypes.includes("layer_data.name") ? (
        <Box
          display="flex"
          justifyContent="space-bewteen"
          width="100%"
          alignItems="center"
        >
          <CustomeTextField
            name="layer_data.name"
            fieldKey="name"
            value={layerName(values.layer_data.name, values.layer_type)}
            disabled={!editable || layerType === LayerTypes.CAR}
            error={Boolean(
              touched.layer_data &&
                touched.layer_data.name &&
                errors.layer_data &&
                errors.layer_data.name
            )}
            helperText={
              touched.layer_data &&
              touched.layer_data.name &&
              errors.layer_data &&
              errors.layer_data.name
            }
            onBlur={handleBlur}
            fullWidth
            onUpdateField={onLayerDataUpdateOnly}
            onUpdateDB={onLayerDataUpdate}
          />
        </Box>
      ) : (
        <></>
      )}
    </>
  );
});

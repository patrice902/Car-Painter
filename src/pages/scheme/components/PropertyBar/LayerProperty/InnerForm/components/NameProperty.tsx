import { Box } from "@material-ui/core";
import { FormikProps } from "formik";
import React, { useCallback, useMemo } from "react";
import { decodeHtml, getAllowedLayerTypes } from "src/helper";
import {
  BuilderLayerJSONParitalAll,
  PartialAllLayerData,
} from "src/types/common";
import { LayerTypes } from "src/types/enum";
import { UserWithoutPassword } from "src/types/query";
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

type NamePropertyProps = {
  editable: boolean;
  user?: UserWithoutPassword;
  layerType?: LayerTypes;
  onLayerDataUpdateOnly: (valueMap: PartialAllLayerData) => void;
  onLayerDataUpdate: (valueMap: PartialAllLayerData) => void;
} & FormikProps<BuilderLayerJSONParitalAll>;

export const NameProperty = React.memo(
  ({
    user,
    editable,
    errors,
    handleBlur,
    touched,
    values,
    layerType,
    onLayerDataUpdateOnly,
    onLayerDataUpdate,
  }: NamePropertyProps) => {
    const layerDataProperties = ["name"];
    const AllowedLayerTypes = useMemo(() => getAllowedLayerTypes(values), [
      values,
    ]);
    const layerName = useCallback(
      (name, type) => {
        if (
          type === LayerTypes.UPLOAD &&
          name.indexOf(user?.id.toString()) === 0
        )
          return name.slice(user?.id.toString().length ?? 0 + 1);
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
              value={decodeHtml(
                layerName(values.layer_data.name, values.layer_type)
              )}
              disabled={!editable || layerType === LayerTypes.CAR}
              error={Boolean(
                touched.layer_data?.name && errors.layer_data?.name
              )}
              helperText={touched.layer_data?.name && errors.layer_data?.name}
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
  }
);

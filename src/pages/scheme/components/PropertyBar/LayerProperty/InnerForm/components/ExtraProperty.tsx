import { Box, Button } from "@material-ui/core";
import { FormikProps } from "formik";
import React, { useMemo } from "react";
import { getAllowedLayerTypes } from "src/helper";
import { BuilderLayerJSONParitalAll } from "src/types/common";

type ExtraPropertyProps = {
  editable: boolean;
  onClone: (mirrorRotation?: boolean) => void;
  onDelete: () => void;
} & FormikProps<BuilderLayerJSONParitalAll>;

export const ExtraProperty = React.memo(
  ({ editable, values, onClone, onDelete }: ExtraPropertyProps) => {
    const AllowedLayerTypes = useMemo(() => getAllowedLayerTypes(values), [
      values,
    ]);

    if (
      !AllowedLayerTypes ||
      (!AllowedLayerTypes.includes("clone") &&
        !AllowedLayerTypes.includes("delete"))
    )
      return <></>;
    return (
      <Box display="flex" flexDirection="column" width="100%" mt={2}>
        {editable && AllowedLayerTypes.includes("clone") ? (
          <Button variant="outlined" onClick={() => onClone()}>
            Clone
          </Button>
        ) : (
          <></>
        )}
        {editable && AllowedLayerTypes.includes("clone") ? (
          <Box width="100%" mt={2}>
            <Button fullWidth variant="outlined" onClick={() => onClone(true)}>
              Mirror Clone
            </Button>
          </Box>
        ) : (
          <></>
        )}
        {editable && AllowedLayerTypes.includes("delete") ? (
          <Box width="100%" mt={2}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={onDelete}
            >
              Delete
            </Button>
          </Box>
        ) : (
          <></>
        )}
      </Box>
    );
  }
);

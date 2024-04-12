import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControlLabel,
  Typography,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { useFeatureFlag } from "configcat-react";
import { FormikProps } from "formik";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { LightTooltip } from "src/components/common";
import { focusBoardQuickly, getAllowedLayerTypes } from "src/helper";
import { RootState } from "src/redux";
import {
  BuilderLayerJSONParitalAll,
  PartialAllLayerData,
} from "src/types/common";
import { ConfigCatFlags } from "src/types/enum";
import styled from "styled-components/macro";

import { FormCheckbox } from "../../../components";

type PublicSharingPropertyProps = {
  editable: boolean;
  onLayerDataUpdateOnly: (valueMap: PartialAllLayerData) => void;
  onLayerDataUpdate: (valueMap: PartialAllLayerData) => void;
} & FormikProps<BuilderLayerJSONParitalAll>;

export const PublicSharingProperty = React.memo(
  ({
    editable,
    values,
    onLayerDataUpdateOnly,
    onLayerDataUpdate,
  }: PublicSharingPropertyProps) => {
    const layerDataProperties = ["editLock", "showOnTop"];
    const [expanded, setExpanded] = useState(true);
    const { value: enablePublicSharing } = useFeatureFlag(
      ConfigCatFlags.PUBLIC_SHARING,
      false
    );
    const AllowedLayerTypes = useMemo(() => getAllowedLayerTypes(values), [
      values,
    ]);
    const owner = useSelector((state: RootState) => state.schemeReducer.owner);

    if (
      !enablePublicSharing ||
      !AllowedLayerTypes ||
      layerDataProperties.every(
        (value) => !AllowedLayerTypes.includes("layer_data." + value)
      ) ||
      (values.layer_data.ownerForGallery &&
        owner?.id !== values.layer_data.ownerForGallery)
    )
      return <></>;
    return (
      <Accordion
        expanded={expanded}
        onChange={() => {
          setExpanded(!expanded);
          focusBoardQuickly();
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Public Sharing</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexDirection="column" width="100%">
            {AllowedLayerTypes.includes("layer_data.editLock") ? (
              <Box display="flex" alignItems="center" height="40px">
                <LightTooltip
                  title="Disabling this will make this layer as a watermark so that public users can't modify it after clone"
                  arrow
                >
                  <CustomFormControlLabel
                    control={
                      <FormCheckbox
                        color="primary"
                        name="editLock"
                        fieldKey="editLock"
                        checked={!values.layer_data.editLock}
                        disabled={!editable}
                        fieldFunc={(editLockDisabled) => ({
                          editLock: !editLockDisabled,
                          ownerForGallery: !editLockDisabled
                            ? owner?.id
                            : undefined,
                        })}
                        onUpdateField={onLayerDataUpdateOnly}
                        onUpdateDB={onLayerDataUpdate}
                      />
                    }
                    label="Users can modify this layer"
                    labelPlacement="start"
                  />
                </LightTooltip>
              </Box>
            ) : (
              <></>
            )}
            {AllowedLayerTypes.includes("layer_data.showOnTop") ? (
              <Box display="flex" alignItems="center" height="40px">
                <LightTooltip
                  title="Keep this layer on top of other layers"
                  arrow
                >
                  <CustomFormControlLabel
                    control={
                      <FormCheckbox
                        color="primary"
                        name="showOnTop"
                        fieldKey="showOnTop"
                        checked={values.layer_data.showOnTop}
                        disabled={!editable}
                        onUpdateField={onLayerDataUpdateOnly}
                        onUpdateDB={onLayerDataUpdate}
                      />
                    }
                    label="Keep on top of other layers"
                    labelPlacement="start"
                  />
                </LightTooltip>
              </Box>
            ) : (
              <></>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  }
);

export const CustomFormControlLabel = styled(FormControlLabel)`
  margin-left: 0;
  color: rgba(255, 255, 255, 0.5);
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 40px;
  & .MuiFormControlLabel-label {
    font-size: 14px;
  }
`;

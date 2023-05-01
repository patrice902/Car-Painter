import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import { funWords } from "src/constant";
import { getTwoRandomNumbers } from "src/helper";
import CarMakeAutocomplete from "src/pages/projects/components/CarMakeAutocomplete";
import { CarMake } from "src/types/model";

import {
  CustomDialogActions,
  NameField,
  useStyles,
} from "./CreateProjectDialog.style";

type CreateProjectDialogProps = {
  onContinue: (carMake: CarMake, name: string) => void;
  onCancel: () => void;
  open: boolean;
  carMakeList: CarMake[];
  predefinedCarMakeID?: string;
};

export const CreateProjectDialog = React.memo(
  ({
    onContinue,
    onCancel,
    open,
    carMakeList,
    predefinedCarMakeID,
  }: CreateProjectDialogProps) => {
    const classes = useStyles();
    const [carMake, setCarMake] = useState<CarMake | undefined | null>(null);
    const [name, setName] = useState("");

    const [placeHolderName, setPlaceHolderName] = useState("");

    const handleSubmit = useCallback(() => {
      const schemeName = name && name.length ? name : placeHolderName;
      if (carMake) onContinue(carMake, schemeName);
    }, [carMake, name, placeHolderName, onContinue]);

    const handleKeyDown = useCallback(
      (event) => {
        if (event.keyCode === 13 && carMake) {
          event.preventDefault();
          handleSubmit();
        }
      },
      [carMake, handleSubmit]
    );

    useEffect(() => {
      if (predefinedCarMakeID && carMakeList && carMakeList.length) {
        const make = carMakeList.find(
          (item) => item.id.toString() === predefinedCarMakeID
        );
        setCarMake(make);
      }
    }, [carMakeList, predefinedCarMakeID]);

    useEffect(() => {
      if (open) {
        const rands = getTwoRandomNumbers(funWords.length);
        setPlaceHolderName(
          funWords[rands[0]] + " " + funWords[rands[1]] + " Paint"
        );
      }
    }, [open]);

    return (
      <Dialog
        aria-labelledby="project-select-title"
        open={open}
        onClose={onCancel}
      >
        <DialogTitle id="project-select-title">Create a new paint</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column">
            <CarMakeAutocomplete
              label="Select Vehicle"
              value={carMake}
              className={classes.carMakeAutocomplete}
              onChange={(event, newValue) =>
                setCarMake(newValue as CarMake | null)
              }
              onKeyDown={handleKeyDown}
            />

            <NameField
              label="Name"
              value={name && name.length ? name : placeHolderName}
              variant="outlined"
              inputProps={{ maxLength: "50" }}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={handleKeyDown}
            />
          </Box>
        </DialogContent>
        <CustomDialogActions>
          <Button onClick={onCancel} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="outlined"
            disabled={!carMake ? true : false}
          >
            Continue
          </Button>
        </CustomDialogActions>
      </Dialog>
    );
  }
);

export default CreateProjectDialog;

import {
  Box,
  Checkbox,
  CircularProgress,
  TextField,
  Typography,
} from "@material-ui/core";
import { Autocomplete, AutocompleteProps } from "@material-ui/lab";
import _ from "lodash";
import React, { useCallback, useMemo } from "react";
import { BsPinAngle, BsPinAngleFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/redux";
import { createCarPin, deleteCarPin } from "src/redux/reducers/carPinReducer";
import { CarMake } from "src/types/model";

interface CarMakeAutocompleteProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> extends Omit<
    AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
    "options" | "groupBy" | "getOptionLabel" | "renderInput" | "renderOption"
  > {
  label: string;
}

export const CarMakeAutocomplete = React.memo(
  ({
    label,
    ...props
  }: CarMakeAutocompleteProps<
    CarMake,
    boolean | undefined,
    boolean | undefined,
    boolean | undefined
  >) => {
    const dispatch = useDispatch();
    const carMakeList = useSelector(
      (state: RootState) => state.carMakeReducer.list
    );
    const carPinList = useSelector(
      (state: RootState) => state.carPinReducer.list
    );
    const updatingCarMakeID = useSelector(
      (state: RootState) => state.carPinReducer.updatingID
    );

    const carPinIDList = useMemo(
      () => carPinList.map((carPin) => carPin.car_make),
      [carPinList]
    );
    const sortedCarMakesList = useMemo(
      () =>
        _.orderBy(
          [...carMakeList.filter((item) => !item.is_parent && !item.deleted)],
          [(carMake) => carPinIDList.includes(carMake.id), "car_type", "name"],
          ["desc", "asc", "asc"]
        ),
      [carMakeList, carPinIDList]
    );

    const funcGroupBy = useCallback(
      (carMake: CarMake) =>
        carPinIDList.includes(carMake.id) ? "Pinned" : carMake.car_type,
      [carPinIDList]
    );

    return (
      <>
        {carMakeList && carMakeList.length ? (
          <Autocomplete
            options={sortedCarMakesList}
            groupBy={funcGroupBy}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label={label} variant="outlined" />
            )}
            renderOption={(option) => (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
              >
                <Typography>{option.name}</Typography>
                {option.id === updatingCarMakeID ? (
                  <CircularProgress
                    size={30}
                    color="secondary"
                    style={{ margin: "5px" }}
                  />
                ) : (
                  <Checkbox
                    icon={<BsPinAngle />}
                    checkedIcon={<BsPinAngleFill />}
                    checked={carPinIDList.includes(option.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (carPinIDList.includes(option.id)) {
                        dispatch(deleteCarPin(option.id));
                      } else {
                        dispatch(createCarPin(option.id));
                      }
                    }}
                  />
                )}
              </Box>
            )}
            {...props}
          />
        ) : (
          <></>
        )}
      </>
    );
  }
);

export default CarMakeAutocomplete;

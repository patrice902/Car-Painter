import { IconButton, Menu, useMediaQuery } from "@material-ui/core";
import { MoreVert as ActionIcon } from "@material-ui/icons";
import FilterListIcon from "@material-ui/icons/FilterList";
import { SearchBox } from "components/common";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
} from "components/MaterialUI";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components/macro";

import CarMakeAutocomplete from "./CarMakeAutocomplete";

export const FilterBar = React.memo(
  ({
    search,
    setSearch,
    selectedVehicle,
    setSelectedVehicle,
    hideLegacy,
    setHideLegacy,
    sortBy,
    setSortBy,
    legacyFilter,
  }) => {
    const isAboveMobile = useMediaQuery((theme) => theme.breakpoints.up("sm"));
    const [actionMenuEl, setActionMenuEl] = useState(null);
    const [showFilter, setShowFilter] = useState(true);

    const handleSearchChange = useCallback((value) => setSearch(value), [
      setSearch,
    ]);

    const handleActionMenuClick = (event) => {
      setActionMenuEl(event.currentTarget);
    };

    const handleActionMenuClose = () => {
      setActionMenuEl(null);
    };

    const toggleFilter = () => setShowFilter((prev) => !prev);

    useEffect(() => {
      setShowFilter(isAboveMobile);
    }, [isAboveMobile]);

    const sortByComponent = (
      <CustomFormControl variant="outlined">
        <InputLabel id="sort-label">Sort By</InputLabel>
        <Select
          labelId="sort-label"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          label="Sort By"
        >
          <MenuItem value={1}>Project Name</MenuItem>
          <MenuItem value={2}>Vehicle Name</MenuItem>
          <MenuItem value={3}>Last Modified</MenuItem>
        </Select>
      </CustomFormControl>
    );

    return (
      <>
        {!isAboveMobile ? (
          <Box
            display="flex"
            justifyContent="end"
            marginRight={4}
            marginBottom={4}
          >
            <Button
              startIcon={<FilterListIcon />}
              onClick={toggleFilter}
              variant={showFilter ? "contained" : "outlined"}
            >
              {!showFilter ? "Filter" : "Hide"}
            </Button>
          </Box>
        ) : (
          <></>
        )}

        {showFilter ? (
          <>
            <Wrapper
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box maxWidth="300px">
                <SearchBox value={search} onChange={handleSearchChange} />
              </Box>
              {isAboveMobile ? null : sortByComponent}
            </Wrapper>

            <Wrapper
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              my={3}
            >
              {isAboveMobile ? sortByComponent : null}
              <StyledCarMakeAutocomplete
                label="Filter By Vehicle"
                value={selectedVehicle}
                onChange={(event, newValue) => {
                  setSelectedVehicle(newValue);
                }}
              />
              <IconButton
                aria-haspopup="true"
                aria-controls={`projects-control`}
                onClick={handleActionMenuClick}
              >
                <ActionIcon />
              </IconButton>
              <Menu
                id={`projects-control`}
                elevation={0}
                getContentAnchorEl={null}
                anchorEl={actionMenuEl}
                keepMounted
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(actionMenuEl)}
                onClose={handleActionMenuClose}
              >
                {legacyFilter ? (
                  <MenuItem>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={hideLegacy}
                          onChange={(e) => setHideLegacy(e.target.checked)}
                        />
                      }
                      label="Hide Legacy"
                    />
                  </MenuItem>
                ) : (
                  <></>
                )}
              </Menu>
            </Wrapper>
          </>
        ) : (
          <></>
        )}
      </>
    );
  }
);

const StyledCarMakeAutocomplete = styled(CarMakeAutocomplete)`
  max-width: 500px;
  width: 100%;
  margin-right: 16px;
  .MuiInputLabel-outlined {
    transform: translate(14px, 12px) scale(1);
    &.MuiInputLabel-shrink {
      transform: translate(14px, -6px) scale(0.75);
    }
  }
  .MuiInputBase-root {
    padding-top: 0;
    padding-bottom: 0;
  }
`;

const CustomFormControl = styled(FormControl)`
  .MuiInputBase-root {
    height: 38px;
    margin-right: 16px;

    ${(props) => props.theme.breakpoints.up("sm")} {
      margin-right: 10px;
    }
  }
`;

const Wrapper = styled(Box)`
  gap: 8px;
`;

export default FilterBar;

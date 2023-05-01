import { InputBase } from "@material-ui/core";
import React, { useCallback } from "react";

import { SearchIcon, useStyles } from "./SearchBox.style";

type SearchBoxProps = {
  value: string;
  onChange: (value: string) => void;
};

export const SearchBox = React.memo((props: SearchBoxProps) => {
  const { value, onChange } = props;

  const classes = useStyles();
  const handleChange = useCallback(
    (event) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Search"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        value={value}
        inputProps={{ "aria-label": "search" }}
        onChange={handleChange}
      />
    </div>
  );
});

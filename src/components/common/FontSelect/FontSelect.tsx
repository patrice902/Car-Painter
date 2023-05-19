import { Box, List, MenuItem, TextField } from "@material-ui/core";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImageWithLoad } from "src/components/common";
import config from "src/config";
import { focusBoardQuickly } from "src/helper";
import { RootState } from "src/redux";
import { updateScheme } from "src/redux/reducers/schemeReducer";
import { BuilderFont } from "src/types/model";

import { CustomSelect, FontImage } from "./FontSelect.style";

export type FontSelectProps = {
  fontList: BuilderFont[];
  value?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
};

export const FontSelect = React.memo((props: FontSelectProps) => {
  const { fontList, value, disabled, onChange } = props;
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const currentScheme = useSelector(
    (state: RootState) => state.schemeReducer.current
  );
  const filteredFontList = useMemo(
    () =>
      fontList.filter((item) =>
        item.font_name.toLowerCase().includes(search.toLocaleLowerCase())
      ),
    [fontList, search]
  );

  const stopPropagation = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  const hanldeSearchTextChange = useCallback((e) => {
    stopPropagation(e);
    setSearch(e.target.value);
  }, []);

  const handleChangeFont = useCallback(
    (fontID) => {
      if (currentScheme) {
        dispatch(
          updateScheme({ ...currentScheme, last_font: fontID }, false, false)
        );
      }

      setOpen(false);
      onChange(fontID);
      focusBoardQuickly();
    },
    [currentScheme, dispatch, onChange]
  );

  const handleOpen = () => setOpen(true);

  const handleClose = useCallback(() => {
    setOpen(false);
    focusBoardQuickly();
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
      stopPropagation(e);
    },
    [handleClose]
  );

  return (
    <CustomSelect
      labelId="font-select-label"
      id="font-select-outlined"
      value={value}
      open={open}
      disabled={disabled}
      label="Font"
      onOpen={handleOpen}
      onClose={handleClose}
      renderValue={(id) => {
        const font = fontList.find((item) => item.id === id);
        if (!font) {
          return <>Select Font</>;
        }
        return (
          <ImageWithLoad
            ImageComponent={FontImage}
            src={`${config.assetsURL}/${font.font_preview}`}
            alt={font.font_name}
            minHeight="20px"
            justifyContent="flex-start"
          />
        );
      }}
    >
      <Box display="flex" flexDirection="column">
        <Box mx={2} mb={2}>
          <TextField
            value={search}
            label="Filter"
            variant="outlined"
            onChange={hanldeSearchTextChange}
            onClick={stopPropagation}
            onKeyDown={handleKeyDown}
            style={{ width: "100%" }}
            autoFocus={true}
          />
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          maxHeight="500px"
          overflow="auto"
        >
          <List>
            {filteredFontList.map((font) => (
              <MenuItem
                value={font.id}
                key={font.id}
                onClick={() => handleChangeFont(font.id)}
              >
                <ImageWithLoad
                  ImageComponent={FontImage}
                  src={`${config.assetsURL}/${font.font_preview}`}
                  alt={font.font_name}
                  minHeight="20px"
                  justifyContent="flex-start"
                />
              </MenuItem>
            ))}
          </List>
        </Box>
      </Box>
    </CustomSelect>
  );
});

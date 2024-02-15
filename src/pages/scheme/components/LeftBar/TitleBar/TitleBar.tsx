import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { Box, IconButton } from "@material-ui/core";
import { Settings as SettingsIcon } from "@material-ui/icons";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LightTooltip } from "src/components/common";
import { SchemeSettingsDialog } from "src/components/dialogs";
import { decodeHtml, focusBoardQuickly } from "src/helper";
import { RootState } from "src/redux";
import { updateScheme } from "src/redux/reducers/schemeReducer";
import { DialogTypes } from "src/types/enum";
import { useDebouncedCallback } from "use-debounce";

import { CustomIcon, NameInput } from "./TitleBar.style";

type TitleBarProps = {
  editable: boolean;
  onBack: () => void;
};

export const TitleBar = React.memo(({ editable, onBack }: TitleBarProps) => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [dialog, setDialog] = useState<DialogTypes | null>(null);

  const currentScheme = useSelector(
    (state: RootState) => state.schemeReducer.current
  );
  const saving = useSelector((state: RootState) => state.schemeReducer.saving);

  const hideDialog = useCallback(() => {
    setDialog(null);
    focusBoardQuickly();
  }, []);

  const handleSaveName = useDebouncedCallback(() => {
    if (!currentScheme) return;

    dispatch(updateScheme({ id: currentScheme.id, name }, true, false));
  }, 1000);

  const handleNameChange = useCallback(
    (event) => {
      setName(decodeHtml(event.target.value ?? ""));
      handleSaveName();
    },
    [handleSaveName]
  );

  useEffect(() => {
    if (currentScheme) {
      setName(currentScheme.name);
    }
  }, [currentScheme]);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      pl={1}
      my={1}
    >
      <Box display="flex" alignItems="center" flexGrow={1}>
        <Box mr={1}>
          <LightTooltip title="Back" arrow>
            <IconButton size="medium" disabled={saving} onClick={onBack}>
              <CustomIcon icon={faChevronLeft} size="xs" />
            </IconButton>
          </LightTooltip>
        </Box>
        <NameInput
          value={decodeHtml(name)}
          onChange={handleNameChange}
          inputProps={{ maxLength: "50" }}
        />
      </Box>
      <Box display="flex" marginLeft="4px">
        <LightTooltip title="Settings" arrow>
          <IconButton
            size="medium"
            onClick={() => setDialog(DialogTypes.SETTINGS)}
          >
            <SettingsIcon />
          </IconButton>
        </LightTooltip>
      </Box>

      <SchemeSettingsDialog
        editable={editable}
        open={dialog === DialogTypes.SETTINGS}
        onCancel={hideDialog}
      />
    </Box>
  );
});

export default TitleBar;

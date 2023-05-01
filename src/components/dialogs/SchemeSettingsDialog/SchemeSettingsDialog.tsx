import { Dialog, DialogTitle } from "@material-ui/core";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/redux";
import {
  createFavoriteScheme,
  deleteAndCreateNewCarMakeLayers,
  deleteFavoriteItem,
  deleteScheme,
  updateScheme,
} from "src/redux/reducers/schemeReducer";

import { GeneralSetting } from "./components";

type SchemeSettingsDialogProps = {
  editable: boolean;
  open: boolean;
  onCancel: () => void;
};

export const SchemeSettingsDialog = React.memo(
  ({ editable, onCancel, open }: SchemeSettingsDialogProps) => {
    const dispatch = useDispatch();

    const currentScheme = useSelector(
      (state: RootState) => state.schemeReducer.current
    );
    const owner = useSelector((state: RootState) => state.schemeReducer.owner);
    const modifier = useSelector(
      (state: RootState) => state.schemeReducer.lastModifier
    );
    const currentCarMake = useSelector(
      (state: RootState) => state.carMakeReducer.current
    );
    const currentUser = useSelector(
      (state: RootState) => state.authReducer.user
    );
    const favoriteSchemeList = useSelector(
      (state: RootState) => state.schemeReducer.favoriteList
    );
    const favroiteScheme = useMemo(
      () =>
        favoriteSchemeList.find((item) => item.scheme_id === currentScheme?.id),
      [favoriteSchemeList, currentScheme]
    );

    const handleCreateFavorite = useCallback(
      (user_id, scheme_id, callback) => {
        dispatch(
          createFavoriteScheme(
            {
              user_id,
              scheme_id,
            },
            callback
          )
        );
      },
      [dispatch]
    );

    const handleRemoveFavorite = useCallback(
      (favoriteID, callback) => {
        dispatch(deleteFavoriteItem(favoriteID, callback));
      },
      [dispatch]
    );
    const handleSaveName = useCallback(
      (schemeID, name) => {
        dispatch(updateScheme({ id: schemeID, name }, true, false));
      },
      [dispatch]
    );
    const handleDeleteProject = useCallback(
      (schemeID, callback) => {
        dispatch(deleteScheme(schemeID, callback));
      },
      [dispatch]
    );

    const handleRenewCarMakeLayers = useCallback(() => {
      if (currentScheme)
        dispatch(deleteAndCreateNewCarMakeLayers(currentScheme?.id));
    }, [dispatch, currentScheme]);

    if (!currentScheme || !currentCarMake || !currentUser) return <></>;

    return (
      <Dialog
        aria-labelledby="insert-text-title"
        open={open}
        onClose={onCancel}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="insert-text-title">Project Settings</DialogTitle>
        <GeneralSetting
          editable={editable}
          scheme={currentScheme}
          currentCarMake={currentCarMake}
          currentUser={currentUser}
          owner={owner}
          modifier={modifier}
          favoriteID={favroiteScheme?.id}
          onRemoveFavorite={handleRemoveFavorite}
          onAddFavorite={handleCreateFavorite}
          onRename={handleSaveName}
          onDelete={handleDeleteProject}
          onClose={onCancel}
          onRenewCarMakeLayers={handleRenewCarMakeLayers}
        />
      </Dialog>
    );
  }
);

export default SchemeSettingsDialog;

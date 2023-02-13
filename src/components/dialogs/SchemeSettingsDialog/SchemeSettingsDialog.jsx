import { Dialog, DialogTitle } from "components/MaterialUI";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createFavoriteScheme,
  deleteAndCreateNewCarMakeLayers,
  deleteFavoriteItem,
  deleteScheme,
  updateScheme,
} from "redux/reducers/schemeReducer";

import { GeneralSetting } from "./components";

export const SchemeSettingsDialog = React.memo((props) => {
  const { editable, onCancel, open } = props;
  const dispatch = useDispatch();

  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const owner = useSelector((state) => state.schemeReducer.owner);
  const modifier = useSelector((state) => state.schemeReducer.lastModifier);
  const currentCarMake = useSelector((state) => state.carMakeReducer.current);
  const currentUser = useSelector((state) => state.authReducer.user);
  const favoriteSchemeList = useSelector(
    (state) => state.schemeReducer.favoriteList
  );
  const favroiteScheme = useMemo(
    () =>
      favoriteSchemeList.find((item) => item.scheme_id === currentScheme.id),
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
    dispatch(deleteAndCreateNewCarMakeLayers(currentScheme.id));
  }, [dispatch, currentScheme]);

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
        favoriteID={favroiteScheme ? favroiteScheme.id : null}
        onRemoveFavorite={handleRemoveFavorite}
        onAddFavorite={handleCreateFavorite}
        onRename={handleSaveName}
        onDelete={handleDeleteProject}
        onClose={onCancel}
        onRenewCarMakeLayers={handleRenewCarMakeLayers}
      />
    </Dialog>
  );
});

export default SchemeSettingsDialog;

import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Box, Dialog, DialogTitle } from "components/MaterialUI";
import { SharingTab, ShowroomTab } from "./components";
import {
  StyledTabs,
  StyledTab,
  TabPanel,
  a11yProps,
} from "./SharingDialog.style";

import { setMessage } from "redux/reducers/messageReducer";
import {
  createSharedUser,
  updateSharedUserItem,
  deleteSharedUserItem,
} from "redux/reducers/schemeReducer";

export const SharingDialog = React.memo((props) => {
  const { editable, onCancel, open, tab, retrieveTGAPNGDataUrl } = props;
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(tab || 0);

  const currentScheme = useSelector((state) => state.schemeReducer.current);
  const sharedUsers = useSelector((state) => state.schemeReducer.sharedUsers);
  const owner = useSelector((state) => state.schemeReducer.owner);
  const currentUser = useSelector((state) => state.authReducer.user);

  const handleTabChange = useCallback(
    (event, newValue) => {
      setTabValue(newValue);
    },
    [setTabValue]
  );

  useEffect(() => {
    setTabValue(tab);
  }, [tab]);

  const handleApplySharingSetting = useCallback(
    (data) => {
      console.log(data);
      let count = 0;
      if (data.newUser && data.newUser.editable >= 0 && data.newUser.pro_user) {
        count += 1;
        dispatch(
          createSharedUser(
            {
              user_id: data.newUser.user_id,
              scheme_id: data.newUser.scheme_id,
              accepted: data.newUser.accepted,
              editable: data.newUser.editable,
            },
            () => {
              dispatch(
                setMessage({
                  message: "Shared Project successfully!",
                  type: "success",
                })
              );
            }
          )
        );
      }
      for (let sharedUser of data.sharedUsers) {
        if (sharedUser.editable === -1) {
          dispatch(
            deleteSharedUserItem(sharedUser.id, () => {
              if (!count)
                dispatch(
                  setMessage({
                    message: "Applied Sharing Setting successfully!",
                    type: "success",
                  })
                );
              count += 1;
            })
          );
        } else {
          dispatch(
            updateSharedUserItem(
              sharedUser.id,
              {
                editable: sharedUser.editable,
              },
              () => {
                if (!count)
                  dispatch(
                    setMessage({
                      message: "Applied Sharing Setting successfully!",
                      type: "success",
                    })
                  );
                count += 1;
              }
            )
          );
        }
      }

      onCancel();
    },
    [dispatch, onCancel]
  );

  return (
    <Dialog
      aria-labelledby="insert-text-title"
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="insert-text-title">Project Sharing</DialogTitle>
      <StyledTabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="Project Settings Tab"
      >
        <StyledTab label="Sharing" {...a11yProps(0)} />
        <StyledTab label="Showroom" {...a11yProps(1)} />
      </StyledTabs>
      <Box>
        <TabPanel value={tabValue} index={0}>
          <SharingTab
            editable={editable}
            owner={owner}
            currentUser={currentUser}
            schemeID={currentScheme.id}
            sharedUsers={sharedUsers}
            onApply={handleApplySharingSetting}
            onCancel={onCancel}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <ShowroomTab
            retrieveTGAPNGDataUrl={retrieveTGAPNGDataUrl}
            schemeID={currentScheme.id}
            onClose={onCancel}
          />
        </TabPanel>
      </Box>
    </Dialog>
  );
});

export default SharingDialog;

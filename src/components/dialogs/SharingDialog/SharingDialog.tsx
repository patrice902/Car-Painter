import { Box, Dialog, DialogTitle } from "@material-ui/core";
import { useFeatureFlag } from "configcat-react";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/redux";
import { setMessage } from "src/redux/reducers/messageReducer";
import {
  createSharedUser,
  deleteSharedUserItem,
  updateSharedUserItem,
} from "src/redux/reducers/schemeReducer";
import { ConfigCatFlags } from "src/types/enum";

import { SharingTab, ShowroomTab } from "./components";
import {
  a11yProps,
  StyledTab,
  StyledTabs,
  TabPanel,
} from "./SharingDialog.style";

type SharingDialogProps = {
  editable: boolean;
  open: boolean;
  onCancel: () => void;
  tab?: number;
  retrieveTGAPNGDataUrl: () => Promise<string | null | undefined>;
};

export const SharingDialog = React.memo(
  ({
    editable,
    onCancel,
    open,
    tab,
    retrieveTGAPNGDataUrl,
  }: SharingDialogProps) => {
    const dispatch = useDispatch();
    const [tabValue, setTabValue] = useState(tab ?? 0);
    const { value: enableSubmitToShowroom } = useFeatureFlag(
      ConfigCatFlags.SUBMIT_TO_SHOWROOM,
      true
    );

    const currentScheme = useSelector(
      (state: RootState) => state.schemeReducer.current
    );
    const sharedUsers = useSelector(
      (state: RootState) => state.schemeReducer.sharedUsers
    );
    const owner = useSelector((state: RootState) => state.schemeReducer.owner);
    const currentUser = useSelector(
      (state: RootState) => state.authReducer.user
    );

    const showSowroomTab = useMemo(() => enableSubmitToShowroom && editable, [
      enableSubmitToShowroom,
      editable,
    ]);

    const handleTabChange = useCallback(
      (event: ChangeEvent<unknown>, newValue?: number) => {
        if (newValue === undefined) return;

        setTabValue(newValue);
      },
      [setTabValue]
    );

    useEffect(() => {
      setTabValue(tab ?? 0);
    }, [tab]);

    const handleApplySharingSetting = useCallback(
      (data) => {
        let count = 0;
        if (
          data.newUser &&
          data.newUser.editable >= 0 &&
          data.newUser.pro_user
        ) {
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
        for (const sharedUser of data.sharedUsers) {
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

    if (!currentScheme || !currentUser) return <></>;

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
          {showSowroomTab ? (
            <StyledTab label="Showroom" {...a11yProps(1)} />
          ) : (
            <></>
          )}
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
          {showSowroomTab ? (
            <TabPanel value={tabValue} index={1}>
              <ShowroomTab
                retrieveTGAPNGDataUrl={retrieveTGAPNGDataUrl}
                schemeID={currentScheme.id}
                onClose={onCancel}
              />
            </TabPanel>
          ) : (
            <></>
          )}
        </Box>
      </Dialog>
    );
  }
);

export default SharingDialog;

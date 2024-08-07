import {
  Box,
  Button,
  DialogActions,
  MenuItem,
  Select,
  TextField,
  Theme,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { Form, FormikProps } from "formik";
import React, { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { decodeHtml, getUserName } from "src/helper";
import { RootState } from "src/redux";
import UserService from "src/services/userService";
import { UserMin } from "src/types/model";
import { useDebouncedCallback } from "use-debounce";

import { SharingTabFormValues } from "./model";
import { CustomDialogContent } from "./styles";

type InnerFormProps = {
  owner?: UserMin | null;
  editable: boolean;
  currentUserID: number;
  schemeID: number;
  onCancel: () => void;
} & FormikProps<SharingTabFormValues>;

export const InnerForm = React.memo(
  ({
    owner,
    editable,
    currentUserID,
    schemeID,
    onCancel,
    ...formProps
  }: InnerFormProps) => {
    const {
      isSubmitting,
      isValid,
      handleSubmit,
      setFieldValue,
      values,
    } = formProps;

    const isAboveMobile = useMediaQuery((theme: Theme) =>
      theme.breakpoints.up("sm")
    );

    const blockedUsers = useSelector(
      (state: RootState) => state.authReducer.blockedUsers
    );
    const blockedBy = useSelector(
      (state: RootState) => state.authReducer.blockedBy
    );

    const isOwner = useMemo(
      () => (!owner ? false : owner.id === currentUserID),
      [owner, currentUserID]
    );

    const setNewUser = useCallback(
      async (userID) => {
        setFieldValue(`newUser`, null);
        if (userID && userID.length) {
          try {
            const foundUser = await UserService.getUserByID(userID);
            if (
              foundUser &&
              !values.sharedUsers.find(
                (item) => item.user_id === foundUser.id
              ) &&
              !blockedUsers.includes(foundUser.id) &&
              !blockedBy.includes(foundUser.id)
            ) {
              setFieldValue(`newUser`, {
                user_id: foundUser.id,
                user: foundUser,
                pro_user: foundUser.pro_user,
                scheme_id: schemeID,
                accepted: 0,
                editable: 0,
              });
            }
          } catch (_error) {
            setFieldValue(`newUser`, {
              user_id: userID,
              user: undefined,
              pro_user: false,
              scheme_id: schemeID,
              accepted: 0,
              editable: 0,
            });
          }
        }
      },
      [schemeID, setFieldValue, values.sharedUsers, blockedUsers, blockedBy]
    );

    const debouncedSetNewUser = useDebouncedCallback(
      (userID) => setNewUser(userID),
      500
    );

    const handleNewUserPermissionChange = useCallback(
      (value) => {
        setFieldValue(`newUser['editable']`, value);
      },
      [setFieldValue]
    );

    const handleSharedUserChange = useCallback(
      (value, index) => {
        setFieldValue(`sharedUsers[${index}]['editable']`, value);
      },
      [setFieldValue]
    );

    return (
      <Form onSubmit={handleSubmit} noValidate>
        <CustomDialogContent dividers id="insert-text-dialog-content">
          {isOwner ? (
            <Box
              display={isAboveMobile ? "flex" : "block"}
              justifyContent="space-between"
              mb={5}
              pr={5}
            >
              <TextField
                label="Enter Customer ID"
                variant="outlined"
                name="newUser"
                type="number"
                onChange={(e) => debouncedSetNewUser(e.target.value)}
                style={{ width: isAboveMobile ? 200 : "100%" }}
              />
              {values.newUser ? (
                <Box
                  display="flex"
                  justifyContent={
                    values.newUser?.user ? "space-between" : "flex-end"
                  }
                  alignItems="center"
                  flexGrow={1}
                  ml={isAboveMobile ? 5 : 0}
                  mt={isAboveMobile ? 0 : 5}
                >
                  {values.newUser?.user ? (
                    <>
                      <Box mt="-7px">
                        <Typography>
                          {decodeHtml(getUserName(values.newUser.user))}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          ID #{values.newUser.user.id}
                        </Typography>
                      </Box>
                      <Box height="31px">
                        {values.newUser.pro_user ? (
                          <Select
                            variant="outlined"
                            value={values.newUser.editable}
                            onChange={(event) =>
                              handleNewUserPermissionChange(event.target.value)
                            }
                          >
                            <MenuItem value={0}>Can view</MenuItem>
                            <MenuItem value={1}>{"Can view & edit"}</MenuItem>
                            <MenuItem value={-1}>Cancel</MenuItem>
                          </Select>
                        ) : (
                          <Typography>not a Pro member </Typography>
                        )}
                      </Box>
                    </>
                  ) : (
                    <Typography>
                      No User with ID #{values.newUser.user_id}
                    </Typography>
                  )}
                </Box>
              ) : (
                <></>
              )}
            </Box>
          ) : (
            <></>
          )}
          <Box maxHeight="50vh" pr={5} overflow="auto">
            <Box display="flex" justifyContent="space-between" mb={4}>
              <Typography color="textSecondary">
                {decodeHtml(getUserName(owner)) + (isOwner ? " (you)" : "")}
              </Typography>
              <Typography color="textSecondary">Owner</Typography>
            </Box>
            {values.sharedUsers
              .filter(
                (sharedUser) =>
                  !blockedUsers.includes(sharedUser.user.id) &&
                  !blockedBy.includes(sharedUser.user.id)
              )
              .map((sharedUser, index) => (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  key={index}
                  mb={4}
                >
                  <Box mt="-7px">
                    <Typography color="textSecondary">
                      {decodeHtml(getUserName(sharedUser.user)) +
                        (currentUserID === sharedUser.user.id ? " (you)" : "")}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      ID #{sharedUser.user.id}
                    </Typography>
                  </Box>
                  <Box height="31px">
                    <Select
                      variant="outlined"
                      value={sharedUser.editable}
                      disabled={
                        !isOwner && currentUserID !== sharedUser.user.id
                      }
                      onChange={(event) =>
                        handleSharedUserChange(event.target.value, index)
                      }
                    >
                      <MenuItem value={0}>Can view</MenuItem>
                      <MenuItem value={1} disabled={!editable}>
                        {"Can view & edit"}
                      </MenuItem>
                      <MenuItem value={-1}>Remove</MenuItem>
                    </Select>
                  </Box>
                </Box>
              ))}
          </Box>
        </CustomDialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="secondary">
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="outlined"
            disabled={isSubmitting || !isValid}
          >
            Apply
          </Button>
        </DialogActions>
      </Form>
    );
  }
);

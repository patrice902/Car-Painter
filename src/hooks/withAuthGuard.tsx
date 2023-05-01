import { Box, useTheme } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { ScreenLoader } from "src/components/common";
import { RootState } from "src/redux";
import {
  setPreviousPath,
  signInWithCookie,
} from "src/redux/reducers/authReducer";

// For routes that can only be accessed by authenticated users
export const withAuthGuard = (
  Component: React.ComponentType,
  redirectToSignIn = false,
  adminOnly = false
) =>
  React.memo((props) => {
    const dispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.authReducer);
    const history = useHistory();
    const theme = useTheme();

    useEffect(() => {
      if (!auth.user) {
        dispatch(
          signInWithCookie(undefined, () => {
            if (redirectToSignIn) {
              dispatch(setPreviousPath(window.location.pathname));
              history.push("/auth/sign-in");
            }
          })
        );
      } else {
        if (adminOnly && !auth.user.is_admin) {
          history.push("/");
        }
        if (!auth.user.pro_user) {
          window.location.href = "https://www.tradingpaints.com/page/Builder";
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.user]);

    return auth.loading ? (
      <Box
        bgcolor={theme.palette.background.default}
        height="100vh"
        p={0}
        m={0}
      >
        <ScreenLoader />
      </Box>
    ) : (
      <Component {...props} />
    );
  });

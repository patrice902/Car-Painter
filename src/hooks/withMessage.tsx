import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/redux";
import { setMessage } from "src/redux/reducers/messageReducer";

const Message = React.memo(() => {
  const dispatch = useDispatch();
  const message = useSelector((state: RootState) => state.messageReducer);

  const handleClose = () => {
    dispatch(setMessage({ message: null }));
  };

  return (
    <Snackbar
      open={message.msg ? true : false}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      {message?.msg?.length ? (
        <Alert onClose={handleClose} severity={message.type}>
          {message.msg}
        </Alert>
      ) : (
        <></>
      )}
    </Snackbar>
  );
});

export const withMessage = (Component: React.FC) =>
  React.memo((props) => (
    <React.Fragment>
      <Message />
      <Component {...props} />
    </React.Fragment>
  ));

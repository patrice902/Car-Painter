import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type MessageType = "error" | "success" | "warning";

export type MessageReducerState = {
  msg: string | null;
  type: MessageType;
  timeout: number;
};

const initialState: MessageReducerState = {
  msg: null,
  type: "error", //'success', 'warning'
  timeout: -1,
};

export const slice = createSlice({
  name: "messageReducer",
  initialState,
  reducers: {
    setMessage: (
      state,
      action: PayloadAction<{
        message: string | null;
        type?: MessageType;
        timeout?: number;
      }>
    ) => {
      state.msg = action.payload.message;
      state.type = action.payload.type || "error";
      state.timeout = action.payload.timeout || 3000;
    },
  },
});

export const { setMessage } = slice.actions;

export default slice.reducer;

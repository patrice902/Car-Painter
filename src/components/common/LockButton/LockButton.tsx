import { IconButtonProps } from "@material-ui/core";
import React from "react";

import { CustomIconButton, LinkIcon, LinkOfficon } from "./LockButton.style";

export type LockButtonProps = {
  locked?: string;
} & IconButtonProps;

export const LockButton = React.memo(
  ({ locked, ...props }: LockButtonProps) => (
    <CustomIconButton {...props} locked={locked}>
      {locked === "true" ? <LinkIcon /> : <LinkOfficon />}
    </CustomIconButton>
  )
);

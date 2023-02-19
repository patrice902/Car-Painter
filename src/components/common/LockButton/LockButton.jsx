import React from "react";

import { CustomIconButton, LinkIcon, LinkOfficon } from "./LockButton.style";

export const LockButton = React.memo(({ locked, ...props }) => (
  <CustomIconButton {...props} locked={locked}>
    {locked === "true" ? <LinkIcon /> : <LinkOfficon />}
  </CustomIconButton>
));

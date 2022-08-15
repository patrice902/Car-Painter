import React from "react";

import { GuidesSetting } from "./components";

export const SchemeProperty = React.memo((props) => {
  const { editable } = props;

  return <GuidesSetting editable={editable} />;
});

export default SchemeProperty;

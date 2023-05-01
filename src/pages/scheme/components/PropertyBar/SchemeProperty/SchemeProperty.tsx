import React from "react";

import { GuidesSetting } from "./components";

export interface SchemePropertyProps {
  editable: boolean;
}

export const SchemeProperty = React.memo((props: SchemePropertyProps) => {
  const { editable } = props;

  return <GuidesSetting editable={editable} />;
});

export default SchemeProperty;

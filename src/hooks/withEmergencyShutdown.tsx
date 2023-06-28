import { useFeatureFlag } from "configcat-react";
import React from "react";
import Maintenance from "src/pages/fallback/Maintenance";
import { ConfigCatFlags } from "src/types/enum";

export const withEmergencyShutdown = (Component: React.FC) =>
  React.memo((props) => {
    const { value: emergencyShutDownValue } = useFeatureFlag(
      ConfigCatFlags.EMERGENCY_SHUT_DOWN,
      false
    );

    return (
      <React.Fragment>
        {emergencyShutDownValue ? <Maintenance /> : <Component {...props} />}
      </React.Fragment>
    );
  });

import React, { useEffect } from "react";
// import { pageview } from "react-ga";

export const withGAPageTracking = (Component: React.ComponentType) =>
  React.memo((props) => {
    useEffect(() => {
      // pageview(window.location.pathname + window.location.search);
    }, []);

    return <Component {...props} />;
  });

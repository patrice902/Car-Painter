import { FC, Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "src/pages/fallback/ErrorPage";

import ScreenLoader from "./ScreenLoader";

export const AppBoundary: FC = ({ children }) => {
  const [boundaryKey, setBoundaryKey] = useState<number>(0);

  const handleReset = () => {
    setBoundaryKey((prev) => prev + 1);
  };

  return (
    <ErrorBoundary
      onReset={handleReset}
      FallbackComponent={ErrorPage}
      resetKeys={[boundaryKey]}
    >
      <Suspense fallback={<ScreenLoader />}>{children}</Suspense>
    </ErrorBoundary>
  );
};

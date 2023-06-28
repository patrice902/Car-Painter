import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { withAuthGuard } from "src/hooks";
import { withGAPageTracking } from "src/hooks/withGAPageTracking";
import AuthLayout from "src/layouts/Auth";
import FallbackLayout from "src/layouts/Fallback";
import MainLayout from "src/layouts/Main";

import { Page404 } from "../pages/fallback/Page404";
import {
  authLayoutRoutes,
  fallbackLayoutRoutes,
  mainLayoutRoutes,
  RouteItem,
} from "./index";

const renderChildRoutes = (
  Layout: React.ComponentType,
  routes: RouteItem[]
): React.ReactNode =>
  routes.map(
    (
      {
        path,
        component: Component,
        children,
        guarded,
        redirectToSignIn,
        adminOnly,
      },
      index
    ) => {
      const ComponentLayout = withGAPageTracking(
        guarded ? withAuthGuard(Layout, redirectToSignIn, adminOnly) : Layout
      );

      return children ? (
        renderChildRoutes(Layout, children)
      ) : Component ? (
        <Route
          key={index}
          path={path}
          exact
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          render={(props: any) => (
            <ComponentLayout>
              <Component {...props} />
            </ComponentLayout>
          )}
        />
      ) : null;
    }
  );

const Routes = () => (
  <Router>
    <Switch>
      {renderChildRoutes(MainLayout, mainLayoutRoutes)}
      {renderChildRoutes(AuthLayout, authLayoutRoutes)}
      {renderChildRoutes(FallbackLayout, fallbackLayoutRoutes)}
      <Route exact path="/scheme/:id">
        <Redirect to="/project/:id" />
      </Route>
      <Route
        render={() => (
          <AuthLayout>
            <Page404 />
          </AuthLayout>
        )}
      />
    </Switch>
  </Router>
);

export default Routes;

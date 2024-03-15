import Admin from "src/pages/admin";
import SignIn from "src/pages/auth/SignIn";
import Page404 from "src/pages/fallback/Page404";
import Page500 from "src/pages/fallback/Page500";
import Projects from "src/pages/projects";
import Scheme from "src/pages/scheme";

export type RouteItem = {
  id?: string;
  path: string;
  name?: string;
  component: React.ComponentType | null;
  guarded?: boolean;
  redirectToSignIn?: boolean;
  adminOnly?: boolean;
  children?: RouteItem[];
};

const authRoutes: RouteItem = {
  id: "Auth",
  path: "/auth",
  children: [
    {
      path: "/auth/sign-in",
      name: "Sign In",
      component: SignIn,
    },
  ],
  component: null,
};

const fallbackRoutes: RouteItem = {
  id: "Fallback",
  path: "/fallback",
  children: [
    {
      path: "/fallback/404",
      name: "404 Page",
      component: Page404,
    },
    {
      path: "/fallback/500",
      name: "500 Page",
      component: Page500,
    },
  ],
  component: null,
};

const projectsRoute: RouteItem = {
  id: "Projects",
  path: "/",
  name: "Projects",
  component: Projects,
  guarded: true,
  redirectToSignIn: true,
};

const myProjectRoute: RouteItem = {
  id: "My Project",
  path: "/mine",
  name: "My Project",
  component: Projects,
  guarded: true,
  redirectToSignIn: true,
};

const sharedProjectRoute: RouteItem = {
  id: "Shared Project",
  path: "/shared",
  name: "Shared Project",
  component: Projects,
  guarded: true,
  redirectToSignIn: true,
};

const favoriteProjectRoute: RouteItem = {
  id: "Favorite Project",
  path: "/favorite",
  name: "Favorite Project",
  component: Projects,
  guarded: true,
  redirectToSignIn: true,
};

const galleryProjectRoute: RouteItem = {
  id: "Gallery Project",
  path: "/gallery",
  name: "Gallery Project",
  component: Projects,
  guarded: true,
  redirectToSignIn: true,
};

const projectRoute: RouteItem = {
  id: "Project",
  path: "/project/:id",
  name: "project",
  component: Scheme,
  guarded: true,
  redirectToSignIn: true,
};

const adminRoute: RouteItem = {
  id: "admin",
  path: "/admin",
  name: "Admin Panel",
  component: Admin,
  guarded: true,
  redirectToSignIn: true,
  adminOnly: true,
};

// Routes using the Dashboard layout
export const mainLayoutRoutes: RouteItem[] = [
  projectsRoute,
  myProjectRoute,
  sharedProjectRoute,
  favoriteProjectRoute,
  galleryProjectRoute,
  projectRoute,
  adminRoute,
];

// Routes using the Auth layout
export const authLayoutRoutes: RouteItem[] = [authRoutes];

// Routes using the Fallback layout
export const fallbackLayoutRoutes: RouteItem[] = [fallbackRoutes];
